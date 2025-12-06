import React from "react";
import Sidebar from "../components/layout/Sidebar";
import { useChatStore } from "../stores/useChatStore";
import {
  User,
  Bot,
  FileText,
  Box,
} from "lucide-react";
import { Link, Navigate } from "react-router-dom";

const Result = () => {
  const { currentResult } = useChatStore();

  // 결과가 없으면 홈으로 리다이렉트
  if (!currentResult) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col p-8 overflow-y-auto bg-space-gradient z-10">
        <div className="max-w-3xl mx-auto w-full space-y-8">
          {/* 사용자 질문 */}
          <div className="flex justify-end">
            <div className="bg-blue-600/80 backdrop-blur-sm p-4 rounded-2xl rounded-tr-none max-w-xl flex gap-3 items-start">
              <p className="text-lg leading-relaxed">
                {currentResult.query}
              </p>
              <User
                className="shrink-0 mt-1 bg-blue-800 p-1 rounded-lg"
                size={28}
              />
            </div>
          </div>

          {/* AI 답변 */}
          <div className="flex justify-start relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl blur opacity-20"></div>
            <div className="relative bg-space-light/80 backdrop-blur-md border border-slate-700/50 p-6 rounded-2xl rounded-tl-none max-w-2xl flex gap-4 items-start shadow-xl">
              <Bot
                className="shrink-0 mt-1 text-space-accent bg-space-dark p-1 rounded-lg border border-space-accent"
                size={32}
              />
              <div className="space-y-4 flex-1">
                <p className="text-lg leading-relaxed text-slate-200">
                  {currentResult.answer}
                </p>

                {/* 하단 액션 버튼들 */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                  {/* 참조 소스 */}
                  <div className="flex gap-2 flex-wrap">
                    {currentResult.sources.map(
                      (source, idx) => (
                        <a
                          key={idx}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs bg-slate-800/50 text-slate-400 px-2 py-1 rounded-md border border-slate-700 hover:bg-slate-700 hover:text-white transition-colors"
                        >
                          <FileText size={12} />{" "}
                          {source.name}
                        </a>
                      )
                    )}
                  </div>

                  {/* 3D 시각화 이동 버튼 */}
                  <Link
                    to="/visualized"
                    className="flex items-center gap-2 bg-space-accent hover:bg-purple-600 text-sm text-white px-4 py-2 rounded-full transition-all hover:shadow-[0_0_15px_-3px_rgba(139,92,246,0.6)]"
                  >
                    <Box size={16} />
                    <span className="font-bold">
                      은하계에서 보기 (3D
                      Visualize)
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Result;
