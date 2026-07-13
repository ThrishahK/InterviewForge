from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    Float,
    ForeignKey,
    Text,
)

from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.database import Base


class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)

    role = Column(String)

    experience_level = Column(String)

    resume_uploaded = Column(Boolean, default=False)

    max_questions = Column(Integer, default=10)

    started_at = Column(DateTime(timezone=True), server_default=func.now())

    completed_at = Column(DateTime(timezone=True), nullable=True)

    overall_score = Column(Float, nullable=True)

    responses = relationship(
        "InterviewResponse",
        back_populates="interview",
        cascade="all, delete",
    )


class InterviewResponse(Base):
    __tablename__ = "interview_responses"

    id = Column(Integer, primary_key=True, index=True)

    interview_id = Column(
        Integer,
        ForeignKey("interviews.id"),
    )

    question_number = Column(Integer)

    question = Column(Text)

    answer = Column(Text)

    evaluation = Column(Text)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    interview = relationship(
        "Interview",
        back_populates="responses",
    )