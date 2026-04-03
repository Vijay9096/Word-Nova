const ACHIEVEMENTS = [
  { id: 'first_steps', name: 'First Steps', desc: 'Complete your first level.' },
  { id: 'word_hunter', name: 'Word Hunter', desc: 'Complete 5 total levels.' },
  { id: 'puzzle_master', name: 'Puzzle Master', desc: 'Complete 10 total levels.' },
  { id: 'word_wizard', name: 'Word Wizard', desc: 'Complete 15 total levels.' },
  { id: 'brainiac', name: 'Brainiac', desc: 'Complete 20 total levels.' },
  { id: 'speed_runner', name: 'Speed Runner', desc: 'Complete 25 total levels.' },
  { id: 'puzzle_champion', name: 'Puzzle Champion', desc: 'Complete 30 total levels.' },
  { id: 'letter_legend', name: 'Letter Legend', desc: 'Complete 35 total levels.' },
  { id: 'vocabulary_king', name: 'Vocabulary King', desc: 'Complete 40 total levels.' },
  { id: 'ultimate_solver', name: 'Ultimate Solver', desc: 'Complete 45 total levels.' },
  { id: 'ultimate_champion', name: 'Ultimate Champion', desc: 'Complete 50 total levels.' },
  { id: 'level_10', name: 'Level 10 Complete', desc: 'Reach level 10 in any category.' },
  { id: 'level_20', name: 'Level 20 Complete', desc: 'Reach level 20 in any category.' },
  { id: 'level_30', name: 'Level 30 Complete', desc: 'Reach level 30 in any category.' },
  { id: 'all_levels', name: 'All Levels Done', desc: 'Finish all 50 levels in a category.' },
  { id: 'night_owl', name: 'Night Owl', desc: 'Play between midnight and 5 AM.' },
  { id: 'early_bird', name: 'Early Bird', desc: 'Play between 6 AM and 9 AM.' },
  { id: 'all_words_found', name: 'All Words Found', desc: 'Find every word in a puzzle.' },
  { id: 'all_colors_found', name: 'All Colors Found', desc: 'Find 5+ different word colors.' },
  { id: 'secret_finder', name: 'Secret Finder', desc: 'Find the hidden “SECRET” word.' },
  { id: 'hidden_word_hunter', name: 'Hidden Word Hunter', desc: 'Find hidden or bonus words.' },
  { id: 'perfect_grid', name: 'Perfect Grid', desc: 'Complete a grid with all words found.' },
  { id: 'daily_streak_3', name: 'Daily Streak 3', desc: 'Play 3 levels in a row.' },
  { id: 'daily_streak_7', name: 'Daily Streak 7', desc: 'Play 7 levels in a row.' },
  { id: 'daily_streak_14', name: 'Daily Streak 14', desc: 'Play 14 levels in a row.' },
  { id: 'daily_master', name: 'Daily Master', desc: 'Maintain a long play streak.' },
  { id: 'word_collector', name: 'Word Collector', desc: 'Find 20 words total.' },
  { id: 'word_conqueror', name: 'Word Conqueror', desc: 'Find 30 words total.' },
  { id: 'word_detective', name: 'Word Detective', desc: 'Find 40 words total.' },
  { id: 'word_genius', name: 'Word Genius', desc: 'Find 50 words total.' },
  { id: 'word_marathon', name: 'Word Marathon', desc: 'Find 75 words total.' },
  { id: 'word_master', name: 'Word Master', desc: 'Find 150 words total.' },
  { id: 'puzzle_explorer', name: 'Puzzle Explorer', desc: 'Complete 10 puzzles overall.' },
  { id: 'grid_master', name: 'Grid Master', desc: 'Complete 15 puzzles overall.' },
  { id: 'brain_master', name: 'Brain Master', desc: 'Complete 30 puzzles overall.' },
  { id: 'mystery_solver', name: 'Mystery Solver', desc: 'Solve a secret level.' },
  { id: 'champion_finder', name: 'Champion Finder', desc: 'Complete 45 puzzles overall.' },
  { id: 'grand_master', name: 'Grand Master', desc: 'Complete 50 puzzles overall.' },
  { id: 'collector', name: 'Collector', desc: 'Unlock 10 achievements.' },
  { id: 'achievement_collector', name: 'Achievement Collector', desc: 'Unlock 20 achievements.' },
  { id: 'legendary_solver', name: 'Legendary Solver', desc: 'Unlock almost every achievement.' },
  { id: 'secret_hero', name: 'Secret Hero', desc: 'Unlock all 50 achievements.' },
  { id: 'explorer', name: 'Explorer', desc: 'Play puzzles from 3 different categories.' },
  { id: 'quick_solver', name: 'Quick Solver', desc: 'Finish a puzzle under 60 seconds.' },
  { id: 'perfectionist', name: 'Perfectionist', desc: 'Complete a puzzle without mistakes.' },
  { id: 'marathoner', name: 'Marathoner', desc: 'Play 10 puzzles in one session.' },
  { id: 'lucky_letter', name: 'Lucky Letter', desc: 'Find a rare hidden word combo.' },
  { id: 'puzzle_genius', name: 'Puzzle Genius', desc: 'Solve 100 puzzles total.' },
  { id: 'letter_collector', name: 'Letter Collector', desc: 'Find 100 total letters.' },
  { id: 'super_solver', name: 'Super Solver', desc: 'Solve 200 puzzles total.' } // ✅ new one added to make 50
];
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
function unlockAchievement(id) {
	if (currentMode === "daily") return;
  if (!isUnlocked(id)) {
    unlockedAchievements.push(id);
    saveAchievements();
    renderAchievements?.();
    console.log("🏆 Achievement unlocked:", id);
    showAchievementPopup(ACHIEVEMENTS.find(a => a.id === id)?.name || id);
  }
}
function isUnlocked(id) {
  return unlockedAchievements.includes(id);
}
function renderAchievements() {
  const list = document.getElementById("achievement-list");
  if (!list) return;
  list.innerHTML = "";
  ACHIEVEMENTS.forEach(ach => {
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
  console.log(`🎯 Rendered ${ACHIEVEMENTS.length} achievements`);
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
  okBtn.addEventListener("click", function () {
  waitForButtonActive(function () {
    popup.classList.add("hidden");
  });
});
  if (true) {
    
  }document.getElementById("achievements-screen").addEventListener("click", (e) => {
    const btn = e.target.closest(".achievement-btn");
    if (!btn) return;
    const id = btn.dataset.id;
    const ach = ACHIEVEMENTS.find(a => a.id === id);
    if (!ach) return;
    titleEl.textContent = ach.name;
    descEl.textContent = ach.desc;
    popup.classList.remove("hidden");
  });
});
function saveAchievements() { localStorage.setItem("unlockedAchievements", JSON.stringify(unlockedAchievements)); }