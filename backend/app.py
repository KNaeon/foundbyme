# app.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer
from index import reload_embeddings, DB_PATH, COLLECTION_NAME

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load DB + model
chroma = chromadb.PersistentClient(path = DB_PATH)
col = chroma.get_collection(COLLECTION_NAME)
model = SentenceTransformer("all-MiniLM-L6-v2")


# -----------------------------------------
# /search
# -----------------------------------------
@app.get("/search")
def search(q: str, k: int = 5):
    emb = model.encode([q]).tolist()
    res = col.query(query_embeddings=emb, n_results=k)

    results = []
    for i in range(len(res["ids"][0])):
        results.append({
            "id": res["ids"][0][i],
            "score": float(res["distances"][0][i]),
            "text": res["documents"][0][i],
            "meta": res["metadatas"][0][i]
        })
    return {"results": results}


# -----------------------------------------
# /documents
# -----------------------------------------
@app.get("/documents")
def documents(limit: int = 100):
    res = col.get(include=["documents", "metadatas"])

    docs = []
    for i in range(min(limit, len(res["ids"]))):
        docs.append({
            "id": res["ids"][i],
            "preview": res["documents"][i][:300],
            "meta": res["metadatas"][i]
        })

    return {"documents": docs}


# -----------------------------------------
# /stats
# -----------------------------------------
@app.get("/stats")
def stats():
    res = col.get(include=["metadatas"])
    total = len(res["ids"])

    by_ext = {}
    pdf_pages = 0

    for m in res["metadatas"]:
        ext = m["ext"]
        by_ext[ext] = by_ext.get(ext, 0) + 1
        if ext == "pdf":
            pdf_pages += 1

    return {
        "total_documents": total,
        "by_extension": by_ext,
        "total_pdf_pages": pdf_pages
    }


# -----------------------------------------
# /vectors (샘플)
# -----------------------------------------
@app.get("/vectors")
def vectors(limit: int = 100):
    res = col.get(include=["embeddings"])

    embeddings = res.get("embeddings")
    if embeddings is None:
        return {"error": "Embeddings are not stored in this collection."}

    # numpy 배열 → 파이썬 리스트(list of list of float)로 변환
    vectors = [list(map(float, emb)) for emb in embeddings[:limit]]

    return {"vectors": vectors}


# -----------------------------------------
# /reload
# -----------------------------------------
@app.get("/reload")
def reload():
    count = reload_embeddings()
    return {"status": "success", "indexed": count}
