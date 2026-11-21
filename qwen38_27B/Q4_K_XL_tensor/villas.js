/* villas.js — country estates outside the walls:
   villa urbana (leisure), villa rustica (working farm), villa maritima (by the Tiber) */
window.Villas = (function () {
  const R = window.Roman, M = R.M;

  function groundPatch(x, z, w, d, scene) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), M.grass.clone());
    m.material.color.set(0x7d9a55);
    m.rotation.x = -Math.PI / 2;
    m.position.set(x, window.Terrain.heightAt(x, z) + 0.6, z);
    scene.add(m);
  }

  // Villa Urbana — atrium, impluvium, peristyle garden, triclinium
  function buildVillaUrbana(scene) {
    const g = new THREE.Group();
    // atrium house with open roof (compluvium) over the impluvium
    g.add(R.box(18, 4, 14, M.stone, 0, 2, 0));
    g.add(R.box(20, 0.6, 16, M.roof, 0, 4.3, 0));
    for (const dx of [-8.5, 8.5]) for (const dz of [-6.5, 6.5])
      g.add(R.cyl(0.4, 0.5, 4, 8, M.marble, dx, 2, dz));
    const impluvium = new THREE.Mesh(new THREE.BoxGeometry(5, 0.3, 4), M.water.clone());
    impluvium.material.color.set(0x3f97c2);
    impluvium.position.y = 0.5;
    g.add(impluvium);
    // peristyle: colonnaded courtyard garden with reflecting pool
    const py = 6;
    for (let i = 0; i <= 8; i++) {
      const t = -14 + i * 3.5;
      g.add(R.cyl(0.35, 0.45, 4, 8, M.marble, t, py + 2, 16));
      g.add(R.cyl(0.35, 0.45, 4, 8, M.marble, t, py + 2, 30));
    }
    for (const sx of [-14, 14])
      for (let i = 0; i <= 4; i++)
        g.add(R.cyl(0.35, 0.45, 4, 8, M.marble, sx, py + 2, 16 + i * 2.8));
    g.add(R.box(30, 0.4, 16, M.grass, 0, py + 0.2, 23));
    const pool = new THREE.Mesh(new THREE.BoxGeometry(16, 0.3, 4), M.water.clone());
    pool.material.color.set(0x3f97c2);
    pool.position.set(0, py + 0.55, 23);
    g.add(pool);
    for (let i = 0; i < 4; i++)                       // garden statues
      g.add(R.cyl(0.3, 0.4, 2, 6, M.marble, -10 + i * 6.5, py + 1.4, 19.5));
    // triclinium wing (dining hall opening to the garden)
    g.add(R.box(14, 4, 10, M.stone, -20, 2, 22));
    g.add(R.box(15, 0.6, 11, M.roof, -20, 4.3, 22));
    // cubicula (bedroom) range
    g.add(R.box(12, 4, 10, M.tuff, 20, 2, -4));
    g.add(R.box(13, 0.6, 11, M.roof, 20, 4.3, -4));
    // garden cypresses
    for (let i = 0; i < 5; i++) g.add(R.makeCypress(-30, 10 + i * 6, 10 + i));
    // perimeter wall
    g.add(R.box(58, 3, 1, M.wall, 0, 1.5, -12));
    g.add(R.box(58, 3, 1, M.wall, 0, 1.5, 38));
    g.add(R.box(1, 3, 50, M.wall, -29, 1.5, 13));
    g.add(R.box(1, 3, 50, M.wall, 29, 1.5, 13));

    const label = R.makeLabel('Villa Urbana (estate of otium)', 34);
    label.position.y = 20;
    g.add(label);
    const x = 500, z = 360;
    g.position.set(x, window.Terrain.heightAt(x, z) - 0.3, z);
    scene.add(g);
    groundPatch(x, z, 90, 75, scene);
  }

  // Villa Rustica — agricultural wing: barns, granary, wine press, stables
  function buildVillaRustica(scene) {
    const g = new THREE.Group();
    // long residential wing
    g.add(R.box(36, 4, 10, M.stone, 0, 2, -8));
    g.add(R.box(37, 0.6, 11, M.roof, 0, 4.3, -8));
    // barn / stables
    g.add(R.box(18, 4, 12, M.tuff, -20, 2, 10));
    g.add(R.box(19, 0.6, 13, M.wood, -20, 4.3, 10));
    // granary (horreum) on pilae
    g.add(R.box(12, 0.8, 8, M.stone, 20, 1.4, 10));
    for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++)
      g.add(R.box(1, 1.2, 1, M.tuff, 15.5 + i * 3, 0.6, 7.5 + j * 2.5));
    g.add(R.box(13, 0.6, 9, M.wood, 20, 1.9, 10));
    // wine & olive press shed
    g.add(R.box(10, 3.5, 8, M.tuff, 2, 1.75, 12));
    g.add(R.box(5, 2.2, 5, M.stone, 2, 3.4, 12));
    const wheel = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.25, 8, 16), M.wood);
    wheel.position.set(5.4, 2.2, 12);
    g.add(wheel);
    // amphorae store
    for (let i = 0; i < 8; i++) {
      const a = new THREE.Mesh(new THREE.ConeGeometry(0.6, 1.8, 8), M.brick);
      a.position.set(-32, 0.9, -2 + (i % 4) * 3);
      g.add(a);
    }
    // orchard
    for (let i = 0; i < 6; i++) g.add(R.makeTree(-40 - (i % 3) * 8, 12 + Math.floor(i / 3) * 8, 8));

    const label = R.makeLabel('Villa Rustica (farmer\'s estate)', 34);
    label.position.y = 16;
    g.add(label);
    const x = 420, z = 540;
    g.position.set(x, window.Terrain.heightAt(x, z) - 0.3, z);
    scene.add(g);
    groundPatch(x, z, 100, 60, scene);
  }

  // Villa Maritima — riverside villa on the Tiber with pier and swimming pool
  function buildVillaMaritima(scene) {
    const x = -88, z = 110;
    const g = new THREE.Group();
    g.add(R.box(24, 4, 14, M.stone, 0, 2, 0));
    g.add(R.box(25, 0.6, 15, M.roof, 0, 4.3, 0));
    // peristyle terrace facing the river
    for (let i = 0; i < 6; i++)
      g.add(R.cyl(0.35, 0.45, 4, 8, M.marble, -10 + i * 4, 2, -8));
    // swimming pool at the water's edge
    const pool = new THREE.Mesh(new THREE.BoxGeometry(10, 0.4, 5), M.water.clone());
    pool.material.color.set(0x3f97c2);
    pool.position.set(0, 0.5, -12);
    g.add(pool);
    g.add(R.box(12, 1, 7, M.stone, 0, 0.4, -12));
    // pier over the Tiber
    g.add(R.box(3, 0.5, 14, M.wood, 6, 0.6, -22));
    for (let i = 0; i < 4; i++)
      g.add(R.box(0.5, 1.5, 0.5, M.wood, 5 + (i % 2) * 2, 0.3, -17 - Math.floor(i / 2) * 6));
    for (let i = 0; i < 4; i++) g.add(R.makeCypress(-18, -6 + i * 4, 9));

    const label = R.makeLabel('Villa Maritima (on the Tiber)', 30);
    label.position.y = 16;
    g.add(label);
    g.position.set(x, window.Terrain.heightAt(x, z) - 0.3, z);
    scene.add(g);
  }

  function build(scene) {
    buildVillaUrbana(scene);
    buildVillaRustica(scene);
    buildVillaMaritima(scene);
  }

  return { build };
})();
