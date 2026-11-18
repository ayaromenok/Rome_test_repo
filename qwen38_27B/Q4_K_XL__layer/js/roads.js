/* ============================================================
   roads.js — The consular roads and city streets of Rome
   Via Appia (S), Via Flaminia (N), Via Latrina (E),
   Via Sacra (Forum), bridges over the Tiber
   ============================================================ */
window.RomeRoads = (function () {
  'use strict';

  /* ribbon road that follows the terrain */
  function makeRoad(scene, pts, width, mat) {
    const pos = [], idx = [];
    for (let i = 0; i < pts.length; i++) {
      const [x, z] = pts[i];
      // tangent
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
      const tx = b[0] - a[0], tz = b[1] - a[1];
      const len = Math.hypot(tx, tz) || 1;
      const nx = -tz / len, nz = tx / len;
      const y = ROME.heightAt(x, z) + 0.25;
      pos.push(x + nx * width / 2, y, z + nz * width / 2);
      pos.push(x - nx * width / 2, y, z - nz * width / 2);
    }
    for (let i = 0; i < pts.length - 1; i++) {
      const a = i * 2, b = i * 2 + 1, c = i * 2 + 2, d = i * 2 + 3;
      idx.push(a, c, b, b, c, d);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    const m = new THREE.Mesh(geo, mat || ROME.M.sand);
    m.receiveShadow = true;
    scene.add(m);
  }

  function line(x0, z0, x1, z1, n) {
    const pts = [];
    for (let i = 0; i <= n; i++) {
      pts.push([x0 + (x1 - x0) * i / n, z0 + (z1 - z0) * i / n]);
    }
    return pts;
  }

  /* stone bridge across the Tiber at given z */
  function bridge(scene, z, y) {
    const cx = ROME.riverXAt(z);
    const span = 110;
    const gy = ROME.RIVER_BED_Y - 1;
    const deckY = (y !== undefined) ? y : gy + 9;
    const g = new THREE.Group();
    g.add(ROME.box(span, 2.5, 12, ROME.M.travertine, cx, deckY, z));              // deck
    g.add(ROME.box(span, 1.2, 1.2, ROME.M.stone, cx, deckY + 2.5, z - 5.2));     // rail
    g.add(ROME.box(span, 1.2, 1.2, ROME.M.stone, cx, deckY + 2.5, z + 5.2));     // rail
    for (let i = -1; i <= 1; i++) {                                              // piers
      g.add(ROME.box(7, deckY - gy + 2, 10, ROME.M.stone, cx + i * span / 2.6, gy, z));
    }
    scene.add(g);
  }

  function buildRoads(scene) {
    const M = ROME.M;
    /* --- consular roads (sampled for terrain following) --- */
    // Via Appia — Forum to Porta San Sebastiano (south)
    makeRoad(scene, line(30, 260, 60, 1160, 20), 14);
    // Via Flaminia — Forum to Porta Flaminia (north)
    makeRoad(scene, line(30, 260, 60, -1330, 24), 14);
    // Via Latina / Labicana — Colosseum to Porta Tiburtina (east)
    makeRoad(scene, line(470, 200, 1180, 40, 20), 12);
    // Via Ostiensis — from Porta San Paolo (south-west)
    makeRoad(scene, line(-500, 1050, -700, 1500, 10), 12);
    // Via Aurelia — Campus Martius to the west
    makeRoad(scene, line(-500, 300, -1300, 250, 10), 12);
    // Via Sacra — the sacred processional road through the Forum
    makeRoad(scene, line(15, 290, -40, 40, 8), 10, M.marble);

    /* --- forum pavement --- */
    const fy = ROME.heightAt(20, 190) + 0.2;
    const plaza = ROME.box(230, 0.3, 300, M.sand, 20, fy, 190);
    plaza.rotation.y = 0.18;
    scene.add(plaza);

    /* --- bridges over the Tiber --- */
    bridge(scene, -300);    // Ponte Fabricio, Campus Martius meander
    bridge(scene, -1300);   // north crossing on the Flaminia
    bridge(scene, 700);     // Ponte Cestius, on the Appia
  }

  return { buildRoads: buildRoads, makeRoad: makeRoad };
})();
