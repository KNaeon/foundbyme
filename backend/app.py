# app.py
import os
import shutil
from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import select

from db.db import get_db
from db.models import Document
from chroma_engine import ChromaEngine
from loader import load_text
from indexer import rebuild_index

import numpy as np
from sklearn.decomposition import PCA


# ================================
# 초기 세팅
# ================================
UPLOAD_DIR = "./data"
ALLOWED_EXT = {"txt", "pdf", "md", "docx", "pptx"}

app = FastAPI(title="FoundByMe API (Chroma + PostgreSQL)")

# Global Chroma Engine
chroma = ChromaEngine()


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ======================================================
# 🔍 /search - 유사문서 top5 + PCA 3D
# ======================================================
@app.get("/search")
def search(q: str):

    if not q:
        raise HTTPException(status_code=400, detail="query required")

    # Chroma 검색
    result = chroma.search(q, top_k=5)

    ids = result["ids"][0]
    dists = result["distances"][0]
    docs = result["documents"][0]      # content
    metas = result["metadatas"][0]     # metadata

    real_k = len(ids)

    if real_k == 0:
        return {
            "query": q,
            "query_vector_3d": [0, 0, 0],
            "results": []
        }

    # Embedding 가져오기
    doc_vecs = chroma.collection.get(ids=ids, include=["embeddings"])["embeddings"]
    query_vec = chroma.embed([q])[0]
    doc_vecs = np.array(doc_vecs, dtype=np.float32)
    query_vec = np.array(query_vec, dtype=np.float32)

    # PCA
    # 정상 stack
    X = np.vstack([query_vec, *doc_vecs])
    print("stacked shape:", X.shape)
    
    pca = PCA(n_components=3)
    X_3d = pca.fit_transform(X)
    
    query_3d = X_3d[0].tolist()
    doc_3d = X_3d[1:]
    
    results = []
    for i in range(real_k):
        results.append({
            "id": ids[i],
            "filename": metas[i].get("title"),
            "ext": metas[i].get("ext"),
            "page": metas[i].get("page", 1),
            "score": float(dists[i]),
            "vector_3d": doc_3d[i].tolist()
        })  
    


    return {
        "query": q,
        #"query_ve" : query_vec
        "query_vector_3d": query_3d,
        "results": results
    }





# ======================================================
# 📤 /upload - 파일 업로드만 수행
# ======================================================
@app.post("/upload")
def upload_file(file: UploadFile = File(...)):
    ext = file.filename.split(".")[-1].lower()

    if ext not in ALLOWED_EXT:
        return {"error": f"❌ 지원하지 않는 파일 형식: {ext}"}

    os.makedirs(UPLOAD_DIR, exist_ok=True)
    save_path = f"{UPLOAD_DIR}/{file.filename}"

    with open(save_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    return {
        "status": "saved",
        "file": file.filename,
        "path": save_path,
        "info": "📌 파일 저장완료 → /reindex 호출 시 인덱싱 수행"
    }


# ======================================================
# 🔄 /reindex - 전체 재인덱싱
# ======================================================
@app.get("/reindex")
def reindex():
    rebuild_index()
    global chroma
    chroma = ChromaEngine()  # reload
    return {"status": "Success"}


# ======================================================
# 📄 /documents - 문서 목록 조회
# ======================================================
@app.get("/documents")
def list_documents(limit: int = 100):
    limit = min(limit, 10000)

    rows = chroma.collection.get(include=["metadatas", "documents"])
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
