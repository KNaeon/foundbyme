// src/components/3d/GalaxyView.jsx
import React, {
  // useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import {
  Canvas,
  useFrame, // useFrame 추가
} from "@react-three/fiber";
import {
  OrbitControls,
  Stars,
  Html,
} from "@react-three/drei";
import { useNavigate } from "react-router-dom";
import { useChatStore } from "../../stores/useChatStore"; // Store import

// 개별 별(데이터 포인트) 컴포넌트
const StarNode = ({
  position,
  color,
  label,
  isQuery,
}) => {
  const ref = useRef();
  const [hovered, setHover] = useState(false);

  // 쿼리 노드는 반짝이는 효과 추가
  useFrame((state) => {
    if (isQuery && ref.current) {
      const scale =
        1.5 +
        Math.sin(state.clock.elapsedTime * 3) *
          0.2;
      ref.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh
      ref={ref}
      position={position}
      scale={hovered ? 1.8 : isQuery ? 1.5 : 1}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
      }}
      onPointerOut={() => setHover(false)}
    >
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={
          hovered || isQuery ? 2 : 0.5
        }
        roughness={0.2}
      />
      {hovered && (
        <Html distanceFactor={10}>
          <div className="bg-slate-900/90 text-xs text-white p-2 rounded border border-slate-500 whitespace-nowrap pointer-events-none z-50">
            {label}
          </div>
        </Html>
      )}
    </mesh>
  );
};

