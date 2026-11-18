/* ============================================================
 * walls.js — Aurelian Walls (271–275 CE) + city gates
 * Brick-faced concrete circuit, ~10.6 m high after Stilicho,
 * defensive towers every ~30 m, 18 major gates aligned with
 * the consular roads (Porta Flaminia, Pinciana, Salaria,
 * Maggiore, Tiburtina, Esquilina, Asinaria, San Sebastiano,
 * San Paolo, Latina, Capena...).
 * ============================================================ */

const WALL_CX = 20, WALL_CZ = -40, WALL_R = 620;
const WALL_N = 220;

/* points along the Aurelian circuit, following terrain */
function wallPoints() {
  const pts = [];
  for (let i = 0; i <= WALL_N; i++) {
    const t = i / WALL_N * Math.PI * 2;
    // slightly irregular plan (ellipse-ish)
    const r = WALL_R * (1 + 0.04 * Math.sin(2 * t + 1));
    let x = WALL_CX + Math.cos(t) * r;
    const z = WALL_CZ + Math.sin(t) * r * 0.94;
    // the Aurelian wall followed the Tiber: never cross the river
    x = Math.max(x, ROME.riverX(z) + 90);
    pts.push({ x, z, y: ROME.terrainHeight(x, z) });
  }
  return pts;
}

function buildGate(scene, angle, name, isMajor) {
  const r = WALL_R * (1 + 0.04 * Math.sin(2 * angle + 1));
  const z = WALL_CZ + Math.sin(angle) * r * 0.94;
  const x = Math.max(WALL_CX + Math.cos(angle) * r, ROME.riverX(z) + 90);
  const y = ROME.terrainHeight(x, z);
  const g = new THREE.Group();
  const trav = ROME.MAT.travertine, brick = ROME.MAT.brick;

  const W = isMajor ? 16 : 10, H = 14, D = 8;
  // two piers
  for (const s of [-1, 1]) {
    const pier = new THREE.Mesh(new THREE.BoxGeometry(D, H, 3.5), brick);
    pier.position.set(0, H / 2, s * (W / 2 - 1.75));
    pier.castShadow = true; g.add(pier);
    const cap = new THREE.Mesh(new THREE.BoxGeometry(D + 1, 0.8, 4.5), trav);
    cap.position.set(0, H + 0.4, s * (W / 2 - 1.75)); g.add(cap);
  }
  // arch (half torus)
  const archR = W / 2 - 1.75;
  const arch = new THREE.Mesh(new THREE.TorusGeometry(archR, 1.4, 8, 16, Math.PI), trav);
  arch.position.y = H * 0.55;
  arch.rotation.y = Math.PI / 2;
  g.add(arch);
  // top beam + battlement
  const beam = new THREE.Mesh(new THREE.BoxGeometry(D + 1, 3.2, W + 2), brick);
  beam.position.y = H + 1.6; beam.castShadow = true; g.add(beam);
  const batt = new THREE.Mesh(new THREE.BoxGeometry(D + 1.5, 1.5, W + 2), trav);
  batt.position.y = H + 3.6; g.add(batt);

  g.position.set(x, y, z);
  g.rotation.y = -angle; // gate width along the wall, passage radial
  scene.add(g);
  ROME.makeLabel(scene, name, x + Math.cos(angle) * 4, z + Math.sin(angle) * 4, y);
}

function initWalls(scene) {
  const pts = wallPoints();
  // curtain wall
  ROME.makeStrip(scene, {
    points: pts, material: ROME.MAT.brick,
    width: 3.6, thickness: 10.6, lift: 5.0
  });
  // merlons on top
  ROME.makeStrip(scene, {
    points: pts, material: ROME.MAT.tuff,
    width: 4.4, thickness: 1.2, lift: 10.6 + 0.5
  });
  // defensive towers every ~30 m (381 historically!)
  const towerGeo = new THREE.BoxGeometry(7, 13, 7);
  const towers = new THREE.InstancedMesh(towerGeo, ROME.MAT.brick, 100);
  const dummy = new THREE.Object3D();
  let ti = 0;
  for (let i = 0; i < pts.length - 1 && ti < 100; i += 5) {
    const p = pts[i];
    dummy.position.set(p.x, p.y + 6.5, p.z);
    dummy.rotation.y = 0;
    dummy.scale.set(1, 1, 1);
    dummy.updateMatrix();
    towers.setMatrixAt(ti++, dummy.matrix);
  }
  towers.count = ti;
  towers.castShadow = true;
  scene.add(towers);

  /* ---------------- Gates (angle: 0 = east, CCW) ---------------- */
  const TAU = Math.PI * 2;
  const A = (deg) => deg * Math.PI / 180;
  buildGate(scene, A(-90),  'Porta Flaminia (Porta del Popolo)', true);  // north
  buildGate(scene, A(-125), 'Porta Pinciana', false);
  buildGate(scene, A(-55),  'Porta Salaria', false);
  buildGate(scene, A(-20),  'Porta Maggiore (Praenestina)', true);
  buildGate(scene, A(5),    'Porta Tiburtina', false);
  buildGate(scene, A(30),   'Porta Esquilina', false);
  buildGate(scene, A(60),   'Porta Asinaria', false);
  buildGate(scene, A(90),   'Porta San Sebastiano (Appia)', true);  // south
  buildGate(scene, A(135),  'Porta San Paolo (Ostiensis)', true);  // SSW
  buildGate(scene, A(115),  'Porta Latina', false);
  buildGate(scene, A(155),  'Porta Capena', false);
}
