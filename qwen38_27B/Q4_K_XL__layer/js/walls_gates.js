/* ============================================================
   walls_gates.js — The Aurelian Walls (271–275 CE)
   Brick-faced concrete circuit with square towers every ~30 m
   and the great consular gateways.
   ============================================================ */
window.RomeWalls = (function () {
  'use strict';

  const CX = 60, CZ = -80;          // circuit centre
  const RX = 1150, RZ = 1250;       // east-west / north-south radii
  const WALL_H = 14;                // raised to 35 ft by Stilicho

  function pointOnWall(t) {
    return [CX + RX * Math.cos(t), CZ + RZ * Math.sin(t)];
  }

  /* the 18 portals — a representative selection on their roads */
  const GATES = [
    { name: 'Porta San Sebastiano',  t: Math.PI / 2 },        // south  — Via Appia
    { name: 'Porta San Paolo',      t: 2.35 },               // S-W    — Via Ostiensis
    { name: 'Porta San Pancrazio',  t: Math.PI },            // west
    { name: 'Porta Flaminia',       t: -Math.PI / 2 },       // north  — Via Flaminia
    { name: 'Porta Maggiore',       t: -Math.PI / 4 - 0.25 },// N-E
    { name: 'Porta Tiburtina',      t: 0.05 },               // east   — Via Latina
    { name: 'Porta Asinaria',       t: 0.85 },               // S-E
    { name: 'Porta Latina',         t: 1.55 }                // S-S-E
  ];

  function buildGate(scene, gate) {
    const [x, z] = pointOnWall(gate.t);
    // tangent direction of the ellipse
    const tx = -RX * Math.sin(gate.t), tz = RZ * Math.cos(gate.t);
    const ry = -Math.atan2(tz, tx) + Math.PI / 2;
    const gy = ROME.heightAt(x, z);
    const g = new THREE.Group();
    const M = ROME.M;
    g.add(ROME.box(11, WALL_H + 5, 11, M.brick, 0, 0, -11));     // left tower
    g.add(ROME.box(11, WALL_H + 5, 11, M.brick, 0, 0, 11));      // right tower
    g.add(ROME.box(26, WALL_H, 7, M.brick, 0, 0, 0));            // arch body
    g.add(ROME.box(28, 3, 9, M.travertine, 0, WALL_H, 0));       // cornice
    g.add(ROME.box(28, 2, 1, M.travertine, 0, WALL_H + 3, 0));
    // arch voussoirs hint
    g.add(ROME.box(24, 5, 8.5, M.travertine, 0, 9, 0));
    g.position.set(x, gy, z);
    g.rotation.y = ry;
    scene.add(g);
  }

  function buildWallsGates(scene) {
    const M = ROME.M;
    const N = 240;
    const step = (Math.PI * 2) / N;
    const gateGap = 0.012;   // radians of gap around each gate

    for (let i = 0; i < N; i++) {
      const t = i * step;
      // skip wall segments under a gate
      let near = false;
      for (const g of GATES) {
        let d = Math.abs(((t - g.t) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI * 2 / 2);
        if (d < gateGap) { near = true; break; }
      }
      if (near) continue;

      const [x, z] = pointOnWall(t);
      const tx = -RX * Math.sin(t), tz = RZ * Math.cos(t);
      const len = Math.hypot(tx, tz) * step * RX * RZ / (Math.hypot(tx, tz)) * 0 + 0; // (unused)
      const seg = Math.hypot(tx, tz) * step;
      const ry = -Math.atan2(tz, tx);
      const gy = ROME.heightAt(x, z);
      const wall = ROME.box(13, WALL_H, 3.6, M.brick, x, gy, z, ry + Math.PI / 2);
      scene.add(wall);

      // square defensive towers ~ every 30 m (every 5th segment)
      if (i % 5 === 0) {
        const tower = ROME.box(9, WALL_H + 4, 9, M.brick,
          x + Math.cos(ry) * 6, gy, z + Math.sin(ry) * 6, ry);
        scene.add(tower);
      }
    }
    for (const g of GATES) buildGate(scene, g);
  }

  return { buildWallsGates: buildWallsGates };
})();
