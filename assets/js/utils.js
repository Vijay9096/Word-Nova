
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
