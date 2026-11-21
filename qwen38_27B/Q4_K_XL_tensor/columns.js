/* columns.js — monumental columns (Trajan, Marcus Aurelius),
   the colonnade of the Via Sacra and colonnaded streets */
window.Columns = (function () {
  const R = window.Roman, M = R.M;

  // Classical column with base, shaft, capital
  function makeColumn(h, r) {
    h = h || 12; r = r || 1;
    const g = new THREE.Group();
    g.add(R.box(r * 3, 0.7, r * 3, M.stone, 0, 0.35, 0));
    g.add(R.cyl(r, r * 1.15, h, 14, M.marble, 0, 0.7 + h / 2, 0));
    g.add(R.box(r * 2.6, 0.6, r * 2.6, M.marble, 0, 0.7 + h + 0.3, 0));
    g.add(R.box(r * 2.2, 0.5, r * 2.2, M.marble, 0, 0.7 + h + 0.85, 0));
    return g;
  }

  // Triumphal column with spiral relief (banded rings) and a statue on top
  function makeTriumphalColumn(name, h) {
    h = h || 24;
    const g = new THREE.Group();
    g.add(R.box(5, 2.5, 5, M.tuff, 0, 1.25, 0));
    g.add(R.box(4, 1, 4, M.stone, 0, 3, 0));
    g.add(R.cyl(1.8, 2.1, h, 20, M.marble, 0, 3.5 + h / 2, 0));
    for (let i = 0; i < 10; i++)                            // spiral relief rings
      g.add(R.cyl(2.2, 2.2, 0.25, 20, M.tuff, 0, 5 + i * (h / 10), 0));
    g.add(R.box(4, 1, 4, M.marble, 0, 3.5 + h + 0.5, 0));
    // statue (emperor) on the capital
    const statue = new THREE.Group();
    statue.add(R.cyl(0.5, 0.8, 1.4, 8, M.gold, 0, 0.7, 0));
    const body = R.box(1.4, 2.6, 0.8, M.gold, 0, 2.2, 0);
    statue.add(body);
    statue.add(R.cyl(0.45, 0.45, 0.7, 8, M.gold, 0, 3.9, 0));
    statue.position.y = 3.5 + h + 1;
    g.add(statue);
    const label = R.makeLabel(name, 34);
    label.position.y = h + 14;
    g.add(label);
    return g;
  }

  // Row of columns along a line of points
  function colonnade(pts, gap, scene) {
    gap = gap || 8;
    let acc = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1];
      const dx = b[0] - a[0], dz = b[1] - a[1];
      const len = Math.hypot(dx, dz);
      const n = Math.floor(len / gap);
      for (let j = 0; j <= n; j++) {
        const t = j / n;
        const x = a[0] + dx * t, z = a[1] + dz * t;
        const h = window.Terrain.heightAt(x, z);
        for (const s of [-1, 1]) {                          // paired rows on both sides
          const px = x - dz / len * 2.5 * s, pz = z + dx / len * 2.5 * s;
          const c = makeColumn(7, 0.55);
          c.position.set(px, window.Terrain.heightAt(px, pz), pz);
          scene.add(c);
        }
      }
    }
  }

  function build(scene) {
    // Column of Trajan — Forum of Trajan area (east of the Forum)
    const trajan = makeTriumphalColumn('Column of Trajan (113 CE)', 30);
    const x = 105, z = -25;
    trajan.position.set(x, window.Terrain.heightAt(x, z), z);
    scene.add(trajan);

    // Column of Marcus Aurelius
    const maur = makeTriumphalColumn('Column of Marcus Aurelius', 24);
    const x2 = 70, z2 = -70;
    maur.position.set(x2, window.Terrain.heightAt(x2, z2), z2);
    scene.add(maur);

    // Colonnade of the Via Sacra — the sacred road through the Forum
    colonnade([[90, 140], [55, 95], [20, 55], [-5, 25]], 9, scene);

    // Colonnaded street near the Caelian
    colonnade([[130, 250], [170, 300], [210, 350]], 9, scene);
  }

  return { build, makeColumn, makeTriumphalColumn, colonnade };
})();
