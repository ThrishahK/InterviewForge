from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field

from app.models.enums import DifficultyLevel
from app.models.evaluation import EvaluationResult


class InterviewState(BaseModel):
    """
    Represents the complete state of an interview session.
    This object is continuously updated throughout the interview
    and drives the Adaptive Interview Engine.
    """

    # --------------------------------------------------
    # Interview Information
    # --------------------------------------------------

    interview_id: Optional[str] = None

    role: str

    experience_level: str

    # --------------------------------------------------
    # Resume Context (Optional)
    # --------------------------------------------------

    resume_uploaded: bool = False

    resume_context: Optional[str] = None

    skills: List[str] = Field(default_factory=list)

    projects: List[str] = Field(default_factory=list)

    education: Optional[str] = None

    # --------------------------------------------------
    # Interview Progress
    # --------------------------------------------------

    current_question_number: int = 0

    max_questions: int = 10

    interview_completed: bool = False

    # --------------------------------------------------
    # Questions
    # --------------------------------------------------

    questions_asked: List[str] = Field(default_factory=list)

    # --------------------------------------------------
    # Topic Tracking
    # --------------------------------------------------

    topics_covered: List[str] = Field(default_factory=list)

    weak_topics: List[str] = Field(default_factory=list)

    strong_topics: List[str] = Field(default_factory=list)

    current_focus_topic: Optional[str] = None

    remaining_topics: List[str] = Field(default_factory=list)

    # --------------------------------------------------
    # Interview Difficulty
    # --------------------------------------------------

    difficulty: DifficultyLevel = DifficultyLevel.MEDIUM

    # --------------------------------------------------
    # Evaluation History
    # --------------------------------------------------

    evaluation_history: List[EvaluationResult] = Field(default_factory=list)

    # --------------------------------------------------
    # Follow-up Tracking
    # --------------------------------------------------

    follow_up_depth: int = 0

    # --------------------------------------------------
    # Session Metadata
    # --------------------------------------------------

    started_at: Optional[datetime] = None

    last_updated: Optional[datetime] = None