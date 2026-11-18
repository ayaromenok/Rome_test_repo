/* ============================================================
 * colosseum.js — Flavian Amphitheatre (Colosseum)
 * East of the Forum, near the Caelian and Esquiline hills.
 * Elliptical ring, 4 tiers of arcades, cavea seating.
 * ============================================================ */
function initColosseum(scene) {
  const cx = 120, cz = 120;
  const a = 52, b = 42; // ellipse radii
  const y = ROME.terrainHeight(cx, cz);
  const trav = ROME.MAT.travertine, marble = ROME.MAT.marble, brick = ROME.MAT.brick;

  const g = new THREE.Group();
  const N = 48;

  // tiered outer walls (elliptical ring), height ~48 m
  const tierH = [14, 12, 12, 8];
  let yy = 0;
  tierH.forEach((h, ti) => {
    const shape = new THREE.Shape();
    const inner = new THREE.Path();
    for (let i = 0; i <= N; i++) {
      const t = i / N * Math.PI * 2;
      const X = Math.cos(t) * a, Z = Math.sin(t) * b;
      i === 0 ? shape.moveTo(X, Z) : shape.lineTo(X, Z);
    }
    for (let i = N; i >= 0; i--) {
      const t = i / N * Math.PI * 2;
      inner.lineTo(Math.cos(t) * (a - 4), Math.sin(t) * (b - 4));
    }
    inner.closePath();
    shape.holes.push(inner);
    const geo = new THREE.ExtrudeGeometry(shape, { depth: h, bevelEnabled: false });
    const m = new THREE.Mesh(geo, ti === 3 ? brick : trav);
    m.rotation.x = -Math.PI / 2;
    m.position.y = yy;
    m.castShadow = m.receiveShadow = true;
    g.add(m);
    yy += h;
  });

  // arcade columns along the outer face (first three tiers)
  const colGeo = new THREE.CylinderGeometry(1.1, 1.3, 9, 10);
  const archGeo = new THREE.TorusGeometry(3.2, 0.55, 6, 12, Math.PI);
  const M = 64;
  for (let i = 0; i < M; i++) {
    const t = (i + 0.5) / M * Math.PI * 2;
    const X = Math.cos(t) * (a + 0.5), Z = Math.sin(t) * (b + 0.5);
    for (let ti = 0; ti < 3; ti++) {
      const cy = 3 + ti * 13;
      const c = new THREE.Mesh(colGeo, marble);
      c.position.set(X, cy, Z);
      c.scale.y = 0.55;
      g.add(c);
      const arc = new THREE.Mesh(archGeo, marble);
      arc.position.set(X, cy - 1.5, Z);
      arc.rotation.y = Math.atan2(Math.cos(t) * a, -Math.sin(t) * b);
      g.add(arc);
    }
  }

  // cavea: elliptical seating bowl (inverted cone ring)
  const cavea = new THREE.Mesh(
    new THREE.CylinderGeometry(30, 36, 16, 40, 1, true), brick);
  cavea.scale.set(a / 36, 1, b / 36);
  cavea.position.y = 10;
  g.add(cavea);
  // arena floor
  const floor = new THREE.Mesh(new THREE.CircleGeometry(1, 40), ROME.MAT.sand);
  floor.scale.set(a * 0.62, 1, b * 0.62);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 1.5;
  floor.receiveShadow = true;
  g.add(floor);

  g.position.set(cx, y, cz);
  scene.add(g);
  ROME.makeLabel(scene, 'Colosseum (Flavian Amphitheatre)', cx, cz, y);
}
