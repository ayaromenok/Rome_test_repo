/* ============================================================
 * terrain.js — Shared ROME namespace, historical heightmap
 * (7 hills, Tiber river bend, Campus Martius) + building helpers
 * ============================================================ */
const ROME = {};

/* -------------------- The Seven Hills --------------------
 * World units = meters. x = east, z = south, y = up.
 * Forum Romanum sits at the origin (0,0).
 */
ROME.HILLS = [
  { name: 'Palatine',   x:  100, z: -180, h:  45, s:  90 },
  { name: 'Capitoline', x: -170, z:  -60, h:  44, s:  50 },
  { name: 'Quirinal',   x:  240, z: -300, h:  28, s:  90 },
  { name: 'Viminal',   x:  350, z: -330, h:  18, s:  70 },
  { name: 'Esquiline',  x:  240, z:  140, h:  22, s: 110 },
  { name: 'Caelian',    x:  110, z:  220, h:  16, s:  80 },
  { name: 'Aventine',   x:  -60, z:  170, h:  14, s:  70 },
  { name: 'Janiculum',  x: -640, z:  260, h:  12, s:  90 }, // beyond the Tiber
];

/* Tiber river centerline: runs north→south on the west side,
 * swinging east around the Campus Martius bend. */
ROME.riverX = function (z) {
  return -800 + 90 * Math.sin(0.0015 * z + 0.5)
       + 320 * Math.exp(-Math.pow((z - 150) / 260, 2)); // Campus Martius bend
};
ROME.RIVER_HALF_W = 60;

ROME.terrainHeight = function (x, z) {
  let h = 0;
  for (const hill of ROME.HILLS) {
    const dx = x - hill.x, dz = z - hill.z;
    h += hill.h * Math.exp(-(dx * dx + dz * dz) / (2 * hill.s * hill.s));
  }
  // Campus Martius: flat marshy plain (drained) on the west bank
  const cx = -330 - ROME.riverX(150) * 0 + 0; // plain center relative
  const cdx = x - (-350), cdz = z - 150;
  h *= 1 - 0.55 * Math.exp(-(cdx * cdx + cdz * cdz) / (2 * 170 * 170));

  // Tiber carve
  const rx = ROME.riverX(z);
  const d = Math.abs(x - rx);
  const W = ROME.RIVER_HALF_W;
  if (d < W) {
    const prof = -5 * Math.pow(1 - Math.pow(d / W, 2), 1.2);
    h = Math.min(h, prof);
  }
  return h;
};

/* -------------------- Materials palette -------------------- */
ROME.MAT = {};
ROME.initMaterials = function () {
  const M = ROME.MAT;
  M.marble     = new THREE.MeshStandardMaterial({ color: 0xf2eee3, roughness: 0.65 });
  M.stone      = new THREE.MeshStandardMaterial({ color: 0xd8d0c0, roughness: 0.9 });
  M.travertine = new THREE.MeshStandardMaterial({ color: 0xe8e0cf, roughness: 0.85 });
  M.brick      = new THREE.MeshStandardMaterial({ color: 0xa5766a, roughness: 0.95 });
  M.tuff       = new THREE.MeshStandardMaterial({ color: 0x9a8f7a, roughness: 1.0 });
  M.roof       = new THREE.MeshStandardMaterial({ color: 0x9a5a44, roughness: 0.9 });
  M.wood       = new THREE.MeshStandardMaterial({ color: 0x8a6a42, roughness: 1.0 });
  M.gold       = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.35, metalness: 0.7 });
  M.obsidian   = new THREE.MeshStandardMaterial({ color: 0x2a2a35, roughness: 0.3 });
  M.water      = new THREE.MeshStandardMaterial({ color: 0x2e6f8e, roughness: 0.25, metalness: 0.1, transparent: true, opacity: 0.85 });
  M.road       = new THREE.MeshStandardMaterial({ color: 0xcfc4a6, roughness: 1.0 });
  M.roadStone  = new THREE.MeshStandardMaterial({ color: 0xb8ad93, roughness: 1.0 });
  M.sand       = new THREE.MeshStandardMaterial({ color: 0xd9cba4, roughness: 1.0 });
};

/* -------------------- Geometry helpers -------------------- */
const _box = new THREE.BoxGeometry(1, 1, 1);
const _cyl = new THREE.CylinderGeometry(0.42, 0.5, 1, 10);

ROME.box = function (scene, mat, sx, sy, sz, x, y, z, rx, ry, rz) {
  const m = new THREE.Mesh(_box, mat);
  m.scale.set(sx, sy, sz);
  m.position.set(x, y, z);
  if (rx) m.rotation.x = rx; if (ry) m.rotation.y = ry; if (rz) m.rotation.z = rz;
  m.castShadow = m.receiveShadow = true;
  scene.add(m);
  return m;
};

ROME.cyl = function (scene, mat, r, h, x, y, z, segs) {
  const geo = new THREE.CylinderGeometry(r * 0.88, r, h, segs || 10);
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y + h / 2, z);
  m.castShadow = m.receiveShadow = true;
  scene.add(m);
  return m;
};

/* Densely sample a polyline of waypoints, following terrain height.
 * Returns array of {x, z, y, inRiver}. */
ROME.samplePath = function (waypoints, step) {
  step = step || 6;
  const out = [];
  for (let i = 0; i < waypoints.length - 1; i++) {
    const a = waypoints[i], b = waypoints[i + 1];
    const len = Math.hypot(b.x - a.x, b.z - a.z);
    const n = Math.max(1, Math.floor(len / step));
    for (let j = 0; j < n; j++) {
      const t = j / n;
      const x = a.x + (b.x - a.x) * t, z = a.z + (b.z - a.z) * t;
      const y = ROME.terrainHeight(x, z);
      out.push({ x, z, y: Math.max(y, -4.5) });
    }
  }
  const last = waypoints[waypoints.length - 1];
  out.push({ x: last.x, z: last.z, y: Math.max(ROME.terrainHeight(last.x, last.z), -4.5) });
  return out;
};

/* Instanced flat/vertical strip following a sampled path
 * (roads, walls, aqueduct channels...). */
ROME.makeStrip = function (scene, opts) {
  const pts = opts.points;
  const mat = opts.material;
  const n = pts.length - 1;
  if (n < 1) return null;
  const geo = new THREE.BoxGeometry(1, 1, 1);
  const mesh = new THREE.InstancedMesh(geo, mat, n);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < n; i++) {
    const a = pts[i], b = pts[i + 1];
    const dx = b.x - a.x, dz = b.z - a.z;
    const len = Math.hypot(dx, dz);
    if (len < 0.01) continue;
    dummy.position.set((a.x + b.x) / 2, (a.y + b.y) / 2 + opts.lift, (a.z + b.z) / 2);
    dummy.rotation.set(0, Math.atan2(dx, dz), 0);
    dummy.scale.set(opts.width, opts.thickness, len * 1.12);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  }
  mesh.castShadow = mesh.receiveShadow = true;
  scene.add(mesh);
  return mesh;
};

/* Roman temple: high podium, single frontal stair, deep porch
 * with columns, closed cella, pediment roof. */
