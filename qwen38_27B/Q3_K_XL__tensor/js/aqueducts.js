/* aqueducts.js - masonry aqueduct lines carrying water to fountains, baths and villas */
window.Rome = window.Rome || {};

(function () {
  const T = () => window.Rome.terrain;
  const C = () => window.Rome.core;

  // An aqueduct line: piers + arched galleries + a water channel on top
  // points: array of {x, z}; deckY: constant deck elevation (world)
  function aqueductLine(scene, points, deckY, label) {
    const g = new THREE.Group();
    const M = C().mats;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i], p1 = points[i + 1];
      const dx = p1.x - p0.x, dz = p1.z - p0.z;
      const len = Math.hypot(dx, dz);
      const dir = Math.atan2(dx, dz);
      const span = 12;                    // arch span
      const n = Math.max(1, Math.round(len / span));
      const seg = len / n;
      const py = deckY - 6;               // gallery height above lowest pier
      for (let s = 0; s < n; s++) {
        const t0 = s / n, t1 = (s + 1) / n;
        const cx = p0.x + dx * (t0 + t1) / 2;
        const cz = p0.z + dz * (t0 + t1) / 2;
        const ground = T().heightAt(cx, cz);
        const deck = Math.max(deckY, ground + 2.5);
        const h = deck - ground;
        // two piers
        for (const tt of [t0, t1]) {
          const px = p0.x + dx * tt, pz = p0.z + dz * tt;
          const ph = Math.max(2, T().heightAt(px, pz) - ground) + h - 4;
          g.add(C().box(1.6, h - 3, 1.6, M.stone, px, ground + (h - 3) / 2, pz));
        }
        // arched gallery (openings)
        const gallery = C().box(seg + 0.5, 4.5, 2.2, M.travertine, cx, ground + h - 2.25, cz);
        gallery.rotation.y = -dir;
        g.add(gallery);
        // arches under the gallery
        for (let k = 0; k < 3; k++) {
          const ax = cx - (dx / len) * seg / 3 * (1.5 - k);
          const az = cz - (dz / len) * seg / 3 * (1.5 - k);
          const arch = new THREE.Mesh(C().archFrameGeometry(3.6, 4.4, 2.2, 1.4, 2.0), M.stoneDark);
          arch.position.set(ax, ground + 2.2, az);
          arch.rotation.y = -dir + Math.PI / 2;
          g.add(arch);
        }
        // water channel on the deck
        const channel = C().box(seg + 0.5, 1.4, 1.8, M.marble, cx, deck + 0.7, cz);
        channel.rotation.y = -dir;
        g.add(channel);
        const water = C().box(seg + 0.5, 0.5, 1.0, M.water, cx, deck + 1.3, cz);
        water.rotation.y = -dir;
        g.add(water);
      }
    }
    if (label) {
      const mid = points[Math.floor(points.length / 2)];
      scene.add(T().makeLabel(label, (points[0].x + points[points.length - 1].x) / 2, deckY + 10, (points[0].z + points[points.length - 1].z) / 2));
    }
    scene.add(g);
    return g;
  }

  function buildAqueducts(scene) {
    // Aqua Claudia (32 CE) - arrives from the NE across the Quirinal
    aqueductLine(scene, [
      { x: 350, z: 260 }, { x: 250, z: 215 }, { x: 170, z: 175 }, { x: 110, z: 148 },
    ], 24, 'AQUA CLAUDIA');

    // Aqua Alsietina (49 BCE) - crosses the Tiber to serve the Aventine
    aqueductLine(scene, [
      { x: -235, z: -265 }, { x: -185, z: -268 }, { x: -120, z: -262 }, { x: -70, z: -240 },
    ], 14, 'AQUA ALSIETINA');

    // Aqua Marcia branch toward the Esquiline baths
    aqueductLine(scene, [
      { x: 300, z: 150 }, { x: 240, z: 100 }, { x: 185, z: 82 },
    ], 20, 'AQUA MARCIA');
  }

  window.Rome.aqueducts = { build: buildAqueducts, aqueductLine: aqueductLine };
})();
