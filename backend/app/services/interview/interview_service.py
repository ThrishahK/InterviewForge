from datetime import datetime
from typing import Optional

from app.models.interview_state import InterviewState
from app.services.interview.adaptive_engine import AdaptiveEngine
from app.services.interview.evaluation_handler import EvaluationHandler


class InterviewService:
    """
    Main orchestration service for InterviewForge.

    This service coordinates the complete interview lifecycle.

    Responsibilities:
        - Start Interview
        - Manage Interview State
        - Process Candidate Answers
        - Coordinate Evaluation
        - Coordinate Adaptive Engine
        - End Interview

    NOTE:
    This service SHOULD NOT contain:
        - LLM prompts
        - Question generation logic
        - Evaluation logic
        - Database logic

    It only orchestrates existing services.
    """

    def __init__(self):

        self.adaptive_engine = AdaptiveEngine()

        # Will be injected after evaluator refactor
        self.evaluation_handler = None

    # --------------------------------------------------
    # Start Interview
    # --------------------------------------------------

    def start_interview(
        self,
        role: str,
        experience_level: str,
        resume_context: Optional[dict] = None
    ):

    # -------------------------------
    # Step 1: Extract Resume Details
    # -------------------------------
        resume = {}

        if resume_context:
            resume = resume_context.get("resume", {})

        skills = resume.get("skills", [])
        projects = resume.get("projects", [])
        education = resume.get("education", None)

    # -------------------------------
    # Step 2: Create Interview State
    # -------------------------------
        state = InterviewState(
            role=role,
            experience_level=experience_level,
            resume_uploaded=resume_context is not None,
            resume_context=resume_context,
            skills=skills,
            projects=projects,
            education=education,
            remaining_topics=skills.copy(),
            started_at=datetime.now(),
            last_updated=datetime.now(),
    )

    # -------------------------------
    # Step 3: Adaptive Decision
    # -------------------------------
        decision = self.adaptive_engine.decide_next_question(state)

    # -------------------------------
    # Step 4: Question Generator
    # -------------------------------
        question = None     # We'll replace this later

    # -------------------------------
    # Step 5: Return
    # -------------------------------
        return {
            "state": state,
            "decision": decision,
            "question": question
        }


    # --------------------------------------------------
    # Generate First Question
    # --------------------------------------------------

    def get_first_question(
        self,
        state: InterviewState
    ):
        """
        Generates the first interview question.

        To be implemented after question generator refactor.
        """
        raise NotImplementedError

    # --------------------------------------------------
    # Process Candidate Answer
    # --------------------------------------------------

    def process_answer(
        self,
        state: InterviewState,
        question: str,
        answer: str,
    ):
        """
        Complete interview pipeline.

        Answer
            ↓
        Evaluation
            ↓
        Update State
            ↓
        Adaptive Engine
            ↓
        Next Question

        To be implemented after evaluator refactor.
        """
        raise NotImplementedError

    # --------------------------------------------------
    # End Interview
    # --------------------------------------------------

    def end_interview(
        self,
        state: InterviewState
    ):
        """
        Marks interview as completed.
        """

        state.interview_completed = True
        state.last_updated = datetime.now()

        return state

    # --------------------------------------------------
    # Get Current State
    # --------------------------------------------------

    def get_interview_state(
        self,
        state: InterviewState
    ) -> InterviewState:
        """
        Returns current interview state.
        """

        return state