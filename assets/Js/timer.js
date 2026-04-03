(function(){
  window._timer = { intervalId:null, startTs:0, elapsedMs:0, maxMs:0, expireId:null, onExpire:null };
  function formatTime(ms){
    const t = Math.floor(ms/1000), m = Math.floor(t/60), s = t%60;
    return String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
  }
  function showTimerOnlyIfHard(isHard){
    const el = document.getElementById('timer');
    el.style.display = isHard ? "" : "none";
  }
  window.showTimerOnlyIfHard = showTimerOnlyIfHard;
  window.setTimerLimit = function(ms, onExpire){
    const st = window._timer;
    st.maxMs = ms;
    st.onExpire = onExpire;
  }
  window.startTimer = function(){
  const st = window._timer;
  const endAt = Date.now() + st.maxMs;
  if(st.intervalId) clearInterval(st.intervalId);
  st.intervalId = setInterval(()=>{
    const msLeft = endAt - Date.now();
    st.elapsedMs = st.maxMs - Math.max(msLeft, 0);
    const show = Math.max(0, msLeft);
    document.getElementById("timer").textContent = formatTime(show);
    if (msLeft <= 0) {
      clearInterval(st.intervalId);
      st.intervalId = null;
      document.getElementById("timer").textContent = "00:00";
      if (typeof st.onExpire === "function") st.onExpire();
    }
  }, 200);
  document.getElementById("timer").textContent = formatTime(st.maxMs);
};
  window.stopTimer = function(){
    const st = window._timer;
    if(st.intervalId) clearInterval(st.intervalId);
    if(st.expireId) clearTimeout(st.expireId);
    return st.elapsedMs;
  }
  window.resetTimer = function(){
    const st = window._timer;
    if(st.intervalId) clearInterval(st.intervalId);
    if(st.expireId) clearTimeout(st.expireId);
    st.elapsedMs = 0;
    st.maxMs = 0;
    st.onExpire = null;
    document.getElementById('timer').textContent = "00:00";
  }
  window.getElapsedMs = () => window._timer.elapsedMs;
})();