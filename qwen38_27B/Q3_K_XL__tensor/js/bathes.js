/* bathes.js - public bathes (thermae): Caracalla, Diocletian, Constantine, Domus Aurea */
window.Rome = window.Rome || {};

(function () {
  const T = () => window.Rome.terrain;
  const C = () => window.Rome.core;

  // A generic thermae complex: frigidarium / tepidarium / caldarium halls with apses
  function thermae(w, d, h, mat) {
    const g = new THREE.Group();
    const M = C().mats;
    // main hall
    g.add(C().box(w, h, d, mat || M.stone, 0, h / 2, 0));
    // central dome (frigidarium)
    const dome = new THREE.Mesh(new THREE.SphereGeometry(w * 0.42, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), M.travertine);
    dome.scale.y = 0.75;
    dome.position.y = h;
    g.add(dome);
    // side apses (caldarium / tepidarium semicircular halls)
    for (const s of [-1, 1]) {
      const apse = new THREE.Mesh(new THREE.CylinderGeometry(d * 0.42, d * 0.42, h * 0.9, 16, 1, false, 0, Math.PI), M.stone);
      apse.rotation.y = s === 1 ? 0 : Math.PI;   // dome bulges outward (±x)
      apse.position.set(s * w / 2, h * 0.9 / 2, 0);
      g.add(apse);
      const adome = new THREE.Mesh(
        new THREE.SphereGeometry(d * 0.42, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), M.travertine);
      adome.scale.y = 0.7;
      adome.rotation.y = Math.PI / 2;
      adome.position.set(s * w / 2, h * 0.9, 0);
      g.add(adome);
    }
    // colonnaded portico across the front
    for (let i = 0; i < Math.floor(w / 6); i++) {
      const col = C().column(0.5, h * 0.55, M.marble);
      col.position.set(-w / 2 + 3 + i * 6, 0, d / 2 + 2);
      g.add(col);
    }
    g.add(C().box(w, 1, 1.5, M.travertine, 0, h * 0.55 + 0.6, d / 2 + 2));
    // courtyard pool
    g.add(C().box(w * 0.5, 0.8, d * 0.5, M.cobble, 0, 0.4, d / 2 + 8));
    const water = C().box(w * 0.42, 0.5, d * 0.42, M.water, 0, 0.85, d / 2 + 8);
    g.add(water);
    return g;
  }

  function place(scene, g, x, z, label, lblH) {
    const y = T().heightAt(x, z);
    g.position.set(x, y, z);
    scene.add(g);
    if (label) scene.add(T().makeLabel(label, x, lblH || 26, z));
    return g;
  }

  function buildBathes(scene) {
    const M = C().mats;

    // ---- Baths of Caracalla (Esquiline side; four corner towers in history) ----
    let b = thermae(60, 34, 16, M.stone);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      const tower = C().box(9, 22, 9, M.brick, sx * 30, 11, sz * 17);
      b.add(tower);
      b.add(C().box(10, 1, 10, M.stoneDark, sx * 30, 22.5, sz * 17));
    }
    place(scene, b, 140, 95, 'BATHS OF CARACALLA', 34);

    // ---- Baths of Diocletian (Quirinal, largest of all) ----
    b = thermae(70, 40, 18, M.stone);
    place(scene, b, 95, 165, 'BATHS OF DIOCLETIAN', 36);

    // ---- Baths of Constantine (Quirinal edge) ----
    b = thermae(40, 24, 12, M.stone);
    b.rotation.y = 0.4;
    place(scene, b, 55, 150, 'BATHS OF CONSTANTINE', 24);

    // ---- Domus Aurea (Nero's Golden House, Esquiline park & palace grounds) ----
    const gold = new THREE.MeshLambertMaterial({ color: 0xcfa954 });
    const d = new THREE.Group();
    d.add(C().box(26, 12, 40, gold, 0, 6, 0));
    // rotunda (the great circular hall with the bronze head of the sun)
    const rot = new THREE.Mesh(new THREE.CylinderGeometry(14, 14, 10, 20), gold);
    rot.position.set(20, 5, 10);
    d.add(rot);
    const rd = new THREE.Mesh(new THREE.SphereGeometry(14, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), M.travertine);
    rd.scale.y = 0.7;
    rd.position.set(20, 10, 10);
    d.add(rd);
    // park: trees and the artificial lake
    for (let i = 0; i < 14; i++) {
      const tr = C().tree(1.4);
      tr.position.set(-18 + (i % 7) * 8, 0, -22 + Math.floor(i / 7) * 14 + (i % 2) * 4);
      d.add(tr);
    }
    const lake = new THREE.Mesh(new THREE.CircleGeometry(12, 20), M.water);
    lake.rotation.x = -Math.PI / 2;
    lake.position.set(-14, 0.5, 8);
    d.add(lake);
    d.rotation.y = -0.35;
    place(scene, d, 168, 55, 'DOMUS AUREA (GOLDEN HOUSE)', 24);

    // ---- Baths of Nero (Esquiline / Baths of Trajan successor) ----
    b = thermae(36, 22, 11, M.stone);
    b.rotation.y = 0.8;
    place(scene, b, 175, 120, 'BATHS OF TRAJAN', 22);
  }

  window.Rome.bathes = { build: buildBathes };
})();
