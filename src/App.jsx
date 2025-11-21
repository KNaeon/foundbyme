import React, {
  useState,
  useEffect,
  useRef,
} from "react";
import {
  Search,
  Upload,
  FileText,
  History,
  MessageSquare,
  X,
  Maximize2,
  Sparkles,
  ChevronRight,
  Globe,
} from "lucide-react";
import * as THREE from "three"; // 정식 설치된 패키지 import
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import "./App.css";

const App = () => {
  const [view, setView] = useState("home"); // home, results
  const [show3D, setShow3D] = useState(false);
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState([
    {
      id: 1,
      text: "양자 역학 강의 3강 요약해줘",
      date: "오늘",
    },
    {
      id: 2,
      text: "서양미술사 르네상스 특징",
      date: "어제",
    },
    {
      id: 3,
      text: "경영학원론 마케팅 믹스",
      date: "지난주",
    },
  ]);
  const [isSidebarOpen, setSidebarOpen] =
    useState(true);
  const [uploadedFiles, setUploadedFiles] =
    useState([]);
  const [processing, setProcessing] =
    useState(false);

  // 목업 데이터: 벡터화된 강의 자료들 (3D 좌표 포함)
  const MOCK_VECTORS = [
    {
      id: 1,
      title: "물리학개론_Ch3_운동량.pdf",
      type: "pdf",
      score: 92,
      x: 10,
      y: 5,
      z: -5,
      summary:
        "운동량 보존 법칙과 충돌에 관한 핵심 강의 노트입니다.",
    },
    {
      id: 2,
      title: "근대사_연표정리.xlsx",
      type: "xlsx",
      score: 45,
      x: -20,
      y: 15,
      z: 10,
      summary:
        "19세기 주요 사건을 연도별로 정리한 엑셀 시트입니다.",
    },
    {
      id: 3,
      title: "알고리즘_정렬.pptx",
      type: "pptx",
      score: 12,
      x: -30,
      y: -10,
      z: 5,
      summary:
        "Quick Sort와 Merge Sort의 시각적 비교 자료입니다.",
    },
    {
      id: 4,
      title: "양자역학_슈뢰딩거.pdf",
      type: "pdf",
      score: 88,
      x: 8,
      y: 8,
      z: -2,
      summary:
        "파동 함수와 확률 밀도에 대한 심화 설명입니다.",
    },
    {
      id: 5,
      title: "인공지능_기초.docx",
      type: "docx",
      score: 65,
      x: 25,
      y: -5,
      z: 15,
      summary:
        "머신러닝의 기본 개념과 역사에 대한 에세이입니다.",
    },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setView("results");
      if (
        !history.find((h) => h.text === query)
      ) {
        setHistory([
          {
            id: Date.now(),
            text: query,
            date: "방금",
          },
          ...history,
        ]);
      }
    }, 1500);
  };

  const handleFileUpload = () => {
    const newFile = {
      name: `Lecture_Material_${
        uploadedFiles.length + 1
      }.pdf`,
    };
    setUploadedFiles([...uploadedFiles, newFile]);
    alert(
      `'${newFile.name}'이(가) 우주로 발사되었습니다! (임베딩 완료)`
    );
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 text-white overflow-hidden font-sans selection:bg-purple-500 selection:text-white relative">
      {/* 배경 별 효과 */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-pulse"></div>
        <div className="absolute top-[20%] left-[20%] w-96 h-96 bg-purple-900 rounded-full blur-[128px] opacity-20"></div>
        <div className="absolute bottom-[20%] right-[20%] w-96 h-96 bg-blue-900 rounded-full blur-[128px] opacity-20"></div>
      </div>

      {/* 사이드바 */}
      <aside
        className={`relative z-20 transition-all duration-300 ease-in-out border-r border-white/10 bg-slate-900/50 backdrop-blur-xl flex flex-col
        ${
          isSidebarOpen
            ? "w-72 translate-x-0"
            : "w-0 -translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent tracking-wider flex items-center gap-2">
            <Globe className="w-5 h-5 text-purple-400" />
            foundbyme
          </h1>
        </div>

        <div className="px-4 mb-6">
          <button
            onClick={() => {
              setView("home");
              setQuery("");
              setShow3D(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:shadow-lg hover:shadow-purple-500/20 transition-all group"
          >
            <Sparkles className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
            <span className="font-medium">
              새로운 질문 탐색
            </span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
          <div className="text-xs font-semibold text-slate-500 mb-3 px-2 uppercase tracking-wider">
            Recent Journeys
          </div>
          <div className="space-y-1">
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setQuery(item.text);
                  setView("results");
                }}
                className="w-full text-left px-3 py-2.5 rounded-lg text-slate-300 hover:bg-white/5 hover:text-white transition-colors text-sm truncate flex items-center gap-3 group"
              >
                <MessageSquare className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
                <span className="truncate">
                  {item.text}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-white/10 text-xs text-slate-500 flex items-center justify-center gap-2">
          <span>
            Total Stars:{" "}
            {120 + uploadedFiles.length} vectors
          </span>
        </div>
      </aside>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 relative z-10 flex flex-col h-full transition-all duration-300">
        <header className="h-16 flex items-center px-6 border-b border-white/5 justify-between">
          <button
            onClick={() =>
              setSidebarOpen(!isSidebarOpen)
            }
            className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <History className="w-5 h-5" />
            )}
          </button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              System Online
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-hidden relative">
          {view === "home" && (
            <div className="h-full flex flex-col items-center justify-center p-8 max-w-3xl mx-auto animate-fadeIn">
              <div className="text-center mb-12 space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                  지식의 우주를 <br />
                  <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    탐험하세요
                  </span>
                </h2>
                <p className="text-slate-400 text-lg max-w-lg mx-auto">
                  강의 자료를 별처럼 쏘아
                  올리세요. 우리는 벡터 공간에서
                  당신이 찾는 답을 연결해
                  드립니다.
                </p>
              </div>

              <div className="w-full relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <form
                  onSubmit={handleSearch}
                  className="relative flex bg-slate-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
                >
                  <input
                    type="text"
                    value={query}
                    onChange={(e) =>
                      setQuery(e.target.value)
                    }
                    placeholder="무엇을 찾고 계신가요? (예: 양자역학의 기본 원리)"
                    className="flex-1 bg-transparent px-6 py-5 text-lg text-white placeholder-slate-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-8 hover:bg-white/5 transition-colors border-l border-white/10 flex items-center justify-center text-purple-400"
                  >
                    {processing ? (
                      <span className="animate-spin">
                        ⏳
                      </span>
                    ) : (
                      <Search className="w-6 h-6" />
                    )}
                  </button>
                </form>
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={handleFileUpload}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/50 transition-all text-slate-300 hover:text-white"
                >
                  <Upload className="w-4 h-4" />
                  <span>
                    자료 업로드 (.pdf, .pptx)
                  </span>
                </button>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none"></div>
            </div>
          )}

          {view === "results" && (
            <div className="h-full flex flex-col md:flex-row relative">
              <div
                className={`flex-1 overflow-y-auto p-6 md:p-10 transition-all duration-500 ${
                  show3D
                    ? "md:w-1/3 w-full absolute z-30 bg-slate-950/90 backdrop-blur-md h-full border-r border-white/10"
                    : "w-full"
                }`}
              >
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-400 mb-1">
                      Searching for
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      "{query}"
                    </h2>
                  </div>
                  {!show3D && (
                    <button
                      onClick={() =>
                        setShow3D(true)
                      }
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 text-purple-300 rounded-lg hover:bg-purple-600 hover:text-white transition-all border border-purple-500/30"
                    >
                      <Maximize2 className="w-4 h-4" />
                      <span>3D 시각화 보기</span>
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-3 text-purple-400 font-medium">
                      <Sparkles className="w-4 h-4" />
                      <span>
                        AI Generated Insight
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      질문하신 내용과 가장 유사한
                      벡터값을 가진 3개의 문서를
                      분석했습니다.
                      <strong>
                        물리학개론 3장
                      </strong>
                      과{" "}
                      <strong>
                        양자역학 강의노트
                      </strong>
                      에서 관련된 개념이
                      발견되었습니다.
                    </p>
                  </div>

                  <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider mt-8 mb-4">
                    Related Stars (Files)
                  </div>

                  {MOCK_VECTORS.map((doc) => (
                    <div
                      key={doc.id}
                      className="group relative p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-purple-500/30 transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${
                              doc.type === "pdf"
                                ? "bg-red-500/20 text-red-400"
                                : doc.type ===
                                  "xlsx"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-orange-500/20 text-orange-400"
                            }`}
                          >
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-medium text-slate-200 group-hover:text-white transition-colors">
                              {doc.title}
                            </h3>
                            <div className="text-xs text-slate-500">
                              {doc.type.toUpperCase()}{" "}
                              • 2.4MB
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded text-xs font-mono">
                          {doc.score}% Match
                        </div>
                      </div>
                      <p className="text-sm text-slate-400 pl-12">
                        {doc.summary}
                      </p>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {show3D && (
                <div className="absolute inset-0 z-20 bg-slate-950">
                  <button
                    onClick={() =>
                      setShow3D(false)
                    }
                    className="absolute top-6 right-6 z-50 p-2 bg-slate-800 text-white rounded-full hover:bg-slate-700 border border-white/10"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <ThreeScene
                    data={MOCK_VECTORS}
                  />
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur px-6 py-3 rounded-full border border-white/10 text-sm text-slate-300 z-40 flex items-center gap-4 pointer-events-none">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                      <span>Your Query</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]"></div>
                      <span>Files</span>
                    </div>
                    <div className="border-l border-white/20 pl-4">
                      Drag to rotate • Scroll to
                      zoom
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const ThreeScene = ({ data }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617);
    scene.fog = new THREE.FogExp2(0x020617, 0.02);

    const camera = new THREE.PerspectiveCamera(
      60,
      width / height,
      0.1,
      1000
    );
    camera.position.set(0, 20, 60);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(
      window.devicePixelRatio
    );
    mountRef.current.appendChild(
      renderer.domElement
    );

    // Query Node (Red)
    const queryGeo = new THREE.SphereGeometry(
      1.5,
      32,
      32
    );
    const queryMat = new THREE.MeshBasicMaterial({
      color: 0xff4444,
    });
    const queryMesh = new THREE.Mesh(
      queryGeo,
      queryMat
    );
    scene.add(queryMesh);

    // Glow
    const glowGeo = new THREE.SphereGeometry(
      2.5,
      32,
      32
    );
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xff4444,
      transparent: true,
      opacity: 0.3,
    });
    const queryGlow = new THREE.Mesh(
      glowGeo,
      glowMat
    );
    queryMesh.add(queryGlow);

    // File Nodes
    data.forEach((file) => {
      const size = 0.8 + file.score / 100;
      const geo = new THREE.SphereGeometry(
        size,
        16,
        16
      );
      const color = new THREE.Color().setHSL(
        0.6,
        1,
        0.5 + file.score / 200
      );
      const mat = new THREE.MeshBasicMaterial({
        color: color,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(file.x, file.y, file.z);
      scene.add(mesh);

      if (file.score > 50) {
        const points = [
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(
            file.x,
            file.y,
            file.z
          ),
        ];
        const lineGeo =
          new THREE.BufferGeometry().setFromPoints(
            points
          );
        const lineMat =
          new THREE.LineBasicMaterial({
            color: 0x4444ff,
            transparent: true,
            opacity: (file.score / 100) * 0.5,
          });
        scene.add(
          new THREE.Line(lineGeo, lineMat)
        );
      }

      // Text sprites require loading fonts or creating canvas textures, simplified here for starter
    });

    // Stars
    const starsGeo = new THREE.BufferGeometry();
    const starsCount = 1000;
    const posArray = new Float32Array(
      starsCount * 3
    );
    for (let i = 0; i < starsCount * 3; i++)
      posArray[i] = (Math.random() - 0.5) * 200;
    starsGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3)
    );
    const starsMat = new THREE.PointsMaterial({
      size: 0.2,
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
    });
    const starField = new THREE.Points(
      starsGeo,
      starsMat
    );
    scene.add(starField);

    // Interaction variables
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = () => (isDragging = true);
    const onMouseUp = () => (isDragging = false);
    const onMouseMove = (e) => {
      if (isDragging) {
        const deltaMove = {
          x: e.offsetX - previousMousePosition.x,
          y: e.offsetY - previousMousePosition.y,
        };
        const radius = Math.sqrt(
          camera.position.x ** 2 +
            camera.position.z ** 2
        );
        let theta = Math.atan2(
          camera.position.x,
          camera.position.z
        );
        theta -= deltaMove.x * 0.01;
        camera.position.x =
          radius * Math.sin(theta);
        camera.position.z =
          radius * Math.cos(theta);
        camera.lookAt(0, 0, 0);
      }
      previousMousePosition = {
        x: e.offsetX,
        y: e.offsetY,
      };
    };

    const domElement = renderer.domElement;
    domElement.addEventListener(
      "mousedown",
      onMouseDown
    );
    window.addEventListener("mouseup", onMouseUp);
    domElement.addEventListener(
      "mousemove",
      onMouseMove
    );

    const animate = () => {
      requestAnimationFrame(animate);
      starField.rotation.y += 0.0005;
      queryGlow.scale.setScalar(
        1 + Math.sin(Date.now() * 0.002) * 0.2
      );
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      domElement.removeEventListener(
        "mousedown",
        onMouseDown
      );
      window.removeEventListener(
        "mouseup",
        onMouseUp
      );
      domElement.removeEventListener(
        "mousemove",
        onMouseMove
      );
      window.removeEventListener(
        "resize",
        handleResize
      );
      mountRef.current.removeChild(
        renderer.domElement
      );
    };
  }, [data]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full cursor-move"
    />
  );
};

export default App;
