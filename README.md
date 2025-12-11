# 🧠 FoundByMe

<div align="center">

  <img src="https://img.shields.io/badge/Python-3.8%2B-blue?logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/Node.js-18%2B-339933?logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white" alt="Docker">
  <img src="https://img.shields.io/badge/Database-PostgreSQL-316192?logo=postgresql&logoColor=white" alt="PostgreSQL">

  <br>

  <img src="https://img.shields.io/badge/Powered%20by-txtai-7e56c2?style=flat&logo=python&logoColor=white" alt="txtai">
  <img src="https://img.shields.io/badge/RAG-Semantic%20Search-FF6F61?style=flat" alt="RAG">

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

**FoundByMe** is an open-source, **Context-Based Local Document Search System** that connects scattered knowledge on your PC into one.
Instead of simple keyword matching (Ctrl+F), it uses **RAG (Retrieval-Augmented Generation)** and **Vector Embeddings** to understand the context of your query.

> **Mission:** Stop Searching, Start Finding. A secure, local-first search engine for your scattered files.

---

## 📚 Documentation

- Read the full guide: https://foundbyme.readthedocs.io/en/latest/

- Build locally:

```bash
cd docs
pip install -r requirements.txt
make html
```

## 🌐 Website & Documentation

FoundByMe는 사용자 경험을 극대화하기 위해 새롭게 디자인된 웹사이트를 제공합니다.

### ✨ [NEW] Custom Theme Site (Recommended)
* **URL:** [https://kimhabin2.github.io/foundbyme-custom/](https://kimhabin2.github.io/foundbyme-custom/)
* **Features:**
    * 🎨 **Custom Design:** Apache Hadoop 스타일의 동적 애니메이션 및 브랜드 컬러 적용
    * 📱 **Better UX:** 반응형 레이아웃, 다크 모드, 카드형 UI
    * 📚 **Enhanced Docs:** 최신 설치 가이드(Docker) 및 기술 기여 전략 포함

### 🏚️ Legacy Site (Old)
* **URL:** [https://knaeon.github.io/foundbyme/](https://knaeon.github.io/foundbyme/)
* **Note:** 기본 `just-the-docs` 테마를 사용한 구버전입니다.

### 📚 Documentation
* **Documentation (ReadTheDocs):** https://foundbyme.readthedocs.io/

---

### 💻 Preview Locally (Custom Site)
새로운 커스텀 사이트를 로컬에서 실행하려면 `foundbyme-custom` 폴더에서 다음 명령어를 실행하세요.

```bash
# 1. 커스텀 테마 폴더로 이동
cd foundbyme-custom

# 2. 의존성 설치 및 실행
bundle install
bundle exec jekyll serve
```
---

## 🚀 One-Line Installation (Docker)

We support a fully containerized environment. You can run the entire stack (Frontend + Backend + DB) with a single command.

```bash
# 1. Clone the repository
git clone [https://github.com/KNaeon/foundbyme.git](https://github.com/KNaeon/foundbyme.git)
cd foundbyme

# 2. Run with Docker Compose
docker-compose up -d
```
- Web UI: http://localhost:3000

- API Docs: http://localhost:8000/docs

---

## ✨ Key Features

| Feature | Status | Description |
| :--- | :---: | :--- |
| **Universal Indexing** | ✅ Ready | Support for **PDF, PPTX, DOCX, Code**, and **Images (OCR)**. |
| **Semantic Search** | ✅ Ready | Context-aware search using **ChromaDB** & `Multilingual-MiniLM`. |
| **AI Re-Ranking** | ✅ Ready | High-precision re-scoring with **CrossEncoder** (`BGE-Reranker`). |
| **3D Visualization** | ✅ Ready | **Galaxy View** (PCA) to visualize knowledge clusters. |
| **Hybrid Storage** | ✅ Ready | **PostgreSQL** (Metadata) + **ChromaDB** (Vectors) architecture. |

---

## 🛠️ Tech Stack
- Backend: FastAPI, Python 3.8+

- Database: PostgreSQL (Metadata), ChromaDB (Vector Store)

- AI Models: SentenceTransformers, CrossEncoder (BGE-M3)

- Infrastructure: Docker Compose

- Frontend: Node.js, Jekyll (Project Site)

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

## 👥 Contributors

| Name | Role | Responsibilities |
|:---:|:---:|:---|
| **Naeon Kang** | Project Leader, Dev | Text processing pipeline, Testing, Debugging |
| **Habin Kim** | Docs Lead, PPT | User documentation (Web, Docs), Presentation materials & guides |
| **Jinho Lee** | Design Lead, Dev | UI/UX Design, Frontend Dev|

---

## 📝 License
Distributed under the **Apache License 2.0**.  
See `LICENSE` for details.
💡 *Developed for learning, built for clarity.*

(https://foundbyme.readthedocs.io)
[![Website](https://img.shields.io/badge/website-GitHub%20Pages-222222?logo=github&logoColor=white)](https://kimhabin2.github.io/foundbyme-custom/)

```
```
