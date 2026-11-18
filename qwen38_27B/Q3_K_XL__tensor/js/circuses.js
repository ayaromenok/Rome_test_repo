/* circuses.js - chariot-racing circuses: the Circus Maximus and the Circus Flaminius */
window.Rome = window.Rome || {};

(function () {
  const T = () => window.Rome.terrain;
  const C = () => window.Rome.core;

  // Circus Maximus: in the valley between the Palatine and Aventine hills
  function circusMaximus(scene) {
    const g = new THREE.Group();
    const M = C().mats;
    const CX = 38, CZ = -30;
    const baseY = T().heightAt(CX, CZ);
    const N = 72;

    // ---- tiered seating (cavea) around the track ----
    const TIERS = 9;
    for (let s = 0; s < TIERS; s++) {
      const a = 26 + s * 2.9, b = 72 + s * 2.9;
      const y = baseY + 1.0 + s * 2.1;
      const mat = (s % 3 === 0) ? M.cobble : (s % 3 === 1 ? M.stone : M.travertine);
      C().ovalRing(g, a, b, y, N, (2 * Math.PI * (a + b)) / N * 1.08, 2.6, 2.0, mat, CX, CZ);
    }
    // outer retaining wall
    const ao = 26 + TIERS * 2.9, bo = 72 + TIERS * 2.9;
    C().ovalRing(g, ao, bo, baseY + 1, N, (2 * Math.PI * (ao + bo)) / N * 1.1, 2.4, 4.5, M.brick, CX, CZ);

    // ---- the spina (central barrier with turning posts - metae) ----
    const spina = C().box(4, 1.2, 100, M.travertine, CX, baseY + 0.6, CZ);
    g.add(spina);
    // metae (cone turning posts) at each end
    for (const s of [-1, 1]) {
      const cone = new THREE.Mesh(new THREE.ConeGeometry(2.5, 6, 10), M.marble);
      cone.position.set(CX, baseY + 3, CZ + s * 52);
      g.add(cone);
      const cone2 = cone.clone();
      cone2.rotation.z = Math.PI / 2 * 0.9;
      cone2.position.set(CX + 3.4, baseY + 3, CZ + s * 52);
      cone2.scale.set(0.8, 0.8, 0.8);
      g.add(cone2);
    }
    // obelisk on one end of the spina
    const ob = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.6, 16, 4), M.stoneDark);
    ob.position.set(CX, baseY + 8.5, CZ - 44);
    g.add(ob);
    const tip = new THREE.Mesh(new THREE.ConeGeometry(1.3, 3, 4), M.stoneDark);
    tip.position.set(CX, baseY + 17.5, CZ - 44);
    g.add(tip);
    // gilded "egg" monument
    const egg = new THREE.Mesh(new THREE.SphereGeometry(2, 10, 10), M.gold);
    egg.position.set(CX, baseY + 2.4, CZ + 44);
    g.add(egg);
    const eggPost = C().box(0.8, 2.4, 0.8, M.marble, CX, baseY + 0.8, CZ + 44);
    g.add(eggPost);

    // entrance (carceres - starting gates) at the north end
    const start = C().triumphalArch(1.4, M.travertine);
    start.position.set(CX - 20, baseY, CZ + 78);
    start.rotation.y = Math.PI / 2;
    g.add(start);

    scene.add(g);
    scene.add(T().makeLabel('CIRCUS MAXIMUS', CX, 32, CZ, 'rgba(255,245,215,0.95)'));
    return g;
  }

  // Circus Flaminius: processional oval along the Tiber bank
  function circusFlaminius(scene) {
    const g = new THREE.Group();
    const M = C().mats;
    const CX = -55, CZ = 20, rot = 0.5;
    const baseY = T().heightAt(CX, CZ);
    const N = 40;
    for (let s = 0; s < 4; s++) {
      const a = 16 + s * 3, b = 40 + s * 3;
      C().ovalRing(g, a, b, baseY + 1 + s * 2, N, (2 * Math.PI * (a + b)) / N * 1.1, 2.4, 1.8,
        s % 2 ? M.stone : M.travertine, CX, CZ);
    }
    g.position.y = 0;
    g.rotation.y = 0; // rings already positioned at CX,CZ
    g.children.forEach(ch => {
      // rotate each ring segment about the circus center
      const px = ch.position.x - CX, pz = ch.position.z - CZ;
      ch.position.set(
        CX + px * Math.cos(rot) - pz * Math.sin(rot),
        ch.position.y,
        CZ + px * Math.sin(rot) + pz * Math.cos(rot)
      );
      ch.rotation.y += -rot;
    });
    scene.add(g);
    scene.add(T().makeLabel('CIRCUS FLAMINIUS', CX, 16, CZ));
    return g;
  }

  function buildCircuses(scene) {
    circusMaximus(scene);
    circusFlaminius(scene);
  }

  window.Rome.circuses = { build: buildCircuses, MAXIMUS: { x: 38, z: -30 } };
})();
