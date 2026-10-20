
function waitForButtonActive(callback, delay = 120) {
  setTimeout(() => {
    try { callback(); } catch (e) {}
  }, delay);
}

let progress = 0;
const bar = document.getElementById("loading-bar");
const text = document.getElementById("loading-text");
const splash = document.getElementById("splash-screen");
const loadingInterval = setInterval(() => {
    progress++;
    bar.style.width = progress + "%";
    text.innerText = "Loading... " + progress + "%";
    if(progress >= 100){
        clearInterval(loadingInterval);
        setTimeout(() => {
            splash.style.display = "none";
        }, 300);
    }
}, 25);
function sendFeedback() {
  const email = "mulchandanivijay58@gmail.com";
  const subject = "Word Nova - Feedback";
  const body = "Hello Word Nova Developer,\n\nI would like to share my feedback about Word Nova.";

  const mailto =
    `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  // Try opening the device's email app
  window.open(mailto, "_system");
}