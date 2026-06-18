import datetime
from database import supabase, get_scoped_client
from schemas import SRSUpdate

async def process_srs_update(update: SRSUpdate, token: str = None):
    scoped_supabase = get_scoped_client(token)
    
    # Ensure user exists in public.users to prevent foreign key errors
    user_check = scoped_supabase.table("users").select("id").eq("id", update.user_id).execute()
    if not user_check.data:
        scoped_supabase.table("users").insert({"id": str(update.user_id)}).execute()

    # Fetch current SRS record if it exists
    res = scoped_supabase.table("spaced_repetition_queue").select("*").eq("user_id", update.user_id).eq("question_id", update.question_id).execute()
    
    if res.data:
        record = res.data[0]
        easiness_factor = record.get("easiness_factor", 2.5)
        repetitions = record.get("repetitions", 0)
        interval = record.get("interval", 0)
    else:
        easiness_factor = 2.5
        repetitions = 0
        interval = 0

    q = update.quality_score

    # Standard SM-2 Algorithm
    if q >= 3:
        repetitions += 1
        if repetitions == 1:
            interval = 1
        elif repetitions == 2:
            interval = 6
        else:
            interval = round(interval * easiness_factor)
    else:
        repetitions = 0
        interval = 1

    easiness_factor = easiness_factor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    if easiness_factor < 1.3:
        easiness_factor = 1.3

    next_review_date = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=interval)

    # Upsert the new values
    result = scoped_supabase.table("spaced_repetition_queue").upsert({
        "user_id": update.user_id,
        "question_id": update.question_id,
        "easiness_factor": easiness_factor,
        "repetitions": repetitions,
        "interval": interval,
        "next_review_date": next_review_date.isoformat()
    }, on_conflict="user_id,question_id").execute()
    
    return result.data
