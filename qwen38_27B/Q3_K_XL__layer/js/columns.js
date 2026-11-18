/* ============================================================
 * columns.js — Monumental columns
 *  - Column of Trajan (Forum, 100 CE) — spiral battle reliefs
 *  - Column of Marcus Aurelius (Capitoline)
 *  - Forum column clusters
 * ============================================================ */
function buildMonumentalColumn(scene, x, z, name, statueColor) {
  const y = ROME.terrainHeight(x, z);
  const g = new THREE.Group();
  const trav = ROME.MAT.travertine, marble = ROME.MAT.marble;
  // base
  const base = new THREE.Mesh(new THREE.BoxGeometry(6, 1.6, 6), ROME.MAT.stone);
  base.position.y = 0.8; base.castShadow = true; g.add(base);
  // fluted shaft with relief band (spiral battle reliefs)
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 2.1, 27, 18), trav);
  shaft.position.y = 1.6 + 13.5;
  shaft.castShadow = true;
  g.add(shaft);
  const band = new THREE.Mesh(new THREE.CylinderGeometry(2.16, 2.2, 20, 18), marble);
  band.position.y = 1.6 + 12;
  g.add(band);
  // capital + platform
  const cap = new THREE.Mesh(new THREE.BoxGeometry(4.4, 1.4, 4.4), marble);
  cap.position.y = 30.3; g.add(cap);
  // gilded statue on top
  const statue = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.2, 4.5, 8),
    new THREE.MeshStandardMaterial({ color: statueColor || 0xd4af37, metalness: 0.6, roughness: 0.4 }));
  statue.position.y = 34;
  g.add(statue);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.75, 10, 10), statue.material);
  head.position.y = 36.6;
  g.add(head);

  g.position.set(x, y, z);
  scene.add(g);
  ROME.makeLabel(scene, name, x, z, y);
}

function initColumns(scene) {
  buildMonumentalColumn(scene, 60, -40, 'Column of Trajan');
  buildMonumentalColumn(scene, -140, -90, 'Column of Marcus Aurelius');
  buildMonumentalColumn(scene, 30, 45, 'Column of the Forum', 0xcfc8b8);
}
