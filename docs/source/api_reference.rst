API Reference
=============

Base URL: `http://localhost:8000`

Endpoints
---------

POST /search
~~~~~~~~~~~~
Performs semantic search with re-ranking.

**Request Body (JSON):**

.. code-block:: json

   {
     "query": "When is the assignment due?",
     "top_k": 5
   }

**Response (JSON):**

.. code-block:: json

   {
     "results": [
       {
         "filename": "syllabus.pdf",
         "page": 3,
         "score": 0.89,
         "content": "Final assignment deadline: Dec 15th."
       }
     ],
     "pca_coords": [0.12, -0.5, 0.8]
   }


POST /upload
~~~~~~~~~~~~
Uploads a file for indexing. Supports PDF, DOCX, PPTX, Images.

**Request (Multipart/Form-Data):**

* `file`: (Binary file data)

**Response:**

.. code-block:: json

   {
     "status": "success",
     "filename": "lecture_01.pdf",
     "chunks_processed": 15
   }


GET /galaxy
~~~~~~~~~~~
Retrieves 3D coordinates for visualization.

**Response:**

.. code-block:: json

   [
     {"id": "doc_1", "x": 1.2, "y": 0.5, "z": -0.2, "type": "pdf"},
     {"id": "doc_2", "x": -0.5, "y": 2.1, "z": 0.1, "type": "image"}
   ]


Additional API Endpoints
------------------------

GET /search
~~~~~~~~~~~
Semantic search using query parameters.

**Query Parameters:**

* `q` (string, required): Query text
* `k` (int, optional, default=3): Number of results

**Response Fields:**

* `results`: array of:
  * `id`: string  
  * `score`: float (distance score)
  * `text`: string (document content)
  * `meta`: object (metadata including extension, path)


GET /documents
~~~~~~~~~~~~~~
Fetches a list of indexed documents with previews.

**Query Parameters:**

* `limit` (int, optional, default=100)

**Response Fields:**

* `documents`: array of:
  * `id`: string
  * `preview`: first 300 characters
  * `meta`: object


GET /stats
~~~~~~~~~~
Provides statistics of stored documents.

**Response Fields:**

* `total_documents`: integer  
* `by_extension`: dictionary `{ ext: count }`
* `total_pdf_pages`: integer (currently same as pdf count)


GET /vectors
~~~~~~~~~~~~
Returns raw embedding vectors (for debugging).

**Query Parameters:**

* `limit` (int, optional, default=100)

**Response Fields:**

* `vectors`: array of float arrays


GET /reload
~~~~~~~~~~~
Reindexes all files into the vector database.

**Response Fields:**

* `status`: string (`"success"`)
* `indexed`: integer (number of documents indexed)
