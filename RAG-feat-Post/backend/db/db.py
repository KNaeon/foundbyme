# db/db.py
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

POSTGRES_USER = os.getenv("POSTGRES_USER", "ossuser")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "osspass")
POSTGRES_DB = os.getenv("POSTGRES_DB", "ossdb")
POSTGRES_HOST = os.getenv("POSTGRES_HOST", "localhost")
POSTGRES_PORT = os.getenv("POSTGRES_PORT", "5432")

DATABASE_URL = "sqlite:///./sql_app.db"
# DATABASE_URL = (
#     f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}"
#     f"@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"
# )

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}, echo=False, future=True
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)
Base = declarative_base()


def get_db():
    """FastAPI dependency"""
    from typing import Generator
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
