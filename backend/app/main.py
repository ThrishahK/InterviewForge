from dotenv import load_dotenv
from pathlib import Path
import os

# Load .env from backend root
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(env_path)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes.interview_routes import router
from .db import init_db

app = FastAPI(title="AI Interview Bot - Backend")

# CORS configuration for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API routes
app.include_router(router, prefix="/api")

# Initialize database
@app.on_event("startup")
def startup_event():
    init_db()
