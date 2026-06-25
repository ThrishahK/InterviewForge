from typing import List, Dict


def find_skill_gap(
    resume_skills: List[str],
    jd_skills: List[str]
) -> Dict:

    # Convert to lowercase for comparison
    resume_set = {skill.lower().strip() for skill in resume_skills}
    jd_set = {skill.lower().strip() for skill in jd_skills}

    matched = sorted(list(resume_set & jd_set))
    missing = sorted(list(jd_set - resume_set))

    match_percentage = 0

    if len(jd_set) > 0:
        match_percentage = round(
            len(matched) / len(jd_set) * 100,
            2
        )

    return {
        "matched_skills": matched,
        "missing_skills": missing,
        "match_percentage": match_percentage
    }