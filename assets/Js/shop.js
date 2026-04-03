function renderShop() {
  coins = getSavedCoins();
  updateCoinDisplay();
  const shopCoinEl = document.getElementById("shopCoins");
  if (shopCoinEl) shopCoinEl.textContent = `⭐ Coins: ${coins}`;
  const grid = document.getElementById("theme-shop-grid");
  if (!grid) return;
  grid.innerHTML = "";
  window.waitForButtonActive = window.waitForButtonActive || function(cb, delay = 120) {
    setTimeout(function() { try { cb(); } catch (e) {} }, delay);
  };
  const unlockedThemes = JSON.parse(localStorage.getItem("unlockedThemes") || "[]");
  THEMES.forEach(function(t, i) {
    if (i === 0) return;
    const btn = document.createElement("button");
    btn.className = "theme-shop-btn";
    const themeName = (t && (t.name || t.id)) || String(t);
    const cost = THEME_PRICES && (THEME_PRICES[themeName] || 0);
    if (unlockedThemes.includes(themeName)) {
      btn.textContent = themeName + " ✓";
      btn.disabled = true;
      btn.style.opacity = "0.7";
      btn.style.cursor = "default";
      btn.title = "Unlocked — apply from Theme Settings!";
    } else {
      btn.textContent = `${themeName}—${cost}⭐`;
      btn.addEventListener("click", function() {
        waitForButtonActive(async function() {
          if (btn.disabled) return;
          btn.disabled = true;
          const oldText = btn.textContent;
          btn.textContent = "Buying...";
          try {
            const res = buyTheme(themeName);
            if (res && typeof res.then === "function") await res;
            const refreshedUnlocked = JSON.parse(localStorage.getItem("unlockedThemes") || "[]");
            if (refreshedUnlocked.includes(themeName)) {
              btn.textContent = themeName + " ✓";
              btn.style.opacity = "0.7";
              btn.style.cursor = "default";
              btn.disabled = true;
              btn.title = "Unlocked — apply from Theme Settings!";
            } else {
              btn.textContent = oldText;
              btn.disabled = false;
            }
          } catch (err) {
            console.warn("buyTheme error:", err);
            btn.textContent = oldText;
            btn.disabled = false;
          }
        }, 140);
      }, { passive: true });
    }
    grid.appendChild(btn);
  });
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
function buyHintPack(amount, cost) {
  coins = Number(localStorage.getItem("coins") || 0);
  hints = Number(localStorage.getItem("hints") || 0);
  if (coins < cost) {
    showPopup(` You bought +${amount} hints for ${cost} coins!`);
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
function showChestPopup(type, coinsGained, hintsGained) {
  const popup = document.getElementById("universalPopup");
  const msg = document.getElementById("popup-message");
  const btn = document.getElementById("popup-ok");
  const chestEmoji =
    type === "legendary" ? "👑" :
    type === "rare" ? "💎" : "🟩";
  msg.innerHTML = `
    ${chestEmoji} <b>${type.toUpperCase()} CHEST OPENED!</b><br>
    💰 +${coinsGained} Coins<br>
    💡 +${hintsGained} Hints`;
  popup.classList.remove("hidden");
  btn.onclick = () => {
    popup.classList.add("hidden");
  };
}
function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}