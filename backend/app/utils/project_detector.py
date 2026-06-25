PROJECT_KEYWORDS = [
    "project",
    "projects",
    "intern",
    "internship",
    "built",
    "developed",
    "designed",
    "github",
    "repo",
    "repository",
    "college project",
    "capstone",
]


def mentions_projects(answer: str) -> bool:
    answer = answer.lower()
    return any(keyword in answer for keyword in PROJECT_KEYWORDS)