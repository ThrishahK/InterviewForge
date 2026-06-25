import app.context as context
from app.services.resume.resume_questions import generate_resume_question
from app.utils.project_detector import mentions_projects
def generate_question(prev_answer: str = "", state: dict = None) -> str:

    if getattr(context, "resume_context", None):

        print("Resume context:", context.resume_context)

        q = generate_resume_question(context.resume_context)

        print("Generated resume question:", repr(q))
        print("Type:", type(q))

        return q

    if state is None:
        state = {
            "asked_project_probe": False,
            "project_missing": False
        }

    if not prev_answer.strip():
        return "Let's begin. Can you briefly introduce yourself?"

    has_project = mentions_projects(prev_answer)

    if not has_project and not state["asked_project_probe"]:
        state["asked_project_probe"] = True
        state["project_missing"] = True
        return (
            "Could you briefly talk about any projects, internships, "
            "or practical work you've done?"
        )

    if state["project_missing"] and not has_project:
        return (
            "No problem. Let’s focus on fundamentals. "
            "Can you explain a core computer science concept "
            "you are confident about?"
        )

    return "Can you describe a challenge you faced and how you solved it?"