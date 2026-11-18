/* ============================================================
 * fountains.js — Public fountains (nymphaea & lararia)
 * fed by the aqueducts: Mocho fountain, Forum fountain,
 * Campus Martius fountain, baths basin.
 * ============================================================ */
function buildFountain(scene, x, z, name, size) {
  size = size || 1;
  const y = ROME.terrainHeight(x, z);
  const g = new THREE.Group();
  const marble = ROME.MAT.marble, stone = ROME.MAT.stone, water = ROME.MAT.water;

  // outer basin
  const rim = new THREE.Mesh(new THREE.CylinderGeometry(8 * size, 8.4 * size, 1.6 * size, 18, 1, true), marble);
  rim.position.y = 0.8 * size; rim.castShadow = true; g.add(rim);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(8.4 * size, 8.8 * size, 0.5 * size, 18), stone);
  base.position.y = 0.25 * size; g.add(base);
  const innerWater = new THREE.Mesh(new THREE.CylinderGeometry(7.9 * size, 7.9 * size, 0.5 * size, 18), water);
  innerWater.position.y = 0.9 * size; g.add(innerWater);
  // central pedestal + jet
  const ped = new THREE.Mesh(new THREE.CylinderGeometry(1.6 * size, 2.2 * size, 3.4 * size, 12), marble);
  ped.position.y = 1.7 * size; ped.castShadow = true; g.add(ped);
  const jet = new THREE.Mesh(new THREE.CylinderGeometry(0.5 * size, 0.8 * size, 2.2 * size, 10), water);
  jet.position.y = 4.2 * size; g.add(jet);
  // four small jets
  for (let i = 0; i < 4; i++) {
    const a = i / 4 * Math.PI * 2 + Math.PI / 4;
    const j = new THREE.Mesh(new THREE.CylinderGeometry(0.25 * size, 0.35 * size, 1.4 * size, 8), water);
    j.position.set(Math.cos(a) * 5 * size, 0.9 * size, Math.sin(a) * 5 * size);
    g.add(j);
  }

  g.position.set(x, y, z);
  scene.add(g);
  if (name) ROME.makeLabel(scene, name, x, z, y);
}

function initFountains(scene) {
  buildFountain(scene, -270, 215, 'Mocho Fountain (Campus Martius)', 1.6);
  buildFountain(scene, -15, 20, 'Fountain of the Forum (Fons)', 1.2);
  buildFountain(scene, 60, -110, 'Fountain near the Forum (Aemilia)', 1.0);
  buildFountain(scene, -250, -10, 'Lararium of the Boarium', 0.9);
}
