FROM python:3.10-slim

# Install system dependencies
# tesseract-ocr: OCR engine
# tesseract-ocr-kor: Korean language pack for Tesseract
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-kor \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Expose port
EXPOSE 8000

# Run command
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
