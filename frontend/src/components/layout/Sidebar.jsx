import React, {
  useState,
  useEffect,
  useRef,
} from "react";
import { useChatStore } from "../../stores/useChatStore";
import {
  MessageSquare,
  Rocket,
  PlusCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
// import { deleteChat } from "../../stores/useChatStore";

const Sidebar = () => {
  const {
    chats,
    currentChatId,
    selectChat,
    createNewChat,
    history,
  } = useChatStore();

  const handleDelete = (e, chatId) => {
    e.stopPropagation(); // 부모 div의 클릭 이벤트(채팅 선택)가 발생하지 않도록 막음
    if (
      window.confirm(
        "이 탐사 기록을 삭제하시겠습니까?"
      )
    ) {
      deleteChat(chatId);
    }
  };

  return (
    <aside className="w-64 h-screen bg-space-dark/80 backdrop-blur-md border-r border-space-light flex flex-col p-4">
      {/* 로켓 로고 */}
      <Link
        to="/"
        className="flex items-center gap-2 mb-8 text-xl font-bold text-space-accent hover:text-purple-400 transition-colors"
      >
        <Rocket size={24} />
        <span>FoundByMe</span>
      </Link>

      {/* 새로운 탐사 버튼 */}
      <Link
        to="/"
        className="flex items-center gap-2 p-3 mb-6 bg-space-light/50 rounded-lg hover:bg-space-accent/20 transition-all cursor-pointer border border-transparent hover:border-space-accent/50"
      >
        <PlusCircle size={20} />

        <button onClick={createNewChat}>
          <span>새로운 탐사 시작</span>
        </button>
      </Link>
      {/*채팅 목록영역 */}
      <div className="flex-1 overflow-y-auto pr-2">
        <h3 className="text-sm text-slate-500 mb-2 px-2">
          탐사 기록 (History)
        </h3>

        {chats.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            기록된 탐사가 없습니다.
          </p>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => selectChat(chat.id)}
              // group 클래스를 추가하여 호버 시 자식 요소(삭제 버튼)를 제어
              className={`group flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors text-sm ${
                currentChatId === chat.id
                  ? "bg-gray-700 text-white"
                  : "hover:bg-gray-800 text-gray-300"
              }`}
            >
              <span className="truncate flex-1">
                {chat.title}
              </span>

              {/* 삭제 버튼: 평소엔 숨겨져 있다가(opacity-0), 마우스를 올리면 나타남(group-hover:opacity-100) */}
              <button
                onClick={(e) =>
                  handleDelete(e, chat.id)
                }
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all"
                title="삭제"
              >
                ❌
              </button>
            </div>
          ))
        )}

        <ul>
          {history.map((item) => (
            <li key={item.id} className="mb-1">
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-space-light/50 cursor-pointer transition-colors truncate">
                <MessageSquare
                  size={16}
                  className="text-slate-400 shrink-0"
                />
                <span className="text-sm truncate">
                  {item.query}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="text-xs text-slate-500 mt-4 text-center">
        User: Astronaut_01
      </div>
    </aside>
  );
};

export default Sidebar;
