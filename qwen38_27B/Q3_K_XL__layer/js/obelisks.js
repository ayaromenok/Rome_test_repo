/* ============================================================
 * obelisks.js — Monolithic granite obelisks
 *  - Vatican obelisk (Campus Martius)
 *  - Circus Maximus spina obelisk (in circuses.js)
 *  - Obelisk in front of the Pantheon (Campo Marzio)
 * ============================================================ */
function buildObelisk(scene, x, z, name, h) {
  h = h || 22;
  const y = ROME.terrainHeight(x, z);
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.BoxGeometry(4, 1.2, 4), ROME.MAT.stone);
  base.position.y = 0.6; base.castShadow = true; g.add(base);
  const shaft = new THREE.Mesh(new THREE.ConeGeometry(1.5, h, 4), ROME.MAT.obsidian);
  shaft.position.y = 1.2 + h / 2;
  shaft.rotation.y = Math.PI / 4;
  shaft.castShadow = true;
  g.add(shaft);
  const pyr = new THREE.Mesh(new THREE.ConeGeometry(0.7, 1.8, 4), ROME.MAT.gold);
  pyr.position.y = 1.2 + h + 0.9;
  pyr.rotation.y = Math.PI / 4;
  g.add(pyr);
  g.position.set(x, y, z);
  scene.add(g);
  if (name) ROME.makeLabel(scene, name, x, z, y);
  return g;
}

function initObelisks(scene) {
  buildObelisk(scene, -280, 150, 'Vatican Obelisk (Campus Martius)', 26);
  buildObelisk(scene, 205, -95, 'Obelisk of the Pantheon', 18);
  buildObelisk(scene, -60, 20, 'Obelisk of the Circus (spina)', 24);
}
