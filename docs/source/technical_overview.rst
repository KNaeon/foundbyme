Technical Overview
==================

System Architecture
-------------------
FoundByMe utilizes a **Hybrid Storage Strategy** combining a Vector Database and a Relational Database to ensure both search speed and data integrity.

.. note:: **💡 Technical Decision: Why Hybrid Storage?**

   We intentionally combined **ChromaDB** and **PostgreSQL** to balance performance and reliability.

   * **ChromaDB (Vector Store)**: Specialized for handling unstructured data and ensuring **High-Speed Similarity Search**.
   * **PostgreSQL (RDBMS)**: Ensures **Data Integrity (ACID)** for metadata and provides powerful filtering capabilities for file management.

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
* **Formats**: Supports `.txt`, `.pdf`, `.docx`, `.pptx`, `.md`, and **Images**.
* **OCR Pipeline**: Automatically applies **OCR (pytesseract)** for text extraction from images.
* **Chunking**: Long documents are processed via **Smart Chunking Strategy** to optimize vector embedding.

2. Semantic Search
~~~~~~~~~~~~~~~~~~
* **Model**: **`Multilingual-MiniLM-L12-v2`** (Supports 50+ languages including Korean).
* **Mechanism**: Uses **ChromaDB** + **SentenceTransformers**.
* **Benefit**: Finds documents based on meaning context, overcoming the limitations of simple keyword matching.

3. High-Precision Re-Ranking
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* **Model**: **`BAAI/bge-reranker-v2-m3`**.
* **Process**: Post-processes the initial search results using a CrossEncoder.
* **Benefit**: Re-scores and re-orders documents to achieve **commercial-grade accuracy**, filtering out irrelevant results from the vector search.

4. 3D Galaxy Visualization
~~~~~~~~~~~~~~~~~~~~~~~~~~
* **Technique**: **PCA (Principal Component Analysis)** reduces high-dimensional vectors to 3D.
* **Visual**: Displays the relationship between the **User Query (Yellow Dot)** and **Documents (Color-coded Dots)** in a spatial graph to visualize knowledge clusters.