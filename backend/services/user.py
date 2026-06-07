from database import supabase

async def get_user_stats(user_id: str):
    """
    Fetches the gamification stats for a specific user from Supabase.
    """
    # Note: supabase-py client is synchronous under the hood, but we wrap it in 
    # an async function to keep the service layer consistent with FastAPI async routes.
    response = supabase.table("user_stats").select("*").eq("user_id", user_id).execute()
    
    if not response.data:
        return None
        
    return response.data[0]
