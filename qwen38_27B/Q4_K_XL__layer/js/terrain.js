/* ============================================================
   terrain.js — Historically-inspired terrain of Imperial Rome
   - The 7 hills (Palatine, Capitoline, Quirinal, Viminal,
     Esquiline, Caelian, Aventine)
   - The Tiber River with its great meander enclosing
     Campus Martius, plus the river bed depression
   - Flattened Forum valley (Cloaca Maxima drainage) and
     Circus Maximus valley
   Also provides the shared build helpers used by all modules.
   ============================================================ */
window.ROME = (function () {
  'use strict';

  /* ---- The seven hills (x = east, z = south, metres) ---- */
  const HILLS = [
    { name: 'Palatine',  x:  120, z:  200, h: 40, r: 250 },
    { name: 'Capitoline',x:  -90, z:  140, h: 38, r: 200 },
    { name: 'Quirinal',  x:  140, z: -560, h: 30, r: 260 },
    { name: 'Viminal',   x: -140, z: -430, h: 24, r: 210 },
    { name: 'Esquiline', x:  620, z: -200, h: 44, r: 380 },
    { name: 'Caelian',   x:  430, z:  460, h: 40, r: 300 },
    { name: 'Aventine',  x:  180, z:  720, h: 32, r: 270 }
  ];

  /* ---- Tiber: great meander around Campus Martius ---- */
  function riverXAt(z) {
    // Runs roughly N-S, swings far west around z=-300 (Campus Martius)
    return 110 - 640 * Math.exp(-((z + 300) * (z + 300)) / (2 * 430 * 430));
  }

  const RIVER_HALF_W = 34;      // half width of the water channel
  const RIVER_BED_Y  = -6.5;    // water surface height

  /* smooth flat patches (drained valley floors, lowlands) */
  const FLATS = [
    { x:   20, z:  190, r: 210, t:  9 },   // Roman Forum valley
    { x:  210, z:  460, r: 170, t:  5 },   // Circus Maximus valley
    { x: -460, z:   60, r: 300, t:  4 },   // Campus Martius lowland
    { x: -300, z:  -420, r: 180, t:  5 }   // Forum Boarium / Field of Mars
  ];

  function smoothstep(a, b, x) {
    const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  }

  /* ---- terrain height field ---- */
  function heightAt(x, z) {
    let h = 0;
    for (let i = 0; i < HILLS.length; i++) {
      const hi = HILLS[i];
      const dx = x - hi.x, dz = z - hi.z;
      h += hi.h * Math.exp(-(dx * dx + dz * dz) / (2 * hi.r * hi.r));
    }
    // gentle rolling countryside for the far fields
    h += 2.2 * Math.sin(x * 0.008) * Math.cos(z * 0.011);
    // Tiber bed
    const d = x - riverXAt(z);
    h -= 14 * Math.exp(-(d * d) / (2 * 55 * 55));
    // drained flat areas
    for (let i = 0; i < FLATS.length; i++) {
      const f = FLATS[i];
      const dist = Math.hypot(x - f.x, z - f.z);
      const w = 1 - smoothstep(f.r * 0.45, f.r, dist);
      if (w > 0) h = h + (f.t - h) * w;
    }
    return h;
  }

  /* ---- shared materials ---- */
  const M = {
    stone:      new THREE.MeshLambertMaterial({ color: 0xb8ae9c }),
    travertine: new THREE.MeshLambertMaterial({ color: 0xd8c9a3 }),
    marble:     new THREE.MeshLambertMaterial({ color: 0xe9e6dc }),
    brick:      new THREE.MeshLambertMaterial({ color: 0x9c5b41 }),
    tuff:       new THREE.MeshLambertMaterial({ color: 0xbfa87e }),
    terracotta: new THREE.MeshLambertMaterial({ color: 0xb05a3c }),
    wood:       new THREE.MeshLambertMaterial({ color: 0x7a5b3a }),
    sand:       new THREE.MeshLambertMaterial({ color: 0xcdbb92 }),
    water:      new THREE.MeshLambertMaterial({ color: 0x2f6f9e, transparent: true, opacity: 0.88 }),
    gold:       new THREE.MeshLambertMaterial({ color: 0xd9a832 }),
    bronze:     new THREE.MeshLambertMaterial({ color: 0x8a6d3b }),
    dark:       new THREE.MeshLambertMaterial({ color: 0x6e6252 }),
    fresco:     new THREE.MeshLambertMaterial({ color: 0xd77a52 }),
    green:      new THREE.MeshLambertMaterial({ color: 0x4a6b3a })
  };

  /* ---- tiny geometry helpers (y = BOTTOM of object, absolute) ---- */
  function box(w, h, d, mat, x, y, z, ry) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y + h / 2, z);
    if (ry) m.rotation.y = ry;
    m.castShadow = m.receiveShadow = true;
    return m;
  }
  function cyl(rt, rb, h, seg, mat, x, y, z) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat);
    m.position.set(x, y + h / 2, z);
    m.castShadow = m.receiveShadow = true;
    return m;
  }
  /* cypress / olive tree */
  function tree(x, z, s) {
    const g = new THREE.Group();
    const ground = heightAt(x, z);
    g.add(cyl(0.3 * s, 0.4 * s, 2.2 * s, 6, M.wood, 0, 0, 0));
    const c = new THREE.Mesh(new THREE.ConeGeometry(1.4 * s, 5.5 * s, 8), M.green);
    c.position.set(0, 2.2 * s + 2.6 * s, 0);
    c.castShadow = true;
    g.add(c);
    g.position.set(x, ground, z);
    return g;
  }
  function column(x, z, r, h, mat) {
    const g = new THREE.Group();
    const ground = heightAt(x, z);
    g.add(cyl(r * 1.3, r * 1.5, h * 0.08, 12, mat || M.marble, 0, 0, 0)); // base
    g.add(cyl(r, r * 1.05, h * 0.88, 12, mat || M.marble, 0, h * 0.06, 0)); // shaft
    g.add(cyl(r * 1.4, r * 1.1, h * 0.08, 12, mat || M.marble, 0, h * 0.94, 0)); // capital
    g.position.set(x, ground, z);
    return g;
  }

  /* ---- terrain mesh with vertex colours ---- */
  function buildTerrain(scene) {
    const SIZE = 3400, SEGS = 170;
    const geo = new THREE.PlaneGeometry(SIZE, SIZE, SEGS, SEGS);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    const colors = [];
    const cSand = new THREE.Color(0xbfb28c);
    const cGrass = new THREE.Color(0x7d8a4f);
    const cDry = new THREE.Color(0x9d9763);
    const cRock = new THREE.Color(0x8d8578);
    const tmp = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getZ(i);
      const y = heightAt(x, z);
      pos.setY(i, y);
      if (y < 1.5) tmp.copy(cSand);
      else if (y < 12) tmp.copy(cGrass).lerp(cDry, (y - 1.5) / 10.5);
      else tmp.copy(cDry).lerp(cRock, Math.min(1, (y - 12) / 28));
      colors.push(tmp.r, tmp.g, tmp.b);
    }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    const mat = new THREE.MeshLambertMaterial({ vertexColors: true });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.receiveShadow = true;
    scene.add(mesh);
  }

  /* ---- Tiber ribbon ---- */
  function buildRiver(scene) {
    const pts = [];
    for (let z = -1700; z <= 1700; z += 20) pts.push(riverXAt(z));
    const pos = [], idx = [], count = pts.length;
    for (let i = 0; i < count; i++) {
      const cx = pts[i];
      pos.push(cx - RIVER_HALF_W, RIVER_BED_Y, -1700 + i * 20);
      pos.push(cx + RIVER_HALF_W, RIVER_BED_Y, -1700 + i * 20);
    }
    for (let i = 0; i < count - 1; i++) {
      const a = i * 2, b = i * 2 + 1, c = i * 2 + 2, d = i * 2 + 3;
      idx.push(a, c, b, b, c, d);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    const river = new THREE.Mesh(geo, M.water);
    scene.add(river);

    // Isola Tiberina (small island in the meander, near the Forum)
    const island = cyl(18, 26, 6, 12, M.sand, riverXAt(-140), RIVER_BED_Y - 6, -140);
    island.scale.set(1.9, 1, 1);
    scene.add(island);
  }

  return {
    HILLS: HILLS,
    heightAt: heightAt,
    riverXAt: riverXAt,
    RIVER_BED_Y: RIVER_BED_Y,
    M: M,
    box: box, cyl: cyl, tree: tree, column: column,
    buildTerrain: buildTerrain,
    buildRiver: buildRiver
  };
})();
