# app.py
import os
import shutil
from typing import List, Optional
from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import select, delete

from db.db import get_db
from db.models import Document
from loader import load_text
from indexer import rebuild_index, chroma

import numpy as np
from sklearn.decomposition import PCA


# ================================
# 초기 세팅
# ================================
UPLOAD_DIR = "./data"
ALLOWED_EXT = {"txt", "pdf", "md", "docx", "pptx"}

app = FastAPI(title="FoundByMe API (Chroma + PostgreSQL)")

# Global Chroma Engine
# chroma = ChromaEngine() # Removed to use shared instance from indexer


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    query: str
    session_id: str = "default"

# ======================================================
# 🔍 /search - 유사문서 top5 + PCA 3D
# ======================================================
@app.get("/search")
def search(q: str, session_id: str = "default"):

    if not q:
        raise HTTPException(status_code=400, detail="query required")

    # session_id 필터 적용
    where_filter = {"session_id": session_id} if session_id != "default" else None
    
    q_emb = chroma.embed([q])[0]
    result = chroma.collection.query(
        query_embeddings=[q_emb],
        n_results=5,
        where=where_filter
    )

    ids = result["ids"][0]
    dists = result["distances"][0] if result["distances"] else []
    docs = result["documents"][0] if result["documents"] else []
    metas = result["metadatas"][0] if result["metadatas"] else []

    real_k = len(ids)

    if real_k == 0:
        return {
            "query": q,
            "query_vector_3d": [0, 0, 0],
            "results": []
        }

    # Embedding 가져오기
    doc_vecs = chroma.collection.get(ids=ids, include=["embeddings"])["embeddings"]
    query_vec = np.array(q_emb, dtype=np.float32)
    doc_vecs = np.array(doc_vecs, dtype=np.float32)

    # PCA
    if len(doc_vecs) > 0:
        X = np.vstack([query_vec, *doc_vecs])
    else:
        X = np.array([query_vec])
        
    if len(X) < 3:
         query_3d = [0, 0, 0]
         doc_3d = [[0,0,0]] * len(doc_vecs)
    else:
        pca = PCA(n_components=min(3, len(X)))
        X_3d = pca.fit_transform(X)
        if X_3d.shape[1] < 3:
            X_3d = np.pad(X_3d, ((0,0), (0, 3-X_3d.shape[1])), 'constant')
            
        query_3d = X_3d[0].tolist()
        doc_3d = X_3d[1:]
    
    results = []
    for i in range(real_k):
        results.append({
            "id": ids[i],
            "filename": metas[i].get("title"),
            "ext": metas[i].get("ext"),
            "page": metas[i].get("page", 1),
            "score": float(dists[i]) if len(dists) > i else 0,
            "vector_3d": doc_3d[i].tolist() if len(doc_3d) > i else [0,0,0],
            "preview": (docs[i][:200] if docs[i] else "").replace("\n", " "),
            "url": f"http://localhost:8000/files/{session_id}/{metas[i].get('title')}"
        })  
    
    return {
        "query": q,
        "query_vector_3d": query_3d,
        "results": results
    }

# =====================================
# 💬 /chat (RAG Mock)
# =====================================
@app.post("/chat")
def chat_endpoint(req: ChatRequest):
    search_results = search(req.query, session_id=req.session_id)
    
    sources = []
    context = ""
    
    if "results" in search_results:
        for res in search_results["results"]:
            sources.append({
                "name": res["filename"],
                "url": res.get("url", ""),
                "preview": res.get("preview", ""),
                "page": res.get("page", 1)
            })
            context += f"- {res.get('preview', '')}\n"
    
    if not context:
        answer = "관련된 문서를 찾을 수 없습니다. 문서를 업로드했는지 확인해주세요."
    else:
        answer = f"'{req.query}'에 대해 문서에서 찾은 내용은 다음과 같습니다:\n\n{context}\n\n(위 내용은 RAG 검색 결과에 기반합니다.)"

    return {
        "query": req.query,
        "answer": answer,
        "sources": sources
    }


# ======================================================
# 📤 /upload - 파일 업로드
# ======================================================
@app.post("/upload")
def upload_file(
    files: List[UploadFile] = File(...),
    session_id: str = Form("default")
):
    saved_files = []
    errors = []

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
# 📂 파일 다운로드/열기
# =====================================
@app.get("/files/{session_id}/{filename}")
def get_file(session_id: str, filename: str):
    file_path = os.path.join(UPLOAD_DIR, session_id, filename)
    if os.path.exists(file_path):
        return FileResponse(file_path)
    return {"error": "File not found"}


# ======================================================
# 🔄 /reindex - 전체 재인덱싱
# ======================================================
@app.get("/reindex")
def reindex(session_id: str = "default"):
    rebuild_index()
    # global chroma
    # chroma = ChromaEngine()  # reload - No need, using shared instance
    return {"status": "Success"}


