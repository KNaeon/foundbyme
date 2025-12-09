# chroma_engine.py
import os
from typing import List, Dict, Any
from dotenv import load_dotenv

import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer

load_dotenv()


class ChromaEngine:
    def __init__(self, persist_dir: str | None = None):
        self.persist_dir = persist_dir or os.getenv("CHROMA_PERSIST_DIR", "./chroma_store")

        self.client = chromadb.PersistentClient(
            path=self.persist_dir,
            settings=Settings(anonymized_telemetry=False),
        )

        model_name = os.getenv(
            "EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2"
        )
        print(f"[CHROMA] Loading embedding model: {model_name}")
        self.model = SentenceTransformer(model_name)

        self.collection = self.client.get_or_create_collection(
            name="documents",
            metadata={"hnsw:space": "cosine"},
        )

    def embed(self, texts: List[str]) -> List[List[float]]:
        emb = self.model.encode(texts, convert_to_numpy=True)
        return emb.tolist()

    def clear_all(self):
        # Instead of deleting the collection, we delete all items.
        # This prevents stale reference issues in other modules.
        try:
            existing_ids = self.collection.get()["ids"]
            if existing_ids:
                self.collection.delete(ids=existing_ids)
        except Exception as e:
            print(f"[CHROMA] Error clearing collection: {e}")
            # Fallback to recreate if needed, but prefer deletion
            self.client.delete_collection("documents")
            self.collection = self.client.get_or_create_collection(
                name="documents",
                metadata={"hnsw:space": "cosine"},
            )

    def upsert_documents(
        self,
        ids: List[str],
        texts: List[str],
        metadatas: List[Dict[str, Any]],
    ):
        embeddings = self.embed(texts)
        # Chroma는 id가 중복되면 add에서 에러날 수 있으니 upsert-like 동작을 위해:
        self.collection.upsert(
            ids=ids,
            embeddings=embeddings,
            metadatas=metadatas,
            documents=texts,
        )

    def search(self, query: str, top_k: int = 5) -> Dict[str, Any]:
        q_emb = self.embed([query])[0]
        return self.collection.query(
            query_embeddings=[q_emb],
            n_results=top_k,
        )
