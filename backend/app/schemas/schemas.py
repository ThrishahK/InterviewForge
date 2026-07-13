from pydantic import BaseModel
from typing import Any
from typing import List

class TranscribeResponse(BaseModel):
    text: str

class QuestionResponse(BaseModel):
    question: str

class EvaluateRequest(BaseModel):
    answer: str

class EvaluateResponse(BaseModel):
    evaluation: Any  # Use Any to support JSON/dict or string returned by Groq

class StartInterviewRequest(BaseModel):
    role: str
    experience_level: str
    resume_uploaded: bool = False
    max_questions: int = 10

class StartInterviewResponse(BaseModel):
    interview_id: int

class FinishInterviewResponse(BaseModel):
    overall_score: float
    total_questions: int
    completed: bool

class FinishInterviewResponse(BaseModel):
    completed: bool
    overall_score: float
    total_questions: int


class InterviewHistoryItem(BaseModel):
    interview_id: int
    role: str
    experience_level: str
    overall_score: float | None
    started_at: str
    completed_at: str | None


class InterviewHistoryResponse(BaseModel):
    interviews: List[InterviewHistoryItem]