from pydantic import BaseModel
from typing import List

class QuizOption(BaseModel):
    option_text: str
    is_correct: bool
    hint_if_wrong: str

class QuizQuestion(BaseModel):
    question_text: str
    options: List[QuizOption]

class QuizResponse(BaseModel):
    source: str
    id_or_concept: str
    questions: List[QuizQuestion]

class QuizSubmission(BaseModel):
    user_id: str
    quiz_id_or_concept: str
    score: int
    xp_earned: int

class GamificationUpdate(BaseModel):
    new_xp: int
    new_level: int
    streak: int
    leveled_up: bool
