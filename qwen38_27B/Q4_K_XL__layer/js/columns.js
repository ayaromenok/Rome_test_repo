/* ============================================================
   columns.js — Colonnaded streets and honour columns
   The colonnaded Via Sacra flanking the Forum, the Temple
   of Vesta colonnade circle, and the Column of Marcus
   Aurelius (a 30 m rostra-topped honour column).
   ============================================================ */
window.RomeColumns = (function () {
  'use strict';

  /* two rows of columns lining a straight street */
  function colonnade(scene, x0, z0, x1, z1, n, spacing) {
    const dx = (x1 - x0), dz = (z1 - z0);
    const len = Math.hypot(dx, dz);
    const nx = -dz / len, nz = dx / len;
    for (let i = 0; i <= n; i++) {
      const x = x0 + dx * i / n + nx * spacing;
      const z = z0 + dz * i / n + nz * spacing;
      scene.add(ROME.column(x, z, 0.8, 9, ROME.M.marble));
      const x2 = x0 + dx * i / n - nx * spacing;
      const z2 = z0 + dz * i / n - nz * spacing;
      scene.add(ROME.column(x2, z2, 0.8, 9, ROME.M.marble));
    }
    // entablature on both sides
    for (const s of [-1, 1]) {
      const mx = (x0 + x1) / 2 + nx * spacing * s;
      const mz = (z0 + z1) / 2 + nz * spacing * s;
      const bar = ROME.box(len, 1.4, 1.2, ROME.M.travertine, mx, 0, mz, Math.atan2(dz, dx));
      bar.position.y = ROME.heightAt(mx, mz) + 9.2;
      scene.add(bar);
    }
  }

  /* honour column: tall drum + bronze statue + rostra base */
  function honourColumn(scene, x, z) {
    const M = ROME.M;
    const gy = ROME.heightAt(x, z);
    const g = new THREE.Group();
    g.add(ROME.box(8, 1.8, 8, M.travertine, 0, 0, 0));
    g.add(ROME.cyl(2.6, 2.9, 30, 20, M.travertine, 0, 1.8, 0));
    g.add(ROME.box(7, 2.2, 7, M.travertine, 0, 31.8, 0));
    const statue = new THREE.Mesh(new THREE.ConeGeometry(1.6, 4, 8), M.bronze);
    statue.position.y = 35;
    statue.castShadow = true;
    g.add(statue);
    g.position.set(x, gy, z);
    scene.add(g);
  }

  function buildColumns(scene) {
    // the colonnaded Via Sacra
    colonnade(scene, 12, 280, -30, 60, 7, 11);
    // forum entrance colonnade
    colonnade(scene, 90, 330, 150, 330, 5, 9);
    // honour column of Marcus Aurelius
    honourColumn(scene, -30, 90);
    // scattered sacred columns at temple forecourts
    scene.add(ROME.column(-160, 155, 0.8, 10, ROME.M.marble));
    scene.add(ROME.column(-135, 165, 0.8, 10, ROME.M.marble));
  }

  return { buildColumns: buildColumns };
})();
