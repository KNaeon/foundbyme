from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from txtai.embeddings import Embeddings

app = FastAPI()

# CORS 허용 (프론트가 다른 포트에서 요청할 수 있게)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 저장해둔 vectors 폴더 로드
emb = Embeddings({"path": "vectors"})

@app.get("/search")
def search(q: str):
    results = emb.search(q,3) #쿼리 q와 가장 가까운 문서 3개 반환
    return results
