/* helpers.js — shared materials & geometry builders for the Ancient Rome scene */
window.Roman = (function () {
  const M = {
    stone:     new THREE.MeshLambertMaterial({ color: 0xcfc4ae }),
    tuff:      new THREE.MeshLambertMaterial({ color: 0xbfae8f }),
    marble:    new THREE.MeshLambertMaterial({ color: 0xe8e4da }),
    dark:      new THREE.MeshLambertMaterial({ color: 0x4a443c }),
    brick:     new THREE.MeshLambertMaterial({ color: 0xa85c3b }),
    darkBrick: new THREE.MeshLambertMaterial({ color: 0x8f4a2e }),
    roof:      new THREE.MeshLambertMaterial({ color: 0xb2552f }),
    wood:      new THREE.MeshLambertMaterial({ color: 0x7a5a34 }),
    water:     new THREE.MeshLambertMaterial({ color: 0x2e7ea6, transparent: true, opacity: 0.8 }),
    gold:      new THREE.MeshLambertMaterial({ color: 0xd4af37 }),
    road:      new THREE.MeshLambertMaterial({ color: 0x9b8c6d, side: THREE.DoubleSide }),
    dirt:      new THREE.MeshLambertMaterial({ color: 0x8a7a58 }),
    grass:     new THREE.MeshLambertMaterial({ color: 0x71944c }),
    wall:      new THREE.MeshLambertMaterial({ color: 0x9c8a6b }),
    wallDark:  new THREE.MeshLambertMaterial({ color: 0x84735a }),
    cypress:   new THREE.MeshLambertMaterial({ color: 0x3d5a35 }),
    leaf:      new THREE.MeshLambertMaterial({ color: 0x5d7a3c }),
  };

  function box(w, h, d, mat, x, y, z, ry) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat || M.stone);
    m.position.set(x, y, z);
    if (ry) m.rotation.y = ry;
    return m;
  }

  function cyl(rt, rb, h, seg, mat, x, y, z, open) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg || 16, 1, !!open), mat || M.stone);
    m.position.set(x, y, z);
    return m;
  }

  // Triangular prism (pediment) facing +z
  function pediment(w, d, h, mat) {
    const s = new THREE.Shape();
    s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(0, h); s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false });
    g.translate(0, 0, -d / 2);
    const m = new THREE.Mesh(g, mat || M.stone);
    return m;
  }

  // Floating name label (canvas sprite)
  function makeLabel(text, scale) {
    scale = scale || 30;
    const c = document.createElement('canvas');
    c.width = 1024; c.height = 128;
    const g = c.getContext('2d');
    g.font = 'bold 64px Georgia, serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.strokeStyle = 'rgba(0,0,0,0.85)'; g.lineWidth = 10;
    g.strokeText(text, 512, 64);
    g.fillStyle = '#f5e9c8';
    g.fillText(text, 512, 64);
    const tex = new THREE.CanvasTexture(c);
    const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }));
    spr.scale.set(scale, scale / 8, 1);
    return spr;
  }

  // Tall cypress tree (Roman favourite)
  function makeCypress(x, z, h) {
    h = h || 9;
    const y = window.Terrain.heightAt(x, z);
    const g = new THREE.Group();
    g.add(cyl(0.35, 0.45, h * 0.25, 6, M.wood, 0, h * 0.125, 0));
    const fol = new THREE.Mesh(new THREE.ConeGeometry(h * 0.28, h * 0.85, 7), M.cypress);
    fol.position.y = h * 0.25 + h * 0.425;
    g.add(fol);
    g.position.set(x, y, z);
    return g;
  }

  function makeTree(x, z, h) {
    h = h || 10;
    const y = window.Terrain.heightAt(x, z);
    const g = new THREE.Group();
    g.add(cyl(0.4, 0.55, h * 0.4, 6, M.wood, 0, h * 0.2, 0));
    const fol = new THREE.Mesh(new THREE.IcosahedronGeometry(h * 0.42, 0), M.leaf);
    fol.position.y = h * 0.62;
    g.add(fol);
    g.position.set(x, y, z);
    return g;
  }

  // Ribbon road strip that follows the terrain. pts = [[x,z],...]
  function roadRibbon(pts, width, mat) {
    width = width || 10; mat = mat || M.road;
    const pos = [], idx = [];
    const n = pts.length;
    for (let i = 0; i < n; i++) {
      const p = pts[i];
      const prev = i > 0 ? pts[i - 1] : p;
      const next = i < n - 1 ? pts[i + 1] : p;
      let dx = next[0] - prev[0], dz = next[1] - prev[1];
      const L = Math.hypot(dx, dz) || 1; dx /= L; dz /= L;
      const ox = -dz * width / 2, oz = dx * width / 2;
      const y = window.Terrain.heightAt(p[0], p[1]) + 0.45;
      pos.push(p[0] + ox, y, p[1] + oz, p[0] - ox, y, p[1] - oz);
    }
    for (let i = 0; i < n - 1; i++) {
      const a = i * 2;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return new THREE.Mesh(g, mat);
  }

  // Closed loop of wall segments with towers. pts = [[x,z],...]
  function wallLoop(pts, height, thickness, mat, towerEvery, towerH) {
    height = height || 9; thickness = thickness || 4;
    mat = mat || M.wall; towerEvery = towerEvery || 6; towerH = towerH || 5;
    const group = new THREE.Group();
    const n = pts.length;
    for (let i = 0; i < n; i++) {
      const p = pts[i], q = pts[(i + 1) % n];
      const dx = q[0] - p[0], dz = q[1] - p[1];
      const len = Math.hypot(dx, dz);
      const y = Math.max(window.Terrain.heightAt(p[0], p[1]), window.Terrain.heightAt(q[0], q[1]));
      const b = box(len + 2, height, thickness, mat, (p[0] + q[0]) / 2, y + height / 2, (p[1] + q[1]) / 2);
      b.rotation.y = Math.atan2(dx, dz);
      group.add(b);
      if (i % towerEvery === 0) {
        group.add(box(thickness + 5, height + towerH, thickness + 5, mat, p[0], y + (height + towerH) / 2, p[1]));
      }
    }
    return group;
  }

  // Elongated dome (half sphere), base on y=0
  function makeDome(r, mat) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2), mat || M.roof);
    return m;
  }

  return { M, box, cyl, pediment, makeLabel, makeCypress, makeTree, roadRibbon, wallLoop, makeDome };
})();
