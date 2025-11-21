import React from "react";
import { useChatStore } from "../../stores/useChatStore";
import {
  MessageSquare,
  Rocket,
  PlusCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const { history } = useChatStore();

  return (
    <aside className="w-64 h-screen bg-space-dark/80 backdrop-blur-md border-r border-space-light flex flex-col p-4">
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
        <span>새로운 탐사 시작</span>
      </Link>

      <div className="flex-1 overflow-y-auto pr-2">
        <h3 className="text-sm text-slate-500 mb-2 px-2">
          탐사 기록 (History)
        </h3>
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
