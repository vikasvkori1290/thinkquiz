import os
import json
import google.generativeai as genai
from schemas import QuizResponse

# Ensure API key is configured
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Initialize the model with JSON response schema
model = genai.GenerativeModel(
    'gemini-2.5-flash',
    generation_config={
        "response_mime_type": "application/json",
        "response_schema": QuizResponse,
        "temperature": 0.2,
    }
)

async def generate_socratic_quiz(problem_data: dict = None, topic: str = None) -> dict:
    prompt = (
        "You are a Socratic tutor. Create a 3-question multiple choice quiz. "
        "You must write in clear, concise, natural English sentences. "
        "Do NOT generate lists of keywords, and strictly avoid token repetition loops.\n\n"
    )
    
    if problem_data:
        prompt += (
            f"Based on this LeetCode problem. Do NOT give the solution code. "
            f"Focus on edge cases, time complexity, and the algorithmic pattern. "
            f"Each incorrect option must have a specific hint.\n\n"
            f"Problem Data: {json.dumps(problem_data)}"
        )
    elif topic:
        prompt += (
            f"Based on this computer science concept: {topic}. "
            f"Focus on core principles, edge cases, and common misconceptions. "
            f"Each incorrect option must have a specific hint."
        )
    else:
        raise ValueError("Must provide either problem_data or topic")

    response = await model.generate_content_async(prompt)
    
    # response.text should be a JSON string that strictly adheres to our QuizResponse schema
    return json.loads(response.text)
