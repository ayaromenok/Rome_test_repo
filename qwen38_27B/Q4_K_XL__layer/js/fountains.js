/* ============================================================
   fountains.js — Public water supplied by the aqueducts
   Great basin fountains (moines) of travertine with
   marble statues and spouts: Forum, Campus Martius,
   near Porta San Sebastiano, Caelian, and the baths.
   ============================================================ */
window.RomeFountains = (function () {
  'use strict';

  function fountain(scene, x, z, scale) {
    const M = ROME.M;
    const gy = ROME.heightAt(x, z);
    const s = scale || 1;
    const g = new THREE.Group();
    // octagonal basin
    g.add(ROME.cyl(6 * s, 6.6 * s, 1.6 * s, 8, M.travertine, 0, 0, 0));
    const water = new THREE.Mesh(new THREE.CircleGeometry(5.6 * s, 8), M.water);
    water.rotation.x = -Math.PI / 2;
    water.position.y = 1.65 * s;
    g.add(water);
    // pedestal + spouts
    g.add(ROME.box(2.4 * s, 3.4 * s, 2.4 * s, M.stone, 0, 1.6 * s, 0));
    for (let i = 0; i < 3; i++) {
      const a = i / 3 * Math.PI * 2;
      const spout = new THREE.Mesh(new THREE.CylinderGeometry(0.18 * s, 0.22 * s, 1.2 * s, 8), M.marble);
      spout.position.set(Math.cos(a) * 1.6 * s, 3.2 * s, Math.sin(a) * 1.6 * s);
      spout.rotation.set(Math.sin(a) * 0.9, 0, -Math.cos(a) * 0.9);
      g.add(spout);
    }
    // marble statue (simplified figure)
    const stat = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.5 * s, 0.8 * s, 2.2 * s, 8), M.marble);
    body.position.y = 1.1 * s;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.45 * s, 8, 8), M.marble);
    head.position.y = 2.5 * s;
    stat.add(body, head);
    stat.position.y = 5 * s;
    g.add(stat);
    g.position.set(x, gy, z);
    scene.add(g);
  }

  function grandFountain(scene, x, z) {
    // tiered nymphaeum-style fountain near the baths
    const M = ROME.M;
    const gy = ROME.heightAt(x, z);
    const g = new THREE.Group();
    g.add(ROME.box(26, 2, 12, M.travertine, 0, 0, 0));
    const pool = new THREE.Mesh(new THREE.PlaneGeometry(24, 10), M.water);
    pool.rotation.x = -Math.PI / 2;
    pool.position.y = 2.1;
    g.add(pool);
    g.add(ROME.box(20, 6, 4, M.stone, 0, 2, -4));
    g.add(ROME.box(12, 4, 3, M.stone, 0, 8, -4));
    for (let i = 0; i < 5; i++)
      g.add(ROME.cyl(0.5, 0.6, 5.4, 10, M.marble, -8 + i * 4, 2, -1.5));
    const jet = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.4, 3.4, 8), M.water);
    jet.position.set(0, 13.4, -3);
    g.add(jet);
    g.position.set(x, gy, z);
    scene.add(g);
  }

  function buildFountains(scene) {
    fountain(scene, 60, 200, 1.4);    // Forum, by the Via Sacra
    fountain(scene, -420, -100, 1.6); // Campus Martius
    fountain(scene, 60, 1150, 1.8);   // near Porta San Sebastiano
    fountain(scene, 380, 480, 1.2);   // Caelian
    fountain(scene, -520, -260, 1.2); // Pantheon forecourt
    grandFountain(scene, -260, 760);  // beside the Baths of Caracalla
  }

  return { buildFountains: buildFountains };
})();
