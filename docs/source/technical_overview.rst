Technical Overview
==================

System Architecture
-------------------
FoundByMe utilizes a **Hybrid Storage Strategy** combining a Vector Database and a Relational Database to ensure both search speed and data integrity.

.. image:: ../../assets/images/architecture.png
   :alt: System Architecture Diagram
   :align: center

Tech Stack
----------
* **FastAPI**: High-performance API Server.
* **ChromaDB**: Vector Store for semantic search embedding.
* **PostgreSQL**: RDBMS for metadata management and logs.
* **SentenceTransformers**: Embedding models for converting text to vectors.
* **CrossEncoder**: Re-ranking model for high-precision search results.
* **Docker Compose**: Container orchestration.

Core Features Deep Dive
-----------------------

1. Universal Indexing & OCR
~~~~~~~~~~~~~~~~~~~~~~~~~~~
* Supports `.txt`, `.pdf`, `.docx`, `.pptx`, `.md`.
* Applies **OCR (pytesseract)** for text extraction from images.
* Long documents are processed via **Chunking Strategy**.

2. Semantic Search
~~~~~~~~~~~~~~~~~~
* Uses **ChromaDB** + **SentenceTransformers**.
* Finds documents based on meaning context, overcoming the limitations of keyword matching.

3. High-Precision Re-Ranking
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* Post-processes the initial search results using a **CrossEncoder (BAAI/bge-reranker-v2-m3)**.
* Re-scores and re-orders documents to achieve commercial-grade accuracy.

4. 3D Galaxy Visualization
~~~~~~~~~~~~~~~~~~~~~~~~~~
* **PCA (Principal Component Analysis)** reduces high-dimensional vectors to 3D.
* Visualizes the relationship between the **User Query (Yellow)** and **Documents (Color-coded)** in a spatial graph.