/* ============================================================
   circuses.js — The chariot-racing circuses
   Circus Maximus — the vast long stadium in the valley
   between Palatine and Aventine (300 m track, central spina
   with the Egyptian obelisk and seven-loop bronze serpent)
   and the smaller Circus Flaminius in Campus Martius.
   ============================================================ */
window.RomeCircuses = (function () {
  'use strict';

  /* stepped spectator bank (three tiers of seating) */
  function bank(parent, x, z, len, ry, tiers) {
    const M = ROME.M;
    for (let t = 0; t < tiers; t++) {
      const w = 13, h = 3.4 + t * 0.6;
      const off = 0.5 + t * w;
      parent.add(ROME.box(len, h, w, M.travertine,
        x + Math.cos(ry + Math.PI / 2) * off, 0,
        z + Math.sin(ry + Math.PI / 2) * off, ry));
    }
  }

  function circusMaximus(scene) {
    const M = ROME.M;
    const cx = 210, cz = 460;         // valley between Palatine and Aventine
    const gy = ROME.heightAt(cx, cz);
    const LEN = 340, WID = 55;        // track: 340 m long, U-shaped, curved end to the W
    const g = new THREE.Group();

    // central spina with the obelisk of Pharaohs
    g.add(ROME.box(8, 4, LEN * 0.86, M.travertine, 0, 0, 0));
    g.add(ROME.box(3, 1, LEN * 0.86, M.stone, 0, 4, 0));
    // seven-loop bronze serpent at the spina end
    const serpent = new THREE.Mesh(new THREE.TorusGeometry(3, 0.5, 6, 20, Math.PI * 5), M.bronze);
    serpent.rotation.x = -Math.PI / 2;
    serpent.position.set(0, 5.2, LEN * 0.4);
    g.add(serpent);
    // the obelisk rides on its own module; mark position here
    window.ROME_OBELISK_SPINA = { x: cx, z: cz - LEN * 0.45 };

    // spectator banks along the straight sides
    bank(g, -WID - 16, 0, LEN, 0, 3);       // west bank
    bank(g,  WID + 16, 0, LEN, Math.PI, 3); // east bank (toward Palatine)

    // curved end to the west (toward the Forum)
    for (let i = 0; i <= 10; i++) {
      const a = -Math.PI / 2 + (Math.PI * i) / 10;
      // three concentric arcs of seating blocks
      for (let ring = 0; ring < 3; ring++) {
        const rr = WID + 10 + ring * 13;
        const x = Math.cos(a) * rr, z = -LEN / 2 + 20 + Math.sin(a) * rr * 0.75;
        g.add(ROME.box(14, 3.4 + ring * 0.6, 14, M.travertine, x - WID - 4, 0, z, a + Math.PI / 2));
      }
    }
    // start gates (carceres) at the east end
    g.add(ROME.box(8, 9, WID * 2 + 20, M.stone, WID + 8, 0, LEN / 2 - 10));

    g.position.set(cx, gy, cz);
    scene.add(g);
  }

  function circusFlaminius(scene) {
    const M = ROME.M;
    const cx = -330, cz = -180;       // Campus Martius
    const gy = ROME.heightAt(cx, cz);
    const g = new THREE.Group();
    const LEN = 200, WID = 34;
    g.add(ROME.box(5, 3, LEN * 0.8, M.travertine, 0, 0, 0));           // spina
    g.add(ROME.box(LEN, 3.4, 10, M.travertine, 0, 0, -WID - 8));
    g.add(ROME.box(LEN, 3.8, 10, M.travertine, 0, 0, WID + 8));
    for (let i = 0; i <= 8; i++) {
      const a = Math.PI / 2 + (Math.PI * i) / 8;
      for (let ring = 0; ring < 2; ring++) {
        const rr = WID + 8 + ring * 12;
        g.add(ROME.box(12, 3.4 + ring * 0.6, 12, M.travertine,
          Math.cos(a) * rr, 0, LEN / 2 - 14 + Math.sin(a) * rr * 0.7, a));
      }
    }
    g.position.set(cx, gy, cz);
    scene.add(g);
  }

  function buildCircuses(scene) {
    circusMaximus(scene);
    circusFlaminius(scene);
  }

  return { buildCircuses: buildCircuses, SPINA: () => ROME_OBELISK_SPINA };
})();
