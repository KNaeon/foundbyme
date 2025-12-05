import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 프론트에서 '/api'로 시작하는 요청을 백엔드(8000포트)로 전달
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(/^\/api/, ""),
        // 예: /api/search -> 백엔드에는 /search 로 전달됨
      },
    },
  },
});