# ======================================================
# 📄 /documents - 문서 목록 조회
# ======================================================
@app.get("/documents")
def list_documents(session_id: str = "default", limit: int = 100):
    try:
        limit = min(limit, 10000)

        where_filter = {"session_id": session_id} if session_id != "default" else None

        rows = chroma.collection.get(
            where=where_filter,
            include=["metadatas", "documents"],
            limit=limit
        )
        ids = rows["ids"]
        metas = rows["metadatas"]
        docs = rows["documents"]

        result = []
        for idx, meta, content in zip(ids, metas, docs):
            result.append({
                "id": idx,
                "filename": meta.get("title", "unknown"),
                "preview": (content[:20] if content else "").replace("\n", " "),
                "type": meta.get("ext", "txt")
            })

        return {"count": len(result), "documents": result}
    except Exception as e:
        print(f"Error in /documents: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


# ======================================================
# 📊 /stats - 확장자별 통계
# ======================================================
@app.get("/stats")
def stats():
    rows = chroma.collection.get(include=["metadatas"])
    metas = rows["metadatas"]

    stat = {}
    for meta in metas:
        ext = meta.get("ext", "txt")
        stat[ext] = stat.get(ext, 0) + 1

    return {
        "total_docs": len(metas),
        "by_extension": stat
    }

# =====================================
# 🌌 /galaxy (3D 시각화)
# =====================================
@app.get("/galaxy")
def galaxy_view(session_id: str = "default", query: Optional[str] = None):
    try:
        where_filter = {"session_id": session_id} if session_id != "default" else None
        
        results = chroma.collection.get(
            where=where_filter,
            include=["metadatas", "embeddings"]
        )
        
        ids = results["ids"]
        metas = results["metadatas"]
        embeddings = results["embeddings"]
        
        if not ids:
            return []

        vectors = []
        metadata_list = []
        
        for i, vec in enumerate(embeddings):
            vectors.append(vec)
            metadata_list.append({
                "id": ids[i],
                "label": metas[i].get("title", "unknown"),
                "type": metas[i].get("ext", "txt"),
                "isQuery": False
            })
            
        if query:
            qvec = chroma.embed([query])[0]
            vectors.append(qvec)
            metadata_list.append({
                "id": "query",
                "label": f"Question: {query}",
                "type": "query",
                "isQuery": True
            })

        X = np.array(vectors)
        
        if len(X) < 3:
             points = []
             for i, meta in enumerate(metadata_list):
                points.append({
                    "id": meta["id"],
                    "position": [np.random.uniform(-5, 5), np.random.uniform(-5, 5), np.random.uniform(-5, 5)],
                    "color": "#FDE047" if meta["isQuery"] else "#8B5CF6",
                    "label": meta["label"],
                    "isQuery": meta["isQuery"]
                })
             return points

        X_centered = X - np.mean(X, axis=0)
        
        pca = PCA(n_components=3)
        X_3d = pca.fit_transform(X_centered)
        
        max_val = np.max(np.abs(X_3d))
        if max_val > 0:
            X_3d = (X_3d / max_val) * 15
            
        points = []
        for i, coord in enumerate(X_3d):
            meta = metadata_list[i]
            
            color = "#8B5CF6"
            if meta["isQuery"]:
                color = "#FDE047"
            elif meta["type"] in ["pdf"]:
                color = "#F43F5E"
            elif meta["type"] in ["txt", "md"]:
                color = "#06B6D4"
            elif meta["type"] in ["pptx", "ppt"]:
                color = "#F97316"

            points.append({
                "id": meta["id"],
                "position": coord.tolist(),
                "color": color,
                "label": meta["label"],
                "isQuery": meta["isQuery"]
            })
            
        return points

    except Exception as e:
        print(f"Galaxy View Error: {e}")
        return []

# ======================================================
# ③ delete_session : 채팅방 삭제
# ======================================================
@app.delete("/session/{session_id}")
def delete_session(session_id: str, db: Session = Depends(get_db)):
    # 1. 로컬 파일 삭제
    session_dir = os.path.join(UPLOAD_DIR, session_id)
    if os.path.exists(session_dir):
        shutil.rmtree(session_dir)
    
    # 2. ChromaDB 삭제
    try:
        chroma.collection.delete(where={"session_id": session_id})
    except:
        pass

    # 3. SQL DB 삭제 (path에 session_id가 포함된 문서 삭제)
    # path format: ./data/{session_id}/{filename}
    # Windows path separator issue might exist, so we use like query carefully
    try:
        # session_id가 경로에 포함된 모든 문서 삭제
        # 예: %/session_id/% 또는 %\session_id\%
        # 단순히 like(f"%{session_id}%")를 쓰면 부분 문자열 매칭 위험이 있음 (예: id=123이 1234를 삭제)
        # 따라서 디렉토리 구분자를 포함하여 검색
        stmt = delete(Document).where(
            (Document.path.like(f"%/{session_id}/%")) | 
            (Document.path.like(f"%\\{session_id}\\%"))
        )
        db.execute(stmt)
        db.commit()
    except Exception as e:
        print(f"Error deleting from SQL: {e}")
        
    return {
        "status": "DELETED",
        "session_id": session_id
    }

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000)
