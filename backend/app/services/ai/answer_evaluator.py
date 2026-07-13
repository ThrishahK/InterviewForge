import json
from typing import Dict, Any
from app.services.ai.groq_client import client

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



    # Parse JSON safely
    try:
        parsed = json.loads(raw_clean)
    except json.JSONDecodeError as e:
        print("JSON parse failed:", e)
        parsed = {
            "score": 0.0,
            "strengths": [],
            "weaknesses": ["Failed to parse model output."],
            "suggestions": [raw_clean]
        }

    return parsed