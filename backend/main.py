from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from services.leetcode import fetch_leetcode_problem

app = FastAPI(title="ThinkQuiz Backend")

# Configure CORS
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

@app.get("/api/leetcode/{title_slug}")
async def get_leetcode_problem(title_slug: str):
    try:
        data = await fetch_leetcode_problem(title_slug)
        if not data.get("data") or not data["data"].get("question"):
            raise HTTPException(status_code=404, detail="Problem not found")
        return data["data"]["question"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
