/* ============================================================
 * ui.js — Overlay UI (bottom-right corner)
 * Mode switch (Walk / Bird), speed control, mouse & key help.
 * ============================================================ */
window.UI = (function () {
  let panel, modeBtn, speedSlider, speedVal, helpToggle, helpBox;

  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function init() {
    panel = el('div', 'rome-ui');
    panel.innerHTML =
      '<div class="rome-ui-title">ROMA&nbsp;AETERNA</div>' +
      '<div class="rome-ui-row">' +
      '  <button id="ui-walk" class="ui-btn active">🚶 Walk</button>' +
      '  <button id="ui-bird" class="ui-btn">🕊 Bird</button>' +
      '</div>' +
      '<div class="rome-ui-row">' +
      '  <label class="ui-label" for="ui-speed">Speed</label>' +
      '  <input id="ui-speed" type="range" min="4" max="60" value="18" step="1">' +
      '  <span id="ui-speed-val">18</span>' +
      '</div>' +
      '<button id="ui-help" class="ui-btn ui-help">? Controls (mouse &amp; keys)</button>' +
      '<div id="ui-helpbox" class="ui-helpbox">' +
      '  <b>Mouse</b>' +
      '  <ul>' +
      '    <li>Drag left button — look around</li>' +
      '    <li>Wheel — walking speed (walk mode)</li>' +
      '    <li>Wheel — ascend / descend (bird mode)</li>' +
      '  </ul>' +
      '  <b>Keys</b>' +
      '  <ul>' +
      '    <li>W A S D / Arrows — move</li>' +
      '    <li>B — toggle bird mode</li>' +
      '    <li>Space / E — fly up (bird mode)</li>' +
      '    <li>Shift / Q — fly down (bird mode)</li>' +
      '    <li>R — return to the Forum</li>' +
      '  </ul>' +
      '</div>';
    document.body.appendChild(panel);

    modeBtn = { walk: panel.querySelector('#ui-walk'), bird: panel.querySelector('#ui-bird') };
    speedSlider = panel.querySelector('#ui-speed');
    speedVal = panel.querySelector('#ui-speed-val');
    helpToggle = panel.querySelector('#ui-help');
    helpBox = panel.querySelector('#ui-helpbox');

    modeBtn.walk.addEventListener('click', () => toggleBird(false));
    modeBtn.bird.addEventListener('click', () => toggleBird(true));
    speedSlider.addEventListener('input', () => {
      window.walkSpeed = +speedSlider.value;
      speedVal.textContent = speedSlider.value;
    });
    helpToggle.addEventListener('click', () => helpBox.classList.toggle('open'));
  }

  function toggleBird(b) { if (window.toggleBirdMode) window.toggleBirdMode(b); }
  function setBirdModeUI(b) {
    modeBtn.walk.classList.toggle('active', !b);
    modeBtn.bird.classList.toggle('active', b);
  }
  function setSpeedUI(v) {
    speedSlider.value = Math.round(v);
    speedVal.textContent = Math.round(v);
  }

  return { init, setBirdModeUI, setSpeedUI };
})();
