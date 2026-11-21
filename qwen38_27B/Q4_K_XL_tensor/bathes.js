/* bathes.js — public baths (thermae): frigidarium, tepidarium, caldarium,
   hypocaust heating, pools, apses. Baths of Caracalla, Trajan, Constantine. */
window.Bathes = (function () {
  const R = window.Roman, M = R.M;

  function makeBathes(scale) {
    scale = scale || 1;
    const g = new THREE.Group();

    // Tepidarium — central rectangular hall, open roof showing the pool
    g.add(R.box(26, 10, 40, M.stone, 0, 5, 0));
    g.add(R.box(20, 0.5, 34, M.dark, 0, 10.2, 0));
    const pool1 = new THREE.Mesh(new THREE.BoxGeometry(10, 0.4, 24), M.water.clone());
    pool1.material.color.set(0x3a8ab8);
    pool1.position.set(0, 3, 0);
    g.add(pool1);
    g.add(R.box(12, 2.5, 26, M.marble, 0, 1.25, 0)); // pool wall
    for (let i = 0; i < 6; i++) {                     // colonnade inside
      g.add(R.cyl(0.5, 0.6, 9, 8, M.marble, -9, 5, -15 + i * 6));
      g.add(R.cyl(0.5, 0.6, 9, 8, M.marble, 9, 5, -15 + i * 6));
    }

    // Frigidarium — square hall with semicircular apse at west end
    g.add(R.box(20, 12, 34, M.stone, -28, 6, 0));
    const apseW = new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 12, 16, 1, false, 0, Math.PI), M.stone);
    apseW.rotation.y = Math.PI / 2; apseW.position.set(-38, 6, 0);
    g.add(apseW);
    const coldPool = new THREE.Mesh(new THREE.BoxGeometry(8, 0.4, 16), M.water.clone());
    coldPool.material.color.set(0x2f6f9a);
    coldPool.position.set(-30, 2.5, 0);
    g.add(coldPool);

    // Caldarium — semicircular hot room with dome and hot pool
    g.add(R.box(18, 11, 34, M.stone, 28, 5.5, 0));
    const apseE = new THREE.Mesh(new THREE.CylinderGeometry(9, 9, 11, 16, 1, false, Math.PI, Math.PI), M.stone);
    apseE.rotation.y = Math.PI / 2; apseE.position.set(37, 5.5, 0);
    g.add(apseE);
    const dome = R.makeDome(9, M.roof);
    dome.position.set(37, 11, 0);
    g.add(dome);
    const hotPool = new THREE.Mesh(new THREE.BoxGeometry(6, 0.4, 12), M.water.clone());
    hotPool.material.color.set(0x5aa8c8);
    hotPool.position.set(33, 2.5, 0);
    g.add(hotPool);

    // Hypocaust underfloor heating — pilae (stacked brick columns) visible under a lifted floor section
    g.add(R.box(30, 0.6, 8, M.brick, 0, 0.3, 26));
    for (let i = 0; i < 6; i++)
      for (let j = 0; j < 2; j++)
        g.add(R.box(1, 3, 1, M.darkBrick, -12 + i * 4.8, 1.9, 24 + j * 4));
    g.add(R.box(30, 0.5, 8, M.stone, 0, 3.6, 26));

    // entrance portico
    for (let i = 0; i < 5; i++)
      g.add(R.cyl(0.6, 0.75, 8, 10, M.marble, -12 + i * 6, 4, -23));
    g.add(R.box(30, 1.4, 3, M.stone, 0, 8.7, -23));
    g.add(R.pediment(30, 3, 4, M.stone).translateY(9.4).translateZ(-23));

    // roof slabs over the side halls (gaps left to show the pools)
    g.add(R.box(22, 1, 36, M.roof, -28, 12.5, 0));
    g.add(R.box(20, 1, 36, M.roof, 28, 12.5, 0));

    g.scale.setScalar(scale);
    return g;
  }

  function place(g, name, x, z, ry, scene) {
    g.position.set(x, window.Terrain.heightAt(x, z), z);
    if (ry) g.rotation.y = ry;
    const label = R.makeLabel(name, 40);
    label.position.y = 26;
    g.add(label);
    scene.add(g);
  }

  function build(scene) {
    // Baths of Caracalla — great complex, NE near Quirinal
    place(makeBathes(1.6), 'Baths of Caracalla (Thermae Antoniniana)', 240, -280, -0.5, scene);
    // Baths of Trajan — Esquiline, above the river
    place(makeBathes(1.3), 'Baths of Trajan', 330, 70, -0.9, scene);
    // Baths of Constantine — Quirinal summit
    place(makeBathes(1.1), 'Baths of Constantine', 200, -140, 0.3, scene);
  }

  return { build };
})();
