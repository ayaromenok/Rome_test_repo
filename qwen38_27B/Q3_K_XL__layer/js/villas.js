/* ============================================================
 * villas.js — Country estates outside the walls
 *  - Villa Urbana (leisure retreat) on the Via Appia
 *  - Villa Rustica (working farm) along the Via Flaminia
 *  - Villa Marittima at the Tiber bank
 * Layout: atrium with impluvium courtyard, peristyle garden
 * colonnade, residential wing + agricultural wing.
 * ============================================================ */
function buildVilla(scene, x, z, name, kind) {
  const y = ROME.terrainHeight(x, z);
  const trav = ROME.MAT.travertine, brick = ROME.MAT.brick;
  const marble = ROME.MAT.marble, roof = ROME.MAT.roof, water = ROME.MAT.water;
  const g = new THREE.Group();

  const W = 44, D = 30, wallH = 6;

  // residential wing (pars urbana): U-shaped around courtyard
  const blocks = [
    [-W / 4, -D / 4, W / 2, D / 4],   // north
    [-W / 4, D / 4, W / 2, D / 4],    // south
    [-W / 4, 0, W / 4, D],            // west (atrium wing)
    [W / 4, -D / 4, W / 4, D / 2],    // east (triclinium)
  ];
  for (const [bx, bz, bw, bd] of blocks) {
    const b = new THREE.Mesh(new THREE.BoxGeometry(bw, wallH, bd), trav);
    b.position.set(bx, wallH / 2, bz);
    b.castShadow = b.receiveShadow = true;
    g.add(b);
    const r = new THREE.Mesh(new THREE.BoxGeometry(bw + 0.8, 0.8, bd + 0.8), roof);
    r.position.set(bx, wallH + 0.4, bz);
    g.add(r);
  }
  // atrium impluvium (water basin where rain fell through oculus)
  const impl = new THREE.Mesh(new THREE.BoxGeometry(8, 0.6, 8), water);
  impl.position.set(-W / 4, 0.5, 0);
  g.add(impl);
  const implRim = new THREE.Mesh(new THREE.BoxGeometry(10, 1.0, 10), marble);
  implRim.position.set(-W / 4, 0.3, 0);
  g.add(implRim);
  // peristyle: colonnaded garden on the east side
  const colGeo = new THREE.CylinderGeometry(0.5, 0.55, 4.6, 10);
  for (let i = 0; i <= 5; i++) {
    for (const s of [-1, 1]) {
      const c = new THREE.Mesh(colGeo, marble);
      c.position.set(W / 4 - 3, 2.3, s * (D / 2 - 3) + (s > 0 ? -D / 5 : D / 5));
      g.add(c);
      const c2 = new THREE.Mesh(colGeo, marble);
      c2.position.set(W / 4 - 3 + (i - 2.5) * 3, 2.3, 0);
      g.add(c2);
    }
  }
  // garden pool
  const pool = new THREE.Mesh(new THREE.BoxGeometry(10, 0.5, 4), water);
  pool.position.set(W / 4, 0.4, 0);
  g.add(pool);

  if (kind === 'rustica') {
    // agricultural wing: barns, granaries, press yard
    for (let i = 0; i < 3; i++) {
      const barn = new THREE.Mesh(new THREE.BoxGeometry(10, 4, 7), brick);
      barn.position.set(-W / 2 - 10, 2, -12 + i * 12);
      barn.castShadow = true;
      g.add(barn);
      const br = new THREE.Mesh(new THREE.ConeGeometry(7.2, 2.4, 4), ROME.MAT.wood);
      br.position.set(-W / 2 - 10, 5.2, -12 + i * 12);
      br.rotation.y = Math.PI / 4;
      g.add(br);
    }
    // wine amphora storage yard
    const yard = new THREE.Mesh(new THREE.BoxGeometry(12, 0.4, 16), ROME.MAT.roadStone);
    yard.position.set(-W / 2 - 10, 0.2, 14);
    g.add(yard);
  }
  if (kind === 'marittima') {
    // pier into the river
    const pier = new THREE.Mesh(new THREE.BoxGeometry(6, 1, 30), ROME.MAT.stone);
    pier.position.set(0, 0.5, D / 2 + 12);
    g.add(pier);
  }

  g.position.set(x, y, z);
  g.rotation.y = Math.random() * 0.8 - 0.4;
  scene.add(g);
  ROME.makeLabel(scene, name, x, z, y);
}

function initVillas(scene) {
  buildVilla(scene, 640, 780, 'Villa Urbana (via Appia)', 'urbana');
  buildVilla(scene, 130, -1020, 'Villa Rustica (via Flaminia)', 'rustica');
  buildVilla(scene, -690, -250, 'Villa Marittima (Tiber bank)', 'marittima');
}
