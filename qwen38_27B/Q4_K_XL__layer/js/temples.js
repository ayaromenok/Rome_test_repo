/* ============================================================
   temples.js — The temples of Imperial Rome
   High podium, single front stair, deep colonnaded pronaos,
   closed cella, engaged side columns — and the Pantheon
   with its unreinforced concrete dome and oculus.
   ============================================================ */
window.RomeTemples = (function () {
  'use strict';

  /* generic Roman temple on a high podium, facing +z (front) */
  function temple(scene, x, z, w, d, cols, h, ry, ruined) {
    const M = ROME.M;
    const g = new THREE.Group();
    const gy = ROME.heightAt(x, z);
    const podiumH = 3.2;
    // podium
    g.add(ROME.box(w, podiumH, d, M.travertine, 0, 0, 0));
    // front staircase (single central entry)
    g.add(ROME.box(w * 0.5, podiumH, 6, M.travertine, 0, 0, d / 2 + 3));
    for (let i = 0; i < 4; i++)
      g.add(ROME.box(w * 0.5 - i * 0.4, 0.35, 0.9, M.travertine, 0, 0.15 + i * 0.78, d / 2 + 5.4 - i * 1.45));
    // cella (closed inner room)
    g.add(ROME.box(w * 0.62, h * 0.62, d * 0.72, M.stone, 0, podiumH, -d * 0.12));
    // roof over cella
    g.add(ROME.box(w * 0.7, 1, d * 0.78, M.terracotta, 0, podiumH + h * 0.62, -d * 0.12));
    // pronaos columns (free-standing)
    const colH = h * 0.62;
    for (let i = 0; i < cols; i++) {
      const cx = -w * 0.42 + (w * 0.84) * i / (cols - 1);
      g.add(ROME.cyl(0.55, 0.65, colH, 12, M.marble, cx, podiumH, d * 0.32));
    }
    // architrave + pediment on the front
    g.add(ROME.box(w * 0.95, 1.2, 1.4, M.marble, 0, podiumH + colH, d * 0.32));
    const ped = new THREE.Mesh(new THREE.CylinderGeometry(w * 0.48, w * 0.48, 1.4, 3, 1, false, 0, Math.PI), M.marble);
    ped.rotation.set(Math.PI / 2, 0, 0);
    ped.scale.z = 0.55;
    ped.position.set(0, podiumH + colH + 1.2, d * 0.32);
    ped.castShadow = true;
    g.add(ped);
    // engaged half-columns on the sides and back
    const sideN = Math.max(3, cols);
    for (let i = 1; i < sideN; i++) {
      const sz = -d * 0.35 + (d * 0.65) * i / (sideN - 1);
      g.add(ROME.cyl(0.4, 0.5, colH, 8, M.stone, -w * 0.49, podiumH, sz));
      g.add(ROME.cyl(0.4, 0.5, colH, 8, M.stone, w * 0.49, podiumH, sz));
    }
    if (ruined) { // a few leaning, fallen columns (Temple of Saturn look)
      g.children.forEach(c => { if (Math.random() < 0.25) { c.rotation.z = (Math.random() - 0.5) * 0.25; c.position.y += 0.2; } });
    }
    g.position.set(x, gy, z);
    g.rotation.y = ry || 0;
    scene.add(g);
  }

  /* the Pantheon — rotunda, unreinforced dome, oculus, portico */
  function pantheon(scene, x, z) {
    const M = ROME.M;
    const gy = ROME.heightAt(x, z);
    const g = new THREE.Group();
    const R = 30, WALL = 16;
    // drum
    g.add(ROME.cyl(R, R, WALL, 40, M.brick, 0, 0, 0));
    g.add(ROME.box(R * 2.4, 1.4, R * 2.4, M.travertine, 0, 14.5, 0)); // cornice ring
    // concrete dome
    const dome = new THREE.Mesh(new THREE.SphereGeometry(R, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), M.stone);
    dome.position.y = WALL; dome.scale.y = 1.05; dome.castShadow = true;
    g.add(dome);
    // oculus
    const oculus = new THREE.Mesh(new THREE.CylinderGeometry(6, 6, 3, 24, 1, true), M.dark);
    oculus.position.y = WALL + R * 1.02;
    g.add(oculus);
    const sun = new THREE.Mesh(new THREE.CircleGeometry(5.5, 24), M.gold);
    sun.rotation.x = -Math.PI / 2;
    sun.position.y = WALL + R * 1.06;
    g.add(sun);
    // portico: steps + 8 columns + pediment
    for (let i = 0; i < 5; i++)
      g.add(ROME.box(26 - i * 0.8, 0.5, 3, M.travertine, 0, i * 0.5, R + 4 + (4 - i) * 2.4));
    const base = 2.5;
    for (let i = 0; i < 8; i++) {
      const cx = -19 + (38) * i / 7;
      g.add(ROME.cyl(0.9, 1.05, 12, 14, M.marble, cx, base, R + 2.5));
    }
    g.add(ROME.box(28, 2.2, 3, M.travertine, 0, base + 12, R + 2.5));
    const ped = new THREE.Mesh(new THREE.ConeGeometry(16, 7, 4), M.terracotta);
    ped.position.set(0, base + 15.5, R + 2.5);
    ped.rotation.y = Math.PI / 4;
    ped.scale.z = 0.45;
    ped.castShadow = true;
    g.add(ped);
    g.position.set(x, gy, z);
    scene.add(g);
  }

  /* small circular shrine (Temple of Vesta) */
  function shrine(scene, x, z, r, h) {
    const M = ROME.M;
    const gy = ROME.heightAt(x, z);
    const g = new THREE.Group();
    g.add(ROME.cyl(r * 1.4, r * 1.5, 0.8, 20, M.travertine, 0, 0, 0));
    g.add(ROME.cyl(r, r, h, 20, M.stone, 0, 0.8, 0));
    const roof = new THREE.Mesh(new THREE.ConeGeometry(r + 1.5, h * 0.7, 20), M.terracotta);
    roof.position.y = 0.8 + h + h * 0.35; roof.castShadow = true;
    g.add(roof);
    const flame = new THREE.Mesh(new THREE.SphereGeometry(0.8, 8, 8), M.gold);
    flame.position.y = 0.8 + h * 0.5;
    g.add(flame); // the eternal flame
    for (let i = 0; i < 6; i++) {
      const a = i / 6 * Math.PI * 2;
      g.add(ROME.cyl(0.35, 0.4, h + 1, 10, M.marble, Math.cos(a) * (r + 2), 0.8, Math.sin(a) * (r + 2)));
    }
    g.position.set(x, gy, z);
    scene.add(g);
  }

  function buildTemples(scene) {
    // Temple of Jupiter Optimus Maximus — top of the Capitoline
    temple(scene, -90, 120, 40, 46, 6, 16, -0.5, false);
    // Temple of Saturn — Forum (state treasury), partially ruined
    temple(scene, -25, 265, 26, 30, 6, 11, 0.18, true);
    // Temple of Portunus — Forum Boarium by the river (Ionic, high podium)
    temple(scene, -330, 400, 22, 26, 4, 10, 1.2, false);
    // Temple of Venus and Roma — Hadrian's great twin temple, E of Forum
    temple(scene, 480, 330, 70, 55, 8, 20, 2.6, false);
    // Temple of Serapis — Quirinal
    temple(scene, 130, -580, 30, 36, 6, 13, 0.4, false);
    // Temple of Vesta — the round shrine of the eternal flame
    shrine(scene, 20, 150, 7, 8);
    // The Pantheon — Campus Martius, dome for all the gods
    pantheon(scene, -430, -260);
  }

  return { buildTemples: buildTemples };
})();
