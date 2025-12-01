import React, { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import {
  Search,
  UploadCloud,
  Sparkles,
} from "lucide-react";
import { useChatStore } from "../stores/useChatStore";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [query, setQuery] = useState("");
  const { launchFiles, askQuestion, isLoading } =
    useChatStore();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      launchFiles(e.target.files);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    askQuestion(query);
    navigate("/result"); // 결과 페이지로 이동
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
        {/* 배경 효과용 (실제로는 파티클 라이브러리 사용 추천) */}
        <div className="absolute inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 animate-pulse"></div>

        <div className="text-center max-w-2xl w-full space-y-8 animate-fade-in-up">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500">
            지식의 우주를 탐험하세요
          </h1>
          <p className="text-xl text-slate-400">
            당신의 자료들을 별처럼 쏘아 올리고,
            질문을 통해 해답을 찾아보세요.
          </p>

          {/* 파일 업로드 (Launch) 버튼 */}
          <div className="mt-12">
            <input
              type="file"
              id="fileUpload"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            <label
              htmlFor="fileUpload"
              className={`
                            flex items-center justify-center gap-3 mx-auto w-64 py-4 px-6 
                            bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full 
                            text-lg font-bold cursor-pointer 
                            hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.6)] hover:-translate-y-1 transition-all
                            ${
                              isLoading
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }
                        `}
            >
              <UploadCloud size={24} />
              {isLoading
                ? "발사 준비 중..."
                : "지식 쏘아 올리기 (Launch)"}
            </label>
            <p className="text-sm text-slate-500 mt-3">
              PDF, PPTX, DOCX 등 다양한 강의자료
              지원
            </p>
          </div>

          {/* 검색창 */}
          <form
            onSubmit={handleSearch}
            className="relative w-full max-w-xl mx-auto group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-space-light/80 backdrop-blur-xl border border-slate-700 rounded-2xl p-2 focus-within:border-space-accent transition-colors">
              <Search
                className="ml-4 text-slate-400"
                size={24}
              />
              <input
                type="text"
                value={query}
                onChange={(e) =>
                  setQuery(e.target.value)
                }
                placeholder="무엇을 탐사하시겠습니까?"
                className="w-full bg-transparent p-4 text-lg focus:outline-none text-space-text placeholder:text-slate-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={
                  isLoading || !query.trim()
                }
                className="bg-space-accent hover:bg-purple-700 text-white p-3 rounded-xl transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles size={24} />
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Home;
