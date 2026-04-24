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
function toggleColorblindMode() {
  let enabled = localStorage.getItem("colorblind") === "1";
  enabled = !enabled; // flip state
  localStorage.setItem("colorblind", enabled ? "1" : "0");
  document.body.classList.toggle("colorblind", enabled);
  const btn = document.getElementById("toggle-colorblind-btn");
  if (btn) btn.textContent = enabled ? "🎨 Colorblind: ON" : "🎨 Colorblind: OFF";
}
function togglePerformanceMode() {
  let enabled = localStorage.getItem("performance") === "1";
  enabled = !enabled; // flip state
  localStorage.setItem("performance", enabled ? "1" : "0");
  document.body.classList.toggle("performance", enabled);
  const btn = document.getElementById("toggle-performance-btn");
  if (btn) btn.textContent = enabled ? "⚡ Performance: ON" : "⚡ Performance: OFF";
  window.GAME_PERFORMANCE_MODE = enabled;
}
document.addEventListener("DOMContentLoaded", () => {
  const cb = localStorage.getItem("colorblind") === "1";
  const perf = localStorage.getItem("performance") === "1";
  document.body.classList.toggle("colorblind", cb);
  document.body.classList.toggle("performance", perf);
  const btnCB = document.getElementById("toggle-colorblind-btn");
  if (btnCB) btnCB.textContent = cb ? "🎨 Colorblind: ON" : "🎨 Colorblind: OFF";
  const btnPF = document.getElementById("toggle-performance-btn");
  if (btnPF) btnPF.textContent = perf ? "⚡ Performance: ON" : "⚡ Performance: OFF";
});
function triggerWrongShake() {
    const grid = document.getElementById("grid");
    grid.classList.add("shake");
    setTimeout(() => {
        grid.classList.remove("shake");
    }, 400);
    if (navigator.vibrate) {
        navigator.vibrate([200, 100, 60, 40, 60]);
    }
}
const _AUDIO = { ctx: null };
function playTapSound() {
  try {
    if (!_AUDIO.ctx) _AUDIO.ctx = new (window.AudioContext || window.webkitAudioContext)();
    const ctx = _AUDIO.ctx;
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = 300;
    gain.gain.value = 0.12;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.07);
  } catch (e) {
    console.warn('playTapSound failed', e);
  }
}
document.addEventListener("pointerdown", e => {
  const btn = e.target.closest('button, [role="button"], a[data-button], [data-button], .level-btn');
  if (!btn) return;
  if (btn.disabled) return;
  playTapSound();
});
let audioCtx;
let musicEnabled = true;
let isPlaying = false;

function startGeneratedMusic() {
  if (!musicEnabled || isPlaying) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = audioCtx.createOscillator();
  osc.type = "sine";
  const gainNode = audioCtx.createGain();
  gainNode.gain.value = 0.15;
  osc.connect(gainNode).connect(audioCtx.destination);
  let note = 220;
  osc.frequency.setValueAtTime(note, audioCtx.currentTime);
  setInterval(() => {
    if (!musicEnabled) return;
    note = [220, 247, 262, 294, 330][Math.floor(Math.random() * 5)];
    osc.frequency.setValueAtTime(note, audioCtx.currentTime);
  }, 600);
  osc.start();
  isPlaying = true;
}

