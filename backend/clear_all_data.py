import os
import shutil
from sqlalchemy import delete
from db.db import SessionLocal
from db.models import Document
from chroma_engine import ChromaEngine

def clear_all_data():
    print("=== 🗑️  Clearing ALL Data (Local, SQL, Vector) ===")

    # 1. Local Files
    data_dir = "./data"
    print("\n[1] 📂 Cleaning Local File System...")
    if os.path.exists(data_dir):
        # data 폴더 내의 모든 파일/폴더 삭제 (data 폴더 자체는 유지)
        for item in os.listdir(data_dir):
            item_path = os.path.join(data_dir, item)
            try:
                if os.path.isdir(item_path):
                    shutil.rmtree(item_path)
                    print(f"   - Deleted folder: {item}")
                else:
                    os.remove(item_path)
                    print(f"   - Deleted file: {item}")
            except Exception as e:
                print(f"   ⚠️ Failed to delete {item}: {e}")
    else:
        os.makedirs(data_dir)
        print("   - Created data directory.")

    # 2. SQL DB
    print("\n[2] 🗄️  Cleaning SQL Database...")
    db = SessionLocal()
    try:
        # 모든 문서 삭제
        stmt = delete(Document)
        result = db.execute(stmt)
        db.commit()
        print(f"   ✅ Deleted {result.rowcount} rows from 'documents' table.")
    except Exception as e:
        print(f"   ⚠️ Error cleaning SQL DB: {e}")
        db.rollback()
    finally:
        db.close()

    # 3. Chroma DB
    print("\n[3] 🧠 Cleaning Vector Database (ChromaDB)...")
    try:
        chroma = ChromaEngine()
        # Get all IDs
        result = chroma.collection.get()
        ids = result['ids']
        if ids:
            chroma.collection.delete(ids=ids)
            print(f"   ✅ Deleted {len(ids)} vectors from ChromaDB.")
        else:
            print("   - ChromaDB is already empty.")
            
    except Exception as e:
        print(f"   ⚠️ Error cleaning ChromaDB: {e}")

    print("\n=== ✨ All data cleared successfully! ===")

if __name__ == "__main__":
    clear_all_data()
