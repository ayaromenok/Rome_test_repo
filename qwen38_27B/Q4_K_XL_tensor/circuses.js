/* circuses.js — Circus Maximus: chariot-racing stadium in the valley
   between Palatine and Aventine, with spina, turning posts and grandstands */
window.Circuses = (function () {
  const R = window.Roman, M = R.M;

  function buildCircusMaximus(scene) {
    const g = new THREE.Group();
    const L = 150, W = 44; // track length (z axis) and width

    // flattened track bed
    g.add(R.box(W, 2, L, M.dirt, 0, 0.4, 0));
    const track = new THREE.Mesh(new THREE.PlaneGeometry(W * 0.8, L * 0.94),
      new THREE.MeshLambertMaterial({ color: 0x9c7f52 }));
    track.rotation.x = -Math.PI / 2; track.position.y = 1.45;
    g.add(track);

    // outer perimeter wall
    const wallMat = M.stone;
    g.add(R.box(W / 2 + 4, 10, L + 8, wallMat, -(W / 2) - 4, 6, 0));
    g.add(R.box(W / 2 + 4, 10, L + 8, wallMat, (W / 2) + 4, 6, 0));
    g.add(R.box(W, 10, 6, wallMat, 0, 6, -(L / 2) - 4));

    // tiered grandstands (cavea) along both long sides
    for (const s of [-1, 1]) {
      for (let i = 0; i < 6; i++) {
        const t = i / 6;
        g.add(R.box(6, 1.6, L * 0.9, i % 2 ? M.tuff : M.stone,
          s * (W / 2 - 2 - t * 4.5), 1.5 + i * 1.6, 0));
        // spectator row hint
      }
      // upper colonnaded terrace
      g.add(R.box(8, 6, L * 0.9, M.stone, s * (W / 2 + 7), 14, 0));
      for (let i = 0; i < 14; i++)
        g.add(R.cyl(0.5, 0.6, 5, 8, M.marble, s * (W / 2 + 10.2), 14, -L / 2 * 0.9 + i * (L * 0.9 / 13)));
    }
    // semicircular tier at the far end
    const bowl = new THREE.Mesh(
      new THREE.CylinderGeometry(W / 2 - 4, W / 2 + 6, 14, 24, 1, true, 0, Math.PI), M.tuff.clone());
    bowl.material.side = THREE.DoubleSide;
    bowl.rotation.y = -Math.PI / 2; bowl.rotation.z = 0;
    bowl.position.set(0, 8, L / 2);
    g.add(bowl);

    // the spina: central raised race track with obelisks and turning posts
    g.add(R.box(5, 2, L * 0.8, M.stone, 0, 2.4, 0));
    for (const ez of [-L * 0.38, L * 0.38]) {
      g.add(R.box(3, 2, 3, M.marble, 0, 4, ez));
      const ob = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 1.1, 16, 4), M.gold);
      ob.rotation.y = Math.PI / 4; ob.position.set(0, 4 + 2 + 8, ez);
      g.add(ob);
    }
    // three torus-shaped turning posts (metae)
    for (const mz of [-6, 0, 6]) {
      const meta = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.7, 8, 16), M.stone);
      meta.rotation.x = Math.PI / 2; meta.position.set(0, 5.5, mz);
      g.add(meta);
    }
    // starting gates at the near end (porta pompae hint)
    g.add(R.box(2, 9, 2, M.stone, -6, 5.5, -L / 2 + 1));
    g.add(R.box(2, 9, 2, M.stone, 6, 5.5, -L / 2 + 1));
    g.add(R.box(14, 1.6, 2, M.darkBrick, 0, 10.3, -L / 2 + 1));

    const label = R.makeLabel('Circus Maximus', 48);
    label.position.set(0, 34, 0);
    g.add(label);

    const x = 15, z = 200;
    g.position.set(x, window.Terrain.heightAt(x, z) - 1, z);
    scene.add(g);
  }

  // A smaller circus in the Campus Martius (Circus Flaminius)
  function buildCircusFlaminius(scene) {
    const g = new THREE.Group();
    const L = 90, W = 28;
    g.add(R.box(W, 2, L, M.dirt, 0, 0.4, 0));
    for (const s of [-1, 1])
      for (let i = 0; i < 4; i++)
        g.add(R.box(4, 1.4, L * 0.85, i % 2 ? M.tuff : M.stone, s * (W / 2 - 1 - i * 3), 1.3 + i * 1.4, 0));
    const spina = R.box(3, 1.6, L * 0.75, M.stone, 0, 2, 0);
    g.add(spina);
    const label = R.makeLabel('Circus Flaminius', 26);
    label.position.y = 22;
    g.add(label);
    const x = -95, z = -110;
    g.position.set(x, window.Terrain.heightAt(x, z) - 0.5, z);
    scene.add(g);
  }

  function build(scene) {
    buildCircusMaximus(scene);
    buildCircusFlaminius(scene);
  }

  return { build };
})();
