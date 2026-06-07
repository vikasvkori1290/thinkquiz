import os
import json
from upstash_redis.asyncio import Redis

# Initialize Redis client from environment variables
# UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set
redis = Redis.from_env()

async def get_cached_quiz(key: str):
    """Fetch cached quiz from Upstash Redis."""
    try:
        data = await redis.get(key)
        if data:
            if isinstance(data, str):
                return json.loads(data)
            return data
    except Exception as e:
        print(f"Redis get error: {e}")
    return None

async def set_cached_quiz(key: str, data: dict, ttl_seconds: int = 86400):
    """Save quiz to Upstash Redis with expiration."""
    try:
        # Save as JSON string
        await redis.set(key, json.dumps(data), ex=ttl_seconds)
    except Exception as e:
        print(f"Redis set error: {e}")
