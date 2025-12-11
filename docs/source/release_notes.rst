Release Notes
=============

v1.0.0 (Initial Release)
------------------------
*Release Date: 2025-12-12*

**New Features**
* **Core Search Engine**: Integrated `txtai` (ChromaDB) and `PostgreSQL`.
* **Universal Indexing**: Added support for PDF, PPTX, DOCX, and OCR for images.
* **Re-Ranking**: Implemented `BAAI/bge-reranker-v2-m3` for high precision.
* **3D Galaxy View**: Added PCA-based visualization for document embeddings.
* **Docker Support**: Full `docker-compose` setup for one-line installation.

**Bug Fixes**
* Fixed encoding issues with Korean filenames.
* Resolved memory leak in large PDF chunking process.