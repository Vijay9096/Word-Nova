function checkSelection(cells) {
  if (levelCompleted) return;
  const coords = cells.map(c => [+c.dataset.row, +c.dataset.col]);
  const str = cells.map(c => c.textContent).join('');
  const rev = [...str].reverse().join('');
  const beforeFoundCount = foundWords.size;
  for (const [w, wc] of Object.entries(placedWords)) {
    if (foundWords.has(w)) continue;
    if (match(coords, wc) || match(coords, wc.slice().reverse()) || str === w || rev === w) {
      foundWords.add(w);
      dropConfettiFromCenterAllDir(30);
      triggerWordRevealBlast(wc, { particles: 8, life: 520, vibrateMs: 18 });
      const color = foundColors[w] || `hsl(${Math.random() * 360},70%,55%)`;
      foundColors[w] = color;
      if (window.GAME_PERFORMANCE_MODE) {
        wc.forEach(([r, c]) => {
          const el = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
          if (!el) return;
          el.classList.add('perma');
          el.style.background = color;
          el.style.color = "#fff";
          el.style.transition = "none"; // kill fades
        });
        const wordEl = document.getElementById(`word-${w}`);
        if (wordEl) wordEl.classList.add("word-found");
    } else {
        wc.forEach(([r, c], i) => {
          const el = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
          if (!el) return;
          el.classList.add('perma');
          el.style.transition = "background 0.4s ease, color 0.3s ease";
          setTimeout(() => {
            el.style.background = color;
            el.style.color = "#fff";
          }, i * 80);
        });
        const wordEl = document.getElementById(`word-${w}`);
        if (wordEl) wordEl.classList.add("word-found");
        triggerWordPop(wordEl);triggerRipple(wordEl);
        if (wordEl) {
          wordEl.classList.add("flash");
          setTimeout(() => wordEl.classList.remove("flash"), 6000);
        }
      }
    }
  }
  if (foundWords.size === beforeFoundCount) triggerWrongShake();
  saveProgress();
  if (foundWords.size === Object.keys(placedWords).length)
  triggerLevelOutro("#grid", 1400, () => {
  dropBurstConfetti(50);
  triggerFireworks();
  showLevelCompleteRibbon({ title: 'LEVEL CLEARED', duration: 900 })
    .then(() => {
      markLevelDone();
    });
});
}
function getRewardForDifficulty(diff) {
    diff = String(diff || "").toLowerCase();
    if (diff === "easy")   return Math.floor(Math.random() * (20 - 1 + 1)) + 1;
    if (diff === "normal") return Math.floor(Math.random() * (40 - 20 + 1)) + 20;
    if (diff === "hard")   return Math.floor(Math.random() * (80 - 40 + 1)) + 40;
    return 10;
}
function markLevelDone() {
  if (levelCompleted) return;
  levelCompleted = true;
  if (currentMode === "daily") {
    const today = new Date().toDateString();
    if (localStorage.getItem("daily_" + today) === "done") {
      alert("✅ You've already completed today's puzzle!");
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
      msg.innerHTML = `🌞 Daily Puzzle Complete!<br>💰 You earned <b>${reward}</b> ⭐ coins!`;
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
  const key = `${currentDifficulty}-${currentCat}-level${lockedLevel}`;
  const saved = JSON.parse(localStorage.getItem(key) || "{}");
  if (saved.completed) return;
  const reward = getRewardForDifficulty(currentDifficulty);
  coins += reward;
  localStorage.setItem("coins", coins);
  updateCoinDisplay();
  const elapsedMs = stopTimer();
  saved.completed = true;
  saved.timeMs = elapsedMs;
  localStorage.setItem(key, JSON.stringify(saved));
  currentLevel = lockedLevel + 1;
  unlockNextLevel();
  checkAchievements();
  const popup = document.getElementById("levelPopup");
  const msg = popup.querySelector(".popup-message");
  if (msg)
    msg.innerHTML = `🎉 Level Complete!<br>💰 You earned <b>${reward}</b> ⭐ coins!`;
  console.log("Popup found?", popup);
  popup.classList.remove("hidden");
  const backbtn = document.getElementById("backbtn");
  if (backbtn) {
  backbtn.onclick = function () {
    waitForButtonActive(function () {
      popup.classList.add("hidden");
      goto("levels");
    });
  };
 }
 const nextBtn = document.getElementById("nextLevelbutton");
  if (nextBtn) {
  nextBtn.onclick = function() {
    waitForButtonActive(function () {
      popup.classList.add("hidden");
      goto("game");
      startLevel();
    });
  };
 }
const restartBtn = document.getElementById("restartLevelbutton");
if (restartBtn) {
  restartBtn.onclick = function () {
    waitForButtonActive(function () {
      popup.classList.add("hidden");
      levelCompleted = false;
      currentLevel = currentLevel - 1;
      const key = `${currentDifficulty}-${currentCat}-level${currentLevel}`;
      let saved;
      try {
        saved = JSON.parse(localStorage.getItem(key) || "{}");
      } catch (e) {
        saved = {};
      }
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
        c.style.color = '';
      });
      document.querySelectorAll('.word-item').forEach(w =>
        w.classList.remove('word-found')
      );
      goto("game");
      startLevel();
    });
  };
 }
}
function handleTimeUp(){
  stopTimer();
  const popup = document.getElementById("levelPopup");
  const msg = popup.querySelector(".popup-message");
  msg.innerHTML = "⏱️ Time's up! Game Over.";
  popup.classList.remove("hidden");
  document.getElementById("closePopup").onclick = () => {
    popup.classList.add("hidden");
    goto("levels");
  };
}
function rewardCoins() {
  const reward = Math.floor(Math.random() * 11) + 10;
  coins += reward;
  localStorage.setItem("coins", coins);
  updateCoinDisplay();
  showPopup(` You earned ${reward} coins!`);
}