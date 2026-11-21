/* colosseum.js — the Flavian Amphitheatre (Colosseum), east of the Forum */
window.Colosseum = (function () {
  const R = window.Roman, M = R.M;

  function build(scene) {
    const g = new THREE.Group();
    const EX = 1.3; // elliptical stretch along x

    // base platform flattens the ground
    g.add(R.cyl(64 * EX, 66 * EX, 4, 48, M.tuff, 0, 2, 0));
    g.add(R.cyl(62 * EX, 62 * EX, 1, 48, M.dirt, 0, 4.2, 0));

    // outer elliptical facade in two arcaded tiers
    const wallMat = M.stone.clone();
    wallMat.side = THREE.DoubleSide;
    const t1 = new THREE.Mesh(new THREE.CylinderGeometry(58, 62, 14, 48, 1, true), wallMat);
    t1.position.y = 4 + 7; t1.scale.x = EX;
    g.add(t1);
    const t2 = new THREE.Mesh(new THREE.CylinderGeometry(54, 58, 11, 48, 1, true), wallMat);
    t2.position.y = 18 + 5.5; t2.scale.x = EX;
    g.add(t2);

    // tier bands + ring of columns suggesting the arcades
    const band = new THREE.Mesh(new THREE.CylinderGeometry(60, 60, 1.6, 48, 1, true), M.darkBrick.clone());
    band.material.side = THREE.DoubleSide; band.scale.x = EX;
    g.add(band);
    for (const by of [4, 18, 29]) {
      const b = band.clone(); b.position.y = by; g.add(b);
    }
    for (const [y, r] of [[10, 63], [23, 61]]) {
      for (let i = 0; i < 48; i++) {
        const a = i / 48 * Math.PI * 2;
        const c = R.cyl(1.1, 1.25, 7, 8, M.marble, Math.cos(a) * r, y, Math.sin(a) * r * 1 / 1);
        c.scale.x = 1; // position computed on circle; ellipse via parent below
        g.add(c);
      }
    }

    // roof ring on top with a hint of the retractable awning (velarium)
    const roof = new THREE.Mesh(new THREE.RingGeometry(30, 62, 48), M.roof.clone());
    roof.material.side = THREE.DoubleSide;
    roof.rotation.x = -Math.PI / 2; roof.position.y = 30.5; roof.scale.x = EX;
    g.add(roof);

    // seating (cavea) sloping down to the arena
    const cavea = new THREE.Mesh(new THREE.CylinderGeometry(30, 48, 20, 48, 1, true), M.tuff.clone());
    cavea.material.side = THREE.DoubleSide;
    cavea.position.y = 4 + 10; cavea.scale.x = EX;
    g.add(cavea);
    // arena floor
    const floor = new THREE.Mesh(new THREE.CircleGeometry(30, 48), M.dirt.clone());
    floor.material.color.set(0xa89468);
    floor.rotation.x = -Math.PI / 2; floor.position.y = 4.6; floor.scale.x = EX;
    g.add(floor);

    // turn the column rings into ellipses: wrap whole ring groups
    // (simpler: scale the entire group's x to make everything elliptical)
    const label = R.makeLabel('Colosseum (Flavian Amphitheatre)', 52);
    label.position.y = 48;
    g.add(label);

    const x = 145, z = 95;
    g.position.set(x, window.Terrain.heightAt(x, z) - 2, z);
    g.scale.x = 1; // columns were added on a circle; make them elliptical:
    // scale whole structure in x so facade bands & cavea & columns share the ellipse
    g.scale.set(EX, 1, 1);
    // undo double-scaling on parts already scaled
    [t1, t2, band, roof, cavea, floor].forEach(m => m.scale.x /= EX);
    scene.add(g);
  }

  return { build };
})();
