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
)

from app.db import save_entry

from app.services.ai.transcriber import transcribe_audio
from app.services.ai.question_generator import generate_question
from app.services.ai.answer_evaluator import evaluate_answer

from app.services.resume.resume_parser import extract_resume_text
from app.services.resume.resume_analyzer import analyze_resume


router = APIRouter()

interview_state = {
    "asked_project_probe": False,
    "project_missing": False
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

    return {
        "text": text
    }


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

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    return {
        "question": question
    }


# -----------------------------------
# POST /evaluate
# -----------------------------------
@router.post("/evaluate", response_model=EvaluateResponse)
def evaluate(req: EvaluateRequest):

    try:
        evaluation = evaluate_answer(req.answer)

        save_entry(
            question="",
            answer=req.answer,
            evaluation=json.dumps(evaluation)
        )

        return {
            "evaluation": evaluation
        }

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

        print("ANALYSIS:")
        print(analysis)

        context.resume_context = analysis

        return analysis
        

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



