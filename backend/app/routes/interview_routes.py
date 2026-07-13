import os
import json
import tempfile

import app.context as context

from fastapi import APIRouter, UploadFile, File, HTTPException

from app.schemas.schemas import (
    TranscribeResponse,
    QuestionResponse,
    EvaluateRequest,
    EvaluateResponse,
    StartInterviewRequest,
    StartInterviewResponse,
    FinishInterviewResponse,
    InterviewHistoryResponse,
)

from app.services.ai.transcriber import transcribe_audio
from app.services.ai.question_generator import generate_question
from app.services.ai.answer_evaluator import evaluate_answer
from app.services.resume.resume_parser import extract_resume_text
from app.services.resume.resume_analyzer import analyze_resume

from fastapi import Depends

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.database.database_service import (
    create_interview,
    save_response,
    complete_interview,
    get_history,
)
router = APIRouter()

interview_state = {
    "asked_intro": False,
    "asked_project_probe": False,
    "project_missing": False,
    "current_interview_id": None,
    "question_number": 1,
    "max_questions": 10,
    "scores": [],
    "current_question": ""
}


# -----------------------------------
# POST /transcribe
# -----------------------------------
@router.post("/transcribe", response_model=TranscribeResponse)
async def transcribe(file: UploadFile = File(...)):

    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=os.path.splitext(file.filename)[1]
    ) as tmp:

        tmp.write(await file.read())
        tmp_path = tmp.name

    try:
        text = transcribe_audio(tmp_path)

        return {
            "text": text
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:
        try:
            os.remove(tmp_path)
        except:
            pass

@router.post(
    "/start_interview",
    response_model=StartInterviewResponse,
)
def start_interview(
    req: StartInterviewRequest,
    db: Session = Depends(get_db),
):
    try:

        interview = create_interview(
            db=db,
            role=req.role,
            experience_level=req.experience_level,
            resume_uploaded=req.resume_uploaded,
            max_questions=req.max_questions,
        )

        # Store interview information
        interview_state["current_interview_id"] = interview.id
        interview_state["question_number"] = 1
        interview_state["max_questions"] = req.max_questions
        interview_state["scores"] = []
        interview_state["current_question"] = ""

        return {
            "interview_id": interview.id
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )



# -----------------------------------
# GET /next_question
# -----------------------------------
@router.get("/next_question", response_model=QuestionResponse)
def next_question(prev_answer: str = ""):

    try:
        question = generate_question(
            prev_answer,
            interview_state
        )

        interview_state["current_question"] = question

        return {
            "question": question
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

# -----------------------------------
# POST /evaluate
# -----------------------------------
@router.post("/evaluate", response_model=EvaluateResponse)
def evaluate(
    req: EvaluateRequest,
    db: Session = Depends(get_db),
):

    try:

        # Check if an interview has been started
        if interview_state["current_interview_id"] is None:
            raise HTTPException(
                status_code=400,
                detail="Interview has not been started."
            )

        evaluation = evaluate_answer(req.answer)

        interview_state["scores"].append(
            evaluation["score"]
        )

        save_response(
            db=db,
            interview_id=interview_state["current_interview_id"],
            question_number=interview_state["question_number"],
            question=interview_state["current_question"],
            answer=req.answer,
            evaluation=json.dumps(evaluation),
        )

        interview_state["question_number"] += 1

        finished = (
            interview_state["question_number"]
            > interview_state["max_questions"]
        )

        return {
            "evaluation": evaluation,
            "finished": finished
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

# -----------------------------------
# POST /upload_resume
# -----------------------------------
@router.post("/upload_resume")
async def upload_resume(file: UploadFile = File(...)):

    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=os.path.splitext(file.filename)[1]
    ) as tmp:

        tmp.write(await file.read())
        tmp_path = tmp.name

    try:

        resume_text = extract_resume_text(tmp_path)

        analysis = analyze_resume(resume_text)

        context.resume_context = analysis

        return analysis

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:
        try:
            os.remove(tmp_path)
        except:
            pass


@router.post(
    "/finish_interview",
    response_model=FinishInterviewResponse,
)
def finish_interview(
    db: Session = Depends(get_db),
):
    try:

        if interview_state["current_interview_id"] is None:
            raise HTTPException(
                status_code=400,
                detail="No active interview."
            )

        scores = interview_state["scores"]

        if len(scores) == 0:
            overall_score = 0
        else:
            overall_score = sum(scores) / len(scores)

        complete_interview(
            db=db,
            interview_id=interview_state["current_interview_id"],
            score=overall_score,
        )

        # Reset interview state
        interview_state["current_interview_id"] = None
        interview_state["question_number"] = 1
        interview_state["scores"] = []
        interview_state["current_question"] = ""

        return {
            "completed": True,
            "overall_score": round(overall_score, 2),
            "total_questions": len(scores),
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.get(
    "/history",
    response_model=InterviewHistoryResponse,
)
def history(
    db: Session = Depends(get_db),
):

    try:

        interviews = get_history(db)

        history = []

        for interview in interviews:

            history.append({
                "interview_id": interview.id,
                "role": interview.role,
                "experience_level": interview.experience_level,
                "overall_score": interview.overall_score,
                "started_at": str(interview.started_at),
                "completed_at": (
                    str(interview.completed_at)
                    if interview.completed_at
                    else None
                ),
            })

        return {
            "interviews": history
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )