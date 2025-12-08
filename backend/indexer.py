# indexer.py
import os
import glob
from typing import List

from dotenv import load_dotenv
from sqlalchemy.orm import Session
from sqlalchemy import select

from db.db import SessionLocal
from db.models import Document
from loader import load_text
from chroma_engine import ChromaEngine

load_dotenv()
chroma = ChromaEngine()
DATA_DIR = os.getenv("DATA_DIR", "./data")


def scan_files() -> List[str]:
    patterns = ["*.txt", "*.pdf", "*.md", "*.docx", "*.pptx"]
    files: List[str] = []
    for p in patterns:
        files.extend(glob.glob(os.path.join(DATA_DIR, "**", p), recursive=True))
    return sorted(set(files))


def upsert_documents(db: Session, file_paths: List[str]) -> List[int]:
    """
    1) PostgreSQL documents 테이블 upsert
    2) 같은 시점에 Chroma에도 저장
    """
    doc_ids: List[int] = []

    chroma_ids = []
    chroma_docs = []
    chroma_metas = []

    for path in file_paths:
        title, content = load_text(path)
        if not content:
            continue

        # PostgreSQL upsert
        stmt = select(Document).where(Document.path == path)
        existing = db.execute(stmt).scalar_one_or_none()

        if existing:
            existing.title = title
            existing.content = content
            db.flush()
            doc_id = existing.id
        else:
            doc = Document(path=path, title=title, content=content)
            db.add(doc)
            db.flush()
            doc_id = doc.id

        doc_ids.append(doc_id)

        # metadata
        ext = path.split(".")[-1].lower()

        chroma_ids.append(str(doc_id))
        chroma_docs.append(content)
        chroma_metas.append({
            "title": title,
            "ext": ext,
            "path": path
        })

    db.commit()

    # 🔥 Chroma 업로드 (한 번만)
    chroma.collection.add(
        ids=chroma_ids,
        documents=chroma_docs,
        metadatas=chroma_metas
    )

    return doc_ids


def rebuild_index():
    print("[INDEX] Scanning files...")
    file_paths = scan_files()
    print(f"[INDEX] Found {len(file_paths)} files.")

    if not file_paths:
        print("[INDEX] No files found. Abort.")
        return

    db: Session = SessionLocal()

    try:
        print("[INDEX] Clearing Chroma collection...")
        chroma.clear_all()

        print("[INDEX] Upserting documents into PostgreSQL + Chroma...")
        upsert_documents(db, file_paths)

        print("[INDEX] Done.")
    finally:
        db.close()


if __name__ == "__main__":
    rebuild_index()
