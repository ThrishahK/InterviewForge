import pdfplumber
from docx import Document
import re

def extract_resume_text(file_path: str) -> str:
    text = ""

    # PDF
    if file_path.endswith(".pdf"):
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"

    # DOCX
    elif file_path.endswith(".docx"):
        doc = Document(file_path)
        for para in doc.paragraphs:
            text += para.text + "\n"

    else:
        raise Exception("Unsupported file format")

    return text.strip()



def extract_resume_details(text):
    data = {}

    # Email
    email = re.search(r'[\w\.-]+@[\w\.-]+', text)
    data["email"] = email.group() if email else ""

    # Phone
    phone = re.search(r'(\+91)?\s?\d{10}', text)
    data["phone"] = phone.group() if phone else ""

    # Name
    lines = text.splitlines()
    data["name"] = lines[0].strip()

    return data