/* roads.js - the viae (roads) of ancient Rome, plus bridges over the Tiber */
window.Rome = window.Rome || {};

(function () {
  const T = () => window.Rome.terrain;
  const C = () => window.Rome.core;

  // Build a terrain-hugging ribbon road through a list of (x, z) points
  function road(points, width, mat, yOff) {
    const g = new THREE.Group();
    const M = C().mats;
    mat = mat || M.road;
    yOff = yOff === undefined ? 0.25 : yOff;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i], p1 = points[i + 1];
      const dx = p1.x - p0.x, dz = p1.z - p0.z;
      const len = Math.hypot(dx, dz);
      const segs = Math.max(2, Math.floor(len / 6));
      for (let s = 0; s < segs; s++) {
        const t0 = s / segs, t1 = (s + 1) / segs;
        const ax = p0.x + dx * t0, az = p0.z + dz * t0;
        const bx = p0.x + dx * t1, azz = p0.z + dz * t1;
        const h0 = T().heightAt(ax, az) + yOff;
        const h1 = T().heightAt(bx, azz) + yOff;
        const midH = (h0 + h1) / 2;
        const m = C().box(len / segs + 0.4, 0.5, width, mat);
        m.position.set((ax + bx) / 2, midH, (az + azz) / 2);
        m.rotation.y = -Math.atan2(dx, dz);
        g.add(m);
        // central stone line (cursus line) for major roads
        if (width > 8) {
          const line = C().box(len / segs + 0.4, 0.55, 0.6, M.cobble);
          line.position.set(m.position.x, midH, m.position.z);
          line.rotation.y = m.rotation.y;
          g.add(line);
        }
      }
    }
    return g;
  }

  // A stone bridge across the Tiber at z, spanning the full river width
  function bridge(z, width) {
    const g = new THREE.Group();
    const M = C().mats;
    const cx = T().riverX(z);
    const w = T().RIVER_HALF + 12;
    const deckY = 1.6;
    // bridge runs along x here (perpendicular to river flow which is along z)
    const b = C().box(w * 2, 1.2, width || 6, M.stone, 0, deckY, 0);
    // side walls
    g.add(b);
    g.add(C().box(w * 2, 0.8, 0.5, M.stoneDark, 0, deckY + 1.0, (width || 6) / 2 + 0.25));
    g.add(C().box(w * 2, 0.8, 0.5, M.stoneDark, 0, deckY + 1.0, -(width || 6) / 2 - 0.25));
    // piers in the river
    for (let px = -w + 14; px <= w - 14; px += 28) {
      g.add(C().box(5, 9, (width || 6) + 2, M.stone, px, -1.5, 0));
    }
    g.position.set(cx, 0, z);
    return g;
  }

  // Road network following the consular roads of the Aurelian plan
  function buildRoads(scene) {
    const g = new THREE.Group();
    const M = C().mats;

    // Via Flaminia - north, from Porta Flaminia down to the Forum
    g.add(road([{ x: 5, z: 345 }, { x: -5, z: 180 }, { x: -5, z: 55 }], 9));
    // Via Appia - from Forum to Porta Appia (SE)
    g.add(road([{ x: 15, z: 30 }, { x: 140, z: -90 }, { x: 300, z: -240 }], 9));
    // Via Ostiensis - south
    g.add(road([{ x: 5, z: 30 }, { x: 10, z: -160 }, { x: 20, z: -330 }], 9));
    // Via Tiburtina - east / NE, passing north of the Colosseum
    g.add(road([{ x: 25, z: 20 }, { x: 90, z: 40 }, { x: 260, z: 120 }, { x: 330, z: 160 }], 8));
    // Via Salaria - northeast
    g.add(road([{ x: 10, z: 50 }, { x: 120, z: 120 }, { x: 260, z: 260 }], 8));
    // Via Labicana - toward Esquiline
    g.add(road([{ x: 60, z: 30 }, { x: 150, z: 70 }, { x: 250, z: 120 }], 6));
    // Via Triumphalis - across the Palatine summit (Capitoline to Palatine)
    g.add(road([{ x: -40, z: 42 }, { x: 70, z: 40 }, { x: 160, z: 60 }], 5, M.cobble));
    // Via Sacra - the sacred road through the Forum
    g.add(road([{ x: -35, z: -35 }, { x: 0, z: 0 }, { x: 45, z: 35 }], 7, M.cobble, 0.35));

    // Paved plateau for the Roman Forum itself
    const forumPave = C().box(120, 0.6, 120, M.cobble, 0, T().heightAt(0, 5) + 0.15, 5);
    g.add(forumPave);
    // Circus Maximus track floor (the flat arena)
    g.add(C().box(50, 0.5, 150, M.sand, 38, T().heightAt(38, -30) + 0.15, -30));
    // Colosseum surroundings
    g.add(C().box(110, 0.5, 100, M.road, 100, T().heightAt(100, 5) + 0.15, 5));
    // Campus Martius exercise ground
    g.add(C().box(90, 0.4, 160, M.sand, -85, T().heightAt(-85, 0) + 0.1, 0));

    // Bridges over the Tiber
    g.add(bridge(-45, 6));   // Pons Fabricius (toward Forum Boarium)
    g.add(bridge(70, 6));    // Pons Aemilius
    g.add(bridge(-230, 5));  // southern bridge

    scene.add(g);
    return g;
  }

  window.Rome.roads = { build: buildRoads, road: road, bridge: bridge };
})();
