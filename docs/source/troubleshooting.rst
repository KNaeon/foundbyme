Maintenance and Troubleshooting
===============================

Common Issues
-------------

Docker Containers Fail to Start
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
If `docker-compose up` fails, check if the ports are already in use.

**Error:** `Bind for 0.0.0.0:8000 failed: port is already allocated`

**Solution:**
1. Check running processes: `lsof -i :8000`
2. Kill the process or change `API_PORT` in `docker-compose.yml`.

OCR Not Working on Images
~~~~~~~~~~~~~~~~~~~~~~~~~
If image text is not indexed, ensure `tesseract-ocr` is installed in the container.

**Check:**
Run `docker exec -it foundbyme-backend tesseract --version` inside the container.

Database Connection Refused
~~~~~~~~~~~~~~~~~~~~~~~~~~~
Ensure PostgreSQL container is healthy before the backend starts.
Try restarting the services:

.. code-block:: bash

   docker-compose down
   docker-compose up -d

Maintenance
-----------

Resetting the Index
~~~~~~~~~~~~~~~~~~~
To clear all data and re-index from scratch:

1. Stop containers: `docker-compose down`
2. Remove volume data: `docker volume rm foundbyme_postgres_data`
3. Restart: `docker-compose up -d`

Updating the System
~~~~~~~~~~~~~~~~~~~
To update to the latest version:

.. code-block:: bash

   git pull origin main
   docker-compose build --no-cache
   docker-compose up -d