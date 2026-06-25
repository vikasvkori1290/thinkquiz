import os
import json
from openai import AsyncOpenAI
from schemas import QuizResponse

# Ensure API key is configured. We default to Groq if the key exists, else OpenAI.
api_key = os.getenv("GROQ_API_KEY") or os.getenv("OPENAI_API_KEY")
base_url = "https://api.groq.com/openai/v1" if os.getenv("GROQ_API_KEY") else None
model_name = "llama-3.3-70b-versatile" if os.getenv("GROQ_API_KEY") else "gpt-4o-mini"

client = AsyncOpenAI(
    api_key=api_key,
    base_url=base_url
)

async def generate_socratic_quiz(problem_data: dict = None, topic: str = None) -> dict:
    prompt = (
        "You are a Socratic tutor. Create a 3-question multiple choice quiz. "
        "You must write in clear, concise, natural English sentences. "
        "Do NOT generate lists of keywords, and strictly avoid token repetition loops.\n\n"
        "You MUST return the output ONLY as a raw JSON object exactly matching this structure (no markdown formatting):\n"
        "{\n"
        '  "source": "string",\n'
        '  "id_or_concept": "string",\n'
        '  "questions": [\n'
        "    {\n"
        '      "question_text": "string",\n'
        '      "options": [\n'
        "        {\n"
        '          "option_text": "string",\n'
        '          "is_correct": true or false,\n'
        '          "hint_if_wrong": "string"\n'
        "        }\n"
        "      ]\n"
        "    }\n"
        "  ]\n"
        "}\n\n"
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

    response = await client.chat.completions.create(
        model=model_name,
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        temperature=0.2,
    )
    
    return json.loads(response.choices[0].message.content)
