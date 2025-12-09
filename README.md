# 🧠 FoundByMe

<div align="center">

  <img src="https://img.shields.io/badge/Python-3.8%2B-blue?logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/Node.js-18%2B-339933?logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white" alt="Docker">

  <br>

  <img src="https://img.shields.io/badge/Powered%20by-FAISS-0085CA?style=flat&logo=meta&logoColor=white" alt="FAISS">
  <img src="https://img.shields.io/badge/Vector%20DB-Milvus-00a1ea?style=flat&logo=zilliz&logoColor=white" alt="Milvus">
  <img src="https://img.shields.io/badge/Embedding-Sentence--Transformers-orange?style=flat&logo=huggingface&logoColor=white" alt="SBERT">
  <img src="https://img.shields.io/badge/Framework-txtai-7e56c2?style=flat" alt="txtai">

  <br>

  <a href="https://kimhabin2.github.io/foundbyme-custom/">
    <img src="https://img.shields.io/badge/Website-GitHub%20Pages-222222?logo=github&logoColor=white" alt="Website">
  </a>
  <a href="https://foundbyme.readthedocs.io">
    <img src="https://img.shields.io/badge/Docs-ReadTheDocs-8CA1AF?logo=readthedocs&logoColor=white" alt="Documentation">
  </a>
  <img src="https://img.shields.io/github/license/KNaeon/foundbyme?color=red" alt="License">

</div>
<br>

**FoundByMe** is an open-source, lightweight semantic search tool focused on *simplicity* and *educational accessibility*.  
Instead of relying on keyword matching, it converts text into **vector embeddings** and retrieves documents based on **semantic meaning**.  
It helps users quickly find relevant information across multiple files — no need to open every document manually.

> **Goal:** a local-first, fast meaning-based search across your files.

---

## 📚 Documentation

- Read the full guide: https://foundbyme.readthedocs.io/en/latest/

- Build locally:

```bash
cd docs
pip install -r requirements.txt
make html
```

## 🌐 Website

 - Live site: https://knaeon.github.io/foundbyme/

 - Source Code: The website source code is maintained in the gh-pages branch.(Jekyll/just-the-docs)
 
 - Preview locally: You need to checkout the gh-pages branch to view the website source

```bash
git checkout gh-pages
bundle install
bundle exec jekyll serve
```
---

## ✨ Features

| Feature | Status | Description |
|--------|---------|-------------|
| PDF / TXT Loader | in progress | Extracts text from documents |
| Text Embedding (Sentence-BERT) | planned | Converts text into semantic vectors |
| Vector Storage (FAISS / Chroma) | planned | Efficient similarity search |
| Search API | planned | `/query` endpoint returning top-k relevant results |
| Web UI Frontend | in progress | Simple interface for submitting search queries |

---

## 📁 Project Structure


---

## 📚 Documentation
Documentation (ReadTheDocs): https://foundbyme.readthedocs.io/

---

## ✨ Features

| Feature | Status | Description |
|--------|---------|-------------|
| PDF / TXT Loader | in progress | Extracts text from documents |
| Text Embedding (Sentence-BERT) | planned | Converts text into semantic vectors |
| Vector Storage (FAISS / Chroma) | planned | Efficient similarity search |
| Search API | planned | `/query` endpoint returning top-k relevant results |
| Web UI Frontend | in progress | Simple interface for submitting search queries |

---

## ⚙️ Tech Stack

| Category | Details |
|-----------|----------|
| **Language** | Python 3.10+ |
| **Libraries** | sentence-transformers, faiss |
| **Environment** | Windows |
| **Runtime** | Local |

---

## 🚀 Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/KNaeon/foundbyme
cd foundbyme
````

### 2️⃣ Activate Python Environment (Conda)

```bash
conda create -n foundbyme python=3.10
conda activate foundbyme
```

### 3️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

### 4️⃣ Example Usage

```python
from foundbyme import FoundByMe

fbm = FoundByMe()
fbm.index_folder("data/")

results = fbm.query("What are you finding for?")
print(results)
```

---

## 📝 License
Distributed under the **Apache License 2.0**.  
See `LICENSE` for details.
💡 *Developed for learning, built for clarity.*

(https://foundbyme.readthedocs.io)
[![Website](https://img.shields.io/badge/website-GitHub%20Pages-222222?logo=github&logoColor=white)](https://kimhabin2.github.io/foundbyme-custom/)

```
```
