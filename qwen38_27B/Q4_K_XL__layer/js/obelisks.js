/* ============================================================
   obelisks.js — The Egyptian obelisks of Rome
   Granite four-sided shafts with pyramidion caps:
   the Circus Maximus spina obelisk, the Campus Martius
   obelisk, and the Colosseum forecourt.
   ============================================================ */
window.RomeObelisks = (function () {
  'use strict';

  function obelisk(scene, x, z, h) {
    const M = ROME.M;
    const gy = ROME.heightAt(x, z);
    const g = new THREE.Group();
    // pedestal
    g.add(ROME.box(4.5, 1.6, 4.5, M.stone, 0, 0, 0));
    // tapered four-sided shaft
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(h * 0.045, h * 0.11, h, 4), M.stone);
    shaft.position.y = 1.6 + h / 2;
    shaft.rotation.y = Math.PI / 4;
    shaft.castShadow = true;
    g.add(shaft);
    // pyramidion
    const cap = new THREE.Mesh(new THREE.ConeGeometry(h * 0.055, h * 0.14, 4), M.gold);
    cap.position.y = 1.6 + h + h * 0.07;
    cap.rotation.y = Math.PI / 4;
    g.add(cap);
    g.position.set(x, gy, z);
    scene.add(g);
  }

  function buildObelisks(scene) {
    const spina = window.ROME_OBELISK_SPINA;
    if (spina) {
      // the great obelisk on the spina of the Circus Maximus (31 m)
      // placed on the spina top: compute ground there
      const spinaY = ROME.heightAt(spina.x, spina.z) + 5;
      const g = new THREE.Group();
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 2.2, 31, 4), ROME.M.stone);
      shaft.position.y = 15.5;
      shaft.rotation.y = Math.PI / 4;
      shaft.castShadow = true;
      g.add(shaft);
      const cap = new THREE.Mesh(new THREE.ConeGeometry(1.1, 4.3, 4), ROME.M.gold);
      cap.position.y = 33;
      cap.rotation.y = Math.PI / 4;
      g.add(cap);
      g.position.set(spina.x, spinaY, spina.z);
      scene.add(g);
    }
    obelisk(scene, -430, -180, 26);  // Campus Martius
    obelisk(scene, 330, 180, 18);    // Colosseum forecourt
    obelisk(scene, 20, 190, 14);     // Forum (Ludovisi-style)
  }

  return { buildObelisks: buildObelisks };
})();
