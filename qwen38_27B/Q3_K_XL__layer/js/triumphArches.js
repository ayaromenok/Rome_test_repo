/* ============================================================
 * triumphArches.js — Arch of Titus, Arch of Constantine,
 * Arch of Septimius Severus, Arch of Janus,
 * Arch of Claudius (Porta Maggiore aqueduct arch)
 * ============================================================ */
function buildTriumphalArch(scene, x, z, name, w, h, rotY) {
  w = w || 12; h = h || 18; rotY = rotY || 0;
  const y = ROME.terrainHeight(x, z);
  const g = new THREE.Group();
  const trav = ROME.MAT.travertine, marble = ROME.MAT.marble;

  const pierW = 2.6, gap = w - pierW * 2, archR = gap / 2;
  // piers
  for (const s of [-1, 1]) {
    const pier = new THREE.Mesh(new THREE.BoxGeometry(pierW, h, 6), trav);
    pier.position.set(s * (archR + pierW / 2), h / 2, 0);
    pier.castShadow = true; g.add(pier);
    // Corinthian pilasters (engaged)
    for (const pz of [-2, 0, 2]) {
      const pil = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.45, h * 0.92, 8), marble);
      pil.position.set(s * (archR + pierW / 2), h * 0.46, pz + 2.9);
      g.add(pil);
    }
  }
  // arch
  const arch = new THREE.Mesh(new THREE.TorusGeometry(archR, 1.3, 8, 18, Math.PI), trav);
  arch.position.y = h * 0.6;
  g.add(arch);
  // attic / entablature
  const attic = new THREE.Mesh(new THREE.BoxGeometry(w + 1, h * 0.28, 6.4), trav);
  attic.position.y = h * 0.85;
  attic.castShadow = true;
  g.add(attic);
  // coffered entablature detail
  const ent = new THREE.Mesh(new THREE.BoxGeometry(w + 0.4, 1.2, 5.4), marble);
  ent.position.y = h * 0.6 + 1.2;
  g.add(ent);

  g.position.set(x, y, z);
  g.rotation.y = rotY;
  scene.add(g);
  ROME.makeLabel(scene, name, x, z, y);
}

function initTriumphArches(scene) {
  buildTriumphalArch(scene, 25, -25, 'Arch of Titus', 10, 15, 0.5);
  buildTriumphalArch(scene, 15, 60, 'Arch of Septimius Severus', 14, 20, 0.05);
  buildTriumphalArch(scene, 95, 82, 'Arch of Constantine', 13, 19, 0.7);
  buildTriumphalArch(scene, 65, 25, 'Arch of Janus', 8, 12, -0.4);
  // Arch of Claudius — Claudian aqueduct through Porta Maggiore
  buildTriumphalArch(scene, 560, -190, 'Arch of Claudius (Porta Maggiore)', 12, 16, 0.3);
}
