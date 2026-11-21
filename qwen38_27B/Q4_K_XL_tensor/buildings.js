/* buildings.js — Roman Forum monuments (Curia Julia, Rostra, Basilicas),
   imperial palaces on the Palatine, Domus Aurea on the Esquiline,
   the Tabularium, and insulae (apartment blocks) across the city. */
window.Buildings = (function () {
  const R = window.Roman, M = R.M;

  function label(text, y, g) {
    const l = R.makeLabel(text, y > 30 ? 44 : 26);
    l.position.y = y;
    g.add(l);
  }

  function buildForum(scene) {
    const g = new THREE.Group();

    // drained valley floor (the old marsh, drained by the Cloaca Maxima)
    g.add(R.box(150, 1.2, 100, M.dirt, 40, 0.6, 45));

    // Curia Julia — the Senate house, basilica-like hall
    const curia = new THREE.Group();
    curia.add(R.box(18, 14, 34, M.stone, 0, 7, 0));
    curia.add(R.box(20, 1, 36, M.stone, 0, 14.5, 0));
    curia.add(R.pediment(20, 4, 5, M.stone).translateY(15).translateZ(-18));
    for (let i = 0; i < 5; i++)
      curia.add(R.cyl(0.5, 0.6, 12, 10, M.marble, -8 + i * 4, 7, -17.5));
    curia.position.set(55, 1.2, 55);
    curia.rotation.y = 0.5;
    g.add(curia);
    label('Curia Julia (Senate)', 26, curia);

    // Rostra — raised speaker's platform with ship prows
    const rostra = new THREE.Group();
    for (let i = 0; i < 4; i++) rostra.add(R.box(16 - i * 2, 0.7, 10 - i, M.marble, 0, 0.35 + i * 0.7, i * 0.5));
    for (let i = 0; i < 5; i++) {
      const prow = new THREE.Mesh(new THREE.ConeGeometry(0.8, 2.6, 4), M.wood);
      prow.position.set(-6 + i * 3, 3.6, 4.5);
      rostra.add(prow);
    }
    rostra.position.set(-15, 1.2, 20);
    g.add(rostra);
    label('Rostra (speaker\'s platform)', 12, rostra);

    // Basilica Julia — law courts & commerce, long hall
    const julia = new THREE.Group();
    julia.add(R.box(26, 11, 60, M.stone, 0, 5.5, 0));
    julia.add(R.box(28, 1, 62, M.stone, 0, 11.5, 0));
    for (let i = 0; i < 12; i++) {
      julia.add(R.cyl(0.5, 0.6, 9, 10, M.marble, -11, 5.5, -26 + i * 4.8));
      julia.add(R.cyl(0.5, 0.6, 9, 10, M.marble, 11, 5.5, -26 + i * 4.8));
    }
    julia.position.set(95, 1.2, 20);
    g.add(julia);
    label('Basilica Julia', 24, julia);

    // Basilica Aemilia — west side
    const aemilia = new THREE.Group();
    aemilia.add(R.box(18, 9, 48, M.stone, 0, 4.5, 0));
    aemilia.add(R.box(20, 1, 50, M.stone, 0, 9.5, 0));
    aemilia.position.set(30, 1.2, 90);
    aemilia.rotation.y = 0.15;
    g.add(aemilia);
    label('Basilica Aemilia', 20, aemilia);

    // Market stalls near the Rostra
    for (let i = 0; i < 6; i++) {
      const stall = new THREE.Group();
      stall.add(R.box(4, 2.4, 3, M.wood, 0, 1.2, 0));
      stall.add(R.pediment(4.6, 3.4, 1.2, M.roof).translateY(2.4).translateZ(0));
      stall.position.set(-40, 1.2, 40 + (i % 3) * 7 + Math.floor(i / 3) * 8);
      g.add(stall);
    }

    const x = 40, z = 45;
    g.position.set(x, window.Terrain.heightAt(x, z) - 0.5, z);
    scene.add(g);
  }

  function buildPalatine(scene) {
    // Imperial Palaces (Palatium) — centre of imperial power on the Palatine
    const g = new THREE.Group();
    g.add(R.box(70, 3, 50, M.tuff, 0, 1.5, 0));            // podium
    g.add(R.box(50, 16, 34, M.stone, 0, 3 + 8, -5));       // main palace hall
    g.add(R.box(54, 1, 38, M.stone, 0, 19.5, -5));
    for (let i = 0; i < 8; i++)                            // great portico
      g.add(R.cyl(0.7, 0.9, 14, 12, M.marble, -21 + i * 6, 3 + 7, 13));
    g.add(R.box(56, 1.6, 3, M.stone, 0, 3 + 15, 13));
    g.add(R.box(18, 20, 18, M.stone, -26, 3 + 10, 14));    // wing
    g.add(R.box(18, 20, 18, M.stone, 26, 3 + 10, 14));
    for (const sx of [-1, 1]) {                            // corner towers
      const t = R.cyl(5, 6, 26, 12, M.brick, sx * 34, 3 + 13, -18);
      g.add(t);
    }
    label('Imperial Palaces (Palatium)', 34, g);
    const x = 5, z = 135;
    g.position.set(x, window.Terrain.heightAt(x, z) - 1, z);
    scene.add(g);
  }

  function buildDomusAurea(scene) {
    // Nero's Golden House + gardens, Esquiline
    const g = new THREE.Group();
    g.add(R.box(46, 14, 36, M.gold, 0, 7, 0));
    g.add(R.box(48, 1, 38, M.stone, 0, 14.5, 0));
    const dome = R.makeDome(12, M.roof);
    dome.position.set(0, 15, 0);
    g.add(dome);
    for (let i = 0; i < 10; i++) {                          // garden cypresses
      g.add(R.makeCypress(i % 5 === 0 ? -1 : 1 * 30, 26 + (i % 5) * 4, 10));
    }
    label('Domus Aurea (Golden House)', 30, g);
    const x = 290, z = -40;
    g.position.set(x, window.Terrain.heightAt(x, z) - 0.5, z);
    scene.add(g);
  }

  function buildTabularium(scene) {
    // Archive hall on the foot of the Capitoline, facing the Forum
    const g = new THREE.Group();
    g.add(R.box(44, 12, 10, M.stone, 0, 6, 0));
    for (let i = 0; i < 10; i++) {
      g.add(R.box(2, 8, 1.5, M.tuff, -19 + i * 4.2, 2, 5.5));
      g.add(R.box(2.6, 1.2, 1.8, M.stone, -19 + i * 4.2, 6.8, 5.5));
    }
    label('Tabularium (State Archives)', 20, g);
    const x = -90, z = 8;
    g.position.set(x, window.Terrain.heightAt(x, z) - 0.5, z);
    scene.add(g);
  }

  // Insulae — multi-storey brick apartment blocks filling the residential streets
  function buildInsulae(scene) {
    let seed = 42;
    const rnd = function () { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    const skip = function (x, z, r) { return (x - r[0]) * (x - r[0]) + (z - r[1]) * (z - r[1]) < 900; };
    const reserved = [[20, 50], [145, 95], [15, 200], [-90, 60], [-95, -110], [240, -280], [330, 70], [200, -140]];
    const group = new THREE.Group();
    for (let x = -330; x <= 460; x += 42) {
      for (let z = -320; z <= 400; z += 42) {
        if (rnd() < 0.35) continue;
        const px = x + rnd() * 14, pz = z + rnd() * 14;
        const h = window.Terrain.heightAt(px, pz);
        if (h < 2 || h > 20) continue;
        let ok = true;
        for (const r of reserved) if (skip(px, pz, r)) { ok = false; break; }
        if (!ok) continue;
        const w = 10 + rnd() * 8, d = 10 + rnd() * 8, bh = 9 + rnd() * 14;
        const m = rnd() < 0.7 ? M.brick : M.tuff;
        group.add(R.box(w, bh, d, m, px, h + bh / 2, pz, rnd() * 0.4 - 0.2));
        group.add(R.box(w + 0.6, 0.8, d + 0.6, m === M.brick ? M.darkBrick : M.stone, px, h + bh + 0.4, pz));
      }
    }
    scene.add(group);
  }

  function build(scene) {
    buildForum(scene);
    buildPalatine(scene);
    buildDomusAurea(scene);
    buildTabularium(scene);
    buildInsulae(scene);
  }

  return { build };
})();
