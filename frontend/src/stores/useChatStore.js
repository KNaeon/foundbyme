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

// const dummyResult = {
//   query: "React Hook의 장점은 무엇인가요?",
//   answer:
//     "React Hook은 클래스 컴포넌트 없이 상태 관리와 생명주기 기능을 사용할 수 있게 해줍니다. 이를 통해 코드가 간결해지고 재사용성이 높아지며, 컴포넌트 로직을 분리하여 테스트하기 쉬워집니다. 주요 장점으로는 가독성 향상, 코드 양 감소, 복잡한 컴포넌트 로직의 단순화 등이 있습니다.",
//   sources: [
//     "React_Docs_v18.pdf",
//     "Modern_Web_Dev_Lecture_03.pptx",
//   ],
// };

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

  // 파일을 쏘아올리는 동작 (API 연결)
  launchFiles: async (files) => {
    set({ isLoading: true });

    const formData = new FormData();
    // FileList를 배열로 변환하여 추가
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch(
        "http://localhost:8040/api/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        alert(
          `${files.length}개의 별(파일)을 성공적으로 쏘아 올렸습니다!`
        );
      } else {
        alert("파일 업로드 실패");
      }
    } catch (error) {
      console.error(error);
      alert("서버 연결 오류");
    } finally {
      set({ isLoading: false });
    }
  },

  // 질문하기 동작 (API 연결)
  askQuestion: async (query) => {
    set({ isLoading: true });

    try {
      const response = await fetch(
        "http://localhost:8040/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        }
      );

      const data = await response.json();

      set({
        isLoading: false,
        currentResult: {
          query: query,
          answer: data.answer, // 서버에서 온 답변
          sources: data.sources || [], // 서버에서 온 출처
        },
      });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
      alert("답변을 받아오는데 실패했습니다.");
    }
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
