How to Use
==========

This guide explains how to index documents and perform semantic search.

Quick Example
-------------

.. code-block:: python

   from foundbyme import FoundByMe
   fbm = FoundByMe()
   fbm.index_folder("data/")
   fbm.query("find text related to...")
