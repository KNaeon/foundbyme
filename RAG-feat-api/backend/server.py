# server.py
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
import os
from typing import List
import numpy as np
from sklearn.decomposition import PCA # 차원 축소를 위한 라이브러리


# 기존 milvus_save.py에서 필요한 함수들 임포트 (구조에 따라 수정 필요할 수 있음)
# milvus_save.py의 코드를 모듈화하거나, 필요한 부분만 복사해서 사용하는 것을 추천합니다.
import milvus_save 

app = FastAPI() 

# CORS 설정 (프론트엔드 포트 5173 허용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 데이터 저장 경로
DATA_DIR = "./data"
os.makedirs(DATA_DIR, exist_ok=True)

# 모델 및 DB 초기화 (서버 시작 시 한 번 실행)
embeddings = milvus_save.initialize_embeddings()
milvus_save.connect_milvus()
collection = milvus_save.setup_milvus_collection()

class ChatRequest(BaseModel):
    query: str

@app.post("/api/upload")
async def upload_files(files: List[UploadFile] = File(...)):
    saved_files = []
    for file in files:
        file_path = os.path.join(DATA_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        saved_files.append(file.filename)
    
    # 파일 업로드 후 즉시 인덱싱 실행 (milvus_save.py 로직 재사용)
    documents = milvus_save.load_all_documents(DATA_DIR)
    milvus_save.vectorize_and_index_via_txtai(embeddings, collection, documents)
    
    return {"message": f"{len(saved_files)}개 파일 업로드 및 학습 완료"}

@app.post("/api/chat")
async def chat(request: ChatRequest):
    # milvus_save.py의 test_search 로직을 응용하여 검색 수행
    # 실제 구현 시 milvus_save.py의 search 함수가 반환값을 주도록 수정 필요
    results = milvus_save.search_function(embeddings, collection, request.query) # (가상의 함수)
    
    # 검색된 문서를 바탕으로 LLM(GPT 등)에 질문하는 로직이 여기에 추가되어야 완벽한 답변이 생성됨
    # 현재는 검색된 문서 내용만 반환하는 예시
    return {
        "answer": f"Milvus에서 검색된 내용입니다: {results[0]['text']}", 
        "sources": [r['filename'] for r in results]
    }

# ---------------------------------------------------------
# [기능 1] 검색 결과 반환 (Result.jsx 용)
# ---------------------------------------------------------
@app.post("/api/chat")
async def chat(request: ChatRequest):
    print(f"질문 수신: {request.query}")
    
    # 1. 질문을 벡터로 변환
    query_vector = embeddings.transform(request.query).tolist()
    
    # 2. Milvus에서 가장 가까운 문서 3개 검색
    search_params = {"metric_type": "IP", "params": {"nprobe": 10}}
    results = collection.search(
        data=[query_vector],
        anns_field="vector",
        param=search_params,
        limit=3,
        output_fields=["text", "filename", "path"]
    )
    
    # 3. 결과 정리
    retrieved_docs = []
    answer_text = ""
    
    if results and results[0]:
        # 가장 유사도가 높은 문서의 내용을 답변으로 사용 (간단한 예시)
        top_hit = results[0][0]
        # 실제로는 여기서 LLM(GPT)에게 top_hit.entity.get('text')를 주고 요약을 시켜야 함
        answer_text = f"문서 '{top_hit.entity.get('filename')}'에서 찾은 내용입니다:\n\n{top_hit.entity.get('text')[:200]}..."
        
        for hit in results[0]:
            retrieved_docs.append(hit.entity.get("filename"))
    else:
        answer_text = "관련된 문서를 찾을 수 없습니다."

    return {
        "query": request.query,
        "answer": answer_text,
        "sources": list(set(retrieved_docs)) # 중복 제거
    }

# ---------------------------------------------------------
# [기능 2] 은하수 시각화 데이터 반환 (Visualized.jsx 용)
# ---------------------------------------------------------
@app.get("/api/galaxy")
async def get_galaxy_data():
    # 1. Milvus에 저장된 모든 벡터 가져오기 (최대 1000개 제한 예시)
    res = collection.query(
        expr="id > 0", 
        output_fields=["id", "vector", "filename", "doc_type"],
        limit=1000
    )
    
    if not res:
        return []

    # 2. 데이터 준비 (벡터와 메타데이터 분리)
    vectors = [item['vector'] for item in res]
    metadata = [{'id': item['id'], 'filename': item['filename'], 'type': item['doc_type']} for item in res]
    
    # 3. 차원 축소 (384차원 -> 3차원) : PCA 알고리즘 사용
    # 데이터가 3개 미만이면 축소가 불가능하므로 예외처리
    if len(vectors) < 3:
        # 데이터가 너무 적을 때는 랜덤 좌표 반환
        pca_vectors = np.random.rand(len(vectors), 3) * 10 
    else:
        pca = PCA(n_components=3)
        pca_vectors = pca.fit_transform(vectors)
    
    # 4. 프론트엔드로 보낼 형식으로 변환 (x, y, z 좌표 스케일링)
    galaxy_data = []
    for i, point in enumerate(pca_vectors):
        # 좌표를 좀 더 넓게 퍼뜨리기 위해 5를 곱함
        galaxy_data.append({
            "id": metadata[i]['id'],
            "position": [float(point[0]) * 5, float(point[1]) * 5, float(point[2]) * 5],
            "color": get_color_by_type(metadata[i]['type']), # 파일 타입별 색상
            "label": metadata[i]['filename']
        })
        
    return galaxy_data

def get_color_by_type(doc_type):
    """파일 타입에 따라 별 색깔 다르게 주기"""
    if doc_type == 'pdf': return "#F43F5E"   # 빨강
    if doc_type == 'txt': return "#06B6D4"   # 파랑
    if doc_type == 'pptx': return "#F59E0B"  # 주황
    return "#8B5CF6" # 보라 (기본)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8040)