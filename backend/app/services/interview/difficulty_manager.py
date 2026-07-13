from app.models.enums import DifficultyLevel
from app.models.interview_state import InterviewState


class DifficultyManager:
    """
    Determines the difficulty level for the next interview question.
    """

    def determine_difficulty(
        self, state: InterviewState
    ) -> DifficultyLevel:

        # No evaluation yet
        if not state.evaluation_history:
            return DifficultyLevel.MEDIUM

        latest = state.evaluation_history[-1]

        score = latest.score

        if score >= 8:
            return DifficultyLevel.HARD

        elif score >= 5:
            return DifficultyLevel.MEDIUM

        return DifficultyLevel.EASY