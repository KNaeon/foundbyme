import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Result from "./pages/Result";
import Visualized from "./pages/Visualized";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/result"
        element={<Result />}
      />
      <Route
        path="/visualized"
        element={<Visualized />}
      />
    </Routes>
  );
}

export default App;