const GalaxyView = () => {
  const navigate = useNavigate();
  const { currentChatId, currentResult } =
    useChatStore(); // Store에서 데이터 가져오기
  const [dataPoints, setDataPoints] = useState(
    []
  );

  // 백엔드에서 실제 벡터 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      if (!currentChatId) return;

      try {
        // 쿼리가 있으면 파라미터에 추가
        const queryParam = currentResult?.query
          ? `&query=${encodeURIComponent(
              currentResult.query
            )}`
          : "";

        const response = await fetch(
          `http://localhost:8000/api/galaxy?session_id=${currentChatId}${queryParam}`
        );

        if (response.ok) {
          const data = await response.json();
          setDataPoints(data);
        }
      } catch (error) {
        console.error(
          "Failed to fetch galaxy data:",
          error
        );
      }
    };
    fetchData();
  }, [currentChatId, currentResult]); // 의존성 배열 업데이트

  return (
    <div className="w-full h-screen bg-black relative">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 z-50 bg-slate-800/50 hover:bg-slate-700 text-white px-4 py-2 rounded-full backdrop-blur-md border border-slate-600 transition-colors cursor-pointer"
      >
        ← 돌아가기
      </button>

      <div className="absolute top-6 right-6 z-50 text-right space-y-2 pointer-events-none">
        <div className="bg-space-accent/20 text-space-accent px-4 py-2 rounded-full backdrop-blur-md border border-space-accent/50 font-bold">
          Knowledge Galaxy View
        </div>
        <div className="text-xs text-slate-400 bg-black/50 p-2 rounded">
          🔴 PDF | 🔵 TXT | 🟠 PPTX
        </div>
      </div>

      <Canvas
        camera={{ position: [0, 0, 20], fov: 60 }}
      >
        <color
          attach="background"
          args={["#050810"]}
        />
        <ambientLight intensity={0.3} />
        <pointLight
          position={[10, 10, 10]}
          intensity={1.5}
          color="#4c1d95"
        />
        <pointLight
          position={[-10, -10, -10]}
          intensity={1.5}
          color="#0e7490"
        />

        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />

        {/* 실제 데이터 렌더링 */}
        <group rotation={[0, Math.PI / 4, 0]}>
          {dataPoints.map((point) => (
            <StarNode
              key={point.id}
              position={point.position}
              color={point.color}
              label={point.label}
              isQuery={point.isQuery} // isQuery prop 전달
            />
          ))}
          {/* 중심점 가이드 */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry
              args={[0.2, 16, 16]}
            />
            <meshBasicMaterial
              color="white"
              transparent
              opacity={0.1}
              wireframe
            />
          </mesh>
        </group>

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};

export default GalaxyView;

// import React, { useMemo, useRef } from "react";
// import { Canvas, useFrame } from "@react-three/fiber";
// import { OrbitControls, Stars, Text, Html } from "@react-three/drei";
// import * as THREE from "three";
// import { useNavigate } from "react-router-dom";

// // 3D 더미 데이터 생성 (벡터 공간의 점들)
// const generateDummyData = (count) => {
//   const data = [];
//   for (let i = 0; i < count; i++) {
//     // 중앙에 집중된 랜덤 분포
//     const x =
//       (Math.random() - 0.5) * 10 +
//       (Math.random() - 0.5) * 2;
//     const y =
//       (Math.random() - 0.5) * 10 +
//       (Math.random() - 0.5) * 2;
//     const z =
//       (Math.random() - 0.5) * 10 +
//       (Math.random() - 0.5) * 2;
//     // 주제별 군집 색상 (예: 3가지 주제)
//     const group = Math.floor(Math.random() * 3);
//     const color =
//       group === 0
//         ? "#8B5CF6"
//         : group === 1
//         ? "#06B6D4"
//         : "#F43F5E";

//     data.push({
//       position: [x, y, z],
//       color,
//       id: i,
//       label: `Chunk_${i}`,
//     });
//   }
//   // 질문(Query)을 나타내는 특별한 노드
//   data.push({
//     position: [2, 1, 3],
//     color: "#FDE047",
//     id: "query",
//     label: "내 질문",
//     isQuery: true,
//   });
//   return data;
// };

// // 개별 별(데이터 포인트) 컴포넌트
// const StarNode = ({
//   position,
//   color,
//   isQuery,
// }) => {
//   const ref = useRef();
//   const [hovered, setHover] =
//     React.useState(false);

//   // 쿼리 노드는 반짝이는 효과 추가
//   useFrame((state) => {
//     if (isQuery && ref.current) {
//       ref.current.scale.x =
//         ref.current.scale.y =
//         ref.current.scale.z =
//           1.5 +
//           Math.sin(state.clock.elapsedTime * 3) *
//             0.2;
//     }
//   });

//   return (
//     <mesh
//       ref={ref}
//       position={position}
//       scale={hovered ? 1.8 : isQuery ? 1.5 : 1}
//       onPointerOver={(e) => {
//         e.stopPropagation();
//         setHover(true);
//       }}
//       onPointerOut={() => setHover(false)}
//     >
//       <sphereGeometry args={[0.15, 16, 16]} />
//       <meshStandardMaterial
//         color={color}
//         emissive={color}
//         emissiveIntensity={
//           hovered || isQuery ? 2 : 0.5
//         }
//         roughness={0.2}
//       />
//       {/* 호버 시 레이블 표시 */}
//       {hovered && (
//         <Html distanceFactor={10}>
//           <div className="bg-slate-900/90 text-xs text-white p-2 rounded border border-slate-500 whitespace-nowrap pointer-events-none">
//             {isQuery
//               ? "가장 유사한 정보 근처"
//               : "강의자료 데이터 조각"}
//           </div>
//         </Html>
//       )}
//     </mesh>
//   );
// };

// const GalaxyView = () => {
//   const dataPoints = useMemo(
//     () => generateDummyData(150),
//     []
//   );
//   const navigate = useNavigate();

//   return (
//     <div className="w-full h-screen bg-black relative">
//       {/* 뒤로가기 버튼 (UI 오버레이) */}
//       <button
//         onClick={() => navigate(-1)}
//         className="absolute top-6 left-6 z-50 bg-slate-800/50 hover:bg-slate-700 text-white px-4 py-2 rounded-full backdrop-blur-md border border-slate-600 transition-colors"
//       >
//         ← 돌아가기
//       </button>
//       <div className="absolute top-6 right-6 z-50 bg-space-accent/20 text-space-accent px-4 py-2 rounded-full backdrop-blur-md border border-space-accent/50 pointer-events-none font-bold">
//         Knowledge Galaxy View
//       </div>

//       <Canvas
//         camera={{ position: [0, 0, 15], fov: 60 }}
//       >
//         <color
//           attach="background"
//           args={["#050810"]}
//         />
//         {/* 조명 설정 */}
//         <ambientLight intensity={0.3} />
//         <pointLight
//           position={[10, 10, 10]}
//           intensity={1.5}
//           color="#4c1d95"
//         />
//         <pointLight
//           position={[-10, -10, -10]}
//           intensity={1.5}
//           color="#0e7490"
//         />

//         {/* 배경 별들 */}
//         <Stars
//           radius={100}
//           depth={50}
//           count={5000}
//           factor={4}
//           saturation={0}
//           fade
//           speed={1}
//         />

//         {/* 데이터 포인트들 렌더링 */}
//         <group rotation={[0, Math.PI / 4, 0]}>
//           {dataPoints.map((point) => (
//             <StarNode key={point.id} {...point} />
//           ))}
//           {/* 중심점 표시 */}
//           <mesh position={[0, 0, 0]}>
//             <sphereGeometry
//               args={[0.2, 16, 16]}
//             />
//             <meshBasicMaterial
//               color="white"
//               transparent
//               opacity={0.2}
//               wireframe
//             />
//           </mesh>
//         </group>

//         {/* 마우스 컨트롤 */}
//         <OrbitControls
//           enablePan={true}
//           enableZoom={true}
//           enableRotate={true}
//           autoRotate={true} // 자동 회전
//           autoRotateSpeed={0.5}
//           maxDistance={30}
//           minDistance={2}
//         />
//       </Canvas>
//     </div>
//   );
// };

// export default GalaxyView;
