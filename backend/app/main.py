from dotenv import load_dotenv
from pathlib import Path

# Load .env from backend root
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(env_path)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.interview_routes import router
from app.database.database import create_tables

app = FastAPI(title="AI Interview Bot - Backend")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# allow_origins=["http://localhost:5173"],
# API routes
app.include_router(router, prefix="/api")


@app.on_event("startup")
def startup_event():
    create_tables()

    