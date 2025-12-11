FAQ
===

Frequently Asked Questions about FoundByMe.

General
-------

**Q: Is my data sent to the cloud?**
A: No. FoundByMe runs 100% locally. Your files and embeddings never leave your machine.

**Q: Is it free to use?**
A: Yes, it is an open-source project released under the Apache 2.0 License.

Technical
---------

**Q: Does it support GPU acceleration?**
A: Yes. If you have an NVIDIA GPU and CUDA installed, set `DEVICE=cuda` in your configuration to speed up embedding and re-ranking.

**Q: What file formats are supported?**
A: Currently, we support `.pdf`, `.docx`, `.pptx`, `.txt`, `.md`, and image formats (`.png`, `.jpg`) via OCR.

**Q: How accurate is the search?**
A: We use a Hybrid approach (Vector Search + Cross-Encoder Re-ranking), which provides significantly higher accuracy than simple keyword matching.