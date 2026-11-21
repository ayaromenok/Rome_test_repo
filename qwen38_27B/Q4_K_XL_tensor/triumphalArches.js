/* triumphalArches.js — victory arches: Titus, Septimius Severus,
   Constantine, Augustus. Bays with true arched openings. */
window.TriumphalArches = (function () {
  const R = window.Roman, M = R.M;

  // One arched bay as an extruded slab (rectangle with semicircular hole)
  function archBay(w, h, d, mat) {
    const s = new THREE.Shape();
    s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(w / 2, h); s.lineTo(-w / 2, h); s.closePath();
    const ar = w * 0.38, archH = Math.min(ar * 1.5, h * 0.65);
    const hole = new THREE.Path();
    hole.moveTo(-ar, 0);
    hole.absarc(0, archH - ar, ar, Math.PI, 0, true);
    hole.lineTo(ar, 0);
    hole.lineTo(-ar, 0);
    s.holes.push(hole);
    const g = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false });
    g.translate(0, 0, -d / 2);
    return new THREE.Mesh(g, mat || M.stone);
  }

  function makeArch(h, bays, mat) {
    h = h || 10; bays = bays || 1;
    const g = new THREE.Group();
    const bayW = 7, gap = 3;
    const total = bays * bayW + (bays - 1) * gap;
    for (let i = 0; i < bays; i++) {
      const x = -total / 2 + bayW / 2 + i * (bayW + gap);
      const slab = archBay(bayW, h, bays > 1 ? 6 : 8, mat || M.stone);
      slab.position.x = x;
      g.add(slab);
    }
    // side cheeks + entablature/attic
    for (const sx of [-1, 1])
      g.add(R.box(1.2, h + 3, bays > 1 ? 8 : 9, M.tuff, sx * (total / 2 + 0.6), (h + 3) / 2, 0));
    g.add(R.box(total + 3.5, 2, bays > 1 ? 8 : 9, M.stone, 0, h + 1, 0));
    g.add(R.box(total + 2.5, 2.5, bays > 1 ? 6 : 7, M.tuff, 0, h + 3.5, 0)); // attic
    return g;
  }

  function place(name, x, z, ry, h, bays, scene) {
    const g = makeArch(h, bays);
    g.position.set(x, window.Terrain.heightAt(x, z), z);
    if (ry) g.rotation.y = ry;
    scene.add(g);
    const label = R.makeLabel(name, 26);
    label.position.set(x, window.Terrain.heightAt(x, z) + h + 10, z);
    scene.add(label);
  }

  function build(scene) {
    // Arch of Titus — end of the Via Sacra, through the Temple of Septimius Severus
    place('Arch of Titus (81 CE)', 55, 55, 0.6, 9, 1, scene);
    // Arch of Septimius Severus — three bays, crossing the Via Sacra
    place('Arch of Septimius Severus (203 CE)', 12, 60, Math.PI / 2, 12, 3, scene);
    // Arch of Constantine — before the Colosseum
    place('Arch of Constantine (315 CE)', 108, 118, -0.9, 13, 3, scene);
    // Arch of Augustus — Caelian hill
    place('Arch of Augustus', 150, 175, 0.4, 10, 1, scene);
  }

  return { build, makeArch };
})();
