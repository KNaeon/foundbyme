from db.db import engine, Base
from db.models import SearchLog
from sqlalchemy import text

def reset_search_log_table():
    with engine.connect() as conn:
        conn.execute(text("DROP TABLE IF EXISTS search_logs"))
        conn.commit()
    
    Base.metadata.create_all(bind=engine)
    print("Recreated search_logs table.")

if __name__ == "__main__":
    reset_search_log_table()
