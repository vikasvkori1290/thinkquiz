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
