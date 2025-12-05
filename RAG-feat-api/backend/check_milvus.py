from pymilvus import connections, Collection

# 1. Milvus 연결
connections.connect("default", host="127.0.0.1", port="19530")

# 2. 컬렉션 불러오기
collection_name = "study_docs"
try:
    collection = Collection(collection_name)
    
    # 3. 강제 동기화 (메모리에 있는 데이터를 디스크에 씀)
    collection.flush()
    
    # 4. 개수 출력
    print("="*30)
    print(f"✅ 현재 Milvus 저장된 문서 개수: {collection.num_entities}개")
    print("="*30)
    
    # (선택) 저장된 데이터 살짝 보기
    res = collection.query(expr="", limit=3, output_fields=["filename"])
    for r in res:
        print(f"- {r['filename']}")

except Exception as e:
    print(f"❌ 컬렉션을 찾을 수 없거나 에러 발생: {e}")