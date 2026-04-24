function renderGrid(size) {
  const g = document.getElementById('grid');
  g.style.gridTemplateColumns = `repeat(${size},1fr)`; g.innerHTML = "";
  let html = "";
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      html += `<div class="cell" data-row="${r}" data-col="${c}">${boardData[r][c]}</div>`;
    }
  }
  g.innerHTML = html;
  enableDrag();
}
function renderWordList(words) {
  const div = document.getElementById('word-list'); div.innerHTML = "";
  words.forEach(w => {
    const span = document.createElement('span');
    span.id = `word-${w}`; span.textContent = w;
    span.className = 'word-item'; div.appendChild(span);
  });
}
function enableDrag() {
  const g = document.getElementById('grid');
  if (!g) return;
  const MIN_DRAG_DISTANCE = 6; 
  let pendingStartCell = null;
  let startX = 0, startY = 0;
  let startCell = null;
  let pointerDown = false;
  let lastTouchId = null;
  let suppressNextClickUntil = 0;
  function cellAt(x, y) { 
    return document.elementFromPoint(x, y)?.closest('.cell'); 
  }
  function activateStartCell() {
    if (!pendingStartCell) return;
    pendingStartCell.classList.remove('pressing');
    startCell = pendingStartCell;
    triggerCellRipple(startCell, { size: 'medium', duration: 420 });
    pendingStartCell = null;
    try { triggerCellPulse(startCell); } catch (_) {}
    highlightLine(startCell);
    try { navigator.vibrate(8); } catch (_) {}
  }
  function begin(cell, x, y, touchId) {
    if (!cell) return;
    pendingStartCell = cell;
    pendingStartCell.classList.add('pressing');
    triggerCellRipple(pendingStartCell, { size: 'small', duration: 360 });
    startX = x;
    startY = y;
    pointerDown = true;
    lastTouchId = touchId;
  }
  function move(cell, x, y, touchId) {
    if (!pointerDown) return;
    if (touchId !== lastTouchId) return;
    const dx = x - startX;
    const dy = y - startY;
    const distSq = dx*dx + dy*dy;
    if (!startCell) {
      if (distSq >= MIN_DRAG_DISTANCE * MIN_DRAG_DISTANCE) {
        activateStartCell();
      } else {
        return;
      }
    }
    if (!startCell || !cell) return;
    highlightLine(cell);
  }
  function end(touchId) {
    if (touchId !== lastTouchId) return;
    pointerDown = false;
    lastTouchId = null;
    if (pendingStartCell && !startCell) {
      pendingStartCell.classList.remove('pressing');
      pendingStartCell = null;
      suppressNextClickUntil = performance.now() + 260;
      return;
    }
    if (!startCell) {
      pendingStartCell = null;
      return;
    }
    const sel = [...g.querySelectorAll('.cell.dragging')];
    try { checkSelection(sel); } catch (_) {}
    g.querySelectorAll('.cell.dragging')
     .forEach(el => el.classList.remove('dragging'));
    startCell = null;
  }
  function highlightLine(endCell) {
    if (!startCell && pendingStartCell) {
      pendingStartCell.classList.add('dragging');
      return;
    }
    if (!startCell || !endCell) return;
    g.querySelectorAll('.cell.dragging')
     .forEach(el => el.classList.remove('dragging'));
    const r0 = +startCell.dataset.row;
    const c0 = +startCell.dataset.col;
    const r1 = +endCell.dataset.row;
    const c1 = +endCell.dataset.col;
    const dr = Math.sign(r1 - r0);
    const dc = Math.sign(c1 - c0);
    if (dr === 0 && dc === 0) {
      startCell.classList.add('dragging');
      return;
    }
    if (Math.abs(r1 - r0) !== 0 &&
        Math.abs(c1 - c0) !== 0 &&
        Math.abs(r1 - r0) !== Math.abs(c1 - c0))
      return;
    let r = r0, c = c0;
    while (true) {
      const el = g.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
      if (el) el.classList.add('dragging');
      if (r === r1 && c === c1) break;
      r += dr;
      c += dc;
    }
  }
  function firstTouch(t) {
    return t && ({
      id: t.identifier,
      x: t.clientX,
      y: t.clientY
    });
  }
  g.ontouchstart = e => {
    const t = firstTouch(e.touches[0]);
    begin(cellAt(t.x, t.y), t.x, t.y, t.id);
    e.preventDefault();
  };
  g.ontouchmove = e => {
    const t = firstTouch(e.touches[0]);
    move(cellAt(t.x, t.y), t.x, t.y, t.id);
    e.preventDefault();
  };
  g.ontouchend = e => {
    const ct = e.changedTouches[0];
    end(ct.identifier);
    e.preventDefault();
  };
  g.addEventListener("click", ev => {
    if (performance.now() < suppressNextClickUntil) {
      ev.stopImmediatePropagation();
      ev.preventDefault();
      suppressNextClickUntil = 0;
    }
  }, true);
}
function match(a, b) { return a.length === b.length && a.every((v, i) => v[0] === b[i][0] && v[1] === b[i][1]); }