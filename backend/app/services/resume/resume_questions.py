from app.services.ai.groq_client import client


def generate_resume_question(context):

    resume = context.get("resume", {})
    analysis = context.get("analysis", {})

    prompt = f"""
You are an expert technical interviewer.

Candidate Profile

Skills:
{resume.get("skills", [])}

Projects:
{resume.get("projects", [])}

Education:
{resume.get("education", [])}

Experience:
{resume.get("experience", [])}

Recommended Role:
{analysis.get("recommended_roles", [])}

Generate ONE technical interview question based on the candidate's resume.

Rules:
- Ask only ONE technical interview question.
- Prefer projects first.
- If there are no projects, ask about skills.
- Do not ask generic HR questions.
- Return ONLY the question.
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.7,
        max_tokens=100,
    )

    question = response.choices[0].message.content

    if question is None:
        return "Can you explain one of the projects listed on your resume?"

    return question.strip()