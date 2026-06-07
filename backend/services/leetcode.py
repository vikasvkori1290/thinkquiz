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
