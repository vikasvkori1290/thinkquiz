import asyncio
from dotenv import load_dotenv
import google.generativeai as genai
import os
from schemas import QuizResponse

load_dotenv()
genai.configure(api_key=os.environ.get('GEMINI_API_KEY'))

model = genai.GenerativeModel('gemini-2.5-flash', generation_config={'response_mime_type': 'application/json', 'response_schema': QuizResponse})

async def test():
    resp = await model.generate_content_async('You are a tutor. Give a 1 question quiz about Two Sum.')
    print(resp.text)

if __name__ == "__main__":
    asyncio.run(test())
