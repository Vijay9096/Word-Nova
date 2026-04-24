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
    console.warn('Menu elements not found in DOM.');
    return;
  }
  const _triggerMenu = typeof window.triggerMenuAnimation === 'function'
    ? window.triggerMenuAnimation
    : (sel, open = true, duration = 420) => {
        const el = document.querySelector(sel);
        if (!el) return;
        if (open) el.classList.remove('hidden');
        else el.classList.add('hidden');
      };
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    _triggerMenu('#menu-popup', true, 420);
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
  if (!(typeof currentDifficulty === 'string' && currentDifficulty.trim())) {
    currentDifficulty = localStorage.getItem('currentDifficulty') || 'easy';
  }
  const diff = String(currentDifficulty).trim();
  if (!unlockedLevels[diff]) unlockedLevels[diff] = {};
  if (!Array.isArray(unlockedLevels[diff][currentCat]) || unlockedLevels[diff][currentCat].length === 0) {
    unlockedLevels[diff][currentCat] = [1];
  }
  unlockedLevels[diff][currentCat] = unlockedLevels[diff][currentCat].map(x => Number(x) || 1);
  for (let i = 0; i < 100; i++) {
    const levelNumber = i + 1;
    const b = document.createElement('div');
    b.textContent = `Level ${levelNumber}`;
    b.className = "level-btn";
    b.setAttribute('role', 'button');
    b.setAttribute('data-button', '1');
    b.tabIndex = 0;
    const keyForCheck = `${diff}-${currentCat}-level${levelNumber - 1}`;
    const d = JSON.parse(localStorage.getItem(keyForCheck) || "null");
    if (d && (d.completed || d.status === "done")) {
      b.classList.add('completed');
    }
    const isUnlocked = unlockedLevels[diff][currentCat].includes(levelNumber);
    if (!isUnlocked) {
      b.classList.add('locked');
      b.style.backgroundColor = "#888";
      b.style.color = "#fff";
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