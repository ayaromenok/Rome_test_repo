/* buildings.js - civic and residential buildings: Forum structures, insulae, Palatine palaces */
window.Rome = window.Rome || {};

(function () {
  const T = () => window.Rome.terrain;
  const C = () => window.Rome.core;

  // ---------------- Forum civic buildings ----------------
  function forumBuildings(scene) {
    const g = new THREE.Group();
    const M = C().mats;

    // Curia Julia - the Senate house
    const curia = new THREE.Group();
    curia.add(C().box(16, 14, 22, M.travertine, 0, 7, 0));
    const curRoof = C().gableRoof(17, 23, 3, M.roof);
    curRoof.position.y = 14;
    curia.add(curRoof);
    curia.add(C().box(6, 10, 2, M.travertine, 0, 5, -11.5));      // apsed end
    const curApse = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 12, 14, 1, false, 0, Math.PI), M.travertine);
    curApse.rotation.y = Math.PI / 2;
    curApse.position.set(0, 6, -11);
    curia.add(curApse);
    curia.position.set(-2, T().heightAt(-2, 8), 12);
    curia.rotation.y = Math.PI;
    g.add(curia);
    g.add(T().makeLabel('CURIA JULIA (SENATE)', -2, 19, 12));

    // The Rostra - raised speaker's platform (decorated with ship prows)
    const rostra = new THREE.Group();
    rostra.add(C().box(12, 3, 8, M.stone, 0, 1.5, 0));
    rostra.add(C().box(14, 0.8, 10, M.cobble, 0, 0.4, 0));
    for (let i = 0; i < 4; i++) {
      const prow = new THREE.Mesh(new THREE.ConeGeometry(1.6, 2.6, 6), M.marble);
      prow.position.set(-4.5 + i * 3, 4.3, 0);
      rostra.add(prow);
    }
    rostra.position.set(-18, T().heightAt(-18, -22), -22);
    g.add(rostra);
    g.add(T().makeLabel('ROSTRA', -18, 9, -22));

    // Basilica Julia - long hall with columned portico (law courts, business)
    const bas = new THREE.Group();
    bas.add(C().box(44, 12, 16, M.stone, 0, 6, 0));
    bas.add(C().gableRoof(45, 17, 3.4, M.roof));
    bas.children[1].position.y = 12;
    for (let i = 0; i < 8; i++) {
      const col = C().column(0.5, 6, M.marble);
      col.position.set(-18 + i * 5.2, 0, 9.5);
      bas.add(col);
    }
    bas.add(C().box(44, 0.9, 1.4, M.travertine, 0, 6.8, 9.5));
    bas.position.set(-34, T().heightAt(-34, 22), 22);
    bas.rotation.y = 0.25;
    g.add(bas);
    g.add(T().makeLabel('BASILICA JULIA', -34, 17, 22));

    // Basilica Aemilia - opposite side of the Forum
    const bas2 = bas.clone();
    bas2.position.set(30, T().heightAt(30, -30), -30);
    bas2.rotation.y = Math.PI + 0.2;
    g.add(bas2);
    g.add(T().makeLabel('BASILICA AEMILIA', 30, 17, -30));

    // Basilica of Maxentius (near the Colosseum) - vaulted hall
    const max = new THREE.Group();
    max.add(C().box(30, 18, 60, M.stone, 0, 9, 0));
    for (let i = 0; i < 5; i++) {
      const v = new THREE.Mesh(new THREE.CylinderGeometry(7, 7, 30, 14, 1, false, 0, Math.PI), M.travertine);
      v.rotation.z = Math.PI / 2;
      v.position.set(0, 18 + 1, -20 + i * 10);
      max.add(v);
    }
    max.add(C().gableRoof(31, 61, 4, M.roof));
    max.children[max.children.length - 1].position.y = 18;
    max.position.set(42, T().heightAt(42, 0), 0);
    max.rotation.y = 1.35;
    g.add(max);
    g.add(T().makeLabel('BASILICA OF MAXENTIUS', 42, 26, 0));

    scene.add(g);
    return g;
  }

  // ---------------- Imperial Palaces on the Palatine ----------------
  function palatinePalaces(scene) {
    const g = new THREE.Group();
    const M = C().mats;
    const X = 70, Z = 40, y = T().heightAt(X, Z);
    // Domus Augustana - great palace block
    g.add(C().box(46, 14, 30, M.travertine, X - 8, y + 7, Z - 4));
    const palRoof = C().gableRoof(47, 31, 3.5, M.roof);
    palRoof.position.set(X - 8, y + 14, Z - 4);
    g.add(palRoof);
    // palace peristyle garden
    for (let i = 0; i < 6; i++) {
      const c1 = C().column(0.5, 5, M.marble);
      c1.position.set(X - 30 + i * 9, y, Z + 22);
      g.add(c1);
    }
    g.add(C().box(58, 0.8, 22, M.sand, X, y + 0.4, Z + 30));
    const pool = C().box(16, 0.9, 10, M.water, X, y + 0.9, Z + 30);
    g.add(pool);
    // domed audience hall
    const dom = new THREE.Mesh(new THREE.SphereGeometry(9, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2), M.travertine);
    dom.scale.y = 0.8;
    dom.position.set(X + 24, y + 10, Z - 8);
    g.add(dom);
    const drum = new THREE.Mesh(new THREE.CylinderGeometry(9, 9, 10, 18), M.stone);
    drum.position.set(X + 24, y + 5, Z - 8);
    g.add(drum);
    scene.add(g);
    scene.add(T().makeLabel('IMPERIAL PALACES (PALATINE)', X, y + 26, Z));
    return g;
  }

  // ---------------- Insulae: dense apartment blocks ----------------
  function insulae(scene) {
    const g = new THREE.Group();
    const M = C().mats;
    const W = window.Rome.walls.WALL;
    const rnd = mulberry(2026);

    // exclusion zones (monuments & open spaces)
    const excl = [
      { x: 0, z: 5, r: 80 },       // Forum
      { x: 38, z: -30, r: 95 },    // Circus Maximus
      { x: 100, z: 5, r: 62 },     // Colosseum
      { x: -85, z: 0, r: 95 },     // Campus Martius
      { x: 70, z: 40, r: 42 },     // Palatine palaces
      { x: 42, z: 0, r: 30 },      // Maxentius
      { x: 140, z: 95, r: 55 },    // Caracalla
      { x: 95, z: 165, r: 60 },    // Diocletian
      { x: 168, z: 55, r: 45 },    // Domus Aurea
      { x: -55, z: 20, r: 48 },    // Circus Flaminius
      { x: 110, z: 145, r: 40 },
      { x: -78, z: -52, r: 25 },
      { x: 55, z: 68, r: 32 },
    ];

    let placed = 0, tries = 0;
    while (placed < 130 && tries < 3000) {
      tries++;
      const x = -260 + rnd() * 560;
      const z = -300 + rnd() * 620;
      // inside walls, outside river
      const dWall = Math.hypot(x - W.cx, z - W.cz);
      if (dWall > W.r - 25 || dWall < 40) continue;
      if (T().isWater(x, z) || Math.abs(x - T().riverX(z)) < 30) continue;
      if (T().heightAt(x, z) > 30) continue;   // keep hill summits open
      let ok = true;
      for (let i = 0; i < excl.length; i++) {
        if (Math.hypot(x - excl[i].x, z - excl[i].z) < excl[i].r) { ok = false; break; }
      }
      if (!ok) continue;

      const w = 8 + rnd() * 7, d = 8 + rnd() * 8;
      const floors = 2 + Math.floor(rnd() * 4);      // insulae rose 3-5 storeys
      const h = floors * 3.6;
      const y = T().heightAt(x, z);
      const rot = (Math.floor(rnd() * 4)) * Math.PI / 4;
      const mat = rnd() < 0.6 ? M.brick : (rnd() < 0.5 ? M.paintCream : M.stone);
      const b = C().box(w, h, d, mat);
      b.position.set(x, y + h / 2, z);
      b.rotation.y = rot;
      g.add(b);
      // roof
      const roof = C().gableRoof(w + 1, d + 1, 1.8, rnd() < 0.7 ? M.roof : M.wood);
      roof.position.set(x, y + h, z);
      roof.rotation.y = rot;
      g.add(roof);
      placed++;
    }

    // Caelian & Aventine villas' gardens: a scatter of trees on the hills
    for (let i = 0; i < 40; i++) {
      const x = -240 + rnd() * 560, z = -280 + rnd() * 560;
      const h = T().heightAt(x, z);
      if (h > 5 && h < 38 && !T().isWater(x, z) && Math.hypot(x - W.cx, z - W.cz) < W.r - 20) {
        const tr = C().tree(0.8 + rnd() * 0.8);
        tr.position.set(x, h, z);
        g.add(tr);
      }
    }
    scene.add(g);
    return g;
  }

  // small deterministic PRNG
  function mulberry(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function buildBuildings(scene) {
    forumBuildings(scene);
    palatinePalaces(scene);
    insulae(scene);
  }

  window.Rome.buildings = { build: buildBuildings };
})();
