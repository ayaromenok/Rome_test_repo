/* columns.js - monumental columns: Column of Trajan, Column of Marcus Aurelius, etc. */
window.Rome = window.Rome || {};

(function () {
  const T = () => window.Rome.terrain;
  const C = () => window.Rome.core;

  // A commemorative column: tall shaft with (carved) bands, capital and statue on top
  function monumentalColumn(h, statueColor) {
    const g = new THREE.Group();
    const M = C().mats;
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.0, h, 18), M.marble);
    shaft.position.y = h / 2;
    g.add(shaft);
    // spiral relief banding
    for (let i = 0; i < 5; i++) {
      const band = new THREE.Mesh(new THREE.CylinderGeometry(2.05, 2.05, 0.5, 18), M.travertine);
      band.position.y = 2 + i * (h / 5);
      g.add(band);
    }
    g.add(C().box(5, 1, 5, M.travertine, 0, h + 0.5, 0));
    g.add(C().box(6, 1.4, 6, M.stone, 0, h - 1.4, 0));
    // gilded statue on top (Constantine / Marcus Aurelius)
    const stat = C().box(1.6, 3, 1.2, statueColor || M.gold, 0, h + 3.2, 0);
    g.add(stat);
    const base = C().box(4, 2.2, 4, M.stone, 0, 1.1, 0);
    g.add(base);
    return g;
  }

  function buildColumns(scene) {
    // Column of Trajan - Forum of Trajan, east of the Roman Forum
    let c = monumentalColumn(26, C().mats.gold);
    const x1 = 22, z1 = -40;
    c.position.set(x1, T().heightAt(x1, z1), z1);
    scene.add(c);
    scene.add(T().makeLabel('COLUMN OF TRAJAN', x1, 32, z1));

    // Column of Marcus Aurelius - on the opposite corner of the forum
    c = monumentalColumn(22, C().mats.gold);
    const x2 = -24, z2 = -34;
    c.position.set(x2, T().heightAt(x2, z2), z2);
    scene.add(c);
    scene.add(T().makeLabel('COLUMN OF MARCUS AURELIUS', x2, 28, z2));

    // Column of Phocas (St Peter's Square site, near the Vatican bank)
    c = monumentalColumn(14, C().mats.marble);
    const x3 = -60, z3 = -70;
    c.position.set(x3, T().heightAt(x3, z3), z3);
    scene.add(c);
  }

  window.Rome.columns = { build: buildColumns, monumentalColumn: monumentalColumn };
})();
