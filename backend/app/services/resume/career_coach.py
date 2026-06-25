from app.services.ai.groq_client import client


def generate_career_advice(
    ats_score: float,
    recommended_roles: list,
    matched_skills: list,
    missing_skills: list
):

    top_role = "Software Engineer"

    if recommended_roles:
        top_role = recommended_roles[0]["role"]

    prompt = f"""
You are an expert AI Career Coach.

Candidate Information:

ATS Score:
{ats_score}

Recommended Role:
{top_role}

Current Skills:
{matched_skills}

Missing Skills:
{missing_skills}

Generate career guidance in JSON.

Return ONLY valid JSON.

Schema:

{{
    "current_level":"",
    "target_role":"",
    "strengths":[],
    "improvement_areas":[],
    "learning_roadmap":[],
    "project_ideas":[],
    "interview_preparation":[]
}}

Rules:

- Do not invent candidate skills.
- Use only provided information.
- learning_roadmap should contain exactly 5 steps.
- project_ideas should contain exactly 3 ideas.
- interview_preparation should contain exactly 5 tips.
- Return ONLY JSON.
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": "You are an expert AI Career Coach."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0,
        max_tokens=700
    )

    raw = response.choices[0].message.content

    raw = raw.replace("```json", "")
    raw = raw.replace("```", "")
    raw = raw.strip()

    import json

    try:
        return json.loads(raw)

    except Exception:
        return {
            "current_level": "",
            "target_role": top_role,
            "strengths": matched_skills,
            "improvement_areas": missing_skills,
            "learning_roadmap": [],
            "project_ideas": [],
            "interview_preparation": []
        }