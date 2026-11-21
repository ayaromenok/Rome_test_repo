/* aqueducts.js — masonry aqueducts carrying water over the valleys,
   brick arches on a channel (aqua ductus) reaching fountains & baths. */
window.Aqueducts = (function () {
  const R = window.Roman, M = R.M;

  // Cross-section of a vaulted bay: rectangle with a semicircular hole
  function bayGeometry(w, h, depth) {
    const s = new THREE.Shape();
    const ar = w * 0.42, archH = Math.min(ar * 1.6, h * 0.7);
    s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(w / 2, h); s.lineTo(-w / 2, h); s.closePath();
    const hole = new THREE.Path();
    hole.moveTo(-ar, 0);
    hole.absarc(0, archH - ar, ar, Math.PI, 0, true);
    hole.lineTo(ar, 0);
    hole.lineTo(-ar, 0);
    s.holes.push(hole);
    const g = new THREE.ExtrudeGeometry(s, { depth: depth, bevelEnabled: false });
    g.translate(0, 0, -depth / 2);
    return g;
  }

  // One tier of arches following a list of [x,z] points
  function tier(pts, h, w, mat) {
    const g = new THREE.Group();
    const bayLen = w * 0.92;
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1];
      const dx = b[0] - a[0], dz = b[1] - a[1];
      const len = Math.hypot(dx, dz);
      const n = Math.max(1, Math.round(len / (w * 1.4)));
      for (let j = 0; j < n; j++) {
        const t = (j + 0.5) / n;
        const x = a[0] + dx * t, z = a[1] + dz * t;
        const y = Math.max(1.5, window.Terrain.heightAt(x, z));
        const bay = new THREE.Mesh(bayGeometry(w, h, bayLen), mat);
        bay.position.set(x, y, z);
        bay.rotation.y = Math.atan2(dx, dz);
        g.add(bay);
      }
    }
    return g;
  }

  function makeAqueduct(name, pts, h, w, scene) {
    const g = new THREE.Group();
    // lower arcade
    const lower = tier(pts, h, w, M.brick);
    g.add(lower);
    // upper channel wall carrying the water
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1];
      const dx = b[0] - a[0], dz = b[1] - a[1];
      const len = Math.hypot(dx, dz);
      const x = (a[0] + b[0]) / 2, z = (a[1] + b[1]) / 2;
      const yBase = Math.max(1.5, window.Terrain.heightAt(x, z));
      const wall = R.box(1.6, 3.2, len + 2, M.stone, 0, 0, 0, Math.atan2(dx, dz));
      wall.position.set(x + dz / len * 2.6, yBase + h + 1.6, z - dx / len * 2.6);
      g.add(wall);
      const wall2 = wall.clone();
      wall2.position.set(x - dz / len * 2.6, yBase + h + 1.6, z + dx / len * 2.6);
      g.add(wall2);
      // water in the channel
      const water = R.box(3.4, 0.5, len + 2, M.water, 0, 0, 0, Math.atan2(dx, dz));
      water.position.set(x, yBase + h + 3.1, z);
      g.add(water);
    }
    const label = R.makeLabel(name, 44);
    label.position.set(pts[1][0], 55, pts[1][1]);
    g.add(label);
    scene.add(g);
  }

  function build(scene) {
    // Aqua Claudia/Verginis — across the NW valley from the hills to the city
    makeAqueduct('Aqua Claudia Aqueduct',
      [[-580, -350], [-340, -280], [-80, -200], [140, -130], [340, -90]], 16, 8, scene);
    // Aqua Marcia — crossing the southern valley
    makeAqueduct('Aqua Marcia Aqueduct',
      [[-480, 330], [-220, 360], [40, 400], [300, 430], [480, 470]], 14, 7, scene);
  }

  return { build };
})();
