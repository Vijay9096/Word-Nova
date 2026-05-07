function showPopup(message) {
  const popup = document.getElementById("universalPopup");
  const msg = document.getElementById("popup-message");
  const ok = document.getElementById("popup-ok");
  if (!popup || !msg || !ok) {
    console.warn("Popup HTML missing.");
    return;
  }
  msg.innerHTML = message;
  popup.classList.remove("hidden");
  ok.onclick = function() {
    waitForButtonActive(function() {
      popup.classList.add("hidden");
    }, 120);
  };
}