
function waitForButtonActive(callback, delay = 120) {
  setTimeout(() => {
    try { callback(); } catch (e) {}
  }, delay);
}




