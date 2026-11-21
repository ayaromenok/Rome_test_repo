/* walls.js — Servian Wall (4th c. BCE, tuff, ~10.6 m high) and the
   Aurelian Wall (271 CE, brick-faced concrete, 381 towers, ~30 m apart) */
window.Walls = (function () {
  const R = window.Roman, M = R.M;

  // Irregular closed circuit around a centre
  function circuit(cx, cz, rx, rz, n, wobble) {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2;
      const w = 1 + wobble * Math.sin(3 * a + 1) + wobble * 0.6 * Math.cos(2 * a);
      pts.push([cx + Math.cos(a) * rx * w, cz + Math.sin(a) * rz * w]);
    }
    return pts;
  }

  function build(scene) {
    // Servian Wall: encloses the Seven Hills, tuff, 10.6 m high, ~12 km
    const servian = circuit(60, 20, 380, 320, 72, 0.05);
    scene.add(R.wallLoop(servian, 10.6, 5, M.tuff, 5, 4));
    const ls = R.makeLabel('Servian Wall (390 BCE)', 40);
    ls.position.set(60, 40, -300);
    scene.add(ls);

    // Aurelian Wall: the great brick-faced circuit, 7.2–10.6 m high, 381 towers
    const aurelian = circuit(40, 0, 520, 460, 96, 0.04);
    scene.add(R.wallLoop(aurelian, 9, 4, M.brick, 7, 5));
    const la = R.makeLabel('Aurelian Wall (271 CE)', 40);
    la.position.set(40, 42, 430);
    scene.add(la);

    window.ROME_WALLS = { servian, aurelian }; // shared with gates.js
  }

  return { build, circuit };
})();
