import os
from dotenv import load_dotenv
from supabase import create_client, Client, ClientOptions

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing Supabase credentials. Ensure SUPABASE_URL and SUPABASE_KEY are set.")

# Global client for unauthenticated/generic requests
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Helper for authenticated requests that need to pass RLS
def get_scoped_client(token: str = None) -> Client:
    if token:
        options = ClientOptions(headers={"Authorization": f"Bearer {token}"})
        return create_client(SUPABASE_URL, SUPABASE_KEY, options=options)
    return supabase
