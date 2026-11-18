/* ============================================================
   baths.js — The great public bath complexes (thermae)
   Baths of Caracalla (S-W) and Baths of Constantine (Quirinal):
   peristyle courtyard, main pool, domed caldarium/tepidarium
   fed by the aqueducts (hypocaust-heated).
   ============================================================ */
window.RomeBaths = (function () {
  'use strict';

  function domeRoom(g, x, z, r) {
    const M = ROME.M;
    g.add(ROME.cyl(r, r, r * 0.9, 24, M.brick, x, 0, z));
    const dome = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), M.stone);
    dome.position.set(x, r * 0.9, z);
    dome.castShadow = true;
    g.add(dome);
  }

  /* local tree (inside a positioned group) */
  function ltree(parent, x, z, s) {
    parent.add(ROME.cyl(0.3 * s, 0.4 * s, 2.2 * s, 6, ROME.M.wood, x, 0, z));
    const c = new THREE.Mesh(new THREE.ConeGeometry(1.4 * s, 5.5 * s, 8), ROME.M.green);
    c.position.set(x, 2.2 * s + 2.6 * s, z);
    c.castShadow = true;
    parent.add(c);
  }

  function bathComplex(scene, x, z, scale, name) {
    const M = ROME.M;
    const gy = ROME.heightAt(x, z);
    const g = new THREE.Group();
    const s = scale;

    // outer walls
    g.add(ROME.box(90 * s, 8 * s, 6, M.brick, 0, 0, -45 * s));
    g.add(ROME.box(6, 8 * s, 90 * s, M.brick, -45 * s, 0, 0));
    g.add(ROME.box(6, 8 * s, 90 * s, M.brick, 45 * s, 0, 0));
    // entrance portico
    g.add(ROME.box(20 * s, 6 * s, 4, M.stone, 0, 0, 45 * s));
    g.add(ROME.box(24 * s, 1.5, 6, M.travertine, 0, 6 * s, 45 * s));

    // main pool (frigidarium)
    g.add(ROME.box(34 * s, 1.5, 22 * s, M.stone, 0, 0, 18 * s));
    const pool = new THREE.Mesh(new THREE.PlaneGeometry(30 * s, 18 * s), M.water);
    pool.rotation.x = -Math.PI / 2;
    pool.position.set(0, 1.6, 18 * s);
    g.add(pool);

    // domed halls (caldarium & tepidarium)
    domeRoom(g, -22 * s, -16 * s, 10 * s);
    domeRoom(g, 22 * s, -16 * s, 10 * s);
    domeRoom(g, 0, -24 * s, 14 * s);

    // peristyle colonnade
    for (let i = 0; i <= 6; i++) {
      const fx = -36 * s + (72 * s) * i / 6;
      g.add(ROME.cyl(0.5 * s, 0.6 * s, 6 * s, 10, M.marble, fx, 1.5, -2 * s));
      g.add(ROME.cyl(0.5 * s, 0.6 * s, 6 * s, 10, M.marble, fx, 1.5, 38 * s));
    }
    for (let i = 1; i < 6; i++) {
      const fz = -20 * s + (56 * s) * i / 6;
      g.add(ROME.cyl(0.5 * s, 0.6 * s, 6 * s, 10, M.marble, -36 * s, 1.5, fz));
      g.add(ROME.cyl(0.5 * s, 0.6 * s, 6 * s, 10, M.marble, 36 * s, 1.5, fz));
    }
    // a few trees in the gardens
    [[-30, 30], [30, 30], [-30, 2], [30, 2]].forEach(p => ltree(g, p[0] * s, p[1] * s, 1.1));

    g.position.set(x, gy, z);
    scene.add(g);
  }

  function buildBaths(scene) {
    bathComplex(scene, -260, 820, 1.4, 'Baths of Caracalla');
    bathComplex(scene, 120, -700, 0.8, 'Baths of Constantine');
  }

  return { buildBaths: buildBaths };
})();
