function toggleColorblindMode() {
  let enabled = localStorage.getItem("colorblind") === "1";
  enabled = !enabled; // flip state
  localStorage.setItem("colorblind", enabled ? "1" : "0");
  document.body.classList.toggle("colorblind", enabled);
  const btn = document.getElementById("toggle-colorblind-btn");
  if (btn) btn.textContent = enabled ? "🎨 Colorblind: ON" : "🎨 Colorblind: OFF";
}
function togglePerformanceMode() {
  let enabled = localStorage.getItem("performance") === "1";
  enabled = !enabled; // flip state
  localStorage.setItem("performance", enabled ? "1" : "0");
  document.body.classList.toggle("performance", enabled);
  const btn = document.getElementById("toggle-performance-btn");
  if (btn) btn.textContent = enabled ? "⚡ Performance: ON" : "⚡ Performance: OFF";
  window.GAME_PERFORMANCE_MODE = enabled;
}
function toggleMusic() {
  musicEnabled = !musicEnabled;
  const btn = document.getElementById("music-toggle");
  if (!musicEnabled) {
    if (audioCtx) { audioCtx.suspend(); }
    btn.innerText = "🎹 Music: OFF";
  } else {
    if (audioCtx) { audioCtx.resume();
    } else { startGeneratedMusic(); }
    btn.innerText = "🎹 Music: ON";
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const cb = localStorage.getItem("colorblind") === "1";
  const perf = localStorage.getItem("performance") === "1";
  document.body.classList.toggle("colorblind", cb);
  document.body.classList.toggle("performance", perf);
  const btnCB = document.getElementById("toggle-colorblind-btn");
  if (btnCB) btnCB.textContent = cb ? "🎨 Colorblind: ON" : "🎨 Colorblind: OFF";
  const btnPF = document.getElementById("toggle-performance-btn");
  if (btnPF) btnPF.textContent = perf ? "⚡ Performance: ON" : "⚡ Performance: OFF";
});