from pymilvus import connections, Collection
import milvus_function as ms
from collections import Counter

def check_data():
    print("=== Milvus 데이터 확인 스크립트 ===")
    
    # 1. 연결
    try:
        ms.connect_milvus()
    except Exception as e:
        print(f"Milvus 연결 실패: {e}")
        return

    # 2. 컬렉션 로드
    collection_name = ms.COLLECTION_NAME
    print(f"\nChecking collection: {collection_name}")
    
    try:
        collection = Collection(collection_name)
        collection.load()
    except Exception as e:
        print(f"컬렉션 로드 실패 (컬렉션이 없거나 Milvus가 실행 중이 아닐 수 있습니다): {e}")
        return

    # 3. 전체 개수 확인
    # 데이터 싱크를 맞추기 위해 flush 수행
    collection.flush()
    
    # 🔥 정확한 개수 확인을 위해 강제 Compaction 수행 (삭제된 데이터 정리)
    print("Wait for compaction... (삭제된 데이터 정리 중)")
    collection.compact()
    collection.wait_for_compaction_completed() # 완료될 때까지 대기

    total = collection.num_entities
    print(f"총 벡터 개수 (Total entities): {total}")
    
    if total == 0:
        print("⚠️ 컬렉션이 비어있습니다.")
        return

    # 4. 세션별 데이터 분포 확인
    print("\n--- 세션별 데이터 분포 (Session Distribution) ---")
    try:
        # 모든 데이터의 session_id만 가져오기 (limit은 적절히 설정)
        results = collection.query(
            expr="id >= 0",
            output_fields=["session_id", "filename"],
            limit=16384,
            consistency_level="Strong" # 최신 데이터 보장
        )
        
        if len(results) == 0 and total > 0:
            print(f"⚠️ 주의: 총 개수는 {total}개인데 조회된 데이터가 없습니다.")
            print("   (삭제된 데이터가 아직 완전히 정리되지 않았거나, 인덱싱 지연일 수 있습니다.)")
            print("   Milvus Compaction을 수행하면 해결될 수 있습니다.")
        
        session_counts = Counter()
        session_files = {}

        for res in results:
            sid = res.get('session_id', 'Unknown')
            if not sid: sid = "Empty String" # 빈 문자열 처리
            
            fname = res.get('filename', 'Unknown')
            session_counts[sid] += 1
            
            if sid not in session_files:
                session_files[sid] = set()
            session_files[sid].add(fname)

        if not session_counts and len(results) > 0:
             print("데이터는 있지만 session_id 필드가 모두 비어있습니다.")
        elif session_counts:
            print(f"{'Session ID':<40} | {'Count':<6} | {'Files'}")
            print("-" * 100)
            for sid, count in session_counts.items():
                files = list(session_files[sid])
                file_display = ", ".join(files[:3]) + ("..." if len(files) > 3 else "")
                print(f"{sid:<40} | {count:<6} | {file_display}")

    except Exception as e:
        print(f"데이터 집계 실패: {e}")

    # 5. 최근 데이터 샘플
    print("\n--- 데이터 샘플 (First 5) ---")
    try:
        results = collection.query(
            expr="id >= 0",
            output_fields=["id", "filename", "session_id", "doc_type"],
            limit=5
        )
        
        for res in results:
            print(f"ID: {res['id']} | File: {res['filename']} | Session: {res.get('session_id', 'N/A')}")
            
    except Exception as e:
        print(f"데이터 조회 실패: {e}")

if __name__ == "__main__":
    check_data()
