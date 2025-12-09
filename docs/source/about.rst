About the Project
=================

About FoundByMe
===============

Why FoundByMe?
--------------
기존의 문서 탐색 방식은 다음과 같은 문제점들로 인해 학습 및 연구 효율을 저해했습니다. FoundByMe는 이러한 문제들을 해결하고자 시작되었습니다.

* **비효율적인 시간 소모:** 여러 개의 PDF, PPT 파일을 매번 열어보며 찾는 데 많은 시간 소요
* **반복 탐색:** 자료가 흩어져 있어 같은 용어의 위치를 기억하지 못해 반복적으로 탐색
* **맥락 이해 불가:** 단순 키워드 검색은 의미(맥락)를 이해하지 못해 정확한 검색 불가

Project Goals
-------------
FoundByMe는 사용자의 검색 의도를 이해하고, PDF, PPTX, DOCX, TXT 등 다양한 포맷의 문서에서 **'의미적으로 가장 관련 있는 자료'**를 빠르게 찾아주는 오픈소스 도구를 만드는 것을 목표로 합니다.

# Architecture & Open Source Stack

FoundByMe leverages powerful open-source technologies to provide a robust local semantic search experience.

## 🏗️ Core Technologies

### Vector Search Engine
* **FAISS (Facebook AI Similarity Search):** Used for lightweight, in-memory vector search on local machines. We optimized the indexing process to be accessible for personal desktop environments.
* **Milvus:** Adopted as a scalable vector database for handling larger datasets. Integrated via Docker for easy deployment and persistence.

### Embedding & NLP
* **Sentence-Transformers (SBERT):** Utilized for generating high-quality text embeddings that capture semantic meaning, enabling context-aware search results.
* **txtai:** Serves as the backbone framework for the RAG (Retrieval-Augmented Generation) pipeline, connecting embeddings with the search logic.

### Infrastructure
* **Docker & Docker Compose:** Orchestrates the complex stack (Node.js Frontend + Python Backend + Vector DBs) into a single, deployable unit, significantly lowering the barrier to entry for users.

---

For more details on our design philosophy and contribution strategy, please visit our [Project Website](https://kimhabin2.github.io/foundbyme-custom/about/).

Team Members
------------
FoundByMe를 만드는 사람들입니다.

* **강나언 (Project Leader):** 진행 관리, 개발, 테스팅, 디버깅 (Coding, testing, debugging)
* **김하빈 (Documentation Lead):** 문서화, 사용자 가이드 페이지 제작 (README,Jekyll)
* **이진호 (Developer & Design Lead):** 개발, 디자인/브랜딩 (Design/Branding)