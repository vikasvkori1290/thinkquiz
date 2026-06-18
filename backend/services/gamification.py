import datetime
from fastapi import HTTPException
from database import supabase, get_scoped_client
from schemas import QuizSubmission, GamificationUpdate

async def process_quiz_submission(submission: QuizSubmission, token: str = None) -> GamificationUpdate:
    scoped_supabase = get_scoped_client(token)

    # Ensure user exists in public.users to prevent foreign key errors
    user_check = scoped_supabase.table("users").select("id").eq("id", submission.user_id).execute()
    if not user_check.data:
        # We don't have the email/username here easily, so we just insert the ID to satisfy the FK
        scoped_supabase.table("users").insert({"id": str(submission.user_id)}).execute()

    # Anti-Farming Security: Check if user already submitted this topic today
    today_iso = datetime.date.today().isoformat()
    recent_attempts = scoped_supabase.table("quiz_attempts").select("id").eq("user_id", submission.user_id).eq("problem_slug", submission.quiz_id_or_concept).gte("completed_at", today_iso).execute()
    
    if recent_attempts.data:
        raise HTTPException(status_code=403, detail="Cooldown: You have already completed this topic today.")

    # Step 1: Insert into quiz_attempts
    scoped_supabase.table("quiz_attempts").insert({
        "user_id": submission.user_id,
        "problem_slug": submission.quiz_id_or_concept,
        "score": submission.score
    }).execute()

    # Step 2: Fetch user's current record
    response = scoped_supabase.table("user_stats").select("*").eq("user_id", submission.user_id).execute()
    
    if not response.data:
        # Fallback if the user_stats row doesn't exist yet
        current_xp = 0
        level = 1
        current_streak = 0
        last_active_date = None
    else:
        stats = response.data[0]
        current_xp = stats.get("current_xp") or 0
        level = stats.get("level") or 1
        current_streak = stats.get("current_streak") or 0
        last_active_date = stats.get("last_active_date")

    # Step 3: XP & Level
    new_xp = current_xp + submission.xp_earned
    new_level = (new_xp // 100) + 1
    leveled_up = new_level > level

    # Step 4: Streaks
    today = datetime.date.today()
    if last_active_date:
        last_active = datetime.datetime.strptime(last_active_date, "%Y-%m-%d").date()
        delta = (today - last_active).days
        if delta == 1:
            new_streak = current_streak + 1
        elif delta == 0:
            new_streak = current_streak
        else:
            new_streak = 1
    else:
        new_streak = 1

    # Step 5: Update user_stats
    scoped_supabase.table("user_stats").upsert({
        "user_id": submission.user_id,
        "current_xp": new_xp,
        "level": new_level,
        "current_streak": new_streak,
        "last_active_date": today.isoformat()
    }).execute()

    # Cache Invalidation: Delete leaderboard from Redis to force a fresh fetch
    try:
        from services.cache import redis
        await redis.delete("cache:leaderboard")
    except Exception as e:
        print(f"Redis delete error: {e}")

    return GamificationUpdate(
        new_xp=new_xp,
        new_level=new_level,
        streak=new_streak,
        leveled_up=leveled_up
    )
