/* villas.js - suburban villas outside the Aurelian Walls: pars urbana (residence) + pars rustica (farm) */
window.Rome = window.Rome || {};

(function () {
  const T = () => window.Rome.terrain;
  const C = () => window.Rome.core;

  function villa() {
    const g = new THREE.Group();
    const M = C().mats;

    // ---------------- Pars urbana: residential wing ----------------
    // main house block
    g.add(C().box(24, 6, 16, M.paintCream, 0, 3, 0));
    g.add(C().gableRoof(25, 17, 2.4, M.roof));
    g.children[g.children.length - 1].position.y = 6;
    // atrium with impluvium (rainwater basin under the compluvium opening)
    g.add(C().box(7, 0.5, 7, M.cobble, 0, 0.25, 0));
    g.add(C().box(4.5, 0.4, 4.5, M.water, 0, 0.45, 0));
    // peristyle: colonnaded garden court
    for (let i = 0; i < 5; i++) {
      for (const sz of [-1, 1]) {
        const c = C().column(0.45, 4, M.marble);
        c.position.set(-12 + i * 6, 0, 14 + sz * 4);
        g.add(c);
      }
      const c1 = C().column(0.45, 4, M.marble);
      c1.position.set(2 + i * 6, 0, 14);
      g.add(c1);
    }
    // garden floor + reflecting pool
    g.add(C().box(30, 0.4, 14, M.grass ? M.sand : M.sand, 2, 0.2, 14));
    const pool = C().box(10, 0.5, 4, M.water, 6, 0.5, 14);
    g.add(pool);
    // triclinium wing (dining room) opening to the garden
    g.add(C().box(12, 5.5, 8, M.paintBlue, 10, 2.75, -10));
    g.add(C().gableRoof(13, 9, 2, M.roof));
    g.children[g.children.length - 1].position.set(10, 5.5, -10);
    // private balnea: small bath with hypocaust
    g.add(C().box(9, 5, 10, M.paintRed, -12, 2.5, -10));
    g.add(C().box(2.5, 3.5, 3, M.water, -12, 1.2, -6));

    // ---------------- Pars rustica: agricultural wing ----------------
    // barns / stables
    g.add(C().box(16, 4, 10, M.wood, -22, 2, 20));
    g.add(C().gableRoof(17, 11, 1.6, M.darkWood));
    g.children[g.children.length - 1].position.set(-22, 4, 20);
    // granary
    g.add(C().box(8, 5, 14, M.stone, 26, 2.5, 24));
    g.add(C().gableRoof(9, 15, 1.8, M.wood));
    g.children[g.children.length - 1].position.set(26, 5, 24);
    // oil / wine press building
    g.add(C().box(6, 3.5, 8, M.stone, -26, 1.75, 28));
    // amphorae storage
    for (let i = 0; i < 6; i++) {
      const amp = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.7, 1.6, 8), M.brickDark);
      amp.position.set(18 + (i % 3) * 2.4, 0.8, 34 + Math.floor(i / 3) * 2.6);
      g.add(amp);
    }
    // vineyard rows
    for (let r = 0; r < 5; r++) {
      for (let i = 0; i < 6; i++) {
        const post = C().box(0.25, 1.4, 0.25, M.darkWood, 24 + i * 3, 0.7, 42 + r * 4);
        const vine = C().box(2.8, 0.5, 1.2, M.foliageDark, 24 + i * 3 + 1.4, 0.9, 42 + r * 4);
        g.add(post, vine);
      }
    }
    // olive grove
    for (let i = 0; i < 9; i++) {
      const tr = C().tree(0.9);
      tr.position.set(-30 + (i % 3) * 8, 0, 40 + Math.floor(i / 3) * 7);
      g.add(tr);
    }
    // villa walls
    g.add(C().box(70, 2, 1.2, M.stone, 0, 1, 38));
    g.add(C().box(1.2, 2, 38, M.stone, -34, 1, 19));
    g.add(C().box(1.2, 2, 38, M.stone, 34, 1, 19));
    g.add(C().box(70, 2, 1.2, M.stone, 0, 1, -19));
    return g;
  }

  function buildVillas(scene) {
    // along the Via Appia (SW, outside the walls)
    let v = villa();
    v.position.set(150, T().heightAt(150, -230), -230);
    v.rotation.y = 0.8;
    scene.add(v);
    scene.add(T().makeLabel('VILLA (VIA APPIA)', 150, 16, -230));

    // west of the city, near the Campus Martius
    v = villa();
    v.position.set(-250, T().heightAt(-250, 90), 90);
    v.rotation.y = -0.5;
    scene.add(v);
    scene.add(T().makeLabel('VILLA (WEST)', -250, 16, 90));

    // far SE countryside
    v = villa();
    v.position.set(280, T().heightAt(280, -120), -120);
    v.rotation.y = -1.1;
    scene.add(v);
    scene.add(T().makeLabel('VILLA RUSTICA', 280, 16, -120));
  }

  window.Rome.villas = { build: buildVillas, villa: villa };
})();
