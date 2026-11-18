/* ============================================================
 * roads.js — Consular roads radiating from the city gates,
 * Via Sacra through the Forum, Campus Martius plain,
 * and the bridges over the Tiber (pontes).
 * ============================================================ */
function initRoads(scene) {
  const road = ROME.MAT.road;

  /* ---- Radiating consular roads (each starts at its gate) ---- */
  const roads = [
    // [name, from, to...]
    ['Via Flaminia',  [{ x: 0, z: -620 }, { x: 40, z: -1450 }]],
    ['Via Nomentana', [{ x: 150, z: -590 }, { x: 420, z: -1250 }]],
    ['Via Salaria',   [{ x: 380, z: -470 }, { x: 850, z: -950 }]],
    ['Via Prenestina',[{ x: 600, z: -140 }, { x: 1450, z: -60 }]],
    ['Via Tiburtina', [{ x: 590, z: 130 }, { x: 1450, z: 260 }]],
    ['Via Latina',    [{ x: 480, z: 400 }, { x: 1150, z: 850 }]],
    ['Via Appia',     [{ x: 40, z: 610 }, { x: 420, z: 1550 }]],
    ['Via Ostiensis', [{ x: -230, z: 545 }, { x: -520, z: 1450 }]],
  ];
  for (const [name, wps] of roads) {
    const pts = ROME.samplePath(wps, 8);
    ROME.makeStrip(scene, { points: pts, material: road, width: 14, thickness: 0.5, lift: 0.5 });
  }

  /* ---- Via Sacra: sacred road through the Forum (triumphal route) ---- */
  const viaSacra = ROME.samplePath(
    [{ x: 118, z: 118 }, { x: 70, z: 80 }, { x: 30, z: 30 }, { x: 0, z: -20 }, { x: -35, z: -70 }], 4);
  ROME.makeStrip(scene, { points: viaSacra, material: ROME.MAT.roadStone, width: 9, thickness: 0.4, lift: 0.4 });

  /* ---- Internal streets: Forum ↔ Forum Boarium, Palatine gate, Campus Martius ---- */
  const internal = [
    [{ x: -35, z: -70 }, { x: -120, z: -10 }, { x: -230, z: -25 }],          // to Forum Boarium
    [{ x: 0, z: -20 }, { x: -40, z: 80 }, { x: -60, z: 160 }],               // Aventine road
    [{ x: 60, z: 120 }, { x: 100, z: 240 }, { x: 110, z: 360 }],             // Caelian
    [{ x: 120, z: 120 }, { x: 240, z: 150 }, { x: 360, z: 170 }],            // Esquiline
    [{ x: 0, z: -20 }, { x: -80, z: -30 }, { x: -170, z: -60 }],             // Capitoline
    [{ x: -35, z: -70 }, { x: -160, z: -60 }, { x: -300, z: -20 }, { x: -370, z: 60 }, { x: -360, z: 110 }], // Campus Martius
  ];
  for (const wps of internal) {
    const pts = ROME.samplePath(wps, 5);
    ROME.makeStrip(scene, { points: pts, material: ROME.MAT.roadStone, width: 7, thickness: 0.35, lift: 0.35 });
  }

  /* ---- Campus Martius: flat training ground (military exercises,
          public assemblies, monumental building program) ---- */
  const campus = new THREE.Mesh(new THREE.CircleGeometry(55, 24),
    new THREE.MeshStandardMaterial({ color: 0xb9b194, roughness: 1 }));
  campus.rotation.x = -Math.PI / 2;
  campus.position.set(-280, Math.max(ROME.terrainHeight(-280, 150), 0.3) + 0.15, 150);
  campus.receiveShadow = true;
  scene.add(campus);
  ROME.makeLabel(scene, 'Campus Martius', -280, 150, 0);
  // altars / training posts
  for (let i = 0; i < 6; i++) {
    const a = i / 6 * Math.PI * 2;
    ROME.box(scene, ROME.MAT.stone, 4, 1.5, 4, -280 + Math.cos(a) * 40, 0, 150 + Math.sin(a) * 40);
  }

  /* ---- Ponte Fabricio & Ponte Sublicius over the Tiber ---- */
  for (const [z, name] of [[120, 'Ponte Fabricio'], [60, 'Ponte Sublicius']]) {
    const rx = ROME.riverX(z);
    const halfW = ROME.RIVER_HALF_W + 12;
    const deck = new THREE.Mesh(new THREE.BoxGeometry(halfW * 2, 1.2, 12), ROME.MAT.roadStone);
    deck.position.set(rx, 2.2, z);
    deck.castShadow = true;
    scene.add(deck);
    // arches under the bridge
    const arches = 3;
    for (let i = 0; i < arches; i++) {
      const ax = rx - halfW + (i + 0.5) * (halfW * 2 / arches);
      const a = new THREE.Mesh(new THREE.TorusGeometry(halfW * 2 / arches / 2 - 1, 0.8, 6, 10, Math.PI), ROME.MAT.stone);
      a.position.set(ax, 1.0, z);
      a.rotation.y = Math.PI / 2;
      scene.add(a);
    }
    // ramp up from each bank
    for (const s of [-1, 1]) {
      const ramp = new THREE.Mesh(new THREE.BoxGeometry(14, 0.8, 12), ROME.MAT.roadStone);
      const bx = rx + s * (halfW + 6);
      const by = (ROME.terrainHeight(bx, z) + 2.2) / 2;
      ramp.position.set(bx, by, z);
      ramp.rotation.z = Math.atan2(2.2 - ROME.terrainHeight(bx, z), 14) * s;
      scene.add(ramp);
    }
    if (name) ROME.makeLabel(scene, name, rx, z, 0);
  }
}
