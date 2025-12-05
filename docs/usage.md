---
layout: default
title: 사용법
nav_order: 2
parent: 문서
---

# 사용법 (Usage)

FoundByMe의 상세 기능들과 실제 활용 방법을 설명합니다.

---

## 1️⃣ 기본 사용

### 로컬 폴더 전체 검색

```bash
python search.py "자료 키워드"
```
### 특정 파일 형식만 검색
```bash
python search.py "딥러닝" --ext pdf,txt
```
### 특정 폴더 제외
```bash
python search.py "과제" --exclude "backup"
```
---

## 2️⃣ RAG API 사용하기
<div class="link-box"> <a href="http://localhost:8000/search" target="_blank">로컬 RAG API 테스트</a> </div>
FoundByMe RAG API를 이용하면 자연어 기반 검색 결과를 쉽게 얻을 수 있습니다.

### Python 예시

```python
import requests

url = "http://localhost:8000/search"
data = {"query": "딥러닝 표준화"}
response = requests.post(url, json=data)
print(response.json())
```

### API Response 예시
```json
{
  "results": [
    {"file": "C:/my-documents/deep_learning.pdf", "summary": "딥러닝 표준화 관련 내용 요약..."}
  ]
}
```
---

## 3️⃣ 검색 기능과 결과 활용
검색 기능
- 키워드 검색
- 자연어 기반 질문
- PDF / 이미지 / 코드 파일 검색

검색 결과 활용
- 결과 미리보기
- 바로 열기
- 요약 내용 확인

---

## 4️⃣ 고급 기능

벡터 시각화 Embedding

멀티파일 동시 검색

문서 요약 기능
