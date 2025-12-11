Configuration Guide
===================

FoundByMe uses `docker-compose.yml` and environment variables for configuration.
You can customize these settings in the `.env` file or directly in `docker-compose.yml`.

Database Settings (PostgreSQL)
------------------------------
Configuration for the metadata storage.

* **POSTGRES_USER**: Database username (default: `user`)
* **POSTGRES_PASSWORD**: Database password (default: `password`)
* **POSTGRES_DB**: Database name (default: `foundbyme_db`)
* **DB_PORT**: Internal port for PostgreSQL (default: `5432`)

Vector Store Settings (ChromaDB)
--------------------------------
* **CHROMA_DB_IMPL**: Implementation backend (default: `duckdb+parquet`)
* **PERSIST_DIRECTORY**: Path to store vector data locally (default: `/data/chroma`)

Model Configuration
-------------------
Settings for AI models used in embedding and re-ranking.

* **EMBEDDING_MODEL**: SentenceTransformers model name (default: `sentence-transformers/all-MiniLM-L6-v2`)
* **RERANKER_MODEL**: CrossEncoder model name (default: `BAAI/bge-reranker-v2-m3`)
* **DEVICE**: Computation device (`cpu` or `cuda`). Set to `cuda` if GPU is available.

Server Options
--------------
* **API_PORT**: Port for FastAPI backend (default: `8000`)
* **WEB_PORT**: Port for Frontend UI (default: `3000`)
* **LOG_LEVEL**: Logging verbosity (`INFO`, `DEBUG`, `WARNING`)