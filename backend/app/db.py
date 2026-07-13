import sqlite3

DB_PATH = "ai_interview.db"


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # -------------------------
    # Interviews
    # -------------------------

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS interviews (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        role TEXT,

        experience_level TEXT,

        resume_uploaded BOOLEAN DEFAULT 0,

        started_at DATETIME DEFAULT CURRENT_TIMESTAMP,

        completed_at DATETIME,

        overall_score REAL
    )
    """)

    # -------------------------
    # Interview Responses
    # -------------------------

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS interview_responses (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        interview_id INTEGER NOT NULL,

        question_number INTEGER,

        question TEXT,

        answer TEXT,

        evaluation TEXT,

        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY(interview_id)
            REFERENCES interviews(id)
            ON DELETE CASCADE
    )
    """)

    conn.commit()
    conn.close()


def create_interview(
    role: str,
    experience_level: str,
    resume_uploaded: bool,
):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO interviews
        (
            role,
            experience_level,
            resume_uploaded
        )
        VALUES (?, ?, ?)
        """,
        (
            role,
            experience_level,
            resume_uploaded,
        ),
    )

    interview_id = cursor.lastrowid

    conn.commit()
    conn.close()

    return interview_id


def save_response(
    interview_id: int,
    question_number: int,
    question: str,
    answer: str,
    evaluation: str,
):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO interview_responses
        (
            interview_id,
            question_number,
            question,
            answer,
            evaluation
        )
        VALUES (?, ?, ?, ?, ?)
        """,
        (
            interview_id,
            question_number,
            question,
            answer,
            evaluation,
        ),
    )

    conn.commit()
    conn.close()


def complete_interview(
    interview_id: int,
    overall_score: float,
):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        UPDATE interviews
        SET
            overall_score=?,
            completed_at=CURRENT_TIMESTAMP
        WHERE id=?
        """,
        (
            overall_score,
            interview_id,
        ),
    )

    conn.commit()
    conn.close()