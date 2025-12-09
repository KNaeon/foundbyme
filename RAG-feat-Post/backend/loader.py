# loader.py
import os
from typing import Tuple

import pdfplumber
from docx import Document as DocxDocument
from pptx import Presentation
import markdown


def load_text(path: str) -> Tuple[str, str]:
    """
    파일 경로 → (title, content)
    """
    ext = os.path.splitext(path)[1].lstrip(".").lower()
    title = os.path.basename(path).rsplit(".", 1)[0]

    if ext == "txt":
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()

    elif ext == "pdf":
        try:
            with pdfplumber.open(path) as pdf:
                texts = []
                for page in pdf.pages:
                    texts.append(page.extract_text() or "")
                content = "\n".join(texts)
        except Exception as e:
            print(f"Error reading PDF {path}: {e}")
            content = ""

    elif ext == "docx":
        doc = DocxDocument(path)
        content = "\n".join(p.text for p in doc.paragraphs)

    elif ext == "pptx":
        pres = Presentation(path)
        texts = []
        for slide in pres.slides:
            for shape in slide.shapes:
                if hasattr(shape, "text"):
                    texts.append(shape.text)
        content = "\n".join(texts)

    elif ext == "md":
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            md_text = f.read()
        html = markdown.markdown(md_text)
        import re
        content = re.sub("<[^<]+?>", "", html)

    else:
        content = ""

    content = content.strip()
    return title, content
