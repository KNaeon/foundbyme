# 실행: python -m db.create_tables
from .db import Base, engine
from . import models  # noqa: F401


def create_all():
    print("[DB] Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("[DB] Done.")


if __name__ == "__main__":
    create_all()
