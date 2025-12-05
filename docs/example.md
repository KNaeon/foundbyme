---
layout: default
title: 예제
nav_order: 3
parent: 문서
---

# 예제 (Examples)

실제로 FoundByMe를 사용하는 구체적인 예시와 워크플로우를 안내합니다.

---

## 예제 1. 단일 파일 검색 예제

```bash
python search.py "머신러닝 기초" --ext pdf
```
---

## 예제 2. 폴더 내 여러 파일 검색

```bash
python search.py "시험 자료" --path "C:/my-documents/CS101"
```
---

## 예제 3. RAG API 예제
<div class="link-box"> <a href="http://localhost:8000/search" target="_blank">RAG API 호출 테스트</a> </div>

```bash
import requests

data = {"query": "딥러닝 프로젝트 예제"}
response = requests.post("http://localhost:8000/search", json=data)
print(response.json())
```
## 예제 3. 백터 시각화 예제
- visualize_embeddings.py 실행 예제
- 문서 간 유사도 맵 확인 가능
