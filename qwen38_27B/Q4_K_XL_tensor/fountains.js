/* fountains.js — public fountains (nympheum & basin fountains) fed by
   the aqueducts: Forum, Campus Martius, Palatine */
window.Fountains = (function () {
  const R = window.Roman, M = R.M;

  function makeFountain(scale) {
    scale = scale || 1;
    const g = new THREE.Group();
    // great basin
    g.add(R.cyl(9, 10, 1.6, 24, M.stone, 0, 0.8, 0));
    const water = new THREE.Mesh(new THREE.CircleGeometry(8.2, 24), M.water.clone());
    water.material.color.set(0x3f97c2);
    water.rotation.x = -Math.PI / 2; water.position.y = 1.45;
    g.add(water);
    // marble rim columns
    for (let i = 0; i < 10; i++) {
      const a = i / 10 * Math.PI * 2;
      g.add(R.cyl(0.4, 0.5, 3.4, 8, M.marble, Math.cos(a) * 8.8, 3.3, Math.sin(a) * 8.8));
    }
    // middle tier
    g.add(R.cyl(1.2, 1.4, 5, 10, M.marble, 0, 3.9, 0));
    g.add(R.cyl(4.5, 5, 1, 16, M.stone, 0, 6.6, 0));
    const water2 = new THREE.Mesh(new THREE.CircleGeometry(3.9, 16), M.water.clone());
    water2.material.color.set(0x3f97c2);
    water2.rotation.x = -Math.PI / 2; water2.position.y = 7.05;
    g.add(water2);
    // upper basin + jet
    g.add(R.cyl(0.6, 0.7, 3, 8, M.marble, 0, 8.6, 0));
    g.add(R.cyl(2, 2.2, 0.7, 12, M.stone, 0, 10.3, 0));
    const jet = new THREE.Mesh(new THREE.ConeGeometry(0.5, 2.6, 8), M.water.clone());
    jet.material.color.set(0x9fd8ef);
    jet.position.y = 12;
    g.add(jet);
    g.scale.setScalar(scale);
    return g;
  }

  function place(name, x, z, s, scene) {
    const g = makeFountain(s);
    g.position.set(x, window.Terrain.heightAt(x, z) + 0.2, z);
    scene.add(g);
    const label = R.makeLabel(name, 20);
    label.position.y = 18 * s;
    g.add(label);
  }

  function build(scene) {
    place('Fountain of the Forum (Nymphaeum)', 38, 30, 1, scene);
    place('Great Fountain of the Campus Martius', -125, 25, 1.6, scene);
    place('Fountain of the Palatine', 60, 105, 1.2, scene);
  }

  return { build };
})();
