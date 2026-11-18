/* ============================================================
   arches.js — The triumphal arches
   Arch of Constantine (three arches, by the Colosseum),
   Arch of Titus and Arch of Septimius Severus (Forum).
   ============================================================ */
window.RomeArches = (function () {
  'use strict';

  /* single opening built from piers + arch */
  function bay(parent, x, z, w, h, opening) {
    const M = ROME.M;
    parent.add(ROME.box(w / 2 - opening / 2, h, 5, M.travertine, -w / 4 - opening / 4, 0, 0));
    parent.add(ROME.box(w / 2 - opening / 2, h, 5, M.travertine, w / 4 + opening / 4, 0, 0));
    parent.add(ROME.box(w, h - opening, 5, M.travertine, 0, opening, 0));
    const arc = new THREE.Mesh(new THREE.TorusGeometry(opening / 2, 0.9, 8, 14, Math.PI), M.stone);
    arc.position.set(0, opening, 0);
    arc.rotation.y = 0;
    arc.castShadow = true;
    parent.add(arc);
  }

  function arch(scene, x, z, ry, kind) {
    const M = ROME.M;
    const gy = ROME.heightAt(x, z);
    const g = new THREE.Group();
    if (kind === 'triple') {
      // Arch of Constantine: big central bay + two small side bays
      g.add(ROME.box(26, 6, 8, M.travertine, 0, 12, 0));   // attic with reliefs
      g.add(ROME.box(27, 1.5, 9, M.stone, 0, 18, 0));
      bay(g, 0, 0, 14, 12, 9);
      bay(g, -8.5, 0, 7, 12, 5);
      bay(g, 8.5, 0, 7, 12, 5);
      // small side pediments
      for (const sx of [-1, 1]) {
        const ped = new THREE.Mesh(new THREE.ConeGeometry(3.4, 2.4, 4), M.terracotta);
        ped.position.set(sx * 8.5, 19.5, 0);
        ped.rotation.y = Math.PI / 4;
        ped.scale.z = 0.5;
        g.add(ped);
      }
    } else {
      // single-bay (Titus / Septimius Severus)
      g.add(ROME.box(12, 2.4, 6, M.stone, 0, 12.5, 0));    // attic
      bay(g, 0, 0, 12, 12.5, 7.5);
    }
    g.position.set(x, gy, z);
    g.rotation.y = ry;
    scene.add(g);
  }

  function buildArches(scene) {
    arch(scene, 300, 175, 1.35, 'triple');   // Arch of Constantine (Via Triunphalis)
    arch(scene, 40, 118, 0.5, 'single');     // Arch of Titus (top of Via Sacra)
    arch(scene, 15, 25, 0.55, 'single');     // Arch of Septimius Severus
  }

  return { buildArches: buildArches };
})();
