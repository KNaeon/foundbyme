API Reference
=============

Search Endpoint
---------------

**POST /query**

Request:

.. code-block:: json

   { "text": "search text", "top_k": 5 }

Response:

.. code-block:: json

   { "results": [...] }