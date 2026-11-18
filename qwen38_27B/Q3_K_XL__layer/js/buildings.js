/* ============================================================
 * buildings.js — Roman Forum & civic buildings
 *  - Curia Julia (Senate house)
 *  - Rostra (speaker's platform with ship prows)
 *  - Basilica Julia & Basilica Aemilia
 *  - Tablinum / Temple of Castor & Pollux (three columns)
 *  - Via Sacra surroundings, market stalls, domus blocks
 * ============================================================ */
function initBuildings(scene) {
  const trav = ROME.MAT.travertine, brick = ROME.MAT.brick;
  const marble = ROME.MAT.marble, roof = ROME.MAT.roof;

  /* ---- Curia Julia (Senate house), west end of Forum ---- */
  (function () {
    const x = -90, z = -45, y = ROME.terrainHeight(x, z);
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(16, 9, 11), trav);
    body.position.y = 4.5; body.castShadow = true; g.add(body);
    // three front arches
    for (let i = -1; i <= 1; i++) {
      const arch = new THREE.Mesh(new THREE.TorusGeometry(2, 0.5, 6, 12, Math.PI), marble);
      arch.position.set(i * 4.5, 3.2, 5.55);
      g.add(arch);
    }
    const pedShape = new THREE.Shape();
    pedShape.moveTo(-8.5, 0); pedShape.lineTo(8.5, 0); pedShape.lineTo(0, 3.5); pedShape.closePath();
    const ped = new THREE.Mesh(new THREE.ExtrudeGeometry(pedShape, { depth: 1.2, bevelEnabled: false }), marble);
    ped.position.set(0, 9, 4.6);
    g.add(ped);
    const r = new THREE.Mesh(new THREE.BoxGeometry(17, 1.4, 12), roof);
    r.position.y = 10; g.add(r);
    g.position.set(x, y, z);
    g.rotation.y = -Math.PI / 2 - 0.2;
    scene.add(g);
    ROME.makeLabel(scene, 'Curia Julia (Senate House)', x, z, y);
  })();

  /* ---- Rostra: raised speaker platform with ship prows ---- */
  (function () {
    const x = -40, z = -25, y = ROME.terrainHeight(x, z);
    const g = new THREE.Group();
    const pl = new THREE.Mesh(new THREE.BoxGeometry(12, 3, 8), trav);
    pl.position.y = 1.5; pl.castShadow = true; g.add(pl);
    for (let i = 0; i < 4; i++) {
      const s = new THREE.Mesh(new THREE.BoxGeometry(13, 0.5, 1.4), marble);
      s.position.set(0, 0.25 + i * 0.72, 4.2 + (4 - i) * 0.3);
      g.add(s);
    }
    // ship prows (corvi) — curved bronze bows
    for (const s of [-3, 0, 3]) {
      const prow = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.18, 6, 10, Math.PI * 1.2), ROME.MAT.gold);
      prow.position.set(s, 3.5, 3.8);
      prow.rotation.y = Math.PI / 2;
      g.add(prow);
    }
    g.position.set(x, y, z);
    scene.add(g);
    ROME.makeLabel(scene, 'Rostra', x, z, y);
  })();

  /* ---- Basilica Julia (law court / market hall), south of forum ---- */
  (function () {
    const x = -90, z = 30, y = ROME.terrainHeight(x, z);
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(36, 8, 16), trav);
    body.position.y = 4; body.castShadow = true; g.add(body);
    const roofB = new THREE.Mesh(new THREE.BoxGeometry(37, 1.2, 17), roof);
    roofB.position.y = 8.6; g.add(roofB);
    // apse
    const apse = new THREE.Mesh(new THREE.CylinderGeometry(8, 8, 8, 16, 1, false, -Math.PI / 2, Math.PI), trav);
    apse.rotation.z = Math.PI / 2;
    apse.position.set(18, 4, 0);
    g.add(apse);
    // arcade
    const colGeo = new THREE.CylinderGeometry(0.8, 0.9, 7, 10);
    for (let i = 0; i <= 6; i++) {
      const c = new THREE.Mesh(colGeo, marble);
      c.position.set(-15 + i * 5, 3.5, 8.5);
      c.castShadow = true; g.add(c);
    }
    g.position.set(x, y, z);
    scene.add(g);
    ROME.makeLabel(scene, 'Basilica Julia', x, z, y);
  })();

  /* ---- Basilica Aemilia, east side of Forum ---- */
  (function () {
    const x = 85, z = 35, y = ROME.terrainHeight(x, z);
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(30, 7.5, 14), trav);
    body.position.y = 3.75; body.castShadow = true; g.add(body);
    const roofB = new THREE.Mesh(new THREE.BoxGeometry(31, 1.1, 15), roof);
    roofB.position.y = 8.1; g.add(roofB);
    g.position.set(x, y, z);
    g.rotation.y = Math.PI / 2;
    scene.add(g);
    ROME.makeLabel(scene, 'Basilica Aemilia', x, z, y);
  })();

  /* ---- Temple of Castor & Pollux (three surviving columns) ---- */
  (function () {
    const x = -8, z = 5, y = ROME.terrainHeight(x, z);
    const g = new THREE.Group();
    const colGeo = new THREE.CylinderGeometry(1.1, 1.3, 9, 14);
    const pos = [[-3, 0], [3, 0], [0, 4.5]];
    for (const [px, pz] of pos) {
      const c = new THREE.Mesh(colGeo, marble);
      c.position.set(px, 4.5, pz); c.castShadow = true; g.add(c);
      const cap = new THREE.Mesh(new THREE.BoxGeometry(3, 0.8, 3), marble);
      cap.position.set(px, 9.4, pz); g.add(cap);
    }
    g.position.set(x, y, z);
    scene.add(g);
    ROME.makeLabel(scene, 'Temple of Castor & Pollux', x, z, y);
  })();

  /* ---- Market stalls & domus blocks around the Forum ---- */
  const stallGeo = new THREE.BoxGeometry(4, 2.2, 3);
  const stallRoofGeo = new THREE.ConeGeometry(3.1, 1.6, 4);
  const stallPts = [];
  for (let i = 0; i < 14; i++) {
    const x = -70 + i * 9.5, z = -70 + (i % 2) * 12;
    if (Math.hypot(x, z) < 25) continue; // keep Via Sacra clear
    stallPts.push([x, z]);
  }
  for (const [x, z] of stallPts) {
    const y = ROME.terrainHeight(x, z);
    const s = new THREE.Mesh(stallGeo, ROME.MAT.wood);
    s.position.set(x, y + 1.1, z); s.rotation.y = Math.random() * 0.8 - 0.4;
    s.castShadow = true; scene.add(s);
    const sr = new THREE.Mesh(stallRoofGeo, ROME.MAT.roof);
    sr.position.set(x, y + 2.6, z);
    sr.rotation.y = Math.PI / 4 + Math.random() * 0.8 - 0.4;
    scene.add(sr);
  }

  /* ---- Insulae: dense brick apartment blocks (residential quarters) ---- */
  const insulaSpots = [
    [60, 170, 14, 12, 4], [85, 190, 12, 10, 3], [140, 160, 16, 12, 5],
    [170, 100, 13, 11, 4], [-170, 100, 12, 10, 3], [-200, 130, 14, 11, 4],
    [330, -310, 13, 10, 4], [360, -270, 15, 11, 3], [-60, 320, 14, 10, 4],
    [-10, 300, 12, 10, 3], [300, 420, 14, 12, 4], [-320, 300, 12, 10, 3],
    [260, -120, 13, 10, 4], [-190, -140, 12, 10, 3],
  ];
  for (const [x, z, w, d, h] of insulaSpots) {
    const y = ROME.terrainHeight(x, z);
    const b = new THREE.Mesh(new THREE.BoxGeometry(w, h * 3, d), brick);
    b.position.set(x, y + h * 1.5, z);
    b.rotation.y = Math.random() * 0.6 - 0.3;
    b.castShadow = b.receiveShadow = true;
    scene.add(b);
    const r = new THREE.Mesh(new THREE.BoxGeometry(w + 1, 0.9, d + 1), roof);
    r.position.set(x, y + h * 3 + 0.45, z);
    r.rotation.y = b.rotation.y;
    scene.add(r);
  }
}
