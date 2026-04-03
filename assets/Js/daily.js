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
      statusEl.textContent = " You already completed today's Daily Puzzle!";
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
      ? " You already completed today's puzzle!"
      : " Ready to play today's challenge!";
  }
}
function startDailyPuzzle() {
  const today = new Date().toDateString();
  const completed = localStorage.getItem("daily_" + today);
  if (completed) {
    showPopup(" You already completed today's Daily Puzzle!");
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
  document.getElementById("game-title").textContent = "ðŸŒž Daily Puzzle";
}
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
     if (claimBtn) {
    claimBtn.addEventListener("click", function () {
      waitForButtonActive(function () {
        claimTodayReward();
      });
    });
  }
    document.querySelectorAll("#daily-calendar .day-tile, .day7-row .day-tile")
      .forEach(function (tile) {
      tile.addEventListener("click", function () {
        waitForButtonActive(function () {
          const d = Number(tile.dataset.day); 
          const r = (typeof DAILY_REWARDS !== "undefined" && (DAILY_REWARDS[d] || DAILY_REWARDS[d - 1])) || { coins: 0, hints: 0 };
          showPopup(`Day ${d} reward: ${r.coins}⭐ ${r.hints ? ('+' + r.hints + ' hints') : ''}`);
        });
      });
    });
    refreshDailyUI();
  });
  window.dailyRewardsRefreshUI = refreshDailyUI;
})();