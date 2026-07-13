import app.context as context

from app.services.resume.resume_questions import generate_resume_question
from app.utils.project_detector import mentions_projects


def generate_question(
    prev_answer: str = "",
    state: dict = None,
):
    """
    Generates the next interview question.

    Supports both:
    - Resume-based interviews
    - General interviews (without resume)
    """

    # ----------------------------
    # Resume-based Interview
    # ----------------------------
    if getattr(context, "resume_context", None):

        return generate_resume_question(
            context.resume_context
        )

    # ----------------------------
    # General Interview
    # ----------------------------

    if state is None:
        state = {
            "asked_intro": False,
            "asked_project_probe": False,
            "project_missing": False,
        }

    # First Question

    if not state["asked_intro"]:

        state["asked_intro"] = True

        return (
            "Let's begin. "
            "Could you briefly introduce yourself?"
        )

    # Candidate hasn't answered yet

    if not prev_answer.strip():

        return (
            "Could you tell me a little more about yourself?"
        )

    # Detect project mention

    has_project = mentions_projects(prev_answer)

    if not has_project and not state["asked_project_probe"]:

        state["asked_project_probe"] = True

        state["project_missing"] = True

        return (
            "Could you tell me about any projects, internships, "
            "research work, or practical experience you've had?"
        )

    # No projects

    if state["project_missing"] and not has_project:

        return (
            "That's completely fine. "
            "Let's move to technical fundamentals.\n\n"
            "Can you explain the difference between "
            "Object-Oriented Programming and Procedural Programming?"
        )

    # Project mentioned

    return (
        "Interesting! Could you explain one challenging "
        "technical problem you faced in that project "
        "and how you solved it?"
    )