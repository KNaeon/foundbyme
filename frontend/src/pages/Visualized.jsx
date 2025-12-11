import React from "react";
import GalaxyView from "../components/3d/GalaxyView";

const Visualized = () => {
  return (
    // 3D Canvas가 전체 화면을 차지하도록 함
    <div
      style={{ width: "100vw", height: "100vh" }}
    >
      <GalaxyView />
    </div>
  );
};

export default Visualized;
