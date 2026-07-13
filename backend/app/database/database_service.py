from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from app.database.models import (
    Interview,
    InterviewResponse,
)


def create_interview(
    db: Session,
    role: str,
    experience_level: str,
    resume_uploaded: bool,
    max_questions: int,
):
    interview = Interview(
        role=role,
        experience_level=experience_level,
        resume_uploaded=resume_uploaded,
        max_questions=max_questions,
    )

    db.add(interview)
    db.commit()
    db.refresh(interview)

    return interview


def save_response(
    db: Session,
    interview_id: int,
    question_number: int,
    question: str,
    answer: str,
    evaluation: str,
):
    response = InterviewResponse(
        interview_id=interview_id,
        question_number=question_number,
        question=question,
        answer=answer,
        evaluation=evaluation,
    )

    db.add(response)
    db.commit()

    return response


def complete_interview(
    db: Session,
    interview_id: int,
    score: float,
):
    interview = (
        db.query(Interview)
        .filter(Interview.id == interview_id)
        .first()
    )

    if interview:
        interview.overall_score = score
        interview.completed_at = func.now()

        db.commit()
        db.refresh(interview)

    return interview


def get_history(db: Session):

    return (
        db.query(Interview)
        .order_by(
            Interview.started_at.desc()
        )
        .all()
    )