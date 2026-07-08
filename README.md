# InterviewForge

> **An AI-powered mock interview platform that generates adaptive interview questions, evaluates candidate responses, and provides personalized feedback using Large Language Models (LLMs).**

InterviewForge is an intelligent mock interview platform designed to simulate real-world technical and HR interviews. Instead of asking a fixed set of questions, the platform adapts the interview based on the candidate's resume, previous responses, and performance, creating a more realistic interview experience.

The project combines speech recognition, LLM-powered question generation, automated answer evaluation, and adaptive interview logic to help students and job seekers prepare for interviews effectively.

---

## ✨ Features

### 🤖 AI Interview Generation

- Dynamic interview question generation using LLMs
- Technical and HR interview support
- Resume-aware interview questions
- Context-aware interview progression
- Adaptive difficulty based on candidate performance

---

### 📄 Resume Intelligence

- Upload resumes in **DOCX** format
- Automatic resume parsing
- Extraction of:
  - Personal Information
  - Skills
  - Projects
  - Experience
  - Education
  - Certifications
- Resume-specific interview question generation

---

### 🎤 Voice-Based Interviews

- Voice answer submission
- Speech-to-text transcription using Whisper
- Hands-free interview experience

---

### 🧠 AI Answer Evaluation

Every candidate response is automatically evaluated for:

- Overall Score
- Topic Identification
- Difficulty Level
- Strengths
- Weaknesses
- Constructive Feedback

Structured evaluation is generated after every response to enable adaptive interview progression.

---

### 🔄 Adaptive Interview Flow

InterviewForge continuously adjusts the interview by considering:

- Resume context
- Previous questions
- Candidate answers
- Evaluation results
- Candidate performance

This enables a dynamic interview rather than a predefined questionnaire.

---

## 🏗️ System Workflow

```text
                  Resume Upload
                        │
                        ▼
               Resume Parsing Engine
                        │
                        ▼
            Resume-Aware Question Generator
                        │
                        ▼
              Candidate Answers (Voice)
                        │
                        ▼
            Whisper Speech-to-Text Engine
                        │
                        ▼
              AI Answer Evaluation Engine
                        │
         ┌──────────────┼──────────────┐
         │              │              │
         ▼              ▼              ▼
      Score         Feedback      Strengths &
                                  Weaknesses
                        │
                        ▼
           Adaptive Interview Decision Engine
                        │
                        ▼
              Next Interview Question
```

---

## 🚀 Current Capabilities

- ✅ Resume Parsing
- ✅ Resume Analysis
- ✅ Resume-Based Question Generation
- ✅ AI Interview Question Generation
- ✅ Adaptive Interview Flow
- ✅ Voice-to-Text Transcription
- ✅ AI Answer Evaluation
- ✅ Topic Detection
- ✅ Candidate Scoring
- ✅ Strength & Weakness Analysis
- ✅ Personalized Feedback

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS

### Backend

- FastAPI
- Python

### AI Models & APIs

- Groq API
- Llama 3.3 70B
- Whisper (Speech-to-Text)

### Database

- SQLite

---

## 📂 Project Structure

```text
InterviewForge
│
├── frontend/
│   ├── React
│   ├── Tailwind CSS
│   └── Vite
│
├── backend/
│   ├── API Routes
│   ├── AI Services
│   ├── Resume Parser
│   ├── Interview Engine
│   ├── Evaluation Engine
│   ├── Models
│   └── Database
│
└── README.md
```

---

## 📈 Development Status

### ✅ Completed

- Resume Parsing
- Resume Analysis
- Resume-Based Question Generation
- Dynamic AI Question Generation
- Whisper Speech-to-Text Integration
- AI Answer Evaluation
- Adaptive Interview Flow
- Structured Evaluation Output

### 🚧 Planned Features

- ATS Resume Scoring
- Authentication & User Profiles
- Interview History
- Performance Dashboard
- Company-Specific Interview Mode
- Coding Interview Environment
- Real-Time Voice-to-Voice Interviews
- Multi-language Support
- Cloud Deployment

---

## 🎯 Project Vision

InterviewForge aims to provide an interview experience that closely resembles real technical interviews.

Rather than simply asking questions, the platform understands a candidate's background, evaluates each response, identifies strengths and weaknesses, and adapts subsequent questions accordingly. The long-term goal is to build a comprehensive AI interview assistant that helps candidates prepare more effectively through personalized practice and actionable feedback.

---

## 👩‍💻 Author

**Thrisha K**

Computer Science Engineering Student

Passionate about Artificial Intelligence, Machine Learning, and Full-Stack Development.

---
