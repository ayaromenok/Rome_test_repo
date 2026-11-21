/* gates.js — the great gates of the Aurelian Wall, aligned with the
   consular roads (viae) radiating out of Rome. */
window.Gates = (function () {
  const R = window.Roman, M = R.M;

  // A city gate: flanking towers + arched passage(s)
  function makeGate(towers, threeBays) {
    const g = new THREE.Group();
    const tH = 16;
    const bayW = 6;
    const count = threeBays ? 4 : 2;      // piers
    const span = (count - 1) * (bayW + 5);
    for (let i = 0; i < count; i++) {
      const x = -span / 2 + i * (bayW + 5);
      g.add(R.box(5, tH, towers ? 12 : 9, M.brick, x, tH / 2, 0));
    }
    for (let i = 0; i < count - 1; i++) {
      const x = -span / 2 + i * (bayW + 5) + (bayW + 5) / 2;
      g.add(R.box(bayW + 5, 3.4, towers ? 12 : 9, M.stone, x, tH - 1.7, 0)); // lintel
      // arch hints under the lintel
      g.add(R.box(bayW, 5, 0.8, M.dark, x, 2.5, 5.5));
      g.add(R.box(bayW, 5, 0.8, M.dark, x, 2.5, -5.5));
    }
    if (towers) {
      // big corner round towers (e.g. Porta San Sebastiano)
      for (const sx of [-1, 1]) {
        const t = R.cyl(6, 7, tH + 6, 16, M.brick, sx * (span / 2 + 9), (tH + 6) / 2, 0);
        g.add(t);
      }
    }
    return g;
  }

  function build(scene) {
    const pts = window.Walls.circuit(40, 0, 520, 460, 96, 0.04);
    const N = pts.length;
    const at = function (deg) {
      const i = Math.round(deg / 360 * N) % N;
      return pts[i];
    };
    // +z is south. Consular roads out of each gate.
    const list = [
      { name: 'Porta San Sebastiano (Appia)',   deg: 90,  towers: true,  bays: 3 }, // Via Appia
      { name: 'Porta San Paolo (Ostiensis)',   deg: 140, towers: false, bays: 1 }, // to Ostia
      { name: 'Porta Maggiore (Praenestina)',  deg: 100, towers: false, bays: 2 }, // Claudian aqueduct arch
      { name: 'Porta Flaminia (del Popolo)',   deg: 275, towers: true,  bays: 3 }, // Via Flaminia
      { name: 'Porta Salaria',                 deg: 245, towers: false, bays: 1 },
      { name: 'Porta Pinciana',                deg: 205, towers: false, bays: 1 },
      { name: 'Porta Tiburtina',               deg: 335, towers: false, bays: 2 }, // Via Tiburtina
      { name: 'Porta Esquilina',               deg: 8,   towers: false, bays: 2 },
      { name: 'Porta Latina',                  deg: 30,  towers: false, bays: 2 }, // Via Latina
    ];
    for (const gt of list) {
      const p = at(gt.deg);
      const gate = makeGate(gt.towers, gt.bays > 1);
      const y = window.Terrain.heightAt(p[0], p[1]);
      gate.position.set(p[0], y, p[1]);
      // face outward from the city centre (40, 0)
      gate.rotation.y = Math.atan2(p[0] - 40, p[1] - 0);
      scene.add(gate);
      const label = R.makeLabel(gt.name, 30);
      label.position.set(p[0], y + 26, p[1]);
      scene.add(label);
    }
  }

  return { build, makeGate };
})();
