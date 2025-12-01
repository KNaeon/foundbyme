import os
import glob
import chromadb
from sentence_transformers import SentenceTransformer
import pdfplumber
import docx
from bs4 import BeautifulSoup

DB_PATH = "chroma_db"
COLLECTION_NAME = "documents"

model = SentenceTransformer("sentence-transformers/multi-qa-mpnet-base-dot-v1")

# -------------------------------------------
# 확장자별 로더
# -------------------------------------------
def load_text_from_file(f):
    ext = f.split(".")[-1].lower()

    if ext in ["txt", "md"]:
        return open(f, encoding="utf-8").read()

    if ext == "html":
        soup = BeautifulSoup(open(f, encoding="utf-8").read(), "html.parser")
        return soup.get_text(" ", strip=True)

    if ext == "docx":
        doc = docx.Document(f)
        return "\n".join([p.text for p in doc.paragraphs])

    return None


def load_pdf(f):
    pages = []
    with pdfplumber.open(f) as pdf:
        for p, page in enumerate(pdf.pages):
            text = page.extract_text()
            if text:
                pages.append((p, text))
    return pages


# --------------------------------------------------
# 전체 로드 + 임베딩 + ChromaDB 저장
# --------------------------------------------------
def build_embeddings():
    chroma = chromadb.PersistentClient(path=DB_PATH)

    # 기존 컬렉션 삭제 후 재생성
    try:
        chroma.delete_collection(COLLECTION_NAME)
    except:
        pass

    col = chroma.get_or_create_collection(name=COLLECTION_NAME, metadata = {'hnsw:space': 'cosine'})

    ids, texts, metas = [], [], []

    for f in glob.glob("data/*"):

        ext = f.split(".")[-1].lower()

        # PDF: 페이지 단위
        if ext == "pdf":
            pdf_pages = load_pdf(f)
            for p, text in pdf_pages:
                doc_id = f"{f}_p{p}"
                ids.append(doc_id)
                texts.append(text)
                metas.append({"filepath": f, "ext": ext, "page": p})

        # 일반 파일
        else:
            text = load_text_from_file(f)
            if text:
                doc_id = f"{f}_0"
                ids.append(doc_id)
                texts.append(text)
                metas.append({"filepath": f, "ext": ext, "page": 0})

    # 임베딩 생성
    embeddings = model.encode(texts).tolist()

    # ChromaDB 적재
    col.add(ids=ids, embeddings=embeddings, documents=texts, metadatas=metas)


    return len(ids)


# reload 기능
def reload_embeddings():
    if os.path.exists(DB_PATH):
        pass  # chroma persist dir 그대로 둬도 override됨
    return build_embeddings()


if __name__ == "__main__":
    count = build_embeddings()
    print(f"Indexed {count} documents.")
