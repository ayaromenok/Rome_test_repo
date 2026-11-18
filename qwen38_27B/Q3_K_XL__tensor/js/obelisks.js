/* obelisks.js - Egyptian obelisks raised in Rome: Forum, Campus Martius, Circus spina */
window.Rome = window.Rome || {};

(function () {
  const T = () => window.Rome.terrain;
  const C = () => window.Rome.core;

  function obelisk(h, mat) {
    const g = new THREE.Group();
    mat = mat || C().mats.stoneDark;
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.5, h, 4), mat);
    shaft.position.y = h / 2;
    g.add(shaft);
    const tip = new THREE.Mesh(new THREE.ConeGeometry(1.1, h * 0.22, 4), mat);
    tip.position.y = h + h * 0.11;
    g.add(tip);
    // gilded pyramidion
    const gold = new THREE.Mesh(new THREE.ConeGeometry(0.7, h * 0.12, 4), C().mats.gold);
    gold.position.y = h + h * 0.25;
    g.add(gold);
    // pedestal
    g.add(C().box(4.5, 1.6, 4.5, C().mats.stone, 0, -1.6 + 0.8, 0));
    g.add(C().box(3.8, 0.6, 3.8, C().mats.marble, 0, 0.3, 0));
    return g;
  }

  function buildObelisks(scene) {
    // Obelisk of Augustus (Roman Forum)
    let o = obelisk(20);
    const y1 = T().heightAt(-12, 20);
    o.position.set(-12, y1 + 1.2, 20);
    scene.add(o);
    scene.add(T().makeLabel('OBELISK OF AUGUSTUS', -12, 26, 20));

    // Obelisk of Macuteus (Campus Martius)
    o = obelisk(18);
    const y2 = T().heightAt(-90, -8);
    o.position.set(-90, y2 + 1.2, -8);
    scene.add(o);
    scene.add(T().makeLabel('OBELISK (CAMPUS MARTIUS)', -90, 24, -8));

    // Obelisk of the Circus Maximus spina (the famous "Acacus")
    o = obelisk(15);
    const y3 = T().heightAt(38, -74);
    o.position.set(38, y3 + 1.4, -74);
    scene.add(o);
  }

  window.Rome.obelisks = { build: buildObelisks, obelisk: obelisk };
})();
