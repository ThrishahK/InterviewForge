# 🎯 InterviewForge

> **An AI-powered mock interview platform that conducts adaptive technical interviews, evaluates candidate responses in real time, and generates comprehensive performance reports.**

<p align="center">
  <i>Practice smarter. Receive personalized feedback. Build interview confidence.</i>
</p>

---

## 📖 Table of Contents

* [Overview](#-overview)
* [Features](#-features)
* [System Architecture](#-system-architecture)
* [Tech Stack](#-tech-stack)
* [Project Structure](#-project-structure)
* [How It Works](#-how-it-works)
* [Getting Started](#-getting-started)
* [Environment Variables](#-environment-variables)
* [API Endpoints](#-api-endpoints)
* [Screenshots](#-screenshots)
* [Roadmap](#-roadmap)
* [Future Improvements](#-future-improvements)
* [Contributing](#-contributing)
* [License](#-license)

---

# 📌 Overview

InterviewForge is an AI-powered mock interview platform designed to simulate realistic technical interviews.

Unlike traditional interview practice platforms that rely on static question banks, InterviewForge dynamically adapts the interview based on the candidate's responses. It generates personalized questions, evaluates spoken answers using Large Language Models (LLMs), adjusts difficulty throughout the interview, and produces a detailed performance report at the end.

Whether you're preparing for internships, placements, or software engineering interviews, InterviewForge provides an interactive environment to practice communication, technical reasoning, and interview performance.

---

# ✨ Features

### 🤖 AI-Powered Interview Engine

* Adaptive interview flow
* Dynamic question generation
* Resume-aware interviews
* Context-aware follow-up questions
* Difficulty adjustment based on candidate performance

### 📄 Resume Intelligence

* Resume upload (optional)
* Resume parsing
* Skill extraction
* Project identification
* Experience analysis
* Resume-based interview questions

### 🎙️ Voice Interview

* Speech-to-text transcription
* Natural voice interaction
* Real-time response processing

### 🧠 AI Evaluation

* Technical answer evaluation
* Communication assessment
* Strength identification
* Improvement suggestions
* Detailed scoring

### 📊 Performance Report

* Overall interview score
* Topic-wise performance
* Strengths & weaknesses
* Personalized feedback
* Interview history

---

# 🏗️ System Architecture

> **Architecture diagram will be added here.**

```
Candidate
    │
    ▼
React Frontend
    │
HTTP API
    │
    ▼
FastAPI Backend
    │
 ┌───────────────┬────────────────┐
 │               │                │
 ▼               ▼                ▼
Resume       Interview       Database
Parser         Engine
 │               │
 └───────► Groq LLM ◄────────┘
                 │
                 ▼
        Answer Evaluation
                 │
                 ▼
         Adaptive Engine
                 │
                 ▼
          Final Report
```

---

# 💻 Tech Stack

## Frontend

* React
* Vite
* Tailwind CSS

## Backend

* Python
* FastAPI

## Artificial Intelligence

* Groq API
* Whisper (Speech-to-Text)
* Llama 3.3 70B (Question Generation & Evaluation)

## Database

* SQLite

## Development Tools

* Git
* GitHub
* Postman / Swagger UI

---

# 📂 Project Structure

```text
InterviewForge/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── ...
│
├── backend/
│   ├── interview/
│   ├── routes/
│   ├── database/
│   ├── models/
│   ├── utils/
│   └── main.py
│
├── docs/
│
├── README.md
├── requirements.txt
└── package.json
```

---

# ⚙️ How It Works

```text
Candidate

↓

Upload Resume (Optional)

↓

Resume Parsing

↓

AI Question Generation

↓

Voice Answer

↓

Speech-to-Text

↓

AI Answer Evaluation

↓

Adaptive Decision Engine

↓

Next Question

↓

Interview Completion

↓

Performance Report
```

---

# 🚀 Getting Started

## Clone the Repository

```bash
git clone https://github.com/<your-username>/InterviewForge.git
cd InterviewForge
```

---

## Backend Setup

```bash
cd backend

pip install -r requirements.txt

uvicorn main:app --reload
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

# 🔑 Environment Variables

Create a `.env` file inside the backend directory.

```env
GROQ_API_KEY=your_api_key_here
DATABASE_URL=sqlite:///ai_interview.db
```

---

# 🌐 API Endpoints

| Method | Endpoint         | Description                          |
| ------ | ---------------- | ------------------------------------ |
| POST   | `/upload_resume` | Upload and parse resume              |
| POST   | `/transcribe`    | Convert speech to text               |
| GET    | `/next_question` | Generate the next interview question |
| POST   | `/evaluate`      | Evaluate candidate response          |

---

# 📸 Screenshots

> Screenshots will be added after frontend completion.

* Landing Page
* Resume Upload
* Interview Screen
* AI Question Interface
* Final Performance Report

---

# 🎥 Demo

A complete demo GIF showcasing the interview workflow will be added after deployment.

---

# 🛣️ Roadmap

## ✅ Completed

* Resume Upload
* Resume Parsing
* Resume Analysis
* AI Question Generation
* Adaptive Interview Engine
* Speech-to-Text Integration
* AI Answer Evaluation
* FastAPI Backend
* SQLite Integration

## 🚧 In Progress

* React Frontend
* Final Report Dashboard
* Responsive UI

## 🔜 Planned

* User Authentication
* Interview History Dashboard
* Company-specific Interview Modes
* Coding Interview Support
* Docker Deployment
* Cloud Deployment
* Multi-language Interviews
* Analytics Dashboard

---

# 💡 Future Improvements

* ATS Resume Analyzer
* AI Career Coach
* HR Interview Mode
* Behavioral Interview Mode
* Live Coding Environment
* Custom Interview Templates
* PDF Report Export
* Email Report Delivery

---

# 🤝 Contributing

Contributions are welcome!

If you would like to improve InterviewForge:

1. Fork the repository
2. Create a new feature branch
3. Commit your changes
4. Push your branch
5. Open a Pull Request

---

# 📄 License

This project will be released under the MIT License.

---

# 🙏 Acknowledgements

InterviewForge is built using several excellent open-source technologies and frameworks.

Special thanks to the communities behind:

* FastAPI
* React
* Tailwind CSS
* Groq
* Whisper
* SQLite

---

<p align="center">
  Built with ❤️ to help developers practice interviews with confidence.
</p>
