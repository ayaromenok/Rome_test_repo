/* temples.js — Roman temples: high podium, front stairs, deep portico, cella,
   engaged side columns, pediment. Includes Pantheon (dome + oculus). */
window.Temples = (function () {
  const R = window.Roman, M = R.M;

  // Generic Roman temple. width (w), depth (d), floor height above podium (fh),
  // number of front columns (nc), column height (ch)
  function makeTemple(opts) {
    const w = opts.w || 24, d = opts.d || 32, fh = opts.fh || 9,
          nc = opts.nc || 6, ch = opts.ch || 8,
          mat = opts.mat || M.marble, ped = opts.ped || M.stone;
    const g = new THREE.Group();
    const podiumH = 3;
    // high podium + single front staircase
    g.add(R.box(w + 2, podiumH, d + 2, M.tuff, 0, podiumH / 2, 0));
    for (let i = 0; i < 4; i++)
      g.add(R.box(w * (1 - i * 0.08), 0.5, 1.1, M.stone, 0, 0.25 + i * 0.5, d / 2 + 1 + (3 - i) * 1.1));
    // cella (naos) behind the porch
    const cellaW = w * 0.62, cellaD = d * 0.55;
    const cella = R.box(cellaW, fh, cellaD, mat, 0, podiumH + fh / 2, -d * 0.18);
    g.add(cella);
    // free-standing front colonnade (pronaos)
    const colR = ch * 0.09;
    for (let i = 0; i < nc; i++) {
      const x = -w / 2 + w * (i / (nc - 1));
      for (const row of [0, -1]) {
        const z = d * 0.32 + row * 2.2;
        const c = R.cyl(colR, colR * 1.15, ch, 10, mat, x, podiumH + ch / 2, z);
        g.add(c);
        g.add(R.box(colR * 3, 0.7, colR * 3, mat, x, podiumH + ch + 0.35, z)); // capital
      }
    }
    // engaged (half) columns along the cella sides
    for (let i = 1; i < 5; i++) {
      const z = -d * 0.42 + d * 0.55 * (i / 4);
      for (const sx of [-1, 1])
        g.add(R.cyl(colR * 0.8, colR * 0.95, ch * 0.9, 8, mat, sx * (cellaW / 2), podiumH + ch * 0.45, z));
    }
    // architrave + pediment over the front
    g.add(R.box(w * 1.04, 1.4, 2.6, ped, 0, podiumH + ch + 1.1, d * 0.32));
    const pedm = R.pediment(w * 1.06, 2.6, w * 0.32, ped);
    pedm.position.set(0, podiumH + ch + 1.8, d * 0.32);
    g.add(pedm);
    // flat roof over the cella
    g.add(R.box(cellaW + 1, 1, cellaD + 1, ped, 0, podiumH + fh + 0.5, -d * 0.18));
    return g;
  }

  // Pantheon: cylindrical rotunda with great concrete dome + oculus, portico of 8
  function makePantheon() {
    const g = new THREE.Group();
    g.add(R.box(34, 2, 40, M.tuff, 0, 1, 0));                       // platform
    const drum = R.cyl(17, 17, 15, 32, M.stone, 0, 2 + 7.5, -4);
    g.add(drum);
    const dome = R.makeDome(17, M.stone);                           // unreinforced concrete dome
    dome.position.set(0, 2 + 15, -4);
    g.add(dome);
    const oculus = R.cyl(2.4, 2.4, 1.6, 16, M.dark, 0, 2 + 15 + 16.6, -4, true); // oculus ring
    g.add(oculus);
    g.add(R.box(3, 16.2, 3, M.dark, 0, 2 + 8, -4 - 16.2));          // dome ribs hint
    for (let i = 0; i < 8; i++) {                                   // portico
      const x = -14 + 28 * (i / 7);
      g.add(R.cyl(0.9, 1.05, 11, 12, M.marble, x, 2 + 5.5, 16));
      g.add(R.box(2.4, 0.8, 2.4, M.marble, x, 2 + 11.4, 16));
    }
    g.add(R.box(32, 1.6, 3, M.stone, 0, 2 + 12.2, 16));
    const ped = R.pediment(33, 3, 10, M.stone);
    ped.position.set(0, 2 + 13, 16);
    g.add(ped);
    for (let i = 0; i < 6; i++) g.add(R.box(7, 0.5, 1, M.stone, -15 + i * 3, 0.25 + i * 0.5, 19.5 + (5 - i)));
    const label = R.makeLabel('Pantheon', 34);
    label.position.set(0, 42, -4);
    g.add(label);
    return g;
  }

  // Round temple (Temple of Vesta type)
  function makeRoundTemple(r) {
    r = r || 5;
    const g = new THREE.Group();
    g.add(R.cyl(r + 0.6, r + 0.8, 2, 24, M.tuff, 0, 1, 0));
    for (let i = 0; i < 10; i++) {
      const a = i / 10 * Math.PI * 2;
      g.add(R.cyl(r * 0.09, r * 0.11, 5.5, 8, M.marble, Math.cos(a) * (r - 0.5), 2 + 2.75, Math.sin(a) * (r - 0.5)));
    }
    g.add(R.cyl(r * 0.6, r * 0.6, 5, 20, M.marble, 0, 2 + 2.5, 0));
    const cone = new THREE.Mesh(new THREE.ConeGeometry(r + 0.4, r * 0.8, 20), M.roof);
    cone.position.y = 2 + 5 + r * 0.4;
    g.add(cone);
    for (let i = 0; i < 4; i++)
      g.add(R.box(4 - i * 0.6, 0.4, 0.9, M.stone, 0, 0.2 + i * 0.4, r + 1 + i * 0.9));
    return g;
  }

  function place(g, x, z, ry, scene) {
    g.position.set(x, window.Terrain.heightAt(x, z) + 0.3, z);
    if (ry) g.rotation.y = ry;
    scene.add(g);
    return g;
  }

  function build(scene) {
    // Temple of Jupiter Optimus Maximus — top of the Capitoline citadel
    const jupiter = makeTemple({ w: 34, d: 44, fh: 12, nc: 8, ch: 11 });
    const lj = R.makeLabel('Temple of Jupiter Optimus Maximus', 46); lj.position.y = 40; jupiter.add(lj);
    place(jupiter, -110, -55, Math.PI, scene);

    // Pantheon — east edge of the Campus Martius, at the foot of the Palatine
    place(makePantheon(), -90, 60, Math.PI * 0.85, scene);

    // Temple of Portunus — Forum Boarium, near the Tiber
    const port = makeTemple({ w: 15, d: 20, fh: 7, nc: 5, ch: 6.5, mat: M.marble });
    const lp = R.makeLabel('Temple of Portunus', 24); lp.position.y = 26; port.add(lp);
    place(port, -120, -50, Math.PI * 0.8, scene);

    // Temple of Venus and Roma — between Palatine and Colosseum (Hadrian's great temple)
    const venus = makeTemple({ w: 44, d: 60, fh: 14, nc: 9, ch: 12 });
    const lv = R.makeLabel('Temple of Venus and Roma', 48); lv.position.y = 44; venus.add(lv);
    place(venus, 45, 165, Math.PI * 0.95, scene);

    // Roman Forum temples
    const saturn = makeTemple({ w: 22, d: 26, fh: 8, nc: 6, ch: 7 });
    const ls = R.makeLabel('Temple of Saturn', 26); ls.position.y = 24; saturn.add(ls);
    place(saturn, -20, 62, Math.PI * 0.85, scene);

    // Temple of Vesta & Atrium Vestae — circular shrine, eternal flame
    const vesta = makeRoundTemple(5.5);
    const lvv = R.makeLabel('Temple of Vesta', 20); lvv.position.y = 20; vesta.add(lvv);
    place(vesta, -35, 30, 0, scene);
    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.7, 1.6, 8),
      new THREE.MeshLambertMaterial({ color: 0xff8c1a, emissive: 0xff6600 }));
    flame.position.set(-35, window.Terrain.heightAt(-35, 30) + 3.4, 30);
    scene.add(flame);

    // Temple of Serapis — Quirinal hill
    const serapis = makeTemple({ w: 30, d: 38, fh: 10, nc: 7, ch: 9 });
    const lser = R.makeLabel('Temple of Serapis', 36); lser.position.y = 36; serapis.add(lser);
    place(serapis, 150, -200, 0, scene);

    // Temple of Castor and Pollux — Forum, triple-arched podium
    const castor = makeTemple({ w: 24, d: 30, fh: 9, nc: 6, ch: 8 });
    const lc = R.makeLabel('Temple of Castor and Pollux', 30); lc.position.y = 32; castor.add(lc);
    place(castor, 78, 42, Math.PI * 0.9, scene);

    // Temple of Juno Regina — Aventine
    const juno = makeTemple({ w: 20, d: 24, fh: 8, nc: 6, ch: 7 });
    const ljn = R.makeLabel('Temple of Juno Regina', 24); ljn.position.y = 26; juno.add(ljn);
    place(juno, -70, 290, 0, scene);
  }

  return { build, makeTemple, makePantheon, makeRoundTemple, place };
})();
