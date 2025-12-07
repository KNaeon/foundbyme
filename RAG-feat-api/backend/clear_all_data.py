import milvus_function as ms

def clear_all():
    print("=== 전체 데이터 삭제 (Milvus + Local Files) ===")
    
    # Milvus 연결
    try:
        ms.connect_milvus()
    except Exception as e:
        print(f"Milvus 연결 실패: {e}")
        return

    # 삭제 함수 실행
    deleted_count = ms.drop_milvus_collection_and_count()
    
    print(f"\n[결과] 총 {deleted_count}개의 벡터 데이터와 로컬 파일들이 삭제되었습니다.")

if __name__ == "__main__":
    # 사용자 확인
    confirm = input("⚠️ 경고: 모든 데이터가 영구적으로 삭제됩니다. 계속하시겠습니까? (y/n): ")
    if confirm.lower() == 'y':
        clear_all()
    else:
        print("작업이 취소되었습니다.")
