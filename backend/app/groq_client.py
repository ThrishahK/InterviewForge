import os
from typing import Dict, Any
from groq import Groq
import json
import re
import json
PROJECT_KEYWORDS = [
    "project", "projects", "intern", "internship",
    "built", "developed", "designed",
    "github", "repo", "repository",
    "college project", "capstone"
]

def mentions_projects(answer: str) -> bool:
    answer = answer.lower()
    return any(k in answer for k in PROJECT_KEYWORDS)


GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise RuntimeError("GROQ_API_KEY not set")

client = Groq(api_key=GROQ_API_KEY)


def transcribe_audio_bytes(audio_path: str) -> str:
    with open(audio_path, "rb") as f:
        resp = client.audio.transcriptions.create(
            file=f,
            model="whisper-large-v3",
            language="en"  # Force English
        )
    return getattr(resp, "text", resp.get("text") if isinstance(resp, dict) else str(resp))




def generate_question(prev_answer: str = "", state: dict = None) -> str:
    if state is None:
        state = {
            "asked_project_probe": False,
            "project_missing": False
        }

    if not prev_answer.strip():
        return "Let's begin. Can you briefly introduce yourself?"

    has_project = mentions_projects(prev_answer)

    # Adaptive probing
    if not has_project and not state["asked_project_probe"]:
        state["asked_project_probe"] = True
        state["project_missing"] = True
        return (
            "Could you briefly talk about any projects, internships, "
            "or practical work you've done?"
        )

    # Branch interview path
    if state["project_missing"] and not has_project:
        return (
            "No problem. Let’s focus on fundamentals. "
            "Can you explain a core computer science concept "
            "you are confident about?"
        )

    # Normal flow
    return (
        "Can you describe a challenge you faced and how you solved it?"
    )

def evaluate_answer(answer: str) -> Dict[str, Any]:
    if not answer.strip():
        return {
            "score": 0.0,
            "strengths": [],
            "weaknesses": ["No answer provided."],
            "suggestions": ["Please respond to the question."]
        }

    system_prompt = (
           "You are an expert interviewer evaluator.\n"
    "Evaluate the candidate answer and return ONLY a valid JSON object with:\n"
    "- score: float between 0 and 10\n"
    "- strengths: 3–5 concise points (MAX 5)\n"
    "- weaknesses: 3–5 concise points (MAX 5)\n"
    "- suggestions: 3–5 actionable points (MAX 5)\n\n"
    "Additionally, infer the candidate's sentiment and confidence level.\n"
    "Adjust your tone accordingly:\n"
    "- If the candidate sounds nervous or low-confidence, be supportive and encouraging\n"
    "- If confident and strong, be direct and professional\n"
    "- If confident but weak, be firm but constructive\n\n"
    "Rules:\n"
    "- Do NOT exceed 5 items in any list\n"
    "- Merge similar points\n"
    "- Avoid repetition\n"
    "- Use a human, empathetic HR tone\n"
    "- No text outside the JSON\n"
    )

    user_prompt = f"Candidate answer:\n{answer}"

    resp = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        temperature=0.0,
        max_tokens=400,
    )

    raw = resp.choices[0].message.content.strip()

    # Clean markdown and stray text
    raw_clean = (
        raw.replace("```json", "")
           .replace("```", "")
           .strip()
    )

    #  Debug print — keep for now
    print("🧾 Raw model output:", raw)
    print("🧹 Cleaned output:", raw_clean)

    # Parse JSON safely
    try:
        parsed = json.loads(raw_clean)
    except json.JSONDecodeError as e:
        print("⚠️ JSON parse failed:", e)
        parsed = {
            "score": 0.0,
            "strengths": [],
            "weaknesses": ["Failed to parse model output."],
            "suggestions": [raw_clean]
        }

    return parsed

