function getSavedCoins() {
  const saved = Number(localStorage.getItem("coins"));
  return isNaN(saved) ? 0 : saved;
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