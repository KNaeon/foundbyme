import { create } from "zustand";

// 더미 데이터: 과거 기록 및 현재 질문 결과
const dummyHistory = [
  {
    id: 1,
    query: "운영체제 스케줄링 기법 요약해줘",
    date: "2024-05-20",
  },
  {
    id: 2,
    query: "양자역학 슈뢰딩거 고양이 설명",
    date: "2024-05-19",
  },
];

const dummyResult = {
  query: "React Hook의 장점은 무엇인가요?",
  answer:
    "React Hook은 클래스 컴포넌트 없이 상태 관리와 생명주기 기능을 사용할 수 있게 해줍니다. 이를 통해 코드가 간결해지고 재사용성이 높아지며, 컴포넌트 로직을 분리하여 테스트하기 쉬워집니다. 주요 장점으로는 가독성 향상, 코드 양 감소, 복잡한 컴포넌트 로직의 단순화 등이 있습니다.",
  sources: [
    "React_Docs_v18.pdf",
    "Modern_Web_Dev_Lecture_03.pptx",
  ],
};

export const useChatStore = create((set) => ({
  history: dummyHistory,
  currentResult: null, // 현재 보고 있는 결과
  isLoading: false,
  // 추가!!!!!!
  // 채팅 목록 (각 채팅은 id, title, messages 등을 가짐)
  chats: [],
  // 현재 선택된 채팅 ID
  currentChatId: null,

  // 새로운 채팅 생성 액션
  createNewChat: () => {
    const newChat = {
      id: Date.now(), // 고유 ID 생성 (간단히 타임스탬프 사용)
      title: `새로운 탐사 ${new Date().toLocaleTimeString()}`, // 기본 제목
      messages: [], // 빈 메시지 배열
    };

    set((state) => ({
      chats: [newChat, ...state.chats], // 새 채팅을 목록 맨 앞에 추가
      currentChatId: newChat.id, // 새로 만든 채팅을 현재 채팅으로 선택
    }));
  },

  // 채팅 선택 액션
  selectChat: (chatId) => {
    set({ currentChatId: chatId });
  },

  //추가!!!!여기까지

  // 파일을 쏘아올리는 동작 모사
  launchFiles: (files) => {
    set({ isLoading: true });
    setTimeout(() => {
      alert(
        `${files.length}개의 별(파일)을 성공적으로 쏘아 올렸습니다!`
      );
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
        currentResult: {
          ...dummyResult,
          query: query,
        },
      });
      // 페이지 이동은 컴포넌트에서 처리
    }, 1000);
  },

  // --- 추가된 삭제 로직 ---
  deleteChat: (chatId) => {
    set((state) => {
      // 1. 삭제할 채팅을 제외한 새 목록 생성
      const newChats = state.chats.filter(
        (chat) => chat.id !== chatId
      );

      // 2. 만약 현재 보고 있는 채팅을 삭제했다면?
      let newCurrentId = state.currentChatId;
      if (state.currentChatId === chatId) {
        // 남은 채팅이 있으면 첫 번째 것을 선택, 없으면 null
        newCurrentId =
          newChats.length > 0
            ? newChats[0].id
            : null;
      }

      return {
        chats: newChats,
        currentChatId: newCurrentId,
      };
    });
  },

  // --- 추가된 이름 변경 로직 ---
  updateChatTitle: (chatId, newTitle) => {
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === chatId
          ? { ...chat, title: newTitle }
          : chat
      ),
    }));
  },
}));
