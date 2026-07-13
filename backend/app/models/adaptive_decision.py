from pydantic import BaseModel

from app.models.enums import DifficultyLevel


class AdaptiveDecision(BaseModel):
    """
    Represents the decision made by the Adaptive Engine
    for selecting the next interview question.
    """

    topic: str

    difficulty: DifficultyLevel

    question_type: str

    follow_up: bool

    reason: str