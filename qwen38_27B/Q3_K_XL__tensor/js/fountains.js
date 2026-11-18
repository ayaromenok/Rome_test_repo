/* fountains.js - public fountains (lacus / nympheum) fed by the aqueducts */
window.Rome = window.Rome || {};

(function () {
  const T = () => window.Rome.terrain;
  const C = () => window.Rome.core;

  // Tiered fountain: basin, column, upper basin, spout
  function fountain(scale, mat) {
    scale = scale || 1; mat = mat || C().mats.travertine;
    const g = new THREE.Group();
    const M = C().mats;
    // lower basin
    const basin = new THREE.Mesh(new THREE.CylinderGeometry(4 * scale, 4.4 * scale, 1.4 * scale, 16), mat);
    basin.position.y = 0.7 * scale;
    g.add(basin);
    const water1 = C().box(6.6 * scale, 0.6 * scale, 6.6 * scale, M.water, 0, 1.3 * scale, 0);
    g.add(water1);
    // central column
    g.add(C().column(0.6 * scale, 3.2 * scale, mat));
    // upper basin
    const upper = new THREE.Mesh(new THREE.CylinderGeometry(2.2 * scale, 2.4 * scale, 0.9 * scale, 14), mat);
    upper.position.y = 3.6 * scale;
    g.add(upper);
    const water2 = C().box(3.4 * scale, 0.5 * scale, 3.4 * scale, M.water, 0, 4.0 * scale, 0);
    g.add(water2);
    // crowning figure
    const figure = C().box(0.9 * scale, 1.8 * scale, 0.9 * scale, M.marble, 0, 4.9 * scale, 0);
    g.add(figure);
    return g;
  }

  // Large nymphaeum fountain: a fountain set into an arched wall
  function nymphaeum(w) {
    w = w || 16;
    const g = new THREE.Group();
    const M = C().mats;
    g.add(C().box(w, 8, 2.5, M.stone, 0, 4, -3));
    const arch = new THREE.Mesh(C().archFrameGeometry(w * 0.7, 6, w * 0.35, 3, 2.2), M.travertine);
    arch.position.set(0, 1.2, -1.6);
    g.add(arch);
    g.add(C().box(w * 0.6, 0.9, 4, M.cobble, 0, 0.45, 2));
    const water = C().box(w * 0.5, 0.5, 3, M.water, 0, 0.95, 2);
    g.add(water);
    g.add(C().column(0.5, 4, M.marble, -w * 0.4, 2, -2.6));
    g.add(C().column(0.5, 4, M.marble, w * 0.4, 2, -2.6));
    g.add(C().box(w, 0.9, 1.2, M.travertine, 0, 8.4, -3));
    return g;
  }

  function buildFountains(scene) {
    let f = fountain(1.6);
    const p1 = { x: -6, z: -6 };
    f.position.set(p1.x, T().heightAt(p1.x, p1.z), p1.z);
    scene.add(f);
    scene.add(T().makeLabel('PUBLIC FOUNTAIN (FORUM)', p1.x, 10, p1.z));

    // Campus Martius - great fountain
    f = fountain(2.2);
    f.position.set(-85, T().heightAt(-85, 60), 60);
    scene.add(f);
    scene.add(T().makeLabel('FOUNTAIN OF MOESIS', -85, 14, 60));

    // Outside the Baths of Caracalla
    f = fountain(1.4);
    f.position.set(140, T().heightAt(140, 122), 122);
    scene.add(f);

    // Caelian hill quarter
    const n = nymphaeum(18);
    n.position.set(95, T().heightAt(95, -60), -60);
    n.rotation.y = 0.6;
    scene.add(n);
    scene.add(T().makeLabel('NYMPHAEUM', 95, 14, -60));

    // Aventine - luxury zone fountain
    f = fountain(1.2);
    f.position.set(0, T().heightAt(0, -120), -120);
    scene.add(f);
  }

  window.Rome.fountains = { build: buildFountains, fountain: fountain, nymphaeum: nymphaeum };
})();
