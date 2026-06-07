from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from services.leetcode import fetch_leetcode_problem
from services.user import get_user_stats

app = FastAPI(title="ThinkQuiz Backend")

# Configure CORS
origins = [
    "http://localhost:3000",
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
    return {"status": "ok"}

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

from pydantic import BaseModel
from typing import Optional
from services.ai import generate_socratic_quiz
from services.cache import get_cached_quiz, set_cached_quiz

class GenerateRequest(BaseModel):
    leetcode_slug: Optional[str] = None
    concept_topic: Optional[str] = None

@app.post("/api/generate")
async def generate_quiz(req: GenerateRequest):
    if not req.leetcode_slug and not req.concept_topic:
        raise HTTPException(status_code=400, detail="Must provide either leetcode_slug or concept_topic")
    
    # 1. Generate a unique cache key (using v2 to bypass old corrupted cache)
    if req.leetcode_slug:
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
        raise HTTPException(status_code=500, detail=str(e))

from schemas import QuizSubmission, GamificationUpdate
from services.gamification import process_quiz_submission

@app.post("/api/quiz/submit", response_model=GamificationUpdate)
async def submit_quiz(submission: QuizSubmission):
    try:
        result = await process_quiz_submission(submission)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
