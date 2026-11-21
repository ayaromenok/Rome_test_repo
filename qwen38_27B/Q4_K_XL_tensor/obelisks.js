/* obelisks.js — Egyptian obelisks set up by Roman emperors: Forum,
   Circus Maximus spina, Pantheon front, Campus Martius */
window.Obelisks = (function () {
  const R = window.Roman, M = R.M;

  function makeObelisk(h) {
    h = h || 20;
    const g = new THREE.Group();
    g.add(R.box(3, 2.4, 3, M.marble, 0, 1.2, 0));            // socle
    g.add(R.box(2.2, 1.2, 2.2, M.tuff, 0, 2.9, 0));
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 1.15, h, 4), M.gold.clone());
    shaft.material.color.set(0xc9a86a);
    shaft.rotation.y = Math.PI / 4;
    shaft.position.y = 3.5 + h / 2;
    g.add(shaft);
    const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.6, 1.8, 4), M.gold);
    tip.rotation.y = Math.PI / 4;
    tip.position.y = 3.5 + h + 0.9;
    g.add(tip);
    return g;
  }

  function place(name, x, z, h, scene) {
    const g = makeObelisk(h);
    g.position.set(x, window.Terrain.heightAt(x, z), z);
    scene.add(g);
    const label = R.makeLabel(name, 22);
    label.position.set(x, window.Terrain.heightAt(x, z) + h + 8, z);
    scene.add(label);
  }

  function build(scene) {
    place('Obelisk of the Forum', 15, 25, 22, scene);
    place('Obelisk of the Campus Martius', -85, 55, 26, scene);
    place('Pantheon Obelisk', -108, 72, 16, scene);
    // (the two great spina obelisks of the Circus Maximus are built in circuses.js)
  }

  return { build, makeObelisk };
})();
