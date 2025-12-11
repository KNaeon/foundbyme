/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          dark: "#0F172A", // 깊은 우주색
          light: "#1E293B", // 약간 밝은 우주색 (카드 등)
          accent: "#8B5CF6", // 보라색 강조 (Nebula)
          text: "#E2E8F0", // 별빛 텍스트
        },
      },
      backgroundImage: {
        "space-gradient":
          "radial-gradient(circle at center, #1E293B 0%, #0F172A 100%)",
      },
    },
  },
  plugins: [],
};
