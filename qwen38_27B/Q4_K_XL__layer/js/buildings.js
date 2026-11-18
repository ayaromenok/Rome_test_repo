/* ============================================================
   buildings.js — The city fabric of Imperial Rome
   Forum: Curia Julia (Senate house), the Rostra, the great
   Basilicas. Palatine imperial palaces, Esquiline insulae
   (apartment blocks) and Nero's Domus Aurea, the Subura,
   and Campus Martius monuments (Mausoleum of Augustus,
   Temple of the Divine Julius).
   ============================================================ */
window.RomeBuildings = (function () {
  'use strict';

  function footprint(scene, x, z, w, d, h, mat, roofMat, ry) {
    const g = new THREE.Group();
    const M = ROME.M;
    g.add(ROME.box(w, h, d, mat, 0, 0, 0));
    if (roofMat) {
      g.add(ROME.box(w * 1.02, 1.2, d * 1.02, roofMat, 0, h, 0));
      g.add(ROME.box(w * 0.95, h * 0.22, d * 0.95, roofMat, 0, h + 1.2, 0));
    }
    g.position.set(x, ROME.heightAt(x, z), z);
    g.rotation.y = ry || 0;
    scene.add(g);
    return g;
  }

  /* the Curia Julia — Senate house with its round apse */
  function curia(scene) {
    const M = ROME.M;
    const x = -115, z = 155;
    const gy = ROME.heightAt(x, z);
    const g = new THREE.Group();
    g.add(ROME.box(18, 14, 30, M.travertine, 0, 0, 0));
    // apse (back)
    g.add(ROME.cyl(9, 9, 14, 16, M.travertine, 0, 0, -17));
    const apseDome = new THREE.Mesh(new THREE.SphereGeometry(9, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), M.stone);
    apseDome.position.set(0, 14, -17);
    apseDome.castShadow = true;
    g.add(apseDome);
    // front columns
    for (let i = 0; i < 6; i++)
      g.add(ROME.cyl(0.7, 0.8, 13, 12, M.marble, -7.5 + 3 * i, 0, 16.5));
    g.add(ROME.box(20, 2, 3, M.travertine, 0, 13.5, 16.5));
    g.position.set(x, gy, z);
    g.rotation.y = 0.5;
    scene.add(g);
  }

  /* the Rostra — raised speaker's platform with ship prows */
  function rostra(scene) {
    const M = ROME.M;
    const x = -55, z = 205;
    const gy = ROME.heightAt(x, z);
    const g = new THREE.Group();
    g.add(ROME.box(14, 2.5, 9, M.travertine, 0, 0, 0));
    // ship prows on the front
    for (let i = 0; i < 5; i++) {
      const prow = new THREE.Mesh(new THREE.ConeGeometry(0.9, 2.4, 4), M.bronze);
      prow.position.set(-5.5 + i * 2.75, 3.4, 4.6);
      prow.rotation.x = 0.9;
      g.add(prow);
    }
    g.position.set(x, gy, z);
    g.rotation.y = 0.5;
    scene.add(g);
  }

  /* long basilica with a clerestory roof */
  function basilica(scene, x, z, w, d, ry) {
    const M = ROME.M;
    const gy = ROME.heightAt(x, z);
    const g = new THREE.Group();
    g.add(ROME.box(w, 9, d, M.travertine, 0, 0, 0));
    g.add(ROME.box(w, 3, d * 0.35, M.stone, 0, 9, 0));            // clerestory
    g.add(ROME.box(w * 1.02, 1, d * 1.02, M.terracotta, 0, 12, 0)); // roof
    g.add(ROME.box(4, 1, d * 1.06, M.terracotta, w / 2, 9, 0));
    g.add(ROME.box(4, 1, d * 1.06, M.terracotta, -w / 2, 9, 0));
    g.position.set(x, gy, z);
    g.rotation.y = ry || 0;
    scene.add(g);
  }

  /* cluster of tall insulae (apartment blocks) */
  function insulae(scene, cx, cz, n, spread) {
    const M = ROME.M;
    for (let i = 0; i < n; i++) {
      const x = cx + (Math.random() - 0.5) * spread;
      const z = cz + (Math.random() - 0.5) * spread;
      const w = 9 + Math.random() * 8, d = 9 + Math.random() * 8;
      const h = 11 + Math.random() * 9;
      const mat = Math.random() < 0.5 ? M.brick : M.stone;
      const g = new THREE.Group();
      g.add(ROME.box(w, h, d, mat, 0, 0, 0));
      g.add(ROME.box(w * 0.9, 1.2, d * 0.9, M.terracotta, 0, h, 0));
      // wooden upper storeys (harmful mixtum)
      g.add(ROME.box(w * 1.03, 2, d * 1.03, M.wood, 0, h * 0.65, 0));
      g.position.set(x, ROME.heightAt(x, z), z);
      g.rotation.y = Math.random() * 0.6;
      scene.add(g);
    }
  }

  /* imperial palaces on the Palatine */
  function palaces(scene) {
    const M = ROME.M;
    footprint(scene, 120, 160, 46, 34, 15, M.marble, M.terracotta, 0.2);
    footprint(scene, 170, 250, 38, 30, 18, M.travertine, M.terracotta, -0.3);
    footprint(scene, 80, 280, 30, 26, 13, M.brick, M.terracotta, 0.7);
    // great basilica of the Palatine
    basilica(scene, 150, 130, 30, 50, 0.3);
    // gardens
    [[60, 130], [200, 180], [100, 230], [180, 300], [50, 250]].forEach(p =>
      scene.add(ROME.tree(p[0], p[1], 1.3)));
  }

  /* Campus Martius: Mausoleum of Augustus, Temple of the Divine Julius */
  function campusMartius(scene) {
    const M = ROME.M;
    // Mausoleum of Augustus — great tumulus
    const mx = -280, mz = -60;
    const gy = ROME.heightAt(mx, mz);
    const g = new THREE.Group();
    g.add(ROME.cyl(30, 34, 10, 32, M.stone, 0, 0, 0));
    g.add(ROME.cyl(26, 30, 16, 32, M.stone, 0, 10, 0));
    const cap = new THREE.Mesh(new THREE.ConeGeometry(8, 10, 4), M.gold);
    cap.position.set(0, 29.5, 0);
    cap.rotation.y = Math.PI / 4;
    cap.castShadow = true;
    g.add(cap);
    g.position.set(mx, gy, mz);
    scene.add(g);
    // Temple of the Divine Julius (round)
    const tx = -230, tz = 30;
    const tg = new THREE.Group();
    tg.add(ROME.cyl(10, 11, 9, 24, M.marble, 0, 0, 0));
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * Math.PI * 2;
      tg.add(ROME.cyl(0.55, 0.65, 9.5, 10, M.marble, Math.cos(a) * 13, 0, Math.sin(a) * 13));
    }
    const d = new THREE.Mesh(new THREE.ConeGeometry(14, 6, 24), M.terracotta);
    d.position.y = 14.8;
    d.castShadow = true;
    tg.add(d);
    tg.position.set(tx, ROME.heightAt(tx, tz), tz);
    scene.add(tg);
    // the obelisk of Campus Martius (see obelisks.js)
    // exercise grounds / trees
    for (let i = 0; i < 14; i++) {
      const x = -450 + Math.random() * 260, z = -300 + Math.random() * 400;
      if (Math.abs(x - ROME.riverXAt(z)) > 60) scene.add(ROME.tree(x, z, 1.2));
    }
  }

  function buildBuildings(scene) {
    const M = ROME.M;
    // --- Roman Forum ---
    curia(scene);
    rostra(scene);
    basilica(scene, -90, 260, 55, 24, 0.18);      // Basilica Aemilia
    basilica(scene, -60, 90, 46, 30, 0.18);       // Basilica Julia
    // market stalls & shops around the forum
    for (let i = 0; i < 10; i++) {
      const x = -130 + Math.random() * 90, z = 40 + Math.random() * 260;
      footprint(scene, x, z, 7, 6, 5, i % 2 ? M.stone : M.brick, null, Math.random());
    }
    // --- Palatine ---
    palaces(scene);
    // --- Esquiline: Domus Aurea + insulae + Baths of Trajan ---
    footprint(scene, 620, -260, 55, 40, 12, M.stone, M.gold, 0.4);   // Domus Aurea
    insulae(scene, 620, -60, 12, 130);
    footprint(scene, 720, 60, 60, 50, 10, M.brick, M.terracotta, 0); // Baths of Trajan
    // --- Caelian: aristocratic villas in town (domus) ---
    insulae(scene, 430, 520, 8, 120);
    footprint(scene, 320, 600, 26, 22, 8, M.stone, M.terracotta, 0.3);
    // --- Aventine: residential ---
    insulae(scene, 200, 760, 7, 110);
    // --- Subura / Viminal & Quirinal quarters ---
    insulae(scene, -140, -380, 10, 140);
    insulae(scene, 140, -480, 9, 130);
    footprint(scene, -40, -620, 44, 36, 12, M.travertine, M.terracotta, 0.1); // Baths of Diocletian core
    // --- Campus Martius ---
    campusMartius(scene);
    // --- Tiber island shrine + mills at the Pons Sublicius ---
    const mx = ROME.riverXAt(120);
    footprint(scene, mx + 60, 130, 16, 14, 7, M.stone, M.terracotta, 0); // stone mills by the river
  }

  return { buildBuildings: buildBuildings };
})();
