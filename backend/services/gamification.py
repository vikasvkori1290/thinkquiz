import datetime
from database import supabase
from schemas import QuizSubmission, GamificationUpdate

async def process_quiz_submission(submission: QuizSubmission) -> GamificationUpdate:
    # Ensure user exists in public.users to prevent foreign key errors
    user_check = supabase.table("users").select("id").eq("id", submission.user_id).execute()
    if not user_check.data:
        # We don't have the email/username here easily, so we just insert the ID to satisfy the FK
        supabase.table("users").insert({"id": str(submission.user_id)}).execute()

    # Step 1: Insert into quiz_attempts
    supabase.table("quiz_attempts").insert({
        "user_id": submission.user_id,
        "problem_slug": submission.quiz_id_or_concept,
        "score": submission.score
    }).execute()

    # Step 2: Fetch user's current record
    response = supabase.table("user_stats").select("*").eq("user_id", submission.user_id).execute()
    
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
    new_xp = current_xp + (submission.score * 10)
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
    supabase.table("user_stats").upsert({
        "user_id": submission.user_id,
        "current_xp": new_xp,
        "level": new_level,
        "current_streak": new_streak,
        "last_active_date": today.isoformat()
    }).execute()

    return GamificationUpdate(
        new_xp=new_xp,
        new_level=new_level,
        streak=new_streak,
        leveled_up=leveled_up
    )
