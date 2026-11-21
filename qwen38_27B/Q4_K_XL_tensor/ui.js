/* ui.js — overlay panel in the right-bottom corner: mouse/keyboard controls,
   mode indicator and bird/walk mode buttons */
window.UI = (function () {
  const css = `
    #rome-ui {
      position: fixed; right: 16px; bottom: 16px; z-index: 10;
      width: 300px; padding: 14px 16px 12px;
      background: rgba(18, 14, 8, 0.78);
      border: 1px solid rgba(212, 175, 55, 0.55);
      border-radius: 10px; color: #f5e9c8;
      font: 13px Georgia, 'Times New Roman', serif;
      backdrop-filter: blur(3px);
      user-select: none;
    }
    #rome-ui h2 {
      margin: 0 0 2px; font-size: 19px; letter-spacing: 1px; color: #e8c96a;
    }
    #rome-ui .sub { font-size: 11px; opacity: .75; margin-bottom: 8px; font-style: italic; }
    #rome-ui .mode {
      display: inline-block; padding: 2px 10px; margin: 2px 0 8px;
      border-radius: 12px; font-size: 12px; font-weight: bold;
      background: rgba(113, 148, 76, 0.35); border: 1px solid rgba(113, 148, 76, 0.7);
    }
    #rome-ui .mode.bird {
      background: rgba(74, 127, 166, 0.35); border-color: rgba(120, 178, 216, 0.8); color: #cfe8fa;
    }
    #rome-ui table { border-collapse: collapse; width: 100%; }
    #rome-ui td { padding: 2px 4px; vertical-align: top; }
    #rome-ui td.k {
      white-space: nowrap; font-family: monospace; color: #ffd97a;
      background: rgba(255,255,255,0.07); border-radius: 4px; padding: 0 6px;
    }
    #rome-ui .btns { margin-top: 8px; display: flex; gap: 8px; }
    #rome-ui button {
      flex: 1; cursor: pointer; padding: 6px 4px; font: 12px Georgia, serif;
      color: #f5e9c8; background: rgba(168, 92, 59, 0.55);
      border: 1px solid rgba(212, 175, 55, 0.6); border-radius: 6px;
    }
    #rome-ui button:hover { background: rgba(168, 92, 59, 0.85); }
    #rome-ui button.active { background: rgba(212, 175, 55, 0.55); color: #1c1610; font-weight: bold; }
    #rome-ui .hint { margin-top: 7px; font-size: 11px; opacity: .7; font-style: italic; }
  `;

  let root, modeEl, walkBtn, birdBtn, hintEl;
  const listeners = { mode: [] };

  function setMode(mode) {
    const bird = mode === 'bird';
    modeEl.textContent = bird ? '🕊 BIRD MODE — flying over the city' : '🚶 WALK MODE — on foot in the streets';
    modeEl.classList.toggle('bird', bird);
    walkBtn.classList.toggle('active', !bird);
    birdBtn.classList.toggle('active', bird);
    hintEl.textContent = bird
      ? 'Space / E — up · Shift / Q — down · WASD — fly · B — walk again'
      : 'WASD — walk · mouse — look · Shift — run · B — fly like a bird';
    listeners.mode.forEach(f => f(mode));
  }

  function init(onToggleMode) {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    root = document.createElement('div');
    root.id = 'rome-ui';
    root.innerHTML =
      '<h2>Ancient Rome</h2>' +
      '<div class="sub">Roma Aeterna — walk the Eternal City</div>' +
      '<div class="mode" id="rome-mode"></div>' +
      '<table>' +
      '<tr><td class="k">Click</td><td>capture / release the mouse</td></tr>' +
      '<tr><td class="k">Mouse</td><td>look around (drag to turn)</td></tr>' +
      '<tr><td class="k">W A S D</td><td>move (arrow keys also work)</td></tr>' +
      '<tr><td class="k">Shift</td><td>run faster</td></tr>' +
      '<tr><td class="k">B</td><td>toggle bird mode (fly over the city)</td></tr>' +
      '<tr><td class="k">Space / E</td><td>bird mode: fly up</td></tr>' +
      '<tr><td class="k">Shift / Q</td><td>bird mode: descend</td></tr>' +
      '<tr><td class="k">Esc</td><td>release the mouse</td></tr>' +
      '</table>' +
      '<div class="btns">' +
      '<button id="rome-walk">🚶 Walk</button>' +
      '<button id="rome-bird">🕊 Bird</button>' +
      '</div>' +
      '<div class="hint" id="rome-hint"></div>';
    document.body.appendChild(root);

    modeEl = root.querySelector('#rome-mode');
    walkBtn = root.querySelector('#rome-walk');
    birdBtn = root.querySelector('#rome-bird');
    hintEl = root.querySelector('#rome-hint');
    walkBtn.onclick = () => onToggleMode('walk');
    birdBtn.onclick = () => onToggleMode('bird');

    setMode('walk');
  }

  return { init, setMode, onMode(fn) { listeners.mode.push(fn); } };
})();
