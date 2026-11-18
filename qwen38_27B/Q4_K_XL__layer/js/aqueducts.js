/* ============================================================
   aqueducts.js — The brick-faced concrete aqueducts
   Carrying water across the valleys to fountains, thermae
   and villas. Aqua Claudia (NE, crossing north of the city)
   and Aqua Virgo (SW, to the Campus Martius & Forum).
   ============================================================ */
window.RomeAqueducts = (function () {
  'use strict';

  function conduit(scene, x0, z0, x1, z1, deckH) {
    const M = ROME.M;
    const len = Math.hypot(x1 - x0, z1 - z0);
    const ry = Math.atan2(z1 - z0, x1 - x0);
    const nPiers = Math.floor(len / 15);
    const deckY = deckH; // roughly level channel

    for (let i = 0; i <= nPiers; i++) {
      const t = i / nPiers;
      const x = x0 + (x1 - x0) * t, z = z0 + (z1 - z0) * t;
      const gy = ROME.heightAt(x, z);
      const pierH = deckY - gy;
      if (pierH > 1) {
        scene.add(ROME.box(3.4, pierH, 3.4, M.brick, x, gy, z, ry));
        // arch between this pier and the next
        if (i < nPiers) {
          const mx = (x + x0 + (x1 - x0) * (i + 1) / nPiers) / 2;
          const mz = (z + z0 + (z1 - z0) * (i + 1) / nPiers) / 2;
          const arc = new THREE.Mesh(new THREE.TorusGeometry(6, 1.1, 6, 14, Math.PI), M.brick);
          arc.position.set(mx, gy + pierH * 0.35, mz);
          arc.rotation.y = ry + Math.PI / 2;
          arc.castShadow = true;
          scene.add(arc);
        }
      }
    }
    // the water channel running on top
    const deck = ROME.box(len + 4, 2.6, 4.4, M.brick, (x0 + x1) / 2, deckY, (z0 + z1) / 2, ry + Math.PI / 2);
    scene.add(deck);
    // copings
    const px = Math.sin(ry) * 2.2, pz = -Math.cos(ry) * 2.2;
    scene.add(ROME.box(len + 4, 0.8, 0.9, M.travertine, (x0 + x1) / 2 + px, deckY + 2.6, (z0 + z1) / 2 + pz, ry + Math.PI / 2));
  }

  function buildAqueducts(scene) {
    // Aqua Claudia — from the NE hills over the Viminal/Quirinal valley
    conduit(scene, 1350, -750, -800, -1450, 34);
    // Aqua Virgo — from the SW up to the Campus Martius / Forum
    conduit(scene, 820, 950, -1250, 420, 28);
    // Aqua Alsietina spur — low bridge to the baths by the river
    conduit(scene, -520, 60, -900, 380, 14);
  }

  return { buildAqueducts: buildAqueducts };
})();
