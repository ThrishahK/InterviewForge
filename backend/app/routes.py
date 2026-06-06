import os
import tempfile
import json

from fastapi import APIRouter, UploadFile, File, HTTPException

from .groq_client import (
    transcribe_audio_bytes,
    generate_question,
    evaluate_answer,
)
from .schemas import (
    TranscribeResponse,
    QuestionResponse,
    EvaluateRequest,
    EvaluateResponse,
)
from .db import save_entry
from .resume_parser import extract_resume_text

router = APIRouter()

interview_state = {
    "asked_project_probe": False,
    "project_missing": False
}


# -------------------------------
# POST /api/transcribe
# -------------------------------
@router.post("/transcribe", response_model=TranscribeResponse)
async def transcribe(file: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=os.path.splitext(file.filename)[1],
    ) as tmp_file:
        contents = await file.read()
        tmp_file.write(contents)
        tmp_file_path = tmp_file.name

    try:
        text = transcribe_audio_bytes(tmp_file_path)
        print(f"Transcribed text: {text}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        try:
            os.remove(tmp_file_path)
        except Exception:
            pass

    return {"text": text}


# -------------------------------
# GET /api/next_question
# -------------------------------
@router.get("/next_question", response_model=QuestionResponse)
def next_question(prev_answer: str = ""):
    try:
        q = generate_question(prev_answer)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate question: {str(e)}"
        )

    return {"question": q}


# -------------------------------
# POST /api/evaluate
# -------------------------------
@router.post("/evaluate", response_model=EvaluateResponse)
def evaluate(req: EvaluateRequest):
    try:
        evaluation = evaluate_answer(req.answer)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Evaluation failed: {str(e)}"
        )

    try:
        save_entry(
            question="",
            answer=req.answer,
            evaluation=json.dumps(evaluation),
        )

    except Exception as e:
        print(f"Warning: Failed to save to DB: {str(e)}")

    return {"evaluation": evaluation}


# -------------------------------
# POST /api/upload_resume
# -------------------------------
@router.post("/upload_resume")
async def upload_resume(file: UploadFile = File(...)):
    try:
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=os.path.splitext(file.filename)[1]
        ) as temp_file:
            contents = await file.read()
            temp_file.write(contents)
            temp_path = temp_file.name

        resume_text = extract_resume_text(temp_path)

        try:
            os.remove(temp_path)
        except Exception:
            pass

        return {
            "resume_text": resume_text
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )