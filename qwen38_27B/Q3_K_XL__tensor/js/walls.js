/* walls.js - the Aurelian Walls (271-275 CE) enclosing the expanded city, with its 18 major gates */
window.Rome = window.Rome || {};

(function () {
  const T = () => window.Rome.terrain;
  const C = () => window.Rome.core;

  // Wall circuit: large rounded circuit enclosing the seven hills
  const WALL = { cx: 60, cz: 30, r: 330 };

  function buildWalls(scene) {
    const g = new THREE.Group();
    const M = C().mats;
    const { cx, cz, r } = WALL;
    const N = 96;               // wall segments
    const H = 8;                // raised to ~10 m under Stilicho
    const segLen = (2 * Math.PI * r) / N * 1.15;

    for (let i = 0; i < N; i++) {
      const a0 = (i / N) * Math.PI * 2;
      const a1 = ((i + 0.5) / N) * Math.PI * 2;
      const px = cx + r * Math.cos(a1);
      const pz = cz + r * Math.sin(a1);
      const h = T().heightAt(px, pz);
      const m = C().box(segLen, H, 3.2, M.brick);
      m.position.set(px, h + H / 2, pz);
      m.rotation.y = -C().ovalTangent(r, r, a1);
      g.add(m);
      // battlement
      const bat = C().box(segLen, 0.8, 4.6, M.stoneDark, px, h + H + 0.4, pz);
      bat.rotation.y = m.rotation.y;
      g.add(bat);
      // towers roughly every ~30 m (381 towers in history)
      if (i % 4 === 0) {
        const tx = cx + (r + 3) * Math.cos(a0);
        const tz = cz + (r + 3) * Math.sin(a0);
        const th = T().heightAt(tx, tz);
        g.add(C().box(8, H + 2, 8, M.brick, tx, th + (H + 2) / 2, tz));
        g.add(C().box(9, 0.7, 9, M.stoneDark, tx, th + H + 2.3, tz));
      }
    }

    // ---------------- Major gates (subset of the 18 portals) ----------------
    // angle (degrees) around the circuit, name, double-arch monumental gate
    const gates = [
      { a: 95,   name: 'PORTA FLAMINIA' },  // north - Via Flaminia
      { a: 60,   name: 'PORTA SALARIA' },   // north - Via Salaria
      { a: 30,   name: 'PORTA PINCIANA' },
      { a: 20,   name: 'PORTA MAGGIORE' },  // NE - Praenestina (Claudian aqueduct)
      { a: 15,   name: 'PORTA TIBURTINA' }, // east - Via Tiburtina
      { a: -35,  name: 'PORTA ASINARIA' },
      { a: -65,  name: 'PORTA PRÆNÆSTINA' },
      { a: -80,  name: 'PORTA APPIA' },     // south - Via Appia (San Sebastiano)
      { a: -110, name: 'PORTA OSTIENSIS' }, // south - to Ostia
      { a: -125, name: 'PORTA LATINÆ' },
      { a: 165,  name: 'PORTA CAPENA' },    // toward the Forum
      { a: 140,  name: 'PORTA PANCRAZI' },
    ];
    for (let i = 0; i < gates.length; i++) {
      const a = THREE.MathUtils.degToRad(gates[i].a);
      const gx = cx + r * Math.cos(a);
      const gz = cz + r * Math.sin(a);
      const gh = T().heightAt(gx, gz);
      // gate tower with double arched passage
      const gt = new THREE.Group();
      gt.add(C().box(16, H + 4, 10, M.brick, 0, (H + 4) / 2, 0));
      gt.add(C().box(17, 0.8, 11, M.stoneDark, 0, H + 4.4, 0));
      // arched openings (front and back faces)
      for (let k = -1; k <= 1; k += 2) {
        const opening = new THREE.Mesh(C().archFrameGeometry(10, 7, 3.4, 2.6, 0.8), M.travertine);
        opening.position.set(k * 1.8, 1, k * 5);
        opening.rotation.y = Math.PI / 2;
        gt.add(opening);
      }
      gt.position.set(gx, gh, gz);
      gt.rotation.y = -a - Math.PI / 2;
      g.add(gt);
      // name label
      scene.add(window.Rome.terrain.makeLabel(gates[i].name, gx, gh + 16, gz, 'rgba(255,235,200,0.9)'));
    }

    scene.add(g);
    return g;
  }

  window.Rome.walls = { build: buildWalls, WALL: WALL };
})();