function toggleMusic() {
  musicEnabled = !musicEnabled;
  if (!musicEnabled && audioCtx) {
    audioCtx.suspend();
  } else if (musicEnabled && audioCtx) {
    audioCtx.resume();
  }
}
document.getElementById("music-toggle").addEventListener("change", toggleMusic);
function dropConfettiFromCenterAllDir(count = 30) {
  const grid = document.getElementById("grid");
  if (!grid) return;
  const rect = grid.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;
  for (let i = 0; i < count; i++) {
    const c = document.createElement("div");
    c.className = "confetti";
    c.style.backgroundColor = `hsl(${Math.random() * 360}, 80%, 60%)`;
    c.style.left = (originX - 4) + "px";
    c.style.top = (originY - 4) + "px";
    const angle = Math.random() * Math.PI * 2;
    const minR = Math.min(rect.width, rect.height) * 0.18;
    const maxR = Math.max(rect.width, rect.height) * 0.9;
    const r = minR + Math.random() * (maxR - minR);
    const dx = Math.round(Math.cos(angle) * r);
    const dy = Math.round(Math.sin(angle) * r);
    const gravityLift = Math.random() < 0.45 ? -Math.random() * 20 : 0;
    const rot = Math.round(Math.random() * 720 - 360) + "deg";
    c.style.setProperty("--dx", (dx) + "px");
    c.style.setProperty("--dy", (dy + gravityLift) + "px");
    c.style.setProperty("--rot", rot);
    const dur = 900 + Math.random() * 900; // 900ms - 1800ms
    c.style.animationDuration = dur + "ms";
    c.style.animationDelay = (Math.random() * 120) + "ms";
    document.body.appendChild(c);
    setTimeout(() => c.remove(), dur + 200 + (parseFloat(c.style.animationDelay) || 0));
  }
}
function triggerCellPulse(cell, duration = 450) {
  if (!cell) return;
  cell.classList.remove("pulse");
  void cell.offsetWidth;
  cell.classList.add("pulse");
  setTimeout(() => {
    cell.classList.remove("pulse");
  }, duration + 30);
}
function triggerLevelIntro(selector = "#grid", duration = 6000) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.style.setProperty("--intro-duration", duration + "ms");
  el.classList.remove("level-intro");
  void el.offsetWidth;
  el.classList.add("level-intro");
  setTimeout(() => {
    el.classList.remove("level-intro");
  }, duration + 50);
}
function triggerLevelOutro(selector = "#grid", duration = 1200, callback) {
  const el = document.querySelector(selector);
  if (!el) { if (callback) callback(); return; }
  el.style.setProperty("--outro-duration", duration + "ms");
  el.classList.remove("level-outro");
  void el.offsetWidth;
  el.classList.add("level-outro");
  setTimeout(() => {
    el.classList.remove("level-outro");
    if (typeof callback === "function") callback();
  }, duration + 40);
}
function dropBurstConfetti(count = 50) {
  const grid = document.getElementById("grid");
  if (!grid) return;
  const rect = grid.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;
  for (let i = 0; i < count; i++) {
    const c = document.createElement("div");
    c.className = "confetti";
    c.style.backgroundColor = `hsl(${Math.random() * 360}, 90%, 60%)`;
    c.style.left = (originX - 4) + "px";
    c.style.top = (originY - 4) + "px";
    const angle = Math.random() * Math.PI * 2;
    const r = rect.width * (0.5 + Math.random() * 1.3);
    const dx = Math.cos(angle) * r;
    const dy = Math.sin(angle) * r;
    const rot = (Math.random() * 800 - 400) + "deg";
    c.style.setProperty("--dx", dx + "px");
    c.style.setProperty("--dy", dy + "px");
    c.style.setProperty("--rot", rot);
    c.style.animationDuration = (700 + Math.random() * 400) + "ms";
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 1200);
  }
}
function triggerWordPop(wordEl, sparkleCount = 8) {
  if (!wordEl) return;
  wordEl.classList.remove("word-pop");
  void wordEl.offsetWidth;
  wordEl.classList.add("word-pop");
  emitWordSparkles(wordEl, sparkleCount);
}
function emitWordSparkles(wordEl, count = 8) {
  const rect = wordEl.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;
  for (let i = 0; i < count; i++) {
    const s = document.createElement("div");
    s.className = "word-sparkle";
    s.style.backgroundColor = `hsl(${Math.random() * 60 + 180}, 80%, ${55 + Math.random()*10}%)`; // teal-ish sparkles; tweak if you want
    s.style.left = (originX - 3) + "px";
    s.style.top = (originY - 3) + "px";
    const angle = Math.random() * Math.PI * 2;
    const distance = 20 + Math.random() * 48; // how far it flies
    const dx = Math.round(Math.cos(angle) * distance);
    const dy = Math.round(Math.sin(angle) * distance);
    s.style.setProperty("--sx", dx + "px");
    s.style.setProperty("--sy", dy + "px");
    s.style.setProperty("--srot", (Math.random()*720 - 360) + "deg");
    s.style.animationDuration = (420 + Math.random()*240) + "ms";
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 800 + Math.random()*200);
  }
}
function triggerMenuAnimation(popupSelector = "#menu-popup", open = true, duration = 420) {
  const el = document.querySelector(popupSelector);
  if (!el) return;
  if (open) el.classList.remove("hidden");
  const cls = open ? "menu-open-anim" : "menu-close-anim";
  el.style.setProperty(open ? "--menu-open-dur" : "--menu-close-dur", duration + "ms");
  el.classList.remove("menu-open-anim", "menu-close-anim");
  void el.offsetWidth;
  el.classList.add(cls);
  setTimeout(() => {
    el.classList.remove(cls);
    if (!open) el.classList.add("hidden");
  }, duration + 20);
}
function triggerRipple(wordEl) {
  if (!wordEl) return;
  const rect = wordEl.getBoundingClientRect();
  const ripple = document.createElement("div");
  ripple.className = "word-ripple";
  const size = Math.max(rect.width, rect.height) * 1.4;
  ripple.style.width = size + "px";
  ripple.style.height = size + "px";
  ripple.style.left = (rect.left + rect.width / 2) + "px";
  ripple.style.top  = (rect.top + rect.height / 2) + "px";
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 650);
}
function waitForButtonActive(callback, delay = 120) {
  setTimeout(() => {
    try { callback(); } catch (e) {}
  }, delay);
}
function hideWordList() {
  const wl = document.getElementById('word-list');
  if (!wl) return;
  wl.classList.add('wordlist-blind');
}
function revealWordList() {
  const wl = document.getElementById('word-list');
  if (!wl) return;
  wl.classList.remove('wordlist-blind', 'wordlist-peek');
}
function peekWordList(peekMs = 00) {
  const wl = document.getElementById('word-list');
  if (!wl) return;
  wl.classList.add('wordlist-peek');
  setTimeout(() => {
    wl.classList.remove('wordlist-peek');
    wl.classList.add('wordlist-blind');
  }, Math.max(0, peekMs));
}
window.toggleBlindMode = window.toggleBlindMode || function() {
  const btn = document.getElementById('toggle-blindmode-btn');
  if (window.currentMode === "blind-list") {
    window.currentMode = "normal";
    if (btn) { btn.textContent = "🕶️ Blind Mode: OFF"; btn.classList.remove('active-blind-btn'); }
    revealWordList();
  } else {
    window.currentMode = "blind-list";
    if (btn) { btn.textContent = "🕶️ Blind Mode: ON"; btn.classList.add('active-blind-btn'); }
    hideWordList();
  }
};
window.initBlindToggleUI = function() {
  const btn = document.getElementById('toggle-blindmode-btn');
  if (!btn) return;
  if (window.currentMode === "blind-list") {
    btn.textContent = "🕶️ Blind Mode: ON";
    btn.classList.add('active-blind-btn');
    hideWordList();
  } else {
    btn.textContent = "🕶️ Blind Mode: OFF";
    btn.classList.remove('active-blind-btn');
    revealWordList();
  }
};
window.addEventListener('DOMContentLoaded', () => {
  try { initBlindToggleUI(); } catch(e) {}
});
window.triggerFireworks = window.triggerFireworks || function(options = {}) {
  try {
    if (window.GAME_PERFORMANCE_MODE) return;
    if (typeof allowConfetti === 'function' && !allowConfetti()) return;
    const {
      duration = 1800,
      perCorner = 26,
      spread = 60
    } = options || {};
    let canvas = document.getElementById('fireworks-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'fireworks-canvas';
      document.body.appendChild(canvas);
    }
    const ctx = canvas.getContext('2d');
    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(innerWidth * dpr);
      canvas.height = Math.round(innerHeight * dpr);
      canvas.style.width = innerWidth + 'px';
      canvas.style.height = innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);
    const particles = [];
    const now = performance.now();
    const endAt = now + duration;
    function rand(min, max) { return Math.random() * (max - min) + min; }
    function spawnCorner(cx, cy, baseAngleDeg) {
      for (let i = 0; i < perCorner; i++) {
        const angle = (baseAngleDeg + rand(-spread/2, spread/2)) * (Math.PI/180);
        const speed = rand(160, 420) / 1000; // px per ms
        const life = rand(duration * 0.7, duration * 1.0);
        const size = rand(2, 5);
        const hue = Math.floor(rand(0, 360));
        particles.push({
          x: cx, y: cy, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
          lifeStart: performance.now(), lifeMs: life, size, hue, alpha: 1
        });
      }
    }
    spawnCorner(0 + 20, 0 + 20, 20);
    spawnCorner(innerWidth - 20, 0 + 20, 160);
    spawnCorner(0 + 20, innerHeight - 20, -20);
    spawnCorner(innerWidth - 20, innerHeight - 20, 200);
    let rafId = null;
    function step(t) {
      const tnow = performance.now();
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        const age = tnow - p.lifeStart;
        if (age >= p.lifeMs) {
          particles.splice(i, 1);
          continue;
        }
        p.x += p.vx * (t - (p.lastT || t));
        p.y += p.vy * (t - (p.lastT || t));
        p.vy += 0.0009 * (t - (p.lastT || t)); // gravity (px per ms^2)
        p.vx *= 0.999; p.vy *= 0.999;
        p.lastT = t;
        const lifeRatio = 1 - (age / p.lifeMs);
        const alpha = Math.max(0, lifeRatio);
        ctx.beginPath();
        ctx.globalCompositeOperation = 'lighter';
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        grad.addColorStop(0, `hsla(${p.hue},100%,65%,${alpha})`);
        grad.addColorStop(0.6, `hsla(${p.hue},90%,55%,${alpha * 0.6})`);
        grad.addColorStop(1, `rgba(255,255,255,0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(p.x - p.size * 3, p.y - p.size * 3, p.size * 6, p.size * 6);
        ctx.fillStyle = `rgba(255,255,255,${Math.min(1, alpha)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
      if (tnow < endAt || particles.length) {
        rafId = requestAnimationFrame(step);
      } else {
        cancelAnimationFrame(rafId);
        window.removeEventListener('resize', resize);
        if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
      }
    }
    rafId = requestAnimationFrame(step);
  } catch (e) {
    console.warn('triggerFireworks failed', e);
  }
};
window.triggerWordRevealBlast = window.triggerWordRevealBlast || function(coords, opts = {}) {
  try {
    if (!coords || !coords.length) return;
    if (window.GAME_PERFORMANCE_MODE) return;
    const { particles = 8, life = 600, vibrateMs = 18 } = opts;
    const rects = coords.map(([r,c]) => {
      const el = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
      return el ? el.getBoundingClientRect() : null;
    }).filter(Boolean);
    if (!rects.length) return;
    const cx = rects.reduce((s, r) => s + (r.left + r.width/2), 0) / rects.length;
    const cy = rects.reduce((s, r) => s + (r.top + r.height/2), 0) / rects.length;
    const body = document.body;
    const created = [];
    for (let i = 0; i < Math.max(3, Math.floor(particles)); i++) {
      const p = document.createElement('div');
      p.className = 'wrb-particle';
      const hue = Math.floor(Math.random() * 360);
      p.style.background = `hsl(${hue},85%,60%)`;
      p.style.left = `${cx - 6 + (Math.random() * 8 - 4)}px`;
      p.style.top  = `${cy - 6 + (Math.random() * 8 - 4)}px`;
      document.body.appendChild(p);
      created.push(p);
      const angle = Math.random() * Math.PI * 2;
      const speed = (60 + Math.random()*220) / (life/16);
      const dx = Math.cos(angle) * speed;
      const dy = Math.sin(angle) * speed - 0.6;
      let start = performance.now();
      (function anim(now){
        const t = now - start;
        const ratio = Math.min(1, t / life);
        p.style.transform = `translate3d(${dx * ratio * 16}px, ${dy * ratio * 16}px, 0) scale(${1 - 0.45 * ratio})`;
        p.style.opacity = String(1 - ratio);
        if (ratio < 1) requestAnimationFrame(anim);
        else { try { p.remove(); } catch(e){} }
      })(start);
    }
    rects.forEach(r => {
      const el = document.elementFromPoint(r.left + r.width/2, r.top + r.height/2)?.closest('.cell');
      if (el) {
        el.classList.add('wrb-glow');
        setTimeout(() => el.classList.remove('wrb-glow'), 260);
      }
    });
    try { if (vibrateMs && navigator.vibrate) navigator.vibrate(vibrateMs); } catch(e){}
  } catch (e){ console.warn('wrb err', e); }
};
window.showLevelCompleteRibbon = window.showLevelCompleteRibbon || function(opts = {}) {
  try {
    const { title = 'LEVEL CLEARED', subtitle = '', duration = 1600 } = opts;
    let el = document.getElementById('levelRibbon');
    if (!el) {
      el = document.createElement('div');
      el.id = 'levelRibbon';
      el.innerHTML = `<div class="r-shine" aria-hidden="true"></div><div class="r-title"></div><div class="r-sub"></div>`;
      document.body.appendChild(el);
    }
    el.querySelector('.r-title').textContent = title;
    el.querySelector('.r-sub').textContent = subtitle || '';
    requestAnimationFrame(()=> el.classList.add('show'));
    setTimeout(()=> {
      el.classList.remove('show');
    }, duration);
    return new Promise(res => setTimeout(res, duration + 320));
  } catch(e) { console.warn('ribbon err', e); return Promise.resolve(); }
};
window.triggerCellRipple = window.triggerCellRipple || function(el, opts = {}) {
  try {
    if (!el) return;
    if (window.GAME_PERFORMANCE_MODE) return;
    const {
      color = null,
      size = 'medium',
      duration = 420
    } = opts;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const r = document.createElement('div');
    r.className = 'cell-ripple';
    if (typeof size === 'number') {
      r.style.width = r.style.height = size + 'px';
    } else {
      r.classList.add(size === 'small' ? 'small' : size === 'large' ? 'large' : 'medium');
    }
    let fill = color;
    if (!fill) {
      try {
        const bg = getComputedStyle(el).backgroundColor;
        fill = (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') ? bg : 'rgba(255,255,255,0.08)';
      } catch (e) {
        fill = 'rgba(255,255,255,0.08)';
      }
    }
    r.style.background = fill;
    r.style.left = cx + 'px';
    r.style.top  = cy + 'px';
    document.body.appendChild(r);
    requestAnimationFrame(() => {
      r.style.transform = 'translate(-50%, -50%) scale(0.98)';
      r.style.opacity = '0.95';
      requestAnimationFrame(() => {
        r.classList.add('end');
      });
    });
    setTimeout(() => {
      try { r.remove(); } catch (e) { if (r.parentNode) r.parentNode.removeChild(r); }
    }, Math.max(360, duration) + 60);
    return r;
  } catch (e) {
    console.warn('triggerCellRipple err', e);
  }
};
(function () {
  const LOOP_MS = 5000;
  let looping = false;
  let pulseTimer = null;
  function getHintBtn() { 
    return document.getElementById('hintBtn'); 
  }
  function doPulseLoop() {
    if (!looping) return;
    const btn = getHintBtn();
    if (!btn) return;
    btn.classList.remove('pulse');
    void btn.offsetWidth;
    btn.classList.add('pulse');
    pulseTimer = setTimeout(doPulseLoop, LOOP_MS);
  }
  function startLoop() {
    if (looping) return;
    looping = true;
    doPulseLoop();
  }
  function stopLoop() {
    looping = false;
    clearTimeout(pulseTimer);
    const btn = getHintBtn();
    if (btn) btn.classList.remove('pulse');
  }
  let idleTimer = null;
  const IDLE_MS = 5000;
  function resetIdle() {
    clearTimeout(idleTimer);
    stopLoop();
    idleTimer = setTimeout(startLoop, IDLE_MS);
  }
  document.addEventListener('touchstart', resetIdle, { passive: true });
  document.addEventListener('touchmove', resetIdle, { passive: true });
  window.addEventListener('wordFound', () => {
    stopLoop();
    resetIdle();
  });
  resetIdle();
})();
window.GridBreath = window.GridBreath || (function(){
  const IDLE_MS_DEFAULT = 2300; // how long to wait before breathing starts
  let idleMs = IDLE_MS_DEFAULT;
  let timer = null;
  let attached = false;
  function gridEl() { return document.getElementById('grid'); }
  function startBreath() {
    const g = gridEl();
    if (!g) return;
    if (window.GAME_PERFORMANCE_MODE) return;
    g.classList.add('grid-breathing');
  }
  function stopBreath() {
    const g = gridEl();
    if (!g) return;
    g.classList.remove('grid-breathing');
  }
  function scheduleStart() {
    clearTimeout(timer);
    timer = setTimeout(() => startBreath(), idleMs);
  }
  function resetIdleTimer() {
    clearTimeout(timer);
    stopBreath();
    scheduleStart();
  }
  function attachListeners() {
    if (attached) return;
    attached = true;
    const act = () => resetIdleTimer();
    document.addEventListener('touchstart', act, { passive: true });
    document.addEventListener('touchmove', act, { passive: true });
    document.addEventListener('mousedown', act, { passive: true });
    document.addEventListener('mousemove', act, { passive: true });
    document.addEventListener('keydown', act, { passive: true });
    window.addEventListener('levelStart', resetIdleTimer);
    window.addEventListener('wordFound', resetIdleTimer);
    scheduleStart();
  }
  const api = {
    attach: attachListeners,
    start: startBreath,
    stop: stopBreath,
    setIdle(ms) { idleMs = Math.max(300, Number(ms) || IDLE_MS_DEFAULT); resetIdleTimer(); },
    isAttached() { return attached; }
  };
  document.addEventListener('DOMContentLoaded', () => {
    try { attachListeners(); } catch(e){ console.warn('GridBreath attach failed', e); }
  });  return api;
})();
window.triggerWordListSlideIn = function() {
  const wl = document.getElementById("word-list");
  if (!wl) return;
  if (window.GAME_PERFORMANCE_MODE) {
    wl.style.opacity = "1";
    wl.style.transform = "none";
    wl.classList.remove("wordlist-slide-in");
    return;
  }
  wl.classList.remove("wordlist-slide-in");
  void wl.offsetWidth;
  wl.classList.add("wordlist-slide-in");
};
window.showStartLevelToast = window.showStartLevelToast || function (msg = "Level Start!", duration = 1400) {
  try {
    const toast = document.createElement("div");
    toast.className = "start-level-toast";
    toast.textContent = msg;
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.classList.add("show");
    });
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        try { toast.remove(); } catch (_) {}
      }, 380);
    }, duration);
  } catch (e) {
    console.warn("Start Toast failed:", e);
  }
};