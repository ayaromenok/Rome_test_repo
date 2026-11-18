/* ============================================================
 * bathes.js — Public bathes (thermae)
 *  - Baths of Caracalla (near Via Appia)
 *  - Baths of Diocletian (Quirinal / Baths of Constantine)
 *  - Baths of Trajan (Esquiline)
 * Large halls with apses, flat roofs, colonnaded gardens,
 * hypocaust-heated pools (caldarium / frigidarium).
 * ============================================================ */
function buildBaths(scene, x, z, name, scale, rotY) {
  scale = scale || 1;
  rotY = rotY || 0;
  const y = ROME.terrainHeight(x, z);
  const trav = ROME.MAT.travertine, brick = ROME.MAT.brick;
  const marble = ROME.MAT.marble, water = ROME.MAT.water;

  const g = new THREE.Group();

  // main hall block
  const hall = new THREE.Mesh(new THREE.BoxGeometry(60 * scale, 12 * scale, 34 * scale), trav);
  hall.position.y = 6 * scale; hall.castShadow = hall.receiveShadow = true;
  g.add(hall);
  // apse (semi-circular end)
  const apse = new THREE.Mesh(new THREE.CylinderGeometry(17 * scale, 17 * scale, 13 * scale, 20, 1, false, 0, Math.PI), trav);
  apse.rotation.y = -Math.PI / 2;
  apse.position.set(30 * scale, 6.5 * scale, 0);
  apse.castShadow = true;
  g.add(apse);
  // roof
  const roof = new THREE.Mesh(new THREE.BoxGeometry(62 * scale, 1.2 * scale, 36 * scale), ROME.MAT.roof);
  roof.position.y = 12.6 * scale;
  g.add(roof);
  // colonnade along the front
  const colGeo = new THREE.CylinderGeometry(0.9 * scale, 1 * scale, 8 * scale, 10);
  for (let i = 0; i <= 8; i++) {
    const c = new THREE.Mesh(colGeo, marble);
    c.position.set(-30 * scale + i * 7.5 * scale, 4 * scale, 20 * scale);
    c.castShadow = true;
    g.add(c);
  }
  const ent = new THREE.Mesh(new THREE.BoxGeometry(62 * scale, 1.4 * scale, 2.2 * scale), marble);
  ent.position.set(0, 8.6 * scale, 20 * scale);
  g.add(ent);
  // reflecting pool (frigidarium) in front garden
  const poolRim = new THREE.Mesh(new THREE.BoxGeometry(26 * scale, 1.4 * scale, 12 * scale), marble);
  poolRim.position.set(0, 0.7 * scale, 30 * scale);
  g.add(poolRim);
  const poolWater = new THREE.Mesh(new THREE.BoxGeometry(24.6 * scale, 0.4 * scale, 10.6 * scale), water);
  poolWater.position.set(0, 1.35 * scale, 30 * scale);
  g.add(poolWater);

  g.position.set(x, y, z);
  g.rotation.y = rotY;
  scene.add(g);
  ROME.makeLabel(scene, name, x, z, y);
}

function initBathes(scene) {
  buildBaths(scene, 200, 480, 'Baths of Caracalla', 1.3, -Math.PI / 2 - 0.3);
  buildBaths(scene, 300, -330, 'Baths of Diocletian', 1.6, Math.PI * 0.9);
  buildBaths(scene, 440, 220, 'Baths of Trajan', 1.0, Math.PI / 4);
}
