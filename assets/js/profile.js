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
    console.warn("âš ï¸ Some profile elements not found â€” check HTML IDs.");
    return;
  }
  nameEl.textContent = `🧑 Name: ${name}`;
  progressEl.textContent = `🏁 Levels Completed: ${completed}`;
  wordsEl.textContent = `🔤 Words Found: ${totalWords}`;
  achievementsEl.textContent = `🏆 Achievements Unlocked: ${achievements}`;
  themeEl.textContent = `🎨 Current Theme: ${themeName}`;
  coinsEl.textContent = ` Coins: ${coins}`;
}