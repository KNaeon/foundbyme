Getting Started
===============

This guide will help you set up **FoundByMe** on your local machine using Docker.

Prerequisites
-------------
* **Git** installed
* **Docker** & **Docker Compose** installed
* OS: Windows, macOS, or Linux

One-Line Installation
---------------------
You can deploy the entire stack (Frontend, Backend, DB, Vector Store) with a single command.

.. code-block:: bash

   # 1. Clone the repository
   git clone https://github.com/KNaeon/foundbyme.git
   cd foundbyme

   # 2. Run with Docker Compose
   docker-compose up -d

Accessing the Application
-------------------------
Once the containers are running, open your browser and visit:

* **Web UI**: http://localhost:3000
* **API Docs**: http://localhost:8000/docs