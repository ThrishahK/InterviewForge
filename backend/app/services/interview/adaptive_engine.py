from app.models.adaptive_decision import AdaptiveDecision
from app.models.interview_state import InterviewState

from app.services.interview.topic_selector import TopicSelector
from app.services.interview.difficulty_manager import DifficultyManager
from app.services.interview.followup_manager import FollowUpManager


class AdaptiveEngine:
    """
    Coordinates the adaptive interview process.

    This service does not contain interview logic itself.
    It delegates responsibilities to specialized managers.
    """

    def __init__(self):

        self.topic_selector = TopicSelector()

        self.difficulty_manager = DifficultyManager()

        self.followup_manager = FollowUpManager()

    def decide_next_question(
        self,
        state: InterviewState
    ) -> AdaptiveDecision:
        """
        Decide the next interview question strategy.
        """

        topic = self.topic_selector.select_topic(state)

        difficulty = self.difficulty_manager.determine_difficulty(state)

        follow_up = self.followup_manager.should_follow_up(state)

        question_type = (
            "follow_up"
            if follow_up
            else "technical"
        )

        return AdaptiveDecision(
            topic=topic,
            difficulty=difficulty,
            question_type=question_type,
            follow_up=follow_up,
            reason=self._generate_reason(
                topic,
                difficulty,
                follow_up
            ),
        )

    def _generate_reason(
        self,
        topic: str,
        difficulty,
        follow_up: bool,
    ) -> str:
        """
        Generates a human-readable explanation
        for debugging and analytics.
        """

        if follow_up:
            return (
                f"Candidate needs a follow-up question on '{topic}'."
            )

        return (
            f"Selected '{topic}' with {difficulty.value} difficulty."
        )