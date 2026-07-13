from app.models.evaluation import EvaluationResult
from app.models.interview_state import InterviewState

from app.services.interview.adaptive_engine import AdaptiveEngine

# Replace this import with your existing evaluator
# Example:
# from app.services.ai.answer_evaluator import AnswerEvaluator


class EvaluationHandler:
    """
    Coordinates answer evaluation and adaptive interview flow.
    """

    def __init__(self, evaluator):
        """
        evaluator -> existing AI Answer Evaluator
        """
        self.evaluator = evaluator
        self.adaptive_engine = AdaptiveEngine()

    def process_answer(
        self,
        state: InterviewState,
        question: str,
        answer: str,
    ):
        """
        Complete evaluation pipeline.
        """

        # ----------------------------------------
        # Step 1 : Evaluate answer
        # ----------------------------------------

        evaluation: EvaluationResult = self.evaluator.evaluate(
            question=question,
            answer=answer,
        )

        # ----------------------------------------
        # Step 2 : Store evaluation
        # ----------------------------------------

        state.evaluation_history.append(evaluation)

        # ----------------------------------------
        # Step 3 : Track question
        # ----------------------------------------

        state.questions_asked.append(question)

        # ----------------------------------------
        # Step 4 : Track topics
        # ----------------------------------------

        if evaluation.topic not in state.topics_covered:
            state.topics_covered.append(evaluation.topic)

        # ----------------------------------------
        # Step 5 : Weak / Strong topic tracking
        # ----------------------------------------

        if evaluation.score < 5:

            if evaluation.topic not in state.weak_topics:
                state.weak_topics.append(evaluation.topic)

        elif evaluation.score >= 8:

            if evaluation.topic not in state.strong_topics:
                state.strong_topics.append(evaluation.topic)

        # ----------------------------------------
        # Step 6 : Update follow-up depth
        # ----------------------------------------

        if evaluation.follow_up_required:
            state.follow_up_depth += 1
        else:
            state.follow_up_depth = 0

        # ----------------------------------------
        # Step 7 : Update interview progress
        # ----------------------------------------

        state.current_question_number += 1

        # ----------------------------------------
        # Step 8 : Decide next question
        # ----------------------------------------

        decision = self.adaptive_engine.decide_next_question(state)

        return evaluation, decision