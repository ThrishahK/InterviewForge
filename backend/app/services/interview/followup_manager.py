from app.models.interview_state import InterviewState


class FollowUpManager:
    """
    Determines whether the next question
    should be a follow-up.
    """

    MAX_FOLLOW_UPS = 2

    def should_follow_up(self, state: InterviewState) -> bool:

        if not state.evaluation_history:
            return False

        latest = state.evaluation_history[-1]

        if latest.follow_up_required:

            if state.follow_up_depth < self.MAX_FOLLOW_UPS:
                return True

        return False