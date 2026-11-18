/* ui.js - overlay UI: right-bottom corner panel with mouse / keyboard controls */
window.Rome = window.Rome || {};

(function () {
  const state = {
    mode: 'walk',
    locked: false,
    el: null,
    modeEl: null,
    posEl: null,
    speedEl: null,
  };

  function buildUI() {
    if (document.getElementById('rome-ui-root')) return state;

    const root = document.createElement('div');
    root.id = 'rome-ui-root';
    root.innerHTML = `
      <div id="rome-title">
        <div class="t1">ROMA AETERNA</div>
        <div class="t2">Wander the Eternal City &middot; AD 200</div>
      </div>
      <div id="rome-hint">Click the scene to capture the mouse</div>
      <div id="rome-panel">
        <div class="p-head">CONTROLS</div>
        <div class="p-row"><span class="k">MOUSE</span><span class="d">look around (click to capture)</span></div>
        <div class="p-row"><span class="k">L-MOUSE</span><span class="d">hold + drag to rotate view</span></div>
        <div class="p-row"><span class="k">WHEEL</span><span class="d">zoom in / out (camera)</span></div>
        <div class="p-row"><span class="k">W A S D</span><span class="d">walk / fly &nbsp;(also arrow keys)</span></div>
        <div class="p-row"><span class="k">SHIFT</span><span class="d">run / fly faster</span></div>
        <div class="p-row"><span class="k">SPACE / C</span><span class="d">rise / sink (bird mode)</span></div>
        <div class="p-row"><span class="k">F</span><span class="d">bird mode &harr; walk mode</span></div>
        <div class="p-row"><span class="k">ESC</span><span class="d">release mouse</span></div>
        <div class="p-status">
          <span id="rome-mode" class="badge">WALK</span>
          <span id="rome-pos" class="mono">x 0&nbsp; z 0</span>
        </div>
      </div>
    `;
    document.body.appendChild(root);
    const style = document.createElement('style');
    style.textContent = `
      #rome-ui-root { position: fixed; inset: 0; pointer-events: none; font-family: Georgia, 'Times New Roman', serif; z-index: 10; }
      #rome-title { position: absolute; top: 14px; left: 18px; color: #f3e9cf; text-shadow: 0 2px 6px rgba(0,0,0,.7); }
      #rome-title .t1 { font-size: 26px; letter-spacing: 6px; font-weight: bold; }
      #rome-title .t2 { font-size: 12px; letter-spacing: 2px; opacity: .85; margin-top: 2px; }
      #rome-hint { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
        color: #fff; background: rgba(20,16,10,.72); padding: 10px 22px; border: 1px solid #b09a6a;
        border-radius: 6px; font-size: 15px; letter-spacing: 1px; transition: opacity .5s; }
      #rome-hint.hidden { opacity: 0; }
      #rome-panel { position: absolute; right: 16px; bottom: 16px; width: 320px;
        background: rgba(24,19,12,.82); border: 1px solid #a08c5f; border-radius: 8px;
        color: #e8dcbf; padding: 10px 14px 12px; box-shadow: 0 6px 24px rgba(0,0,0,.5); }
      .p-head { font-size: 13px; letter-spacing: 3px; color: #d8b56a; border-bottom: 1px solid #6e5d3a;
        padding-bottom: 6px; margin-bottom: 8px; }
      .p-row { display: flex; justify-content: space-between; gap: 8px; font-size: 12px; line-height: 1.75; }
      .p-row .k { color: #e6c470; font-family: monospace; font-size: 11px; white-space: nowrap; }
      .p-row .d { text-align: right; opacity: .9; }
      .p-status { display: flex; align-items: center; gap: 10px; margin-top: 8px;
        border-top: 1px solid #6e5d3a; padding-top: 8px; }
      .badge { background: #b3402e; color: #fff; font-size: 11px; letter-spacing: 2px;
        padding: 3px 10px; border-radius: 10px; }
      .badge.bird { background: #3f618c; }
      .mono { font-family: monospace; font-size: 11px; opacity: .85; }
    `;
    document.head.appendChild(style);

    state.el = root;
    state.modeEl = document.getElementById('rome-mode');
    state.posEl = document.getElementById('rome-pos');
    return state;
  }

  function setMode(mode) {
    state.mode = mode;
    if (state.modeEl) {
      state.modeEl.textContent = mode === 'bird' ? 'BIRD' : 'WALK';
      state.modeEl.classList.toggle('bird', mode === 'bird');
    }
  }

  function setLocked(v) {
    state.locked = v;
    const h = document.getElementById('rome-hint');
    if (h) h.classList.toggle('hidden', v);
  }

  function updateHUD(x, z, y, speed) {
    if (state.posEl) state.posEl.innerHTML = 'x ' + Math.round(x) + '&nbsp; z ' + Math.round(z) + '&nbsp; h ' + Math.round(y);
    if (state.speedEl) state.speedEl.textContent = Math.round(speed) + ' m/s';
  }

  window.Rome.ui = { buildUI: buildUI, setMode: setMode, setLocked: setLocked, updateHUD: updateHUD, state: state };
})();
