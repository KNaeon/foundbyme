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
