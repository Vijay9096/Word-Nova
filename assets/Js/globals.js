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
let hintPopupRunning = false;
let hintQueue = [];
let hintPopupTimer = null;

let unlockedAchievements = JSON.parse(localStorage.getItem("unlockedAchievements") || "[]");
let usedWords = JSON.parse(localStorage.getItem("usedWords") || "{}");
for (const c in CATEGORIES) if (!usedWords[c]) usedWords[c] = [];
let unlockedLevels = JSON.parse(localStorage.getItem("unlockedLevels") || "{}");
const diffs = ["easy", "medium", "hard"];  const cats  = Object.keys(CATEGORIES); 
for (const d of diffs) { if (!unlockedLevels[d]) unlockedLevels[d] = {}; for (const c of cats) { if (!unlockedLevels[d][c]) { unlockedLevels[d][c] = [1]; } } }
let coins = Number(localStorage.getItem("coins") || 0);
let hints = Number(localStorage.getItem("hints") || 3);
if (isNaN(coins)) coins = 0;