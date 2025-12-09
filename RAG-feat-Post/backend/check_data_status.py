import os
import sys
from sqlalchemy import select
from db.db import SessionLocal
from db.models import Document
from chroma_engine import ChromaEngine

def check_status(session_id=None):
    print(f"\n=== 🔍 Data Status Check (Session: {session_id if session_id else 'ALL'}) ===")

    # 1. Local Files
    data_dir = "./data"
    print("\n[1] 📂 Local File System")
    if session_id:
        target_dir = os.path.join(data_dir, session_id)
        if os.path.exists(target_dir):
            files = os.listdir(target_dir)
            print(f"   ✅ Session folder exists: {target_dir}")
            print(f"   📄 File count: {len(files)}")
            for f in files:
                print(f"      - {f}")
        else:
            print(f"   ❌ Session folder does NOT exist.")
    else:
        if os.path.exists(data_dir):
            sessions = [d for d in os.listdir(data_dir) if os.path.isdir(os.path.join(data_dir, d))]
            print(f"   📂 Total session folders found: {len(sessions)}")
            for s in sessions:
                print(f"      - {s}")

    # 2. SQL DB
    print("\n[2] 🗄️  SQL Database (SQLite)")
    db = SessionLocal()
    try:
        query = select(Document)
        if session_id:
            # path에 session_id가 포함되어 있는지 확인
            query = query.where(Document.path.like(f"%{session_id}%"))
        
        results = db.execute(query).scalars().all()
        
        if results:
            print(f"   ✅ Documents found: {len(results)}")
            for doc in results:
                print(f"      - [ID: {doc.id}] {doc.title} (Path: {doc.path})")
        else:
            print(f"   ❌ No documents found in SQL DB.")
            
    except Exception as e:
        print(f"   ⚠️ Error checking SQL DB: {e}")
    finally:
        db.close()

    # 3. Chroma DB
    print("\n[3] 🧠 Vector Database (ChromaDB)")
    try:
        chroma = ChromaEngine()
        
        where_filter = None
        if session_id:
            where_filter = {"session_id": session_id}
            
        results = chroma.collection.get(where=where_filter)
        count = len(results['ids'])
        
        if count > 0:
            print(f"   ✅ Vectors found: {count}")
            for i, idx in enumerate(results['ids']):
                meta = results['metadatas'][i]
                print(f"      - [ID: {idx}] {meta.get('title')} (Session: {meta.get('session_id')})")
        else:
            print(f"   ❌ No vectors found in ChromaDB.")

    except Exception as e:
        print(f"   ⚠️ Error checking ChromaDB: {e}")
    
    print("\n=================================================\n")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        sid = sys.argv[1]
        check_status(sid)
    else:
        print("Usage: python check_data_status.py [session_id]")
        # 입력이 없으면 전체 조회
        check_status()
