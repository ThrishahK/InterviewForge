from typing import List, Dict


ROLE_SKILLS = {
    "Backend Developer": [
        "python",
        "fastapi",
        "django",
        "flask",
        "sql",
        "postgresql",
        "mysql",
        "rest api"
    ],

    "Frontend Developer": [
        "react",
        "html",
        "css",
        "javascript",
        "typescript",
        "tailwind"
    ],

    "Full Stack Developer": [
        "react",
        "javascript",
        "node",
        "express",
        "mongodb",
        "sql"
    ],

    "AI/ML Engineer": [
        "python",
        "tensorflow",
        "pytorch",
        "scikit-learn",
        "opencv",
        "pandas",
        "numpy"
    ],

    "Data Analyst": [
        "python",
        "sql",
        "excel",
        "power bi",
        "tableau",
        "pandas"
    ],

    "DevOps Engineer": [
        "docker",
        "kubernetes",
        "aws",
        "azure",
        "gcp",
        "linux",
        "jenkins"
    ]
}


def recommend_roles(skills: List[str]) -> List[Dict]:

    skills = {skill.lower().strip() for skill in skills}

    recommendations = []

    for role, required in ROLE_SKILLS.items():

        matched = skills.intersection(required)

        score = round(
            len(matched) / len(required) * 100,
            2
        )

        recommendations.append({
            "role": role,
            "match_score": score,
            "matched_skills": sorted(list(matched))
        })

    recommendations.sort(
        key=lambda x: x["match_score"],
        reverse=True
    )

    return recommendations[:5]