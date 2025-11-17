// script.js

const API_BASE = "http://localhost:8000"; // FastAPI 서버 주소

const queryInput = document.getElementById("query");
const searchBtn = document.getElementById("searchBtn");
const resultsList = document.getElementById("resultsList");

const stepInput = document.getElementById("step-input");
const stepEmbed = document.getElementById("step-embed");
const stepVdb = document.getElementById("step-vdb");
const stepResult = document.getElementById("step-result");
const stepInputBody = document.getElementById("step-input-body");

function resetSteps() {
  [stepInput, stepEmbed, stepVdb, stepResult].forEach((el) =>
    el.classList.remove("active")
  );
}

async function search() {
  const q = queryInput.value.trim();
  if (!q) return;

  resetSteps();
  stepInput.classList.add("active");
  stepInputBody.textContent = `입력된 질의: "${q}"`;

  // 2단계: 임베딩 생성 (시각적으로만 표시)
  await sleep(200);
  stepEmbed.classList.add("active");

  // 3단계: 벡터DB 검색 (실제 API 호출)
  await sleep(200);
  stepVdb.classList.add("active");

  try {
    const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(q)}&k=5`);
    const data = await res.json();

    // 4단계: 결과 표시
    await sleep(200);
    stepResult.classList.add("active");
    renderResults(data.results || []);
  } catch (e) {
    console.error(e);
    renderResults([]);
  }
}

function renderResults(results) {
  resultsList.innerHTML = "";

  if (!results.length) {
    const li = document.createElement("li");
    li.textContent = "결과가 없습니다.";
    li.className = "result-item";
    resultsList.appendChild(li);
    return;
  }

  results.forEach((r) => {
    const li = document.createElement("li");
    li.className = "result-item";

    const score = document.createElement("div");
    score.className = "result-score";
    score.textContent = `score: ${r.score.toFixed(3)} | id: ${r.id}`;

    const text = document.createElement("div");
    text.className = "result-text";
    text.textContent = r.text;

    li.appendChild(score);
    li.appendChild(text);
    resultsList.appendChild(li);
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

searchBtn.addEventListener("click", search);
queryInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") search();
});
