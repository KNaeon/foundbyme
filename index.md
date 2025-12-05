---
layout: default
title: Home
nav_order: 1
---

# FoundByMe
로컬에 흩어져 있는 강의 자료, PDF, 코드 파일, 과제 문서 등을 빠르게 검색하고 학습에 활용할 수 있도록 돕는 프로젝트입니다.  

개인 작업 환경에서도, 스터디나 팀 프로젝트에서도 필요한 자료를 즉시 찾을 수 있도록 설계되었습니다.

## 제작 배경
- 시험 기간 시간 절약 : 여러 형태의 문서 파일을 매번 열어서 찾는데 시간이 많이 소요
- 반복 탐색 : 자료가 여러 파일로 흩어져 있어 같은 용어가 어디에 있었는지 기억나지 않아 반복 탐색하게 됨.
- 공부 집중력 감소 : 파일을 하나씩 열어보면서 흐름이 끊기고, 정신이 산만해져 집중력이 떨어짐.
- 맥락 이해 불가 : 키워드 검색은 의미(맥락)을 이해하지 못해 정확한 내용을 못 찾는 문제가 발생

## 🚀 목적
- 검색 시간을 줄이고, 학습 효율을 높이기 위한 개인용 로컬 지식 검색 도구  
- 자료 이름을 정확히 기억하지 않아도, 자연어 기반으로 필요한 자료를 찾아주는 시스템  
- 텍스트뿐 아니라 PDF, 이미지, 코드 등 다양한 파일까지 찾을 수 있는 통합 검색

---

## 🔍 주요 기능
### 1) 로컬 파일 인덱싱  
폴더 전체를 스캔해 문서·이미지·코드 등의 메타데이터를 자동으로 정리합니다.

### 2) RAG 기반 검색  
- 프로젝트에서 구현 중인 API와 연동하여 자연어로 질문하면  
- 로컬 파일 중 가장 관련 있는 내용을 찾고 요약하거나 문맥 기반으로 정리해 제공합니다.

### 3) 벡터 시각화(Embedding Visualization)

## 🧩 프로젝트 구성 요소
- 로컬 검색 시스템 / 사용 설명서 / 예제 페이지 / API 문서 제공

- 백엔드용 RAG API 구현 
  → sentence-transformers 기반 embedding  
  → 문서 요약/검색 엔드포인트 제공

---

## 📁 빠른 시작

```bash
pip install -r requirements.txt
python indexer.py --path "C:/my-documents"
python search.py "딥러닝 표준화"


- 📘 Documentation(ReadTheDocs): https://foundbyme.readthedocs.io/en/latest/about.html
- 💻 GitHub Repository: <https://github.com/KNaeon/foundbyme>