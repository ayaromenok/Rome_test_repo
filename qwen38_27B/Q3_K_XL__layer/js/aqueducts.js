/* ============================================================
 * aqueducts.js — Masonry aqueduct channels
 * Arched conduits carrying fresh water across the valleys to
 * the fountains, thermae and private villas.
 *  - Aqua Claudia: crosses the city valley on arches
 *  - Aqua Appia: along the south road
 *  - Aqueduct arches integrated into Porta Maggiore
 * ============================================================ */
function buildAquaeductLine(scene, from, to, name) {
  const fx = from.x, fz = from.z, tx = to.x, tz = to.z;
  const len = Math.hypot(tx - fx, tz - fz);
  const ang = Math.atan2(tz - fz, tx - fx);
  const trav = ROME.MAT.travertine;
  const g = new THREE.Group();
  g.position.set(fx, 0, fz);
  g.rotation.y = -ang;

  // series of arches (piers + arch ring)
  const archSpan = 8, pierW = 1.4, H = 16;
  const n = Math.floor(len / archSpan);
  const pierGeo = new THREE.BoxGeometry(pierW, 1, 1);
  const piers = new THREE.InstancedMesh(pierGeo, trav, n + 1);
  const dummy = new THREE.Object3D();
  for (let i = 0; i <= n; i++) {
    const d = i * archSpan;
    const gy = ROME.terrainHeight(fx + Math.cos(ang) * d, fz + Math.sin(ang) * d);
    dummy.position.set(d, gy, 0);
    dummy.scale.set(pierW, H, 6);
    dummy.updateMatrix();
    piers.setMatrixAt(i, dummy.matrix);
  }
  piers.count = n + 1;
  piers.castShadow = true;
  g.add(piers);
  // arch rings
  const archGeo = new THREE.TorusGeometry(archSpan / 2 - pierW / 2, 0.7, 6, 10, Math.PI);
  for (let i = 0; i < n; i++) {
    const d = (i + 0.5) * archSpan;
    const gy = ROME.terrainHeight(fx + Math.cos(ang) * d, fz + Math.sin(ang) * d);
    const a = new THREE.Mesh(archGeo, trav);
    a.position.set(d, gy, 0);
    g.add(a);
  }
  // water channel on top, following the terrain on its piers
  const midX = (fx + tx) / 2, midZ = (fz + tz) / 2;
  const segLen = len / n;
  for (let i = 0; i < n; i++) {
    const d0 = i * archSpan, d1 = d0 + archSpan;
    const g0 = ROME.terrainHeight(fx + Math.cos(ang) * d0, fz + Math.sin(ang) * d0);
    const g1 = ROME.terrainHeight(fx + Math.cos(ang) * d1, fz + Math.sin(ang) * d1);
    const c = new THREE.Mesh(new THREE.BoxGeometry(archSpan * 1.02, 2.2, 4.5), ROME.MAT.marble);
    c.position.set((d0 + d1) / 2, (g0 + g1) / 2 + H + 1.1, 0);
    g.add(c);
    const w = new THREE.Mesh(new THREE.BoxGeometry(archSpan * 1.02, 0.5, 3.4), ROME.MAT.water);
    w.position.set((d0 + d1) / 2, (g0 + g1) / 2 + H + 2.0, 0);
    g.add(w);
  }
  scene.add(g);
  if (name) ROME.makeLabel(scene, name, midX, midZ, Math.max(ROME.terrainHeight(midX, midZ) + H + 6, H + 6));
}

function initAqueducts(scene) {
  // Aqua Claudia over the valley east→west
  buildAquaeductLine(scene, { x: 480, z: -520 }, { x: -250, z: -140 }, 'Aqua Claudia');
  // Aqua Appia along the south
  buildAquaeductLine(scene, { x: 500, z: 380 }, { x: 150, z: 520 }, 'Aqua Appia');
}
