import datetime
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from services.leetcode import fetch_leetcode_problem
from services.user import get_user_stats

app = FastAPI(title="ThinkQuiz Backend")

import os

# Configure CORS using environment variable or wildcard for production flexibility
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
origins = [
    frontend_url,
    "https://thinkquiz.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    return {
        "status": "awake",
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }

@app.get("/api/leetcode/{title_slug}")
async def get_leetcode_problem(title_slug: str):
    try:
        data = await fetch_leetcode_problem(title_slug)
        if not data.get("data") or not data["data"].get("question"):
            raise HTTPException(status_code=404, detail="Problem not found")
        return data["data"]["question"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/user/{user_id}/stats")
async def get_user_stats_route(user_id: str):
    try:
        stats = await get_user_stats(user_id)
        if not stats:
            raise HTTPException(status_code=404, detail="User stats not found")
        return stats
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/leaderboard")
async def get_leaderboard():
    from services.cache import redis
    from database import supabase_admin, supabase
    import json
    
    # 1. Check Redis cache
    try:
        cached = await redis.get("cache:leaderboard")
        if cached:
            if isinstance(cached, str):
                return json.loads(cached)
            return cached
    except Exception as e:
        print(f"Redis get error: {e}")
        
    # 2. Cache miss -> query Supabase using admin client to bypass RLS
    try:
        db = supabase_admin or supabase
        res = db.table('user_stats').select(
            'user_id, current_xp, level, first_name, last_name, username, users!inner(id)'
        ).order('current_xp', desc=True).limit(10).execute()
        data = res.data

        # 3. Validate each entry against Supabase Auth
        #    Orphaned entries (deleted from auth but still in public.users) are cleaned up and excluded
        if supabase_admin:
            clean_data = []
            for entry in data:
                try:
                    auth_user = supabase_admin.auth.admin.get_user_by_id(entry['user_id'])
                    if auth_user and auth_user.user:
                        # User exists in auth — enrich with email prefix if no name set
                        has_name = entry.get('first_name') or entry.get('last_name') or entry.get('username')
                        if not has_name and auth_user.user.email:
                            entry['email_prefix'] = auth_user.user.email.split('@')[0]
                        clean_data.append(entry)
                    else:
                        # Auth user not found — orphaned record, clean it up
                        print(f"Orphaned user detected: {entry['user_id']} — cleaning up...")
                        supabase_admin.table('users').delete().eq('id', entry['user_id']).execute()
                except Exception as e:
                    err_str = str(e).lower()
                    if 'not found' in err_str or '404' in err_str or 'user not found' in err_str:
                        # Auth user deleted — clean up orphaned record
                        print(f"Orphaned user detected: {entry['user_id']} — cleaning up...")
                        try:
                            supabase_admin.table('users').delete().eq('id', entry['user_id']).execute()
                        except Exception as cleanup_err:
                            print(f"Cleanup failed for {entry['user_id']}: {cleanup_err}")
                    else:
                        # Some other error — keep the entry, don't delete
                        print(f"Auth check error for {entry['user_id']}: {e}")
                        clean_data.append(entry)
            data = clean_data
        
        # 4. Store in Redis (TTL = 300s)
        try:
            await redis.set("cache:leaderboard", json.dumps(data), ex=300)
        except Exception as e:
            print(f"Redis set error: {e}")
            
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.delete("/api/leaderboard/cache")
async def flush_leaderboard_cache():
    """Dev utility: flush the Redis leaderboard cache so next request re-queries Supabase."""
    from services.cache import redis
    try:
        await redis.delete("cache:leaderboard")
        return {"message": "Leaderboard cache cleared."}
    except Exception as e:
        return {"message": f"Redis not available, skipping: {e}"}

@app.get("/api/debug/user-stats")
async def debug_user_stats():
    """Dev debug: raw dump of user_stats table using admin client."""
    from database import supabase_admin, supabase
    db = supabase_admin or supabase
    try:
        res = db.table('user_stats').select('*').limit(5).execute()
        return {"count": len(res.data), "data": res.data}
    except Exception as e:
        return {"error": str(e)}

from pydantic import BaseModel
from typing import Optional
from services.ai import generate_socratic_quiz
from services.cache import get_cached_quiz, set_cached_quiz

class GenerateRequest(BaseModel):
    leetcode_slug: Optional[str] = None
    concept_topic: Optional[str] = None

from fastapi import Header

async def get_token(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        return None
    return authorization.split(" ")[1]

async def check_rate_limit(token: str = Depends(get_token)):
    if not token:
        raise HTTPException(status_code=401, detail="Authentication required to generate quizzes.")
        
    import hashlib
    token_hash = hashlib.sha256(token.encode()).hexdigest()
    
    import time
    from services.cache import redis
    
    current_minute = int(time.time() // 60)
    key = f"rate_limit:{token_hash}:{current_minute}"
    
    try:
        count = await redis.incr(key)
        if count == 1:
            await redis.expire(key, 60)
            
        if count > 20:
            raise HTTPException(status_code=429, detail="Rate limit exceeded. Please wait a minute before generating another quiz.")
    except HTTPException:
        raise
    except Exception as e:
        print(f"Redis rate limit error: {e}")

@app.post("/api/generate")
async def generate_quiz(req: GenerateRequest, rate_limit: None = Depends(check_rate_limit)):
    if not req.leetcode_slug and not req.concept_topic:
        raise HTTPException(status_code=400, detail="Must provide either leetcode_slug or concept_topic")
    
    # 1. Generate a unique cache key (using v2 to bypass old corrupted cache)
    if req.leetcode_slug:
        # Intercept purely numeric searches and map them to their corresponding slug
        if req.leetcode_slug.isdigit():
            from services.leetcode import get_slug_from_number
            mapped_slug = await get_slug_from_number(int(req.leetcode_slug))
            if mapped_slug:
                req.leetcode_slug = mapped_slug
            else:
                raise HTTPException(status_code=404, detail=f"Question number {req.leetcode_slug} not found.")
                
        cache_key = f"quiz_v2:leetcode:{req.leetcode_slug}"
    else:
        # clean the concept string for cache key
        safe_topic = req.concept_topic.lower().replace(" ", "-")
        cache_key = f"quiz_v2:concept:{safe_topic}"
        
    # 2. Check Redis via get_cached_quiz
    cached_data = await get_cached_quiz(cache_key)
    if cached_data:
        return cached_data
        
    # 3. If miss: Fetch data & generate
    try:
        problem_data = None
        if req.leetcode_slug:
            data = await fetch_leetcode_problem(req.leetcode_slug)
            if not data.get("data") or not data["data"].get("question"):
                raise HTTPException(status_code=404, detail="Problem not found")
            problem_data = data["data"]["question"]
            
        quiz_json = await generate_socratic_quiz(problem_data, req.concept_topic)
        
        # Save result to Redis
        await set_cached_quiz(cache_key, quiz_json)
        
        return quiz_json
    except Exception as e:
        from google.api_core.exceptions import ResourceExhausted
        if isinstance(e, ResourceExhausted) or "429" in str(e):
            raise HTTPException(status_code=429, detail="The AI brain is currently overwhelmed by too many users. Please try again in 30 seconds.")
        raise HTTPException(status_code=500, detail=str(e))

from schemas import QuizSubmission, GamificationUpdate
from services.gamification import process_quiz_submission

@app.post("/api/quiz/submit", response_model=GamificationUpdate)
async def submit_quiz(submission: QuizSubmission, token: str = Depends(get_token)):
    try:
        result = await process_quiz_submission(submission, token)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


from schemas import SRSUpdate
from services.srs import process_srs_update

@app.post("/api/srs/update")
async def update_srs(update: SRSUpdate, token: str = Depends(get_token)):
    try:
        result = await process_srs_update(update, token)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/user")
def delete_user(token: str = Depends(get_token)):
    from database import supabase, supabase_admin
    try:
        print(f"Token received, fetching user...")
        user_response = supabase.auth.get_user(token)
        print(f"User response: {user_response}")
        if not user_response.user:
            raise HTTPException(status_code=401, detail="Invalid token")
            
        user_id = user_response.user.id
        
        try:
            print(f"Attempting to delete user {user_id} via admin API...")
            if not supabase_admin:
                raise Exception("Missing SUPABASE_SERVICE_ROLE_KEY in backend environment.")
            
            # Step 1: Delete from public.users — cascades to user_stats and quiz_attempts via FK
            supabase_admin.table('users').delete().eq('id', user_id).execute()
            print(f"Deleted user {user_id} from public.users (cascades to user_stats & quiz_attempts)")

            # Step 2: Delete from Supabase Auth
            supabase_admin.auth.admin.delete_user(user_id)
            print("Successfully deleted user from Supabase Auth!")

            # Step 3: Flush leaderboard cache so deleted user disappears immediately
            try:
                from services.cache import redis
                import asyncio
                asyncio.get_event_loop().run_until_complete(redis.delete("cache:leaderboard"))
            except Exception as cache_err:
                print(f"Could not flush leaderboard cache: {cache_err}")

        except Exception as admin_err:
            print(f"Failed to delete user: {admin_err}")
            raise HTTPException(status_code=403, detail="Server must be configured with a service_role key to delete accounts.")
            
        return {"status": "success", "message": "User deleted successfully."}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Trigger reload
