/* ============================================================
 * temples.js — Temples of ancient Rome
 *  - Pantheon (dome + oculus, portico)
 *  - Temple of Jupiter Optimus Maximus (Capitoline)
 *  - Temple of Saturn (Forum, state treasury)
 *  - Temple of Vesta & Atrium Vestae (circular shrine)
 *  - Temple of Portunus (Ionic, Forum Boarium)
 *  - Temple of Venus and Roma (Hadrian, largest temple)
 *  - Temple of Serapis (Quirinal)
 *  - Temple of Aesculapius (Isola Tiberina side)
 * ============================================================ */

function buildPantheon(scene) {
  const x = 185, z = -60, y = ROME.terrainHeight(x, z);
  const g = new THREE.Group();
  const marble = ROME.MAT.marble, trav = ROME.MAT.travertine, roof = ROME.MAT.roof;

  // cylindrical drum
  const drum = new THREE.Mesh(new THREE.CylinderGeometry(24, 24, 14, 28), trav);
  drum.position.y = 7; drum.castShadow = drum.receiveShadow = true; g.add(drum);
  // concrete dome (cone as dome profile)
  const dome = new THREE.Mesh(new THREE.SphereGeometry(24, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2), trav);
  dome.position.y = 14; dome.scale.y = 0.95; dome.castShadow = true; g.add(dome);
  // oculus ring
  const oculus = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.6, 8, 20), ROME.MAT.stone);
  oculus.position.y = 14 + 24 * 0.95; oculus.rotation.x = Math.PI / 2; g.add(oculus);
  // attic band
  const attic = new THREE.Mesh(new THREE.CylinderGeometry(24.6, 24.6, 3, 28), marble);
  attic.position.y = 15.5; g.add(attic);
  // portico: stairs, columns, pediment (front faces -x toward forum)
  const pg = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const s = new THREE.Mesh(new THREE.BoxGeometry(30, 0.4, 1.1), marble);
    s.position.set(24 + i * 1.05, 0.2, 0); pg.add(s);
  }
  const colGeo = new THREE.CylinderGeometry(1, 1.2, 13, 14);
  for (let i = 0; i < 6; i++) {
    const c = new THREE.Mesh(colGeo, marble);
    c.position.set(32, 6.5 + 1.2, -10 + i * 4);
    c.castShadow = true; pg.add(c);
  }
  const ent = new THREE.Mesh(new THREE.BoxGeometry(6, 2.2, 26), marble);
  ent.position.set(32, 14.2, 0); pg.add(ent);
  // pediment: triangular prism
  const pedShape = new THREE.Shape();
  pedShape.moveTo(-14, 0); pedShape.lineTo(14, 0); pedShape.lineTo(0, 5); pedShape.closePath();
  const pedGeo = new THREE.ExtrudeGeometry(pedShape, { depth: 3, bevelEnabled: false });
  const pedM = new THREE.Mesh(pedGeo, marble);
  pedM.rotation.y = Math.PI / 2;
  pedM.position.set(29, 15.3, 0);
  pg.add(pedM);
  g.add(pg);

  g.position.set(x, y, z);
  g.rotation.y = Math.PI; // face portico toward the Forum
  scene.add(g);
  ROME.makeLabel(scene, 'Pantheon', x, z, y);
}

function buildVestaShrine(scene) {
  const x = 30, z = -60, y = ROME.terrainHeight(x, z);
  const g = new THREE.Group();
  // circular shrine of Vesta
  const ring = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 4.5, 3.6, 16, 1, true), ROME.MAT.marble);
  ring.position.y = 3; ring.castShadow = true; g.add(ring);
  const roofV = new THREE.Mesh(new THREE.ConeGeometry(5, 2.4, 16), ROME.MAT.roof);
  roofV.position.y = 5.2; g.add(roofV);
  const plinth = new THREE.Mesh(new THREE.CylinderGeometry(6, 6.3, 1.4, 16), ROME.MAT.stone);
  plinth.position.y = 0.7; g.add(plinth);
  // eternal flame
  const flame = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.2, 6),
    new THREE.MeshBasicMaterial({ color: 0xff9530 }));
  flame.position.y = 3.4; g.add(flame);
  // columns ring
  for (let i = 0; i < 10; i++) {
    const a = i / 10 * Math.PI * 2;
    const c = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.45, 3.2, 8), ROME.MAT.marble);
    c.position.set(Math.cos(a) * 4.5, 3, Math.sin(a) * 4.5); g.add(c);
  }
  g.position.set(x, y, z);
  scene.add(g);
  ROME.makeLabel(scene, 'Temple of Vesta', x, z, y);
}

function initTemples(scene) {
  // Standard Roman temple archetype: high podium, frontal stair,
  // deep porch, closed cella — see temples.txt
  ROME.makeTemple(scene, { name: 'Jupiter Capitolinus', x: -170, z: -60, w: 20, d: 24, colH: 9, cols: 6, rotY: Math.PI * 0.08 });
  ROME.makeTemple(scene, { name: 'Saturn',           x: -15, z: -85, w: 16, d: 18, colH: 7, cols: 5, rotY: 0.1 });
  ROME.makeTemple(scene, { name: 'Portunus',        x: -260, z: -40, w: 12, d: 14, colH: 5.5, cols: 4, rotY: -Math.PI / 2 });
  ROME.makeTemple(scene, { name: 'Venus and Roma',  x: 60, z: 55, w: 26, d: 28, colH: 9, cols: 8, rotY: -0.4 });
  ROME.makeTemple(scene, { name: 'Serapis',         x: 240, z: -300, w: 16, d: 18, colH: 7, cols: 5, rotY: 0.3 });
  ROME.makeTemple(scene, { name: 'Aesculapius',     x: -380, z: 330, w: 12, d: 14, colH: 5.5, cols: 4, rotY: Math.PI / 3 });
  buildVestaShrine(scene);
  buildPantheon(scene);
  ROME.makeLabel(scene, 'Temple of Jupiter Optimus Maximus', -170, -60, ROME.terrainHeight(-170, -60));
}
