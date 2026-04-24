// ===== SAFETY CHECKS TO REMOVE=====
if (typeof THEMES === "undefined" || typeof THEME_PRICES === "undefined") {
  throw new Error("themes.js must load before script.js");
}

if (typeof ACHIEVEMENTS === "undefined") {
  throw new Error("achievements.js must load before script.js");
}

const settings = { size: 10, words: 15 };
let currentCat = "";
let currentLevel = 0;
let placedWords = {};
let foundWords = new Set();
let animationsEnabled = true;
let foundColors = {};
let boardData = [];
let levelCompleted = false;
let currentMode = "normal";
let hints;

let unlockedAchievements = JSON.parse(localStorage.getItem("unlockedAchievements") || "[]");
let usedWords = JSON.parse(localStorage.getItem("usedWords") || "{}");
for (const c in CATEGORIES) if (!usedWords[c]) usedWords[c] = [];
let unlockedLevels = JSON.parse(localStorage.getItem("unlockedLevels") || "{}");
for (const c in categories) { if (!unlockedLevels[c]) unlockedLevels[c] = [1]; }
let coins = Number(localStorage.getItem("coins") || 0);
updateCoinDisplay();

function goto(id) {
  if (id === "shop-screen") {
  coins = Number(localStorage.getItem("coins") || 0);
  hints = Number(localStorage.getItem("hints") || 0);
  renderShop();
}
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  const target = document.getElementById(id);
  if (target) target.classList.remove('hidden');
  if (typeof updateCoinDisplay === "function") updateCoinDisplay();
  if (id === 'categories') renderCategories();
  if (id === 'levels') {
    refreshLevelChecks();
    setTimeout(() => { document.getElementById('levels').scrollTop = 0; }, 10);
  }
  if (id === "achievements-screen") renderAchievements();
  if (id === "profile-screen") updateProfileScreen();
  if (id === "daily-reward-screen" || id === "daily-screen") {
  if (typeof refreshDailyUI === "function") refreshDailyUI();
}
  const clearBtn = document.getElementById('clearLevelBtn');
  if (clearBtn) clearBtn.style.display = (id === 'game') ? 'block' : 'none';
  const menuContainer = document.getElementById('menu-container');
  const menuPopup = document.getElementById('menu-popup');
  const hideOnScreens = [
    'themes-screen','settings-screen','achievements-screen','profile-screen',
    'daily-screen','rewards-screen','shop-screen','texture-screen'
  ];
  const shouldHide = hideOnScreens.includes(id);
  if (menuContainer) menuContainer.style.display = shouldHide ? 'none' : 'block';
  if (menuPopup) menuPopup.classList.add('hidden');
}
window.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menu-btn');
  const menuPopup = document.getElementById('menu-popup');

  if (!menuBtn || !menuPopup) {
    console.warn('Menu button or popup not found in DOM.');
    return;
  }
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    menuPopup.classList.toggle('hidden');
  });
});
function renderCategories() {
  const div = document.getElementById('cat-grid'); div.innerHTML = "";
  for (const cat in CATEGORIES) {
    const btn = document.createElement('button');
    btn.textContent = cat; btn.onclick = () => { currentCat = cat; goto('levels'); };
    div.appendChild(btn);
  }
}
function refreshLevelChecks() {
  document.getElementById('level-title').textContent = `${currentCat} Levels`;
  const div = document.getElementById('level-grid');
  div.innerHTML = "";
  if (!unlockedLevels[currentCat]) unlockedLevels[currentCat] = [1];
  for (let i = 0; i < 100; i++) {
    const levelNumber = i + 1;
    const b = document.createElement('div');
    b.textContent = `Level ${levelNumber}`;
    b.className = "level-btn";
    const d = JSON.parse(localStorage.getItem(`${currentCat}-level${i}`) || "null");
    if (d && (d.completed || d.status === "done")) {
      b.classList.add('completed');
    }
    const isUnlocked = unlockedLevels[currentCat].includes(levelNumber);
    if (!isUnlocked) {
      b.classList.add('locked');
      b.style.backgroundColor = "#888";
      b.style.color = "#fff";
      b.style.pointerEvents = "none";
    } else {
      b.style.backgroundColor = "";
      b.style.pointerEvents = "auto";
    }
    b.onclick = () => {
      currentLevel = i;
      startLevel();
    };
    div.appendChild(b);
  }
  localStorage.setItem("unlockedLevels", JSON.stringify(unlockedLevels));
}
function startLevel() {
  const key = `${currentCat}-level${currentLevel}`;
  const savedData = JSON.parse(localStorage.getItem(key) || "{}");
  levelCompleted = !!savedData.completed;  // 🛑 true if already completed
  currentMode = "normal";   // 🎮 back to normal mode
  document.getElementById('game-title').textContent =
    `${currentCat} – Level ${currentLevel + 1}`;
  goto('game');
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
    renderWordList(Object.keys(placedWords));
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
      document.getElementById(`word-${w}`).classList.add('word-found');
    }
  } else {
    generateGrid(currentCat);
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
function renderGrid(size) {
  const g = document.getElementById('grid');
  g.style.gridTemplateColumns = `repeat(${size},1fr)`; g.innerHTML = "";
  let html = "";
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      html += `<div class="cell" data-row="${r}" data-col="${c}">${boardData[r][c]}</div>`;
    }
  }
  g.innerHTML = html;
  enableDrag();
}
function renderWordList(words) {
  const div = document.getElementById('word-list'); div.innerHTML = "";
  words.forEach(w => {
    const span = document.createElement('span');
    span.id = `word-${w}`; span.textContent = w;
    span.className = 'word-item'; div.appendChild(span);
  });
}
function enableDrag() {
  const g = document.getElementById('grid');
  let startCell = null;
  function cellAt(x, y) { return document.elementFromPoint(x, y)?.closest('.cell'); }
  function begin(cell) { if (!cell) return; startCell = cell; highlightLine(cell); }
  function move(cell) { if (!startCell || !cell) return; highlightLine(cell); }
  function end() {
    if (!startCell) return;
    const sel = [...g.querySelectorAll('.cell.dragging')];
    checkSelection(sel);
    g.querySelectorAll('.cell.dragging').forEach(x => x.classList.remove('dragging'));
    startCell = null;
  }
  function highlightLine(endCell) {
    g.querySelectorAll('.cell.dragging').forEach(x => x.classList.remove('dragging'));
    const r0 = +startCell.dataset.row, c0 = +startCell.dataset.col;
    const r1 = +endCell.dataset.row, c1 = +endCell.dataset.col;
    const dr = Math.sign(r1 - r0), dc = Math.sign(c1 - c0);
    if (dr === 0 && dc === 0) { startCell.classList.add('dragging'); return; }
    if (Math.abs(r1 - r0) !== 0 && Math.abs(c1 - c0) !== 0 && Math.abs(r1 - r0) !== Math.abs(c1 - c0)) return;
    let r = r0, c = c0;
    while (true) {
      const el = g.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
      if (el) el.classList.add('dragging');
      if (r === r1 && c === c1) break;
      r += dr; c += dc;
    }
  }
  g.onmousedown = e => begin(e.target.closest('.cell'));
  g.onmousemove = e => move(e.target.closest('.cell'));
  document.onmouseup = end;
  g.ontouchstart = e => {
    e.preventDefault();
    const t = e.touches[0];
    begin(cellAt(t.clientX, t.clientY));
  };
  g.ontouchmove = e => {
    e.preventDefault();
    const t = e.touches[0];
    move(cellAt(t.clientX, t.clientY));
  };
  g.ontouchend = e => {
    e.preventDefault();
    end();
  };
}
function checkSelection(cells) {
	if (levelCompleted) return;  // 🛑 Ignore taps after level is complete
  const coords = cells.map(c => [+c.dataset.row, +c.dataset.col]);
  const str = cells.map(c => c.textContent).join('');
  const rev = [...str].reverse().join('');
  for (const [w, wc] of Object.entries(placedWords)) {
    if (foundWords.has(w)) continue;
    if (match(coords, wc) || match(coords, wc.slice().reverse()) || str === w || rev === w) {
      foundWords.add(w);
      const color = foundColors[w] || `hsl(${Math.random() * 360},70%,55%)`;
      foundColors[w] = color;
      wc.forEach(([r, c], i) => {
        const el = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
        el.classList.add('perma');
        el.style.transition = "background 0.4s ease, color 0.3s ease";
        setTimeout(() => {
          el.style.background = color;
          el.style.color = "#fff";
        }, i * 80);
      });
      document.getElementById(`word-${w}`).classList.add('word-found');
      const wordEl = document.getElementById(`word-${w}`);
      if (wordEl) {
        wordEl.classList.add("flash");
        setTimeout(() => wordEl.classList.remove("flash"), 6000);
      }
    }
  }
  saveProgress();
  if (foundWords.size === Object.keys(placedWords).length) markLevelDone();
}
function match(a, b) { return a.length === b.length && a.every((v, i) => v[0] === b[i][0] && v[1] === b[i][1]); }
function markLevelDone() {
  if (levelCompleted) return;
  levelCompleted = true;
  if (currentMode === "daily") {
    const today = new Date().toDateString();
    if (localStorage.getItem("daily_" + today) === "done") {
      showPopup("✅ You've already completed today's puzzle!");
      return;
    }
    localStorage.setItem("daily_" + today, "done");
    const reward = Math.floor(Math.random() * 11) + 10;
    coins += reward;
    localStorage.setItem("coins", coins);
    updateCoinDisplay();
    const popup = document.getElementById("levelPopup");
    const msg = popup.querySelector(".popup-message");
    if (msg)
      msg.innerHTML = `🌞 Daily Puzzle Complete!<br>💰 You earned <b>${reward}</b>  coins!`;
    popup.classList.remove("hidden");
    const closeBtn = document.getElementById("closePopup");
    if (closeBtn) {
      closeBtn.onclick = () => {
        popup.classList.add("hidden");
        goto("daily-screen");
        initDailyPuzzle(); 
      };
    }
    return;
  }
  const key = `${currentCat}-level${currentLevel}`;
  const saved = JSON.parse(localStorage.getItem(key) || "{}");
  if (saved.completed) return;
  const reward = Math.floor(Math.random() * 11) + 10;
  coins += reward;
  localStorage.setItem("coins", coins);
  updateCoinDisplay();
  saved.completed = true;
  localStorage.setItem(key, JSON.stringify(saved));
  unlockNextLevel();
  checkAchievements();
  const popup = document.getElementById("levelPopup");
  const msg = popup.querySelector(".popup-message");
  if (msg)
    msg.innerHTML = ` Level Complete!<br>💰 You earned <b>${reward}</b>  coins!`;
  console.log("Popup found?", popup);
  popup.classList.remove("hidden");
  const closeBtn = document.getElementById("closePopup");
  if (closeBtn) {
    closeBtn.onclick = () => {
      popup.classList.add("hidden");
      goto("levels");
    };
  }
}
function unlockNextLevel() {
  if (!unlockedLevels[currentCat]) unlockedLevels[currentCat] = [1];
  const nextLevel = currentLevel + 2;
  if (!unlockedLevels[currentCat].includes(nextLevel)) {
    unlockedLevels[currentCat].push(nextLevel);
    localStorage.setItem("unlockedLevels", JSON.stringify(unlockedLevels));
    console.log(`🔓 Level ${nextLevel} unlocked in ${currentCat}`);
  }
}
function saveProgress() {
  try {
    const key = `${currentCat}-level${currentLevel}`;
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
function checkAchievements() {
  const totalCompleted = Object.keys(localStorage)
    .filter(k => k.includes("-level"))
    .map(k => JSON.parse(localStorage.getItem(k) || "{}"))
    .filter(d => d.completed).length;
  const totalWordsFound = foundWords ? foundWords.size : 0;
  const totalColors = foundColors ? Object.keys(foundColors).length : 0;
  const hours = new Date().getHours();
  if (currentLevel === 0) unlockAchievement('first_steps');
  if (totalCompleted >= 5) unlockAchievement('word_hunter');
  if (totalCompleted >= 10) unlockAchievement('puzzle_master');
  if (hours >= 0 && hours <= 5) unlockAchievement('night_owl');
  if (hours >= 6 && hours <= 9) unlockAchievement('early_bird');
  if (totalCompleted >= 10) unlockAchievement('level_10');
  if (totalCompleted >= 20) unlockAchievement('level_20');
  if (totalCompleted >= 30) unlockAchievement('level_30');
  if (totalCompleted >= 50) unlockAchievement('all_levels');
  if (totalCompleted >= 15) unlockAchievement('word_wizard');
  if (totalCompleted >= 20) unlockAchievement('brainiac');
  if (totalCompleted >= 25) unlockAchievement('speed_runner');
  if (totalCompleted >= 30) unlockAchievement('puzzle_champion');
  if (totalCompleted >= 35) unlockAchievement('letter_legend');
  if (totalCompleted >= 40) unlockAchievement('vocabulary_king');
  if (totalCompleted >= 45) unlockAchievement('ultimate_solver');
  if (totalCompleted >= 50) unlockAchievement('ultimate_champion');
  if (totalWordsFound >= settings.words) unlockAchievement('all_words_found');
  if (totalColors >= 5) unlockAchievement('all_colors_found');
  if (foundWords && foundWords.has("SECRET")) unlockAchievement('secret_finder');
  if (totalCompleted >= 3) unlockAchievement('daily_streak_3');
  if (totalCompleted >= 7) unlockAchievement('daily_streak_7');
  if (totalCompleted >= 14) unlockAchievement('daily_streak_14');
  if (totalCompleted >= 20) unlockAchievement('daily_master');
  if (totalWordsFound >= 20) unlockAchievement('word_collector');
  if (totalWordsFound >= 30) unlockAchievement('word_conqueror');
  if (totalWordsFound >= 40) unlockAchievement('word_detective');
  if (totalWordsFound >= 50) unlockAchievement('word_genius');
  if (totalWordsFound >= 75) unlockAchievement('word_marathon');
  if (totalWordsFound >= 100) unlockAchievement('letter_collector');
  if (totalWordsFound >= 150) unlockAchievement('word_master');
  if (totalCompleted >= 10) unlockAchievement('puzzle_explorer');
  if (totalCompleted >= 15) unlockAchievement('grid_master');
  if (totalCompleted >= 25) unlockAchievement('perfect_grid');
  if (totalCompleted >= 30) unlockAchievement('brain_master');
  if (totalCompleted >= 35) unlockAchievement('mystery_solver');
  if (totalCompleted >= 40) unlockAchievement('hidden_word_hunter');
  if (totalCompleted >= 45) unlockAchievement('champion_finder');
  if (totalCompleted >= 50) unlockAchievement('grand_master');
  if (totalCompleted >= 50 && unlockedAchievements.length === 49)unlockAchievement('legendary_solver');
  if (unlockedAchievements.length >= 10) unlockAchievement('collector');
  if (unlockedAchievements.length >= 20) unlockAchievement('achievement_collector');
  if (unlockedAchievements.length >= 50) unlockAchievement('secret_hero');
  console.log(`🏆 Checked Achievements — Levels: ${totalCompleted}, Words: ${totalWordsFound}, Total Unlocked: ${unlockedAchievements.length}`);
}
function saveAchievements() { localStorage.setItem("unlockedAchievements", JSON.stringify(unlockedAchievements)); }
function isUnlocked(id) {
  return unlockedAchievements.includes(id);
}
function unlockAchievement(id) {
	if (currentMode === "daily") return;
  if (!isUnlocked(id)) {
    unlockedAchievements.push(id);
    saveAchievements();
    renderAchievements?.();
    console.log("🏆 Achievement unlocked:", id);
    showAchievementPopup(achievementsList.find(a => a.id === id)?.name || id);
  }
}
function renderAchievements() {
  const list = document.getElementById("achievement-list");
  if (!list) return;
  list.innerHTML = "";
  achievementsList.forEach(ach => {
    const btn = document.createElement("button");
    const unlocked = isUnlocked(ach.id);
    btn.classList.add("achievement-btn");
    btn.dataset.id = ach.id;
    btn.textContent = `${ach.name} — ${unlocked ? "🟢 UNLOCKED" : "🔒 LOCKED"}`;
    btn.style.padding = "0.5rem 1rem";
    btn.style.borderRadius = "10px";
    btn.style.width = "100%";
    btn.style.textAlign = "left";
    btn.style.fontWeight = unlocked ? "bold" : "normal";
    btn.style.opacity = unlocked ? "1" : "0.6";
    btn.style.transition = "all 0.3s ease";
    list.appendChild(btn);
  });
  console.log(`🎯 Rendered ${achievementsList.length} achievements`);
}
function showAchievementPopup(name) {
  const popup = document.getElementById("achievement-popup");
  if (!popup) return;
  popup.textContent = `🏆 Achievement Unlocked: ${name}`;
  popup.style.opacity = "1";
  popup.classList.remove("hidden");
  setTimeout(() => {
    popup.style.opacity = "0";
    setTimeout(() => popup.classList.add("hidden"), 400);
  }, 3000);
}
document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("achievement-detail-popup");
  const titleEl = document.getElementById("popup-achievement-title");
  const descEl = document.getElementById("popup-achievement-desc");
  const okBtn = document.getElementById("popup-ok-btn");
  okBtn.addEventListener("click", () => {
    popup.classList.add("hidden");
  });
  document.getElementById("achievements-screen").addEventListener("click", (e) => {
    const btn = e.target.closest(".achievement-btn");
    if (!btn) return;
    const id = btn.dataset.id;
    const ach = achievementsList.find(a => a.id === id);
    if (!ach) return;
    titleEl.textContent = ach.name;
    descEl.textContent = ach.desc;
    popup.classList.remove("hidden");
  });
});
function renderThemes() {
  const grid = document.getElementById("theme-grid");
  if (!grid) return;

  grid.innerHTML = "";
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "repeat(2, 1fr)";
  grid.style.gap = "0.8rem";
  grid.style.width = "90%";
  grid.style.maxWidth = "500px";
  grid.style.margin = "1rem auto";

  const unlockedThemes = JSON.parse(localStorage.getItem("unlockedThemes") || "[]");

  THEMES.forEach((t, i) => {
    const btn = document.createElement("button");
    const isUnlocked = unlockedThemes.includes(t.name);
    btn.textContent = isUnlocked
      ? `✅ ${t.name}`
      : `🔒 ${t.name} — ${THEME_PRICES[t.name]}⭐`;

    btn.style.background = t.accent;
    btn.style.color = t.text;
    btn.style.padding = "0.8rem 1.2rem";
    btn.style.borderRadius = "10px";
    btn.style.border = "none";
    btn.style.fontWeight = "bold";
    btn.style.fontSize = "1rem";
    btn.style.cursor = "pointer";
    btn.style.opacity = isUnlocked ? "1" : "0.5";
    btn.style.transition = "transform 0.2s ease, opacity 0.3s ease";

    if (isUnlocked) {
      btn.onclick = () => applyTHEME(i);
      btn.onmouseenter = () => (btn.style.transform = "scale(1.05)");
      btn.onmouseleave = () => (btn.style.transform = "scale(1)");
    } else {
      btn.onclick = () => alert(`Unlock this theme in the Shop first!`);
    }

    grid.appendChild(btn);
  });
}
window.addEventListener("load", renderThemes);
function applyTHEME(index) {
  const t = THEMES[index];
  localStorage.setItem("theme", index);
  document.documentElement.style.setProperty("--bg", t.bg);
  document.documentElement.style.setProperty("--accent", t.accent);
  document.documentElement.style.setProperty("--text", t.text);
  document.body.style.backgroundColor = t.bg;
  document.body.style.color = t.text;
  document.querySelectorAll(".screen").forEach(s => {
    s.style.backgroundColor = t.bg;
    s.style.color = t.text;
  });
  const grid = document.getElementById("grid");
  if (grid) {
    grid.style.backgroundColor = t.name === "DEFAULT" ? "rgba(255,255,255,0.05)" : t.accent;
  }
  const wordList = document.getElementById("word-list");
  if (wordList) {
    const items = wordList.querySelectorAll(".word-item");
    items.forEach(item => {
      if (t.name === "DEFAULT") {
        item.style.backgroundColor = "rgba(255,255,255,0.1)";
        item.style.color = "#ffffff";
      } else {
        item.style.backgroundColor = t.accent;
        item.style.color = t.text;
      }
    });
  }
  const profileBox = document.getElementById("profile-container");
  if (profileBox) {
    if (t.name === "DEFAULT") {
      profileBox.style.backgroundColor = "rgba(255,255,255,0.05)";
    } else {
      profileBox.style.backgroundColor = t.accent;
    }
  }
  if (typeof updateProfileScreen === "function") updateProfileScreen();
}
function loadTHEME() {
  const saved = localStorage.getItem("theme");
  if (saved !== null && THEMES[Number(saved)]) {
    applyTHEME(Number(saved));
  } else {
    applyTHEME(0);
  }
}
document.addEventListener("DOMContentLoaded", loadTHEME);
function renderShop() {
  coins = getSavedCoins();
  updateCoinDisplay();
  const shopCoinEl = document.getElementById("shopCoins");
  if (shopCoinEl) shopCoinEl.textContent = ` Coins: ${coins}`;
  const grid = document.getElementById("theme-shop-grid");
  if (!grid) return;
  grid.innerHTML = "";
  THEMES.forEach((t, i) => {
    if (i === 0) return; 
    const btn = document.createElement("button");
    const unlockedThemes = JSON.parse(localStorage.getItem("unlockedThemes") || "[]");
    const cost = THEME_PRICES[t.name] || 0;
    if (unlockedThemes.includes(t.name)) {
      btn.textContent = `${t.name} ✅`;
      btn.disabled = true;
      btn.style.opacity = "0.7";
      btn.style.cursor = "default";
      btn.title = "Unlocked — apply from Theme Settings!";
    } else {
      btn.textContent = `${t.name} — ${cost}`;
      btn.onclick = () => buyTheme(t.name);
    }
    grid.appendChild(btn);
  });
}
function buyHintPack(amount, cost) {
  coins = Number(localStorage.getItem("coins") || 0);
  hints = Number(localStorage.getItem("hints") || 0);
  if (coins < cost) {
    showPopup(`⚠️ Not enough coins! You need ${cost} coins to buy this pack.`);
    return;
  }
  coins -= cost;
  hints += amount;
  localStorage.setItem("coins", coins);
  localStorage.setItem("hints", hints);
  localStorage.setItem("persistentHintsBackup", hints);
  updateCoinDisplay();
  updateHintDisplay();
  showPopup(` You bought +${amount} hints for ${cost} coins!`);
}
function buyChest(type, cost) {
  coins = Number(localStorage.getItem("coins") || 0);
  hints = Number(localStorage.getItem("hints") || 0);
  if (coins < cost) {
    showPopup(`⚠️ Not enough coins! You need ${cost} coins to buy this ${type} chest.`);
    return;
  }
  coins -= cost;
  localStorage.setItem("coins", coins);
  updateCoinDisplay();
  let rewardCoins = 0;
  let rewardHints = 0;
  if (type === "common") {
    const coinChance = Math.random() < 0.6; // 60% chance coins
    if (coinChance) {
      rewardCoins = randomBetween(100, 150);
    } else {
      rewardHints = randomBetween(1, 2);
    }
  }
  else if (type === "rare") {
    rewardCoins = randomBetween(250, 300);
    if (Math.random() < 0.4) rewardHints = randomBetween(1, 3);
  }
  else if (type === "legendary") {
    rewardCoins = randomBetween(500, 600);
    rewardHints = randomBetween(5, 10);
  }
  coins += rewardCoins;
  hints += rewardHints;
  localStorage.setItem("coins", coins);
  localStorage.setItem("hints", hints);
  updateCoinDisplay();
  updateHintDisplay();
  showChestPopup(type, rewardCoins, rewardHints);
}
function buyTheme(themeName) {
  const cost = THEME_PRICES[themeName];
  let coins = Number(localStorage.getItem("coins") || 0);
  if (coins < cost) {
    showPopup(`⚠️ You need ${cost} coins to unlock ${themeName}.`);
    return;
  }
  coins -= cost;
  localStorage.setItem("coins", coins);
  let unlockedThemes = JSON.parse(localStorage.getItem("unlockedThemes") || "[]");
  if (!unlockedThemes.includes(themeName)) unlockedThemes.push(themeName);
  localStorage.setItem("unlockedThemes", JSON.stringify(unlockedThemes));
  updateCoinDisplay();
  renderShop?.();
  renderThemes?.();
  showPopup(` You unlocked the ${themeName} theme!`);
}
function showChestPopup(type, coinsGained, hintsGained) {
  let popup = document.getElementById("levelPopup");
  if (!popup) {
    popup = document.createElement("div");
    popup.id = "levelPopup";
    popup.className = "popup";
    popup.innerHTML = `
      <div class="popup-content">
        <p class="popup-message"></p>
        <button id="closePopup">OK</button>
      </div>`;
    document.body.appendChild(popup);
  }
  const msg = popup.querySelector(".popup-message");
  const chestEmoji = type === "legendary" ? "👑" : type === "rare" ? "💎" : "🟩";
  msg.innerHTML = `
    ${chestEmoji} <b>${type.toUpperCase()} CHEST OPENED!</b><br>
    💰 +${coinsGained} Coins<br>
     +${hintsGained} Hints `;
  popup.classList.remove("hidden");
  document.getElementById("closePopup").onclick = () => {
    popup.classList.add("hidden");
  };
}
function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function showDailyScreen() {
  const today = new Date().toDateString();
  const completed = localStorage.getItem("daily_" + today);
  goto("daily-screen");
  const dateEl = document.getElementById("daily-date");
  const statusEl = document.getElementById("daily-status");
  const playBtn = document.getElementById("daily-play-btn");
  if (dateEl) dateEl.textContent = today;
  if (statusEl) {
    if (completed) {
      statusEl.textContent = "✅ You’ve already completed today’s puzzle!";
      if (playBtn) {
        playBtn.disabled = true;
        playBtn.textContent = "Completed";
        playBtn.style.opacity = "0.6";
      }
    } else {
      statusEl.textContent = "🕹 Ready to play today’s puzzle!";
      if (playBtn) {
        playBtn.disabled = false;
        playBtn.textContent = "Play Now";
        playBtn.style.opacity = "1";
      }
    }
  }
}
function initDailyPuzzle() {
  const dateEl = document.getElementById("daily-date");
  const statusEl = document.getElementById("daily-status");
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });
  if (dateEl) dateEl.textContent = "Today's Puzzle: " + dateStr;
  const completed = localStorage.getItem("daily_" + dateStr);
  if (statusEl) {
    statusEl.textContent = completed
      ? "✅ You already completed today’s puzzle!"
      : "🕒 Ready to play today’s challenge!";
  }
}
function startDailyPuzzle() {
  const today = new Date().toDateString();
  const completed = localStorage.getItem("daily_" + today);
  if (completed) {
    showPopup("✅ You already completed today's Daily Puzzle!");
    goto("daily-screen");
    return;
  }
  currentMode = "daily";
  goto("game");
  const dailyWords = ["SUN", "MOON", "STAR", "CLOUD", "RAIN", "WIND"];
  const size = 10;
  const grid = Array.from({ length: size }, () => Array(size).fill(''));
  const dirs = [[1, 0], [0, 1], [1, 1]];
  placedWords = {};
  function tryPlace(w) {
    for (let t = 0; t < 200; t++) {
      const d = dirs[Math.floor(Math.random() * dirs.length)];
      const r0 = Math.floor(Math.random() * size);
      const c0 = Math.floor(Math.random() * size);
      const cells = [];
      let ok = true;
      for (let i = 0; i < w.length; i++) {
        const r = r0 + d[0] * i;
        const c = c0 + d[1] * i;
        if (r >= size || c >= size || grid[r][c]) { ok = false; break; }
        cells.push([r, c]);
      }
      if (ok) {
        cells.forEach(([r, c], i) => (grid[r][c] = w[i]));
        placedWords[w] = cells;
        return true;
      }
    }
    return false;
  }
  dailyWords.forEach(w => tryPlace(w));
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++)
      if (!grid[r][c])
        grid[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  boardData = grid;
  renderGrid(size);
  renderWordList(dailyWords);
  document.getElementById("game-title").textContent = "🌞 Daily Puzzle";
}
(function(){
const SPIN_COST=30;
const DAILY_KEY="luckyspin_free_date";
const REWARDS=[
{type:"coins",value:50,color:"#FFD54F",labelNumber:"50",labelEmoji:"⭐"},
{type:"coins",value:100,color:"#FFB300",labelNumber:"100",labelEmoji:"⭐"},
{type:"hints",value:1,color:"#80DEEA",labelNumber:"+1",labelEmoji:"💡"},
{type:"coins",value:200,color:"#A5D6A7",labelNumber:"200",labelEmoji:"⭐"},
{type:"hints",value:2,color:"#CE93D8",labelNumber:"+2",labelEmoji:"💡"},
{type:"coins",value:500,color:"#FF8A65",labelNumber:"500",labelEmoji:"⭐"},
{type:"coins",value:300,color:"#4FC3F7",labelNumber:"300",labelEmoji:"⭐"},
{type:"coins",value:1000,color:"#FF7043",labelNumber:"1000",labelEmoji:"⭐"}
];
if(typeof window.coins==="undefined")window.coins=Number(localStorage.getItem("coins")||100);
if(typeof window.hints==="undefined")window.hints=Number(localStorage.getItem("hints")||3);
const canvas=document.getElementById("spinCanvas");
if(!canvas)return console.warn("LuckySpin: #spinCanvas missing");
const overlay=document.getElementById("luckySpin");
const elFree=document.getElementById("freeSpinBtn");
const elBuy=document.getElementById("buySpinBtn");
const elClose=document.getElementById("closeSpinBtn");
const elResult=document.getElementById("spinResult");
const elCoin=document.getElementById("coinCount");
const elHint=document.getElementById("hintCount");
const ctx=canvas.getContext("2d");
function scaleCanvasForDPR(){
const dpr=window.devicePixelRatio||1;
const cssW=canvas.clientWidth||canvas.width;
const cssH=canvas.clientHeight||canvas.height;
canvas.width=Math.round(cssW*dpr);
canvas.height=Math.round(cssH*dpr);
canvas.style.width=cssW+"px";
canvas.style.height=cssH+"px";
ctx.setTransform(dpr,0,0,dpr,0,0);
}
scaleCanvasForDPR();
window.addEventListener("resize",()=>{scaleCanvasForDPR();drawWheel();});
let spinning=false;
let cumulativeRotation=0;
function saveAll(){
localStorage.setItem("coins",String(window.coins));
localStorage.setItem("hints",String(window.hints));
localStorage.setItem("persistentHintsBackup",String(window.hints));
}
function updateAll(){
if(typeof updateCoinDisplay==="function"){try{updateCoinDisplay();}catch(e){console.warn("updateCoinDisplay err:",e);}}else if(elCoin)elCoin.textContent=window.coins;
if(typeof updateHintDisplay==="function"){try{updateHintDisplay();}catch(e){console.warn("updateHintDisplay err:",e);}}else if(elHint)elHint.textContent=window.hints;
}
function todayStr(){return new Date().toISOString().slice(0,10);}
function drawWheel(){
const cssW=canvas.clientWidth||canvas.width;
const cssH=canvas.clientHeight||canvas.height;
const w=cssW,h=cssH;
const cx=w/2,cy=h/2;
const radius=Math.min(cx,cy)-8;
const N=REWARDS.length;
const anglePer=(2*Math.PI)/N;
ctx.clearRect(0,0,w,h);
ctx.save();
ctx.translate(cx,cy);
for(let i=0;i<N;i++){
const p=REWARDS[i];
const start=i*anglePer;
const end=start+anglePer;
ctx.beginPath();
ctx.moveTo(0,0);
ctx.arc(0,0,radius,start,end);
ctx.closePath();
ctx.fillStyle=p.color;
ctx.fill();
ctx.strokeStyle="rgba(0,0,0,0.08)";
ctx.stroke();
const mid=start+anglePer/2;
ctx.save();
ctx.rotate(mid);
ctx.textAlign="center";
ctx.textBaseline="middle";
ctx.fillStyle="#111";
ctx.font="bold 14px system-ui, 'Segoe UI', Roboto, sans-serif";
ctx.fillText(p.labelNumber,radius*0.58-8,0);
ctx.font="18px 'Segoe UI Emoji','Noto Color Emoji','Apple Color Emoji', sans-serif";
ctx.fillText(p.labelEmoji,radius*0.58+20,0);
ctx.restore();
}
ctx.beginPath();
ctx.arc(0,0,radius*0.18,0,Math.PI*2);
ctx.fillStyle="#111";
ctx.fill();
ctx.fillStyle="#fff";
ctx.font="bold 14px sans-serif";
ctx.textAlign="center";
ctx.fillText("SPIN",0,0);
ctx.restore();
}
function awardPrize(prize){
if(!prize)return;
if(prize.type==="coins"){
window.coins+=prize.value;
saveAll();updateAll();
if(elResult)elResult.textContent=`🎉 You won ${prize.value}⭐ coins! (Total: ${window.coins}⭐)`;
return;
}
if (prize.type === "hints") {
  window.hints = Number(window.hints || 0) + Number(prize.value || 0);
  try { hints = Number(window.hints); } catch(e) { /* ignore if not defined */ }
  localStorage.setItem("hints", String(window.hints));
  localStorage.setItem("persistentHintsBackup", String(window.hints));
  if (typeof updateHintDisplay === "function") {
    try { updateHintDisplay(); } catch (e) { console.warn("updateHintDisplay failed", e); }
  }
  const elHint = document.getElementById("hintCount");
  if (elHint) elHint.textContent = window.hints;
  try { window.dispatchEvent(new CustomEvent("hintsChanged", { detail: { hints: window.hints } })); } catch(e){}

  if (elResult) elResult.textContent = `💡 You won ${prize.value} hints! (Total: ${window.hints})`;
  return;
}
if(elResult)elResult.textContent="🎁 You got a prize!";
}
function updateButtons(){
const used=localStorage.getItem(DAILY_KEY)===todayStr();
if(elFree){elFree.disabled=used||spinning;elFree.style.opacity=elFree.disabled?0.6:1;}
if(elBuy){elBuy.disabled=(window.coins<SPIN_COST)||spinning;elBuy.style.opacity=elBuy.disabled?0.6:1;}
}
function openSpin(){
if(overlay)overlay.classList.remove("hidden");
drawWheel();
if(elResult)elResult.textContent="";
updateButtons();
}
function closeSpin(){
if(overlay)overlay.classList.add("hidden");
}
function startSpin(buy=false){
if(spinning)return;
if(buy){
if(window.coins<SPIN_COST){if(elResult)elResult.textContent="⚠️ Not enough coins!";return;}
window.coins-=SPIN_COST;saveAll();updateAll();
}else{
const today=todayStr();
if(localStorage.getItem(DAILY_KEY)===today){if(elResult)elResult.textContent="⚠️ Free spin used today!";return;}
localStorage.setItem(DAILY_KEY,today);
}
spinning=true;
if(elResult)elResult.textContent="";
const N=REWARDS.length;
const anglePerDeg=360/N;
const targetIndex=Math.floor(Math.random()*N);
const rounds=Math.floor(Math.random()*3)+4;
const centerDeg=(targetIndex*anglePerDeg)+anglePerDeg/2;
const rotationNeeded=-90-centerDeg;
const jitter=(Math.random()*(anglePerDeg*0.4))-(anglePerDeg*0.2);
const finalRotation=cumulativeRotation+(360*rounds+rotationNeeded+jitter);
const finalRotationNormalized=((finalRotation%360)+360)%360;
canvas.style.transition="transform 3.6s cubic-bezier(.15,.9,.2,1)";
canvas.style.transform=`rotate(${finalRotation}deg)`;
updateButtons();
const onEnd=function(e){
if(e.target!==canvas)return;
canvas.removeEventListener("transitionend",onEnd);
const normalized=finalRotation%360;
canvas.style.transition="";
canvas.style.transform=`rotate(${normalized}deg)`;
cumulativeRotation=((normalized%360)+360)%360;
const R=finalRotationNormalized;
const pointerTargetDeg=270;
const angleAtPointer=((pointerTargetDeg-R)+360)%360;
const landedIndex=Math.floor(angleAtPointer/anglePerDeg)%N;
awardPrize(REWARDS[landedIndex]);
spinning=false;
updateButtons();
};
canvas.addEventListener("transitionend",onEnd,{once:true});
}
window.openSpin=window.openSpin||openSpin;
window.closeSpin=window.closeSpin||closeSpin;
window.startLuckySpin=window.startLuckySpin||startSpin;
if(elFree)elFree.addEventListener("click",()=>startSpin(false));
if(elBuy)elBuy.addEventListener("click",()=>startSpin(true));
if(elClose)elClose.addEventListener("click",closeSpin);
drawWheel();
updateAll();
updateButtons();
})();
function updateHintDisplay(){
const el=document.getElementById("hintCount");
if(el)el.textContent=window.hints;
}
window.addEventListener("hintsChanged",()=>updateHintDisplay());
(function(){
  const DAILY_REWARDS = {
    1: { coins: 50,  hints: 0  },
    2: { coins: 70,  hints: 1  },
    3: { coins: 100, hints: 0  },
    4: { coins: 140, hints: 4  },
    5: { coins: 190, hints: 0  },
    6: { coins: 250, hints: 8  },
    7: { coins: 320, hints: 12 }
  };
  const KEY_LAST = "daily_last_claim";
  const KEY_STREAK = "daily_streak_day";
  function todayStr() {
    return new Date().toISOString().slice(0,10);
  }
  function yesterDayStr() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().slice(0,10);
  }
  function initDailyState() {
    if (!localStorage.getItem(KEY_STREAK)) localStorage.setItem(KEY_STREAK, "1");
    refreshDailyUI();
  }
  function isClaimedToday() {
    return localStorage.getItem(KEY_LAST) === todayStr();
  }
  function refreshDailyUI() {
    const last = localStorage.getItem(KEY_LAST);
    const streakDay = Number(localStorage.getItem(KEY_STREAK) || "1");
    const tiles = document.querySelectorAll("#daily-calendar .day-tile, .day7-row .day-tile");
    tiles.forEach(t => {
      const d = Number(t.dataset.day);
      t.classList.remove("claimed","active");
      if (!d) return;
      if (last) {
        if (last === todayStr() && d <= streakDay) {
          t.classList.add("claimed");
        } else if (d < streakDay) {
          t.classList.add("claimed");
        }
      }
      const canClaim = !isClaimedToday();
      if (d === streakDay && canClaim) t.classList.add("active");
    });
    const btn = document.getElementById("claimRewardBtn");
    if (!btn) return;
    if (isClaimedToday()) {
      btn.disabled = true;
      btn.textContent = "Already claimed today";
      btn.style.opacity = "0.7";
    } else {
      btn.disabled = false;
      btn.textContent = `Claim Day ${streakDay} Reward`;
      btn.style.opacity = "1";
    }
  }
async function claimTodayReward() {
    if (isClaimedToday()) {
      showPopup("✅ You've already claimed today's reward.");
      refreshDailyUI();
      return;
    }
    let streakDay = Number(localStorage.getItem(KEY_STREAK) || "1");
    const last = localStorage.getItem(KEY_LAST);
    if (!last) {
      streakDay = 1;
    } else if (last === yesterDayStr()) {
    } else if (last !== todayStr()) {
      streakDay = 1; 
    }
    const reward = DAILY_REWARDS[streakDay] || {coins: 50, hints: 0};
    coins = Number(localStorage.getItem("coins") || 0) + (reward.coins || 0);
    localStorage.setItem("coins", coins);
    updateCoinDisplay?.();
    hints = Number(localStorage.getItem("hints") || 0) + (reward.hints || 0);
    localStorage.setItem("hints", hints);
    localStorage.setItem("persistentHintsBackup", hints);
    updateHintDisplay?.();
    localStorage.setItem(KEY_LAST, todayStr());
    if (streakDay === 7) {
      localStorage.setItem("daily_legend_unlocked", "1");
      showPopup(`👑 Day 7 reward claimed! You got ${reward.coins} and ${reward.hints} hints. Legendary chest unlocked!`);
      localStorage.setItem(KEY_STREAK, "1");
    } else {
      localStorage.setItem(KEY_STREAK, String(streakDay + 1));
    }
    refreshDailyUI();
    showPopup(` You claimed Day ${streakDay} reward: +${reward.coins} and +${reward.hints} hints!`);
  }
  document.addEventListener("DOMContentLoaded", () => {
    initDailyState();
    const claimBtn = document.getElementById("claimRewardBtn");
    if (claimBtn) claimBtn.addEventListener("click", claimTodayReward);
    document.querySelectorAll("#daily-calendar .day-tile, .day7-row .day-tile")
      .forEach(tile => tile.addEventListener("click", () => {
        const d = Number(tile.dataset.day);
        const r = DAILY_REWARDS[d] || {coins:0,hints:0};
        showPopup(`Day ${d} reward: ${r.coins} ${r.hints ? '+'+r.hints+' hints' : ''}`);
      }));
    refreshDailyUI();
  });
  window.dailyRewardsRefreshUI = refreshDailyUI;
})();
function updateProfileScreen() {
  const name = localStorage.getItem("playerName") || "Player";
  const completed = Object.keys(localStorage)
    .filter(k => k.includes("-level"))
    .map(k => JSON.parse(localStorage.getItem(k) || "{}"))
    .filter(d => d.completed).length;
  let totalWords = 0;
  Object.keys(localStorage).forEach(k => {
    if (k.includes("-level")) {
      try {
        const data = JSON.parse(localStorage.getItem(k));
        if (data.found && Array.isArray(data.found)) totalWords += data.found.length;
      } catch {}
    }
  });
  const achievements = JSON.parse(localStorage.getItem("unlockedAchievements") || "[]").length;
  const coins = Number(localStorage.getItem("coins") || 0);
  const themeIndex = Number(localStorage.getItem("theme")) || 0;
  const themeName = THEMES[themeIndex]?.name || "Default";
  const nameEl = document.getElementById("player-name");
  const progressEl = document.getElementById("profile-progress");
  const wordsEl = document.getElementById("profile-words");
  const achievementsEl = document.getElementById("profile-achievements");
  const themeEl = document.getElementById("profile-theme");
  const coinsEl = document.getElementById("profile-coins");
  if (!nameEl || !progressEl || !wordsEl || !achievementsEl || !themeEl || !coinsEl) {
    console.warn("⚠️ Some profile elements not found — check HTML IDs.");
    return;
  }
  nameEl.textContent = `🧑 Name: ${name}`;
  progressEl.textContent = `🏁 Levels Completed: ${completed}`;
  wordsEl.textContent = `🔤 Words Found: ${totalWords}`;
  achievementsEl.textContent = `🏆 Achievements Unlocked: ${achievements}`;
  themeEl.textContent = `🎨 Current Theme: ${themeName}`;
  coinsEl.textContent = ` Coins: ${coins}`;
}
function updateCoinDisplay() {
  coins = Number(localStorage.getItem("coins") || coins || 0);
  const el = document.getElementById("coinCount");
  if (el) el.textContent = coins;
  const shopEl = document.getElementById("shopCoins");
  if (shopEl) shopEl.textContent = ` Coins: ${coins}`;
}
setInterval(() => {
  const shopScreen = document.getElementById("shop-screen");
  if (shopScreen && !shopScreen.classList.contains("hidden")) {
    updateCoinDisplay();
  }
}, 500);
try {
  const stored = localStorage.getItem("persistentHintsBackup");
  hints = stored !== null ? Number(stored) : 3;  // Start with 3 on first play
} catch {
  hints = 3;
}
if (isNaN(hints)) hints = 3;
updateHintDisplay();
function updateHintDisplay() {
  const el = document.getElementById("hintCount");
  if (el) el.textContent = hints;
  localStorage.setItem("persistentHintsBackup", hints);
  localStorage.setItem("hints", hints);
}
function rewardCoins() {
  const reward = Math.floor(Math.random() * 11) + 10; // 10–20 random coins
  coins += reward;
  localStorage.setItem("coins", coins);
  updateCoinDisplay();
  showPopup(` You earned ${reward} coins!`);
}
function getSavedCoins() {
  const saved = Number(localStorage.getItem("coins"));
  return isNaN(saved) ? 0 : saved;
}
function useHint() {
  if (currentMode === "daily") {
    showPopup("⚠️ Hints are disabled in Daily Puzzles!");
    return;
  }
  if (hints <= 0) {
    showPopup("⚠️ No hints left! Earn more by completing levels.");
    return;
  }
  hints--;
  updateHintDisplay();
  const remaining = Object.keys(placedWords).filter(w => !foundWords.has(w));
  if (remaining.length === 0) {
    showPopup("✅ All words already found!");
    return;
  }
  const hintWord = remaining[Math.floor(Math.random() * remaining.length)];
  const coords = placedWords[hintWord];
  const saved = localStorage.getItem("theme");
  const t = themes[Number(saved)] || themes[0];
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
    showPopup(` Hint used: "${hintWord}"`);
  }, coords.length * 300 + 300);
}
function toggleAnimations() {
  animationsEnabled = !animationsEnabled;
  localStorage.setItem("animationsEnabled", JSON.stringify(animationsEnabled));
  document.getElementById("toggle-animation-btn").textContent =
    `✨ Animations: ${animationsEnabled ? "ON" : "OFF"}`;
  document.body.classList.toggle("no-animations", !animationsEnabled);
}
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("toggle-animation-btn").textContent =
    `✨ Animations: ${animationsEnabled ? "ON" : "OFF"}`;
});
function showPopup(message) {
  const popup = document.getElementById("universalPopup");
  const msg = document.getElementById("popup-message");
  const ok = document.getElementById("popup-ok");
  if (!popup || !msg || !ok) return console.warn("Popup HTML missing.");

  msg.innerHTML = message;
  popup.classList.remove("hidden");
  ok.onclick = () => popup.classList.add("hidden");
}
const clearBtn = document.getElementById('clearLevelBtn');
if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    const key = `${currentCat}-level${currentLevel}`;
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
}
function resetGame() {
  const key = `${currentCat}-level${currentLevel}`;
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