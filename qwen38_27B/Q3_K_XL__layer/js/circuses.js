/* ============================================================
 * circuses.js — Circus Maximus
 * Massive chariot-racing track in the valley between the
 * Palatine and Aventine hills, with spina, obelisk, goal eggs
 * and tiered spectator stands (the "Maximus" of Rome).
 * ============================================================ */
function initCircuses(scene) {
  const cx = -10, cz = 40;
  const L = 400, W = 85; // length & width of the track
  const trav = ROME.MAT.travertine, brick = ROME.MAT.brick;
  const marble = ROME.MAT.marble, sand = ROME.MAT.sand;

  // arena sand floor following the terrain
  const sandPts = ROME.samplePath([{ x: cx, z: cz - L / 2 }, { x: cx, z: cz + L / 2 }], 6);
  ROME.makeStrip(scene, { points: sandPts, material: sand, width: 2 * W + 6, thickness: 0.6, lift: 0.3 });

  const g = new THREE.Group();
  const baseY = ROME.terrainHeight(cx, cz) - 1;

  // tiered seating at the (west) start end: elliptical tiers
  const tiers = 6, tierH = 3.2, tierD = 5;
  for (let i = 0; i < tiers; i++) {
    const off = i * tierD + 4;
    const ring = new THREE.Shape();
    const inner = new THREE.Path();
    const M = 36;
    for (let k = 0; k <= M; k++) {
      const t = k / M * Math.PI * 2;
      const X = Math.cos(t) * (W + off), Z = Math.sin(t) * (W + off) * 0.75;
      k === 0 ? ring.moveTo(X, Z) : ring.lineTo(X, Z);
    }
    for (let k = M; k >= 0; k--) {
      const t = k / M * Math.PI * 2;
      inner.lineTo(Math.cos(t) * (W + off - 3), Math.sin(t) * (W + off - 3) * 0.75);
    }
    inner.closePath();
    ring.holes.push(inner);
    const geo = new THREE.ExtrudeGeometry(ring, { depth: tierH, bevelEnabled: false });
    const m = new THREE.Mesh(geo, i % 2 ? trav : brick);
    m.rotation.x = -Math.PI / 2;
    m.position.y = i * tierH;
    m.castShadow = true;
    g.add(m);
  }
  // straight east bank
  const bank = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), trav);
  bank.scale.set(tiers * tierD + 10, tiers * tierH, L + W * 1.5);
  bank.position.set(W + (tiers * tierD + 10) / 2, tiers * tierH / 2, L / 2);
  bank.castShadow = true;
  g.add(bank);

  // spina (central barrier)
  const spina = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), marble);
  spina.scale.set(6, 2.5, L * 0.7);
  spina.position.set(0, 1.25, L * 0.55);
  spina.castShadow = true;
  g.add(spina);
  // obelisk on the spina
  const ob = new THREE.Mesh(new THREE.ConeGeometry(1.6, 24, 4), ROME.MAT.obsidian);
  ob.position.set(0, 2.5 + 12, L * 0.55);
  ob.rotation.y = Math.PI / 4;
  g.add(ob);
  const pyramidion = new THREE.Mesh(new THREE.ConeGeometry(0.8, 2, 4), ROME.MAT.gold);
  pyramidion.position.set(0, 2.5 + 25, L * 0.55);
  pyramidion.rotation.y = Math.PI / 4;
  g.add(pyramidion);
  // goal eggs on the spina
  for (let i = 1; i <= 7; i++) {
    const egg = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 8), ROME.MAT.gold);
    egg.position.set(0, 3.5, L * (i / 8));
    g.add(egg);
  }

  g.position.set(cx, baseY, cz - L / 2);
  scene.add(g);

  // Imperial Palaces on the Palatine plateau (east/north of the track)
  for (const pz of [-210, -150, -90]) {
    const px = 115;
    const py = ROME.terrainHeight(px, pz) - 1;
    const pal = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), ROME.MAT.brick);
    pal.scale.set(5, 10, 55);
    pal.position.set(px, py + 5, pz);
    pal.castShadow = true;
    scene.add(pal);
    const palRoof = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), ROME.MAT.roof);
    palRoof.scale.set(6, 1.2, 55);
    palRoof.position.set(px, py + 10.6, pz);
    scene.add(palRoof);
  }

  ROME.makeLabel(scene, 'Circus Maximus', cx, cz, ROME.terrainHeight(cx, cz) + 24);
  ROME.makeLabel(scene, 'Imperial Palaces (Palatine)', 115, -150, ROME.terrainHeight(115, -150) + 18);
  ROME.makeLabel(scene, 'Palatine Hill', 100, -180, ROME.terrainHeight(100, -180));
}
