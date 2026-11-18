/* ============================================================
   ui.js — Overlay UI (bottom-right corner)
   Mode badge, live position, and the mouse + keyboard
   control legend for walking and bird (flying) mode.
   ============================================================ */
window.UI = (function () {
  'use strict';

  let modeEl, posEl, promptEl;

  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function init() {
    /* ---- bottom-right control panel ---- */
    const hud = el('div', 'hud');
    hud.appendChild(el('div', 'hud-title', 'ROMA &middot; AETERNA'));
    hud.appendChild(el('div', 'hud-sub', 'Imperial Rome &middot; the Seven Hills'));
    modeEl = el('div', 'hud-mode walk', 'ON FOOT');
    hud.appendChild(modeEl);
    posEl = el('div', 'hud-pos', '');
    hud.appendChild(posEl);

    const help = el('div', 'hud-help');
    help.innerHTML =
      '<div class="hud-help-title">CONTROLS</div>' +
      '<table>' +
      '<tr><td class="k">Mouse</td><td>look around</td></tr>' +
      '<tr><td class="k">W A S D</td><td>walk / fly</td></tr>' +
      '<tr><td class="k">Shift</td><td>run (or fly fast)</td></tr>' +
      '<tr><td class="k">Space</td><td>jump &middot; in bird mode: rise</td></tr>' +
      '<tr><td class="k">C</td><td>in bird mode: descend</td></tr>' +
      '<tr><td class="k">B</td><td>bird mode (fly over the city)</td></tr>' +
      '<tr><td class="k">Esc</td><td>release the mouse</td></tr>' +
      '</table>';
    hud.appendChild(help);
    document.body.appendChild(hud);

    /* ---- crosshair ---- */
    document.body.appendChild(el('div', 'crosshair', '+'));

    /* ---- click-to-enter prompt ---- */
    promptEl = el('div', 'prompt');
    promptEl.innerHTML = '<div class="prompt-box">' +
      '<div class="prompt-title">ROMA AETERNA</div>' +
      '<div>Click to walk the streets of Imperial Rome</div>' +
      '<div class="prompt-sub">Press B anytime to rise like a bird above the city</div>' +
      '</div>';
    document.body.appendChild(promptEl);
  }

  function setMode(bird) {
    if (!modeEl) return;
    modeEl.textContent = bird ? 'BIRD FLIGHT' : 'ON FOOT';
    modeEl.className = 'hud-mode ' + (bird ? 'bird' : 'walk');
    document.body.classList.toggle('bird', bird);
  }

  function setPos(x, z) {
    if (posEl) posEl.textContent =
      'Pos ' + Math.round(x) + ' E, ' + Math.round(z) + ' S';
  }

  function setLocked(locked) {
    if (promptEl) promptEl.style.display = locked ? 'none' : 'flex';
  }

  return { init: init, setMode: setMode, setPos: setPos, setLocked: setLocked };
})();