ROME.makeTemple = function (scene, opts) {
  const g = new THREE.Group();
  const w = opts.w || 14, d = opts.d || 16, colH = opts.colH || 5;
  const podH = 2.2, n = opts.cols || 4;
  const marble = ROME.MAT.marble, stone = ROME.MAT.stone, roof = ROME.MAT.roof;
  const add = (m, x, y, z) => { m.position.set(x, y, z); g.add(m); m.castShadow = true; return m; };

  // podium
  const pod = add(new THREE.Mesh(_box, stone), 0, podH / 2, 0); pod.scale.set(w * 1.15, podH, d * 1.1);
  // stairs (single frontal entry)
  const steps = 5;
  for (let i = 0; i < steps; i++) {
    const s = add(new THREE.Mesh(_box, marble), 0, 0.2 + i * 0.44, d * 1.1 + (steps - i) * 0.55);
    s.scale.set(w * 0.5, 0.42, 0.55);
  }
  // cella (inner room for the god)
  const cella = add(new THREE.Mesh(_box, marble), 0, podH + colH * 0.45, -d * 0.18);
  cella.scale.set(w * 0.7, colH * 0.9, d * 0.62);
  // porch columns (free-standing front colonnade)
  const colGeo = new THREE.CylinderGeometry(0.45, 0.55, colH, 12);
  for (let i = 0; i < n; i++) {
    const cx = (i / (n - 1) - 0.5) * w * 0.72;
    const c = add(new THREE.Mesh(colGeo, marble), cx, podH + colH / 2, d * 0.42);
    // capital
    const cap = add(new THREE.Mesh(_box, marble), cx, podH + colH + 0.15, d * 0.42);
    cap.scale.set(1.5, 0.5, 1.5);
  }
  // engaged side columns
  for (let i = 1; i < 4; i++) {
    const zc = (i / 4 - 0.5) * d * 0.9;
    for (const sx of [-1, 1]) {
      const c = add(new THREE.Mesh(colGeo, marble), sx * w * 0.36, podH + colH / 2, zc);
      c.scale.x = c.scale.z = 0.6;
    }
  }
  // entablature + roof + pediment
  const ent = add(new THREE.Mesh(_box, marble), 0, podH + colH + 0.55, 0);
  ent.scale.set(w * 0.85, 0.7, d * 0.8);
  const roofM = new THREE.Mesh(new THREE.ConeGeometry(1, 1, 4), roof);
  const roofA = add(roofM, 0, podH + colH + 0.9 + 1.2, 0);
  roofA.scale.set(w * 0.6, 2.4, d * 0.55);
  roofA.rotation.y = Math.PI / 4;
  const ped = add(new THREE.Mesh(_box, marble), 0, podH + colH + 1.3, d * 0.44);
  ped.scale.set(w * 0.85, 0.5, 0.25);
  const pedTop = add(new THREE.Mesh(new THREE.ConeGeometry(1, 1, 4), marble), 0, podH + colH + 1.6, d * 0.44);
  pedTop.scale.set(w * 0.4, 1.4, 0.18); pedTop.rotation.y = Math.PI / 4;

  g.position.set(opts.x, opts.y != null ? opts.y : ROME.terrainHeight(opts.x, opts.z), opts.z);
  g.rotation.y = opts.rotY || 0;
  scene.add(g);
  return g;
};

/* Floating text label (canvas sprite). */
ROME.makeLabel = function (scene, text, x, z, y) {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgba(20,15,8,0.65)';
  ctx.fillRect(0, 20, 512, 88);
  ctx.font = 'bold 44px Georgia, serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = '#f0e6c8';
  ctx.fillText(text, 256, 66);
  const tex = new THREE.CanvasTexture(canvas);
  const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }));
  spr.scale.set(34, 8.5, 1);
  if (y == null) y = ROME.terrainHeight(x, z);
  spr.position.set(x, y + 22, z);
  scene.add(spr);
  return spr;
};

/* Simple tree. */
ROME.makeTree = function (scene, x, z, scale) {
  scale = scale || 1;
  const y = ROME.terrainHeight(x, z);
  if (y < 1) return;
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.4, 2, 6), ROME.MAT.wood);
  trunk.position.y = 1;
  const crown = new THREE.Mesh(new THREE.ConeGeometry(1.6, 4, 7),
    new THREE.MeshStandardMaterial({ color: 0x4a6b35, roughness: 1 }));
  crown.position.y = 4;
  g.add(trunk); g.add(crown);
  g.position.set(x, y, z);
  g.scale.setScalar(scale);
  scene.add(g);
};
