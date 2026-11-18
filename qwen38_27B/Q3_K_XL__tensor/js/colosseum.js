/* colosseum.js - the Flavian Amphitheatre (Colosseum), east of the Forum near Caelian & Esquiline */
window.Rome = window.Rome || {};

(function () {
  const T = () => window.Rome.terrain;
  const C = () => window.Rome.core;

  const CX = 100, CZ = 5, A = 52, B = 45;   // oval radii, center

  function buildColosseum(scene) {
    const g = new THREE.Group();
    const M = C().mats;
    const baseY = T().heightAt(CX, CZ);
    const N = 56;

    // ---- exterior wall: 4 stacked tiers of oval rings (slightly inward-stepping) ----
    const tiers = [
      { a: A, b: B, h: 5, y: baseY },
      { a: A - 2, b: B - 2, h: 5, y: baseY + 5 },
      { a: A - 4, b: B - 4, h: 5, y: baseY + 10 },
      { a: A - 7, b: B - 7, h: 3.5, y: baseY + 15 },   // attic (corian) tier
    ];
    for (let ti = 0; ti < tiers.length; ti++) {
      const tr = tiers[ti];
      C().ovalRing(g, tr.a, tr.b, tr.y, N, (2 * Math.PI * (tr.a + tr.b)) / N * 1.12, 3.4, tr.h,
        ti === 3 ? M.travertine : M.stone, CX, CZ);
    }

    // ---- arched facade (1st and 2nd story arches, 3rd windows) ----
    for (let s = 0; s < 3; s++) {
      const a = A + 0.6 - s * 2, b = B + 0.6 - s * 2;
      const y = baseY + 0.4 + s * 5;
      for (let i = 0; i < N; i++) {
        const t = (i / N) * Math.PI * 2;
        const p = C().ovalPoint(a, b, t);
        const isArch = s < 2;
        const m = isArch
          ? new THREE.Mesh(C().archFrameGeometry(4.4, 3.6, 2.6, 1.6, 0.7), M.travertine)
          : C().box(1.4, 2.4, 0.7, M.travertine);
        m.position.set(p.x, y + (isArch ? 1.8 : 1.4), p.z);
        m.rotation.y = -C().ovalTangent(a, b, t);
        g.add(m);
      }
    }
    // attic tier small windows
    for (let i = 0; i < N; i++) {
      const t = (i / N) * Math.PI * 2;
      const p = C().ovalPoint(A - 6.4, B - 6.4, t);
      const m = C().box(1, 1.6, 0.6, M.stoneDark, p.x, baseY + 15 + 1.6, p.z);
      m.rotation.y = -C().ovalTangent(A - 6.4, B - 6.4, t);
      g.add(m);
    }

    // ---- interior: arena floor (sand) + wooden vaulting suggestion ----
    const floor = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.4, 48), M.sand);
    floor.scale.set(A - 14, 1, B - 14);
    floor.position.set(CX, baseY + 0.2, CZ);
    g.add(floor);

    // ---- tiered seating (cavea) rising from arena edge to the wall ----
    const SEATS = 9;
    for (let s = 0; s < SEATS; s++) {
      const a = A - 12 - s * 3.4, b = B - 12 - s * 3.2;
      const y = baseY + 0.8 + s * 1.9;
      const mat = (s % 3 === 0) ? M.cobble : M.stone;
      C().ovalRing(g, a, b, y, N, (2 * Math.PI * (a + b)) / N * 1.1, 2.6, 1.7, mat, CX, CZ);
    }
    // top walkway
    C().ovalRing(g, A - 42, B - 40, baseY + 0.8 + SEATS * 1.9, N,
      (2 * Math.PI * (A - 42 + B - 40)) / N * 1.1, 2.4, 0.8, M.travertine, CX, CZ);

    // ---- two monumental gateways (north & south entrances) ----
    for (let k = 0; k < 2; k++) {
      const ang = k === 0 ? Math.PI / 2 : -Math.PI / 2;
      const px = CX + A * Math.cos(ang), pz = CZ + B * Math.sin(ang);
      const gate = C().triumphalArch(1.15, M.travertine);
      gate.position.set(px, baseY, pz);
      gate.rotation.y = ang + (k === 0 ? -Math.PI / 2 : Math.PI / 2);
      g.add(gate);
    }

    scene.add(g);
    scene.add(T().makeLabel('COLOSSEUM (FLAVIAN AMPHITHEATRE)', CX, 30, CZ, 'rgba(255,245,215,0.95)'));
    return g;
  }

  window.Rome.colosseum = { build: buildColosseum, CX: CX, CZ: CZ, A: A, B: B };
})();
