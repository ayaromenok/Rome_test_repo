/* ============================================================
   villas.js — Country estates outside the Aurelian Walls
   Villa Urbana  — leisure retreat: atrium with impluvium,
               peristyle garden, triclinium, cubicula
   Villa Rustica — working estate: granaries, presses,
               stables and crop fields
   Villa Marittima — riverside villa on the Tiber with a pier
   ============================================================ */
window.RomeVillas = (function () {
  'use strict';

  /* residential wing: atrium house (pars urbana) */
  function parsUrbana(scene, x, z, ry, scale) {
    const M = ROME.M;
    const gy = ROME.heightAt(x, z);
    const s = scale || 1;
    const g = new THREE.Group();
    // four wings around the atrium
    g.add(ROME.box(24 * s, 5 * s, 7 * s, M.stone, 0, 0, -8 * s));
    g.add(ROME.box(24 * s, 5 * s, 7 * s, M.stone, 0, 0, 8 * s));
    g.add(ROME.box(7 * s, 5 * s, 16 * s, M.stone, -8.5 * s, 0, 0));
    g.add(ROME.box(7 * s, 5 * s, 16 * s, M.stone, 8.5 * s, 0, 0));
    // roofs
    for (const p of [[0, -8 * s, 25 * s, 8 * s], [0, 8 * s, 25 * s, 8 * s], [-8.5 * s, 0, 8 * s, 17 * s], [8.5 * s, 0, 8 * s, 17 * s]]) {
      g.add(ROME.box(p[2], 1, p[3], M.terracotta, p[0], 5 * s, p[1]));
    }
    // open atrium with impluvium (shallow basin catching rain)
    const impluvium = new THREE.Mesh(new THREE.PlaneGeometry(6 * s, 6 * s), M.water);
    impluvium.rotation.x = -Math.PI / 2;
    impluvium.position.y = 0.3;
    g.add(impluvium);
    // peristyle: colonnaded courtyard behind
    for (let i = 0; i <= 5; i++) {
      const cx = -15 * s + (30 * s) * i / 5;
      g.add(ROME.cyl(0.45 * s, 0.5 * s, 5.5 * s, 10, M.marble, cx, 0, 16 * s));
      g.add(ROME.cyl(0.45 * s, 0.5 * s, 5.5 * s, 10, M.marble, cx, 0, 30 * s));
      g.add(ROME.cyl(0.45 * s, 0.5 * s, 5.5 * s, 10, M.marble, -15 * s, 0, 16 * s + (14 * s) * i / 5));
      g.add(ROME.cyl(0.45 * s, 0.5 * s, 5.5 * s, 10, M.marble, 15 * s, 0, 16 * s + (14 * s) * i / 5));
    }
    // reflecting pool in the peristyle
    const pool = new THREE.Mesh(new THREE.PlaneGeometry(16 * s, 6 * s), M.water);
    pool.rotation.x = -Math.PI / 2;
    pool.position.set(0, 0.3, 23 * s);
    g.add(pool);
    // garden trees
    ltree(g, -8 * s, 20 * s, 1); ltree(g, 8 * s, 26 * s, 1); ltree(g, 0, 28 * s, 0.9);
    // triclinium opening to the garden (columns + low table)
    g.add(ROME.box(4 * s, 0.5, 2.5 * s, M.wood, 0, 0.6, 18 * s));

    g.position.set(x, gy, z);
    g.rotation.y = ry || 0;
    scene.add(g);
  }

  /* agricultural wing (pars rustica) */
  function parsRustica(scene, x, z, ry) {
    const M = ROME.M;
    const gy = ROME.heightAt(x, z);
    const g = new THREE.Group();
    // granary
    g.add(ROME.box(20, 6, 10, M.stone, 0, 0, -20));
    g.add(ROME.box(21, 0.8, 11, M.terracotta, 0, 6, -20));
    // wine/olive press house with vats
    g.add(ROME.box(12, 5, 8, M.brick, 16, 0, -14));
    for (let i = 0; i < 3; i++)
      g.add(ROME.cyl(1.4, 1.6, 4.4, 10, M.wood, 12 + i * 3, 0.2, -14));
    // stables
    g.add(ROME.box(10, 4.5, 16, M.wood, -16, 0, -16));
    // workers' quarters
    g.add(ROME.box(8, 4, 10, M.stone, -8, 0, -24));
    // grain field with crop rows
    const field = new THREE.Mesh(new THREE.PlaneGeometry(60, 40), new THREE.MeshLambertMaterial({ color: 0xa8a04a }));
    field.rotation.x = -Math.PI / 2;
    field.position.set(30, 0.2, 20);
    g.add(field);
    for (let i = 0; i < 8; i++) {
      const row = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.9, 38), M.green);
      row.position.set(6 + i * 7, 0.6, 20);
      g.add(row);
    }
    // vine rows
    for (let i = 0; i < 6; i++) {
      const row = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.1, 30), M.green);
      row.position.set(-20 - i * 5, 0.7, 14);
      g.add(row);
    }
    g.position.set(x, gy, z);
    g.rotation.y = ry || 0;
    scene.add(g);
  }

  function ltree(parent, x, z, s) {
    parent.add(ROME.cyl(0.3 * s, 0.4 * s, 2.2 * s, 6, ROME.M.wood, x, 0, z));
    const c = new THREE.Mesh(new THREE.ConeGeometry(1.4 * s, 5.5 * s, 8), ROME.M.green);
    c.position.set(x, 2.2 * s + 2.6 * s, z);
    c.castShadow = true;
    parent.add(c);
  }

  function buildVillas(scene) {
    // Villa Urbana — the great western countryside estate
    parsUrbana(scene, -750, -900, 0.6, 1.3);
    parsRustica(scene, -820, -760, 0.5);
    // Villa Rustica — along the Appia, south of the walls
    parsRustica(scene, 120, 1550, -0.3);
    parsUrbana(scene, -40, 1460, -0.4, 1);
    // Villa Marittima — on the Tiber, with a pier into the water
    const vx = ROME.riverXAt(1250) - 70, vz = 1250;
    parsUrbana(scene, vx, vz, -1.2, 0.9);
    const gy = ROME.heightAt(vx, vz);
    scene.add(ROME.box(4, 1.4, 22, ROME.M.wood, vx + 30, gy - 4, vz));
    // scattered olive trees in the villa countryside
    for (let i = 0; i < 20; i++) {
      const x = -1300 + Math.random() * 1100, z = -1500 + Math.random() * 500;
      if (Math.abs(x - ROME.riverXAt(z)) > 70) scene.add(ROME.tree(x, z, 1.4));
    }
    for (let i = 0; i < 12; i++) {
      const x = -400 + Math.random() * 900, z = 1350 + Math.random() * 400;
      if (Math.abs(x - ROME.riverXAt(z)) > 70) scene.add(ROME.tree(x, z, 1.4));
    }
  }

  return { buildVillas: buildVillas };
})();
