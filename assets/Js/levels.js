function startLevel() {
  lockedLevel = currentLevel;
  const isHard = (currentDifficulty === "hard");
  showTimerOnlyIfHard(isHard);
  if (isHard) {
    resetTimer();
    setTimerLimit(120000, handleTimeUp);
    setTimeout(() => {
      startTimer();
    }, 6000);
  } else {
    resetTimer();
  }
  const key = `${currentDifficulty}-${currentCat}-level${currentLevel}`;
  const savedData = JSON.parse(localStorage.getItem(key) || "{}");
  levelCompleted = !!savedData.completed;
  currentMode = (typeof currentMode === 'string' && currentMode !== '') ? currentMode : "normal";
  document.getElementById('game-title').textContent =
    `${currentCat} - Level ${currentLevel + 1}`;
  goto('game');
  showStartLevelToast(`LEVEL ${currentLevel + 1} — GOOD LUCK!`, 1600);
  if (savedData && savedData.placed && savedData.found) {
    placedWords = savedData.placed;
    foundWords = new Set(savedData.found);
    foundColors = savedData.colors || {};
    boardData = Array.from({ length: settings.size }, () => Array(settings.size).fill(''));
    for (const [word, coords] of Object.entries(placedWords)) {
      coords.forEach(([r, c], i) => boardData[r][c] = word[i]);
    }
    for (let r = 0; r < settings.size; r++)
      for (let c = 0; c < settings.size; c++)
        if (!boardData[r][c])
          boardData[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    renderGrid(settings.size);
    triggerLevelIntro("#grid");
    renderWordList(Object.keys(placedWords));
    triggerWordListSlideIn();
    if (currentMode === 'blind-list') {
        hideWordList();
      }
    for (const w of foundWords) {
      const coords = placedWords[w];
      const color = foundColors[w] || 'yellow';
      coords.forEach(([r, c]) => {
        const el = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
        if (el) {
          el.style.background = color;
          el.classList.add('perma');
        }
      });
      const wordEl = document.getElementById(`word-${w}`);
      if (wordEl) wordEl.classList.add('word-found');
    }
  } else {
  generateGrid(currentCat);
    setTimeout(() => {
      if (currentMode === 'blind-list') {
    hideWordList();
      }
    }, 40);
  }
}
function chooseWords(cat, count) {
  const pool = CATEGORIES[cat].filter(w => !usedWords[cat].includes(w));
  const chosen = [];
  while (chosen.length < count && pool.length) {
    const i = Math.floor(Math.random() * pool.length);
    chosen.push(pool.splice(i, 1)[0]);
  }
  usedWords[cat].push(...chosen);
  localStorage.setItem("usedWords", JSON.stringify(usedWords));
  return chosen;
}
function generateGrid(cat) {
 const size = settings.size;
  const wordCount = settings.words;
  placedWords = {}; foundWords = new Set(); foundColors = {};
  const grid = Array.from({ length: size }, () => Array(size).fill(''));
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]];
  const chosen = chooseWords(cat, wordCount).map(w => w.toUpperCase());
  function tryPlace(w) {
    for (let t = 0; t < 200; t++) {
      const d = dirs[Math.floor(Math.random() * dirs.length)];
      const r0 = Math.floor(Math.random() * size), c0 = Math.floor(Math.random() * size);
      const cells = []; let ok = true;
      for (let i = 0; i < w.length; i++) {
        const r = r0 + d[0] * i, c = c0 + d[1] * i;
        if (r < 0 || c < 0 || r >= size || c >= size) { ok = false; break; }
        if (grid[r][c] && grid[r][c] !== w[i]) { ok = false; break; }
        cells.push([r, c]);
      }
      if (ok) {
        cells.forEach(([r, c], i) => { grid[r][c] = w[i]; });
        placedWords[w] = cells;
        return true;
      }
    }
    return false;
  }
  chosen.forEach(w => tryPlace(w));
  for (let r = 0; r < size; r++) for (let c = 0; c < size; c++)
    if (!grid[r][c]) grid[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  boardData = grid; renderGrid(size); renderWordList(chosen); saveProgress();
}
function unlockNextLevel() {
  const diff = currentDifficulty || localStorage.getItem("currentDifficulty") || "easy";
  const cat  = currentCat || "GENERAL";
  const lvl  = Number(currentLevel);
  if (!unlockedLevels[diff]) unlockedLevels[diff] = {};
  if (!Array.isArray(unlockedLevels[diff][cat])) {
      unlockedLevels[diff][cat] = [1];
  }
  const nextLevel = lvl + 1;
  if (!unlockedLevels[diff][cat].includes(nextLevel)) {
      unlockedLevels[diff][cat].push(nextLevel);
      unlockedLevels[diff][cat].sort((a,b)=>a-b);
      localStorage.setItem("unlockedLevels", JSON.stringify(unlockedLevels));
      console.log(` Level ${nextLevel} unlocked in ${cat} (${diff})`);
  } else {
      console.log(`Level ${nextLevel} already unlocked in ${cat} (${diff})`);
  }
}
function saveProgress() {
  try {
    const key = `${currentDifficulty}-${currentCat}-level${currentLevel}`;
    const data = {
      found: [...foundWords],
      placed: placedWords,
      colors: foundColors
    };
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Save failed:", e);
  }
}
function resetGame() {
  const key = `${currentDifficulty}-${currentCat}-level${currentLevel}`;
  const saved = JSON.parse(localStorage.getItem(key) || "{}");
  if (saved.placed) {
    saved.found = [];
    saved.colors = {};
    delete saved.completed;
    localStorage.setItem(key, JSON.stringify(saved));
  }
  foundWords.clear();
  foundColors = {};
  document.querySelectorAll('.cell').forEach(c => {
    c.classList.remove('perma');
    c.style.background = '';
  });
  document.querySelectorAll('.word-item').forEach(w => w.classList.remove('word-found'));
}
const clearBtn = document.getElementById('clearLevelBtn');
if (clearBtn) {
  clearBtn.addEventListener('click', function () {
    waitForButtonActive(function () {
      const key = `${currentDifficulty}-${currentCat}-level${currentLevel}`;
      const saved = JSON.parse(localStorage.getItem(key) || "{}");
      if (saved.placed) {
        localStorage.setItem(key, JSON.stringify({
          placed: saved.placed,
          found: [],
          colors: {}
        }));
      }
      foundWords.clear();
      foundColors = {};
      document.querySelectorAll('.cell').forEach(c => {
        c.classList.remove('perma');
        c.style.background = '';
      });
      document.querySelectorAll('.word-item').forEach(w => w.classList.remove('word-found'));
    });
  });
}
function clearLocalStorage() {
  const savedCoins = localStorage.getItem("coins");
  const savedHints = localStorage.getItem("hints");
  localStorage.clear();
  unlockedThemes = ["DEFAULT"];
  unlockedLevels = {};
  unlockedachievements = {};
  for (const cat in CATEGORIES) {
    unlockedLevels[cat] = [1];
  }
  localStorage.setItem("unlockedThemes", JSON.stringify(unlockedThemes));
  localStorage.setItem("unlockedLevels", JSON.stringify(unlockedLevels));
  localStorage.setItem("usedWords", JSON.stringify({}));
  if (savedCoins !== null) localStorage.setItem("coins", savedCoins);
  if (savedHints !== null) localStorage.setItem("hints", savedHints);
  updateHintDisplay();
  updateCoinDisplay();
  foundWords.clear();
  foundColors = {};
  levelCompleted = false;
  showPopup("✅ Game data cleared! Coins and hints are safe.");
  goto("start");
}