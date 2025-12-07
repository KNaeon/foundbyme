from fastapi import FastAPI, UploadFile, File, Query, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional
from pymilvus import Collection, connections, utility
from txtai.embeddings import Embeddings
import numpy as np, os, shutil
import uvicorn

import milvus_function as ms

app = FastAPI()

# =====================================
# CORS (React 연결 지원)
# =====================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_methods=["*"], allow_headers=["*"]
)

UPLOAD_DIR= ms.DATA_DIR
ALLOWED_EXT=ms.ALLOWED_EXT

# =====================================
# txtai 모델 · Milvus 연결 초기화
# =====================================
print("\n🚀 Loading txtai model & connecting Milvus...")

embeddings = ms.initialize_embeddings()

ms.connect_milvus()
collection = ms.setup_milvus_collection()

print("✅ Ready → API Online\n")


# =====================================
# 파일 업로드 (/upload)
# =====================================
@app.post("/upload")
def upload_file(
    files: List[UploadFile] = File(...),
    session_id: str = Form("default") # session_id 추가
):
    
    saved_files = []
    errors = []

    # 세션별 폴더 생성
    session_dir = os.path.join(UPLOAD_DIR, session_id)
    os.makedirs(session_dir, exist_ok=True)

    for file in files:
        ext = file.filename.split(".")[-1].lower()
        if ext not in ALLOWED_EXT:
            errors.append(f"❌ {file.filename}: 지원하지 않는 파일 형식 ({ext})")
            continue

        save_path = f"{session_dir}/{file.filename}"
        with open(save_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
        
        saved_files.append(file.filename)

    return {
        "status": "completed",
        "saved": saved_files,
        "errors": errors,
        "session_id": session_id,
        "info": "📌 파일 저장완료 → /reindex 호출 시 인덱싱 수행"
    }

# =====================================
# 📂 파일 다운로드/열기 (추가됨)
# =====================================
@app.get("/files/{session_id}/{filename}")
def get_file(session_id: str, filename: str):
    file_path = os.path.join(UPLOAD_DIR, session_id, filename)
    if os.path.exists(file_path):
        return FileResponse(file_path)
    return {"error": "File not found"}


# =====================================
# 인덱싱 (증분 방식)
# =====================================
@app.get("/reindex")
def reindex(session_id: str = "default"):

    global collection, embeddings  

    # 세션별 폴더 스캔
    session_dir = os.path.join(UPLOAD_DIR, session_id)
    if not os.path.exists(session_dir):
        return {"status": "No documents found for this session"}

    documents = ms.load_all_documents(session_dir, session_id)
    if not documents:
        return {"status": "No new documents"}
    
    ms.vectorize_and_index_via_txtai(embeddings, collection, documents)

    return {"status": "Success", "indexed": len(documents)}


# =====================================
# 🔍 검색
# =====================================
@app.get("/search")
def search(q: str, session_id: str = "default", top_k: int = 5):
    global embeddings, collection
    
    try:
        # 쿼리 벡터화
        qvec = embeddings.transform(q)
        if isinstance(qvec, np.ndarray):
            qvec = qvec.tolist()

        # session_id 필터링 추가
        expr = f'session_id == "{session_id}"'

        results = collection.search(
            data=[qvec],
            anns_field="vector",
            param={"metric_type":"IP","params":{"nprobe":16}},
            limit=top_k,
            expr=expr, # 필터 적용
            output_fields=["filename","path","doc_type","text","session_id"]
        )

        if not results or len(results[0]) == 0:
            return {"results": [], "message":"검색 결과 없음"}

        out=[]
        for hit in results[0]:
            e = hit.entity
            filename = e.get("filename")
            sid = e.get("session_id")
            out.append({
                "score": float(hit.score),
                "file":  filename,
                "path":  e.get("path"),
                "type":  e.get("doc_type"),
                "preview": e.get("text")[:200].replace("\n"," "),
                # [추가] 파일을 열 수 있는 URL 제공 (세션 ID 포함)
                "url": f"http://localhost:8000/files/{sid}/{filename}" 
            })
        return {"results":out}

    except Exception as e:
        return {"error": str(e)}


# =====================================
# 📄 문서 목록 조회
# =====================================
@app.get("/documents")
def list_documents(session_id: str = "default", limit: int = 100):

    # Milvus 쿼리 limit 보호
    limit = min(limit, 16384)

    # session_id 필터링
    expr = f'session_id == "{session_id}"'

    # id, filename, doc_type, text 만 가져오기
    rows = collection.query(
        expr=expr,
        output_fields=["id", "filename", "doc_type", "text"],
        limit=limit
    )

    docs = []
    for r in rows:
        docs.append({
            "id": str(r["id"]),                         # [수정] JS 정밀도 문제로 문자열 변환
            "filename": r["filename"],                  # 파일명
            "preview": r["text"][:20].replace("\n", " "),  # 20자 제한
            "type": r["doc_type"]                       # 확장자
        })

    return {"count": len(docs), "documents": docs}


# =====================================
# 📊 확장자별 통계
# =====================================
@app.get("/stats")
def stats():

    total=collection.num_entities
    if total==0:
        return {"total_docs":0,"by_extension":{}}

    limit=min(total,16384)
    rows=collection.query(expr="id >= 0",output_fields=["doc_type"],limit=limit)

    stat={}
    for r in rows:
        ext=r["doc_type"]
        stat[ext]=stat.get(ext,0)+1

    return {"total_docs":len(rows),"by_extension":stat}

@app.get("/vectors")
def vectors(limit: int = 10, dim: int = 10):
    limit = min(limit, 16384)

    rows = collection.query(
        expr="id >= 0",
        output_fields=["id", "filename", "vector"],
        limit=limit
    )

    vectors = []
    for r in rows:
        vec = r["vector"][:dim]    #  앞 dim개만 출력
        vectors.append({
            "id": str(r["id"]), # [수정] JS 정밀도 문제로 문자열 변환
            "filename": r["filename"],
            "vector_preview": vec,
            "vector_dimensions": len(r["vector"])
        })

    return {"count": len(vectors), "vectors": vectors}


# ======================================================
# ① clear : Collection 전체 삭제 → 초기화
# ======================================================
@app.get("/clear")
def clear_db():
    deleted = ms.drop_milvus_collection_and_count()
    return {
        "status": "CLEARED" if deleted > 0 else "NO ACTION",
        "deleted_docs": deleted, 
        "message": "Vector DB reset." if deleted > 0 else "Collection was already empty."
    }


# ======================================================
# ② delete : 특정 파일 데이터 및 로컬 파일 제거
# ======================================================
@app.get("/delete")
def delete_file(filename: str):
    count, ids = ms.delete_document_by_filename(filename)
    return {
        "status": "DELETED" if count>0 else "NOT FOUND",
        "filename": filename,
        "deleted_count": count,
        "deleted_ids": ids
    }

# ======================================================
# ③ delete_session : 채팅방 삭제 (세션 데이터 전체 삭제)
# ======================================================
@app.delete("/session/{session_id}")
def delete_session(session_id: str):
    count = ms.delete_session_data(session_id)
    return {
        "status": "DELETED",
        "session_id": session_id,
        "deleted_vectors": count
    }

# =====================================
# 💬 채팅 (RAG Mock)
# =====================================y
class ChatRequest(BaseModel):
    query: str
    session_id: str = "default" # 세션 ID 추가

@app.post("/chat")
def chat_endpoint(req: ChatRequest):
    # 1. 검색 수행 (세션 ID 전달)
    search_results = search(req.query, session_id=req.session_id, top_k=3)
    
    # 2. 검색 결과가 있는지 확인
    sources = []
    context = ""
    
    if "results" in search_results:
        for res in search_results["results"]:
            # [수정] 단순 파일명이 아니라 객체 전체(url 포함)를 저장
            sources.append({
                "name": res["file"],
                "url": res["url"],
                "preview": res["preview"]
            })
            context += f"- {res['preview']}\n"
    
    if not context:
        answer = "관련된 문서를 찾을 수 없습니다. 문서를 업로드했는지 확인해주세요."
    else:
        answer = f"'{req.query}'에 대해 문서에서 찾은 내용은 다음과 같습니다:\n\n{context}\n\n(위 내용은 RAG 검색 결과에 기반합니다.)"

    return {
        "query": req.query,
        "answer": answer,
        "sources": sources # 중복 제거
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)