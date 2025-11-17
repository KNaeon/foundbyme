from txtai.embeddings import Embeddings
import json, glob
import pdfplumber

def load_docs():
    docs = []
    for i, f in enumerate(glob.glob("data/*.txt")):
        text = open(f, 'r', encoding='utf-8').read()
        docs.append({"id": i, "text": text})
    return docs

def load_pdfs():
  docs = []
  idx = 0

  for f in glob.glob("data/*.pdf"):
    with pdfplumber.open(f) as pdf:
      for page_num, page in enumerate(pdf.pages):
        text = page.extract_text()
        if not text:
          continue
        text = text.strip()
        if not text:
          continue

        docs.append({
          "id": f"{f}_p{page_num}",
          "text": text
        })
        idx += 1

  return docs

emb = Embeddings({"path": "sentence-transformers/all-MiniLM-L6-v2", "content": True})
docs = load_docs() + load_pdfs()
emb.index(docs)
emb.save("vectors")
