import httpx

async def fetch_leetcode_problem(title_slug: str):
    """
    Fetches the problem content and difficulty from LeetCode GraphQL API.
    """
    url = "https://leetcode.com/graphql"
    
    query = """
    query getQuestionDetail($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        content
        difficulty
      }
    }
    """
    
    variables = {
        "titleSlug": title_slug
    }
    
    payload = {
        "query": query,
        "variables": variables
    }
    
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0"
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=payload, headers=headers)
        response.raise_for_status()
        return response.json()

async def get_slug_from_number(number: int) -> str | None:
    """
    Fetches the full problem list from LeetCode to map a frontend question ID (number)
    to its title slug (e.g., 1 -> "two-sum"). Caches the mapping in Redis for 7 days.
    """
    cache_key = "leetcode_problems_list"
    try:
        from services.cache import redis
        import json
        
        # Try to get from cache
        cached_data = await redis.get(cache_key)
        if cached_data:
            if isinstance(cached_data, str):
                problems = json.loads(cached_data)
            else:
                problems = cached_data
        else:
            # Fetch from API
            async with httpx.AsyncClient() as client:
                res = await client.get("https://leetcode.com/api/problems/all/")
                res.raise_for_status()
                data = res.json()
                
            problems = {}
            for item in data.get("stat_status_pairs", []):
                q_id = item["stat"]["frontend_question_id"]
                slug = item["stat"]["question__title_slug"]
                problems[str(q_id)] = slug
                
            # Cache for 7 days (604800 seconds)
            await redis.set(cache_key, json.dumps(problems), ex=604800)
            
        return problems.get(str(number))
    except Exception as e:
        print(f"Error mapping number to slug: {e}")
        return None
