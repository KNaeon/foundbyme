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