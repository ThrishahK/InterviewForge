from typing import Dict, List


def calculate_ats_score(
    resume: Dict,
    jd_skills: List[str]
) -> Dict:

    score = 0

    breakdown = {}

    skills = resume.get("skills", [])
    projects = resume.get("projects", [])
    experience = resume.get("experience", [])
    education = resume.get("education", [])
    certifications = resume.get("certifications", [])

    # -----------------------------
    # Skills (40 Marks)
    # -----------------------------
    resume_skills = {s.lower().strip() for s in skills}
    jd = {s.lower().strip() for s in jd_skills}

    matched = resume_skills & jd

    if len(jd) > 0:
        skill_score = (len(matched) / len(jd)) * 40
    else:
        skill_score = 40

    score += skill_score

    breakdown["skills"] = round(skill_score, 2)

    # -----------------------------
    # Projects (20 Marks)
    # -----------------------------
    project_score = min(len(projects) * 5, 20)

    score += project_score

    breakdown["projects"] = project_score

    # -----------------------------
    # Experience (15 Marks)
    # -----------------------------
    if experience:
        exp_score = 15
    else:
        exp_score = 0

    score += exp_score

    breakdown["experience"] = exp_score

    # -----------------------------
    # Education (10 Marks)
    # -----------------------------
    if education:
        edu_score = 10
    else:
        edu_score = 0

    score += edu_score

    breakdown["education"] = edu_score

    # -----------------------------
    # Certifications (5 Marks)
    # -----------------------------
    cert_score = min(len(certifications), 5)

    score += cert_score

    breakdown["certifications"] = cert_score

    # -----------------------------
    # Resume Completeness (10 Marks)
    # -----------------------------
    completeness = 0

    if skills:
        completeness += 2

    if projects:
        completeness += 2

    if experience:
        completeness += 2

    if education:
        completeness += 2

    if certifications:
        completeness += 2

    score += completeness

    breakdown["completeness"] = completeness

    score = round(min(score, 100), 2)

    missing_skills = sorted(list(jd - resume_skills))

    return {
        "ats_score": score,
        "breakdown": breakdown,
        "matched_skills": sorted(list(matched)),
        "missing_skills": missing_skills
    }