from groq import Groq
import os

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

client = Groq(api_key=GROQ_API_KEY)


def transcribe_audio(audio_path: str) -> str:
    """
    Convert speech audio into text using Groq Whisper.
    """

    with open(audio_path, "rb") as f:
        response = client.audio.transcriptions.create(
            file=f,
            model="whisper-large-v3",
            language="en"
        )

    return response.text