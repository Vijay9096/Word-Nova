function useHint() {
  if (currentMode === "daily") {
    showPopup("⚠️ Hints are disabled in Daily Puzzles!");
    return;
  }
  if (currentDifficulty === "hard") {
    showPopup("❌ Hints are disabled in Hard mode!");
    return;
  }
  if (currentDifficulty === "normal") {
    showPopup("❌ Hints are disabled in this normal mode!!");
    return;
  }
  if (hints <= 0) {
    showPopup("⚠️ No hints left! Earn more by completing levels.");
    return;
  }
  const remaining = Object.keys(placedWords).filter(w => !foundWords.has(w));
  if (remaining.length === 0) {
    showPopup("✅ All words already found!");
    return;
  }
  hints = hints - 1;
  localStorage.setItem("hints", hints); // 🔥 added
  updateHintDisplay();
  const hintWord = remaining[Math.floor(Math.random() * remaining.length)];
  const coords = placedWords[hintWord];
  const saved = localStorage.getItem("theme");
  const t = THEMES[Number(saved)] || themes[0];
  const hintColor = t.accent || "#FFD700";
  coords.forEach(([r, c], i) => {
    setTimeout(() => {
      const el = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
      if (el) {
        el.style.transition = "background 0.3s ease, color 0.3s ease";
        el.style.background = hintColor;
        el.style.color = t.text || "#000";
        el.classList.add("hinted");
      }
    }, i * 300);
  });
  setTimeout(() => {
    foundWords.add(hintWord);
    document.getElementById(`word-${hintWord}`)?.classList.add("word-found");
    saveProgress();
    showPopup(`💡 Hint used: "${hintWord}"`);
    if (foundWords.size === Object.keys(placedWords).length) {
      levelCompleted = false;
      checkSelection([]);
    }
  }, coords.length * 300 + 300);
}
function updateHintDisplay() {
  hints = Number(localStorage.getItem("hints") ?? 3);
  const el = document.getElementById("hintCount");
  if (el) el.textContent = hints;
  const shopEl = document.getElementById("shopHints");
  if (shopEl) shopEl.textContent = ` Hints: ${hints}`;
}