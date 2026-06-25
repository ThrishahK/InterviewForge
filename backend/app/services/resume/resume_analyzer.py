import json
import re

from app.services.ai.groq_client import client


def analyze_resume(resume_text: str):

    prompt = f"""
You are an expert resume parser.

Extract information from the resume and return ONLY valid JSON.

Schema:

{{
    "resume": {{
        "name": "",
        "email": "",
        "phone": "",

        "education": [],

        "skills": [],

        "projects": [],

        "experience": [],

        "certifications": []
    }}
}}

Rules:
- Do NOT invent information.
- If a field is missing, return "" or [].
- Return ONLY JSON.
- No markdown.
- No explanation.

Resume:

{resume_text}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": "You are an expert resume parser."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0,
        max_tokens=1200,
    )

    raw = response.choices[0].message.content or ""

# Remove markdown fences
    raw = raw.replace("```json", "")
    raw = raw.replace("```", "")
    raw = raw.strip()

    print(raw)

    try:
        return json.loads(raw)

    except json.JSONDecodeError as e:
        print("JSON ERROR:", e)
        print(raw)
        raise