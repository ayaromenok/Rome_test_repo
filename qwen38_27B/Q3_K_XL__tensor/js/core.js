/* core.js - shared materials and geometry helpers for Ancient Rome */
window.Rome = window.Rome || {};

(function () {
  const C = {};

  // ---------------- Materials ----------------
  C.mats = {
    travertine: new THREE.MeshLambertMaterial({ color: 0xd9cfae }),
    marble:     new THREE.MeshLambertMaterial({ color: 0xe9e4d4 }),
    stone:      new THREE.MeshLambertMaterial({ color: 0xb9b09a }),
    stoneDark:  new THREE.MeshLambertMaterial({ color: 0x8e8672 }),
    brick:      new THREE.MeshLambertMaterial({ color: 0xb06a44 }),
    brickDark:  new THREE.MeshLambertMaterial({ color: 0x8e4f33 }),
    roof:       new THREE.MeshLambertMaterial({ color: 0xa8552f }),
    wood:       new THREE.MeshLambertMaterial({ color: 0x7a5b3a }),
    darkWood:   new THREE.MeshLambertMaterial({ color: 0x5d4429 }),
    sand:       new THREE.MeshLambertMaterial({ color: 0xd6c48f }),
    road:       new THREE.MeshLambertMaterial({ color: 0xc7bda4 }),
    cobble:     new THREE.MeshLambertMaterial({ color: 0x9a927e }),
    water:      new THREE.MeshLambertMaterial({ color: 0x3a6f8e, transparent: true, opacity: 0.85 }),
    waterBlue:  new THREE.MeshLambertMaterial({ color: 0x4c88a8, transparent: true, opacity: 0.9 }),
    gold:       new THREE.MeshLambertMaterial({ color: 0xd4af37 }),
    green:      new THREE.MeshLambertMaterial({ color: 0x5d8a3c }),
    foliage:    new THREE.MeshLambertMaterial({ color: 0x4d7a2f }),
    foliageDark:new THREE.MeshLambertMaterial({ color: 0x3c6226 }),
    paintRed:   new THREE.MeshLambertMaterial({ color: 0x9e3b2c }),
    paintBlue:  new THREE.MeshLambertMaterial({ color: 0x3f618c }),
    paintCream: new THREE.MeshLambertMaterial({ color: 0xe3d9bd }),
    concrete:   new THREE.MeshLambertMaterial({ color: 0xb8b0a0 }),
    black:      new THREE.MeshLambertMaterial({ color: 0x2a2622 }),
  };

  const M = C.mats;

  // ---------------- Primitive helpers ----------------
  C.box = function (w, h, d, mat, x, y, z) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x || 0, y || 0, z || 0);
    return m;
  };

  // Gabled roof: triangular prism along the Z axis
  C.gableRoof = function (w, d, h, mat) {
    const g = new THREE.CylinderGeometry(1, 1, d, 3, false);
    const m = new THREE.Mesh(g, mat || M.roof);
    m.rotation.x = Math.PI / 2;
    m.rotation.z = Math.PI; // flat side down
    m.scale.set(w / 1.5, 1, h / 1.5);
    return m;
  };

  // Single column (base + shaft + capital)
  C.column = function (r, h, mat) {
    const g = new THREE.Group();
    const base = C.box(r * 2.6, r * 0.9, r * 2.6, mat || M.marble);
    base.position.y = r * 0.45;
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.85, r, h, 10), mat || M.marble);
    shaft.position.y = h / 2 + r * 0.9;
    const cap = C.box(r * 2.4, r * 0.8, r * 2.4, mat || M.marble);
    cap.position.y = h + r * 0.9 + r * 0.4;
    g.add(base, shaft, cap);
    return g;
  };

  // Arch frame geometry (rectangle with arched opening cut out), extruded in +Z
  C.archFrameGeometry = function (w, h, openingW, archH, depth) {
    const s = new THREE.Shape();
    s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0);
    s.lineTo(w / 2, h); s.lineTo(-w / 2, h); s.closePath();
    const half = openingW / 2;
    const r = half;
    const hole = new THREE.Path();
    hole.moveTo(-half, 0);
    hole.lineTo(half, 0);
    hole.lineTo(half, archH);
    hole.absarc(0, archH, r, 0, Math.PI, false);
    hole.lineTo(-half, 0);
    s.holes.push(hole);
    const g = new THREE.ExtrudeGeometry(s, { depth: depth || 1, bevelEnabled: false });
    g.translate(0, 0, -depth / 2);
    return g;
  };

  // A triumphal arch gate (single bay, decorated)
  C.triumphalArch = function (scale, mat) {
    scale = scale || 1; mat = mat || M.travertine;
    const g = new THREE.Group();
    const W = 8 * scale, H = 10 * scale, D = 3.5 * scale;
    // front / back arch frames
    const frameG = C.archFrameGeometry(W, H, 4.2 * scale, 3 * scale, D);
    const front = new THREE.Mesh(frameG, mat);
    const back = new THREE.Mesh(frameG, mat);
    g.add(front, back);
    // side walls
    const sideL = C.box(D, H, 1.4 * scale, mat, -W / 2 + 0.7 * scale, H / 2, 0);
    const sideR = C.box(D, H, 1.4 * scale, mat, W / 2 - 0.7 * scale, H / 2, 0);
    g.add(sideL, sideR);
    // attic
    const attic = C.box(W + 0.4 * scale, 1.6 * scale, D + 0.3 * scale, M.stoneDark, 0, H + 0.8 * scale, 0);
    g.add(attic);
    // statue on top
    const stat = C.box(1.2 * scale, 2.2 * scale, 1.2 * scale, M.gold, 0, H + 2.6 * scale, 0);
    g.add(stat);
    return g;
  };

  // A simple classical temple: high podium, front columns, cella, gabled roof
  C.romanTemple = function (opts) {
    opts = opts || {};
    const nFront = opts.cols || 6;           // columns across the front
    const w = opts.width || 14;              // temple width (x)
    const d = opts.depth || 20;              // temple depth (z)
    const colH = opts.colH || 6;
    const podiumH = opts.podiumH || 2.4;
    const mat = opts.mat || M.travertine;
    const g = new THREE.Group();

    // podium + stairs
    const podium = C.box(w + 4, podiumH, d + 4, mat, 0, podiumH / 2, 0);
    g.add(podium);
    for (let i = 0; i < 4; i++) {
      g.add(C.box(w + 4 + i * 1.2, 0.4, 1.2, mat, 0, podiumH - 0.2 - i * 0.4, d / 2 + 2 + 0.6 + i * 1.2));
    }
    // floor of the pronaos
    g.add(C.box(w, 0.3, d * 0.45, M.stone, 0, podiumH + 0.15, d * 0.25));
    // front colonnade (single front entry, deep porch)
    const spacing = w / (nFront - 1);
    for (let i = 0; i < nFront; i++) {
      const col = C.column(0.55, colH, mat);
      col.position.set(-w / 2 + i * spacing, podiumH + 0.3, d / 2 - 1.5);
      g.add(col);
    }
    // engaged side columns
    for (let i = 1; i < nFront - 1; i++) {
      const sideL = C.column(0.45, colH, mat);
      sideL.position.set(-w / 2 - 0.4, podiumH + 0.3, -d / 2 + 2 + i * (d - 5) / (nFront - 2));
      const sideR = C.column(0.45, colH, mat);
      sideR.position.set(w / 2 + 0.4, podiumH + 0.3, -d / 2 + 2 + i * (d - 5) / (nFront - 2));
      g.add(sideL, sideR);
    }
    // architrave + pediment
    g.add(C.box(w + 1.5, 0.9, 1.6, mat, 0, podiumH + colH + 0.6, d / 2 - 1.5));
    // cella
    const cella = C.box(w * 0.8, colH + 0.9, d * 0.55, mat, 0, podiumH + (colH + 0.9) / 2, -d * 0.18);
    g.add(cella);
    // gabled roof over the full length
    const roof = C.gableRoof(w + 2, d + 3, 2.6, mat === M.brick ? M.brick : M.travertine);
    roof.position.y = podiumH + colH + 1.6;
    g.add(roof);
    return g;
  };

  // Tree
  C.tree = function (scale) {
    scale = scale || 1;
    const g = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25 * scale, 0.35 * scale, 2.4 * scale, 6), M.wood);
    trunk.position.y = 1.2 * scale;
    const crown = new THREE.Mesh(new THREE.SphereGeometry(1.8 * scale, 7, 6), M.foliage);
    crown.position.y = 3.4 * scale;
    const crown2 = new THREE.Mesh(new THREE.SphereGeometry(1.2 * scale, 7, 6), M.foliageDark);
    crown2.position.set(0.6 * scale, 4.2 * scale, 0.3 * scale);
    g.add(trunk, crown, crown2);
    return g;
  };

  // Point placement helpers for oval / stadium rings
  C.ovalPoint = function (a, b, theta) {
    return { x: a * Math.cos(theta), z: b * Math.sin(theta) };
  };
  C.ovalTangent = function (a, b, theta) {
    const dx = -a * Math.sin(theta), dz = b * Math.cos(theta);
    return Math.atan2(dx, dz);
  };

  // Place a ring of boxes around an oval
  C.ovalRing = function (group, a, b, y, count, boxW, boxD, boxH, mat, cx, cz) {
    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 2;
      const p = C.ovalPoint(a, b, t);
      const m = C.box(boxW, boxH, boxD, mat, 0, 0, 0);
      m.position.set((cx || 0) + p.x, (y || 0) + boxH / 2, (cz || 0) + p.z);
      m.rotation.y = -C.ovalTangent(a, b, t);
      group.add(m);
    }
  };

  C.groupAt = function (g, x, y, z, rotY) {
    g.position.set(x || 0, y || 0, z || 0);
    if (rotY) g.rotation.y = rotY;
    return g;
  };

  window.Rome.core = C;
})();
