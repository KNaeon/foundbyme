import { create } from 'zustand';

// 더미 데이터: 과거 기록 및 현재 질문 결과
const dummyHistory = [
    { id: 1, query: "운영체제 스케줄링 기법 요약해줘", date: "2024-05-20" },
    { id: 2, query: "양자역학 슈뢰딩거 고양이 설명", date: "2024-05-19" },
];

const dummyResult = {
    query: "React Hook의 장점은 무엇인가요?",
    answer: "React Hook은 클래스 컴포넌트 없이 상태 관리와 생명주기 기능을 사용할 수 있게 해줍니다. 이를 통해 코드가 간결해지고 재사용성이 높아지며, 컴포넌트 로직을 분리하여 테스트하기 쉬워집니다. 주요 장점으로는 가독성 향상, 코드 양 감소, 복잡한 컴포넌트 로직의 단순화 등이 있습니다.",
    sources: ["React_Docs_v18.pdf", "Modern_Web_Dev_Lecture_03.pptx"]
};

export const useChatStore = create((set) => ({
    history: dummyHistory,
    currentResult: null, // 현재 보고 있는 결과
    isLoading: false,

    // 파일을 쏘아올리는 동작 모사
    launchFiles: (files) => {
        set({ isLoading: true });
        setTimeout(() => {
             alert(`${files.length}개의 별(파일)을 성공적으로 쏘아 올렸습니다!`);
             set({ isLoading: false });
        }, 1500);
    },

    // 질문하기 동작 모사
    askQuestion: (query) => {
        set({ isLoading: true });
        // 실제로는 백엔드 요청. 여기선 더미 데이터 세팅 후 페이지 이동
        setTimeout(() => {
            set({ 
                isLoading: false, 
                currentResult: { ...dummyResult, query: query } 
            });
            // 페이지 이동은 컴포넌트에서 처리
        }, 1000);
    }
}));