/* ============================================================
   colosseum.js — The Flavian Amphitheatre (70–80 CE)
   Four tiers of travertine, arched facade, east-west oval
   east of the Forum, near the Caelian and Esquiline.
   ============================================================ */
window.RomeColosseum = (function () {
  'use strict';

  /* vertical elliptical wall band between heights y0..y1 (local) */
  function ring(parent, rx, rz, y0, y1, n, mat) {
    const pos = [], idx = [];
    for (let i = 0; i < n; i++) {
      const a0 = (i / n) * Math.PI * 2, a1 = ((i + 1) / n) * Math.PI * 2;
      const x0 = Math.cos(a0) * rx, z0 = Math.sin(a0) * rz;
      const x1 = Math.cos(a1) * rx, z1 = Math.sin(a1) * rz;
      pos.push(x0, y0, z0, x1, y0, z1, x1, y1, z1, x0, y1, z0);
      const a = i * 4;
      idx.push(a, a + 1, a + 3, a, a + 3, a + 2);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    const m = new THREE.Mesh(geo, mat);
    m.castShadow = m.receiveShadow = true;
    parent.add(m);
  }

  /* a ring of piers + semicircular arches (facade arcade) */
  function arcades(parent, rx, rz, y, n, archH) {
    const M = ROME.M;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const x = Math.cos(a) * rx, z = Math.sin(a) * rz;
      const ry = -a - Math.PI / 2;
      parent.add(ROME.box(1.6, archH, 1.6, M.stone, x, y, z, ry));
      const arc = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.5, 6, 10, Math.PI), M.travertine);
      arc.position.set(x, y + archH, z);
      arc.rotation.set(0, ry, 0);
      arc.castShadow = true;
      parent.add(arc);
    }
  }

  function buildColosseum(scene) {
    const M = ROME.M;
    const cx = 430, cz = 180;
    const gy = ROME.heightAt(cx, cz);
    const RX = 78, RZ = 56;
    const g = new THREE.Group();

    // Tier 1: ground arcade (tall, open colonnade)
    ring(g, RX, RZ, 0, 10, 64, M.travertine);
    ring(g, RX + 1.5, RZ + 1.5, 10, 12.5, 64, M.stone);        // entablature
    // Tier 2: semicircular arcades
    ring(g, RX - 1, RZ - 1, 12.5, 21, 64, M.travertine);
    ring(g, RX + 1, RZ + 1, 21, 23, 64, M.stone);
    // Tier 3: windowed Corinthian order
    ring(g, RX - 2.5, RZ - 2.5, 23, 31.5, 64, M.stone);
    ring(g, RX - 1, RZ - 1, 31.5, 33.5, 64, M.travertine);
    // Tier 4: attic (partly lost to history)
    ring(g, RX - 6, RZ - 6, 33.5, 38, 64, M.brick);

    // arcades on the two lower tiers
    arcades(g, RX + 0.2, RZ + 0.2, 0, 40, 9);
    arcades(g, RX + 0.8, RZ + 0.8, 13, 34, 7.5);

    // the four corner pendentive towers
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const x = Math.cos(a) * RX * 0.99, z = Math.sin(a) * RZ * 0.99;
      g.add(ROME.box(12, 46, 12, M.travertine, x, 0, z, -a));
    }

    // arena floor
    const arena = new THREE.Mesh(new THREE.CircleGeometry(52, 40), M.sand);
    arena.rotation.x = -Math.PI / 2;
    arena.scale.set(1.3, 1, 1);
    arena.position.y = 0.6;
    g.add(arena);

    // plinth hugging the terrain
    ring(g, RX + 3, RZ + 3, -3, 0.5, 64, M.stone);

    g.position.set(cx, gy, cz);
    scene.add(g);
  }

  return { buildColosseum: buildColosseum };
})();
