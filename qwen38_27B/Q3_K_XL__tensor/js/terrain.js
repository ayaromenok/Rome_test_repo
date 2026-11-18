/* terrain.js - historically inspired terrain: Seven Hills, Tiber river, Campus Martius lowland */
window.Rome = window.Rome || {};

(function () {
  // World layout (meters): East = +x, North = +z, Forum at origin.
  const HILLS = [
    { x: 70,  z: 40,    r: 78, h: 46, name: 'Palatine Hill' },    // imperial palaces
    { x: -70, z: 40,    r: 66, h: 44, name: 'Capitoline Hill' }, // Temple of Jupiter
    { x: 110, z: 145,   r: 80, h: 50, name: 'Quirinal Hill' },   // Temple of Serapis, Baths of Constantine
    { x: 52,  z: 100,   r: 46, h: 30, name: 'Viminal Hill' },   // residential
    { x: 155, z: 75,    r: 82, h: 40, name: 'Esquiline Hill' },  // Domus Aurea, Baths of Trajan
    { x: 95,  z: -75,   r: 64, h: 44, name: 'Caelian Hill' },    // villas, residences
    { x: 12,  z: -135,  r: 58, h: 40, name: 'Aventine Hill' },   // temples, luxury zone
  ];

  // Flattened monumental areas (mixed smoothly toward level l)
  const FLATS = [
    { x: 0,   z: 5,    r: 85, l: 3.0 },   // Roman Forum valley (drained by Cloaca Maxima)
    { x: 38,  z: -30,  r: 95, l: 3.5 },   // Circus Maximus valley (Palatine-Aventine)
    { x: 100, z: 5,    r: 60, l: 4.0 },   // Colosseum plateau
    { x: -85, z: -10,  r: 95, l: 1.2 },   // Campus Martius lowland (flat, inside Tiber bend)
    { x: 70,  z: 40,   r: 30, l: 44 },    // Palatine top (palace terrace)
    { x: -70, z: 40,   r: 26, l: 42 },    // Capitoline top
  ];

  // Tiber river centerline (curves from north to south through the city)
  function riverX(z) {
    return -150 + 60 * Math.sin(z * 0.0045) + 28 * Math.sin(z * 0.0011);
  }
  const RIVER_HALF = 14;      // water half-width
  const RIVER_BANK = 70;      // valley influence half-width

  function smooth(t) { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); }

  function baseHeight(x, z) {
    let h = 1.2 * Math.sin(x * 0.011) * Math.cos(z * 0.009) + 0.6 * Math.sin((x + z) * 0.02);
    // seven hills (plateau-shaped gaussians)
    for (let i = 0; i < HILLS.length; i++) {
      const hl = HILLS[i];
      const d = Math.hypot(x - hl.x, z - hl.z);
      const q = 1 - Math.min(1, (d / hl.r) * (d / hl.r));
      if (q > 0) h += hl.h * Math.pow(q, 1.35);
    }
    // Tiber valley
    const dR = Math.abs(x - riverX(z));
    if (dR < RIVER_BANK) {
      h -= 11 * smooth(1 - dR / RIVER_BANK);
    }
    // monumental flats
    for (let i = 0; i < FLATS.length; i++) {
      const f = FLATS[i];
      const d = Math.hypot(x - f.x, z - f.z);
      const w = smooth(1 - Math.min(1, d / f.r));
      if (w > 0) h = h * (1 - w) + f.l * w;
    }
    // riverbed floor
    if (dR < RIVER_HALF + 6) h = Math.min(h, -6 + 3 * (dR / RIVER_HALF));
    return h;
  }

  function heightAt(x, z) { return baseHeight(x, z); }

  function isWater(x, z) { return Math.abs(x - riverX(z)) < RIVER_HALF; }

  // ---------------- Terrain mesh ----------------
  function buildTerrain(scene, opts) {
    opts = opts || {};
    const SIZE = 1500, SEG = 240;
    const geo = new THREE.PlaneGeometry(SIZE, SIZE, SEG, SEG);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const grass  = new THREE.Color(0x7d9a50);
    const grass2 = new THREE.Color(0x6a8a45);
    const sand   = new THREE.Color(0xc9b27a);
    const rock   = new THREE.Color(0x9a9384);
    const stone  = new THREE.Color(0xb5ac98);
    const bed    = new THREE.Color(0x7a6f55);
    const c = new THREE.Color();

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getZ(i);
      const h = baseHeight(x, z);
      pos.setY(i, h);

      const dR = Math.abs(x - riverX(z));
      if (h < 0.5 && dR < RIVER_HALF + 8) c.copy(bed);
      else if (dR < RIVER_HALF + 16) c.lerpColors(sand, grass, (dR - RIVER_HALF - 8) / 16);
      else if (h > 34) c.lerpColors(rock, grass2, Math.max(0, 1 - (h - 34) / 18));
      else c.lerpColors(grass2, grass, Math.min(1, h / 22));
      // monumental flat areas get a paved tint
      let flatW = 0;
      for (let k = 0; k < FLATS.length; k++) {
        const f = FLATS[k];
        const d = Math.hypot(x - f.x, z - f.z);
        if (f.l < 10) { const w = smooth(1 - Math.min(1, d / f.r)); flatW = Math.max(flatW, w); }
      }
      c.lerp(stone, flatW * 0.65);
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();

    const mat = new THREE.MeshLambertMaterial({ vertexColors: true });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);
    return mesh;
  }

  // ---------------- Tiber water ribbon ----------------
  function buildRiver(scene) {
    const pts = [], uvs = [], idx = [];
    const z0 = -720, z1 = 720, step = 24;
    let i = 0;
    for (let z = z0; z <= z1; z += step) {
      const cx = riverX(z);
      // slight width variation
      const w = RIVER_HALF + 2 + 3 * Math.sin(z * 0.02);
      pts.push(cx - w, 0.35, z);
      pts.push(cx + w, 0.35, z);
      if (z > z0) {
        const a = i - 2, b = i - 2 + 1, cc = i, dd = i + 1;
        idx.push(a, cc, b, b, cc, dd);
      }
      i += 2;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    const mesh = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({
      color: 0x3a6f8e, transparent: true, opacity: 0.82,
    }));
    scene.add(mesh);

    // sand banks along the river
    const banks = [];
    for (let z = z0; z <= z1; z += step) {
      const cx = riverX(z);
      banks.push(cx - RIVER_HALF - 6, 0.55, z,  cx + RIVER_HALF + 6, 0.55, z);
    }
    return mesh;
  }

  // ---------------- Labels (hill names as floating text sprites) ----------------
  function makeLabel(text, x, y, z, color) {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.font = 'bold 56px Georgia';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = color || 'rgba(255,255,240,0.92)';
    ctx.fillText(text, 256, 64);
    const tex = new THREE.CanvasTexture(canvas);
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.85, depthTest: true }));
    sp.scale.set(40, 10, 1);
    sp.position.set(x, y, z);
    return sp;
  }

  function buildLabels(scene) {
    const labels = [
      ['TIBER', riverX(0) - 20, 6, -180],
      ['CAMPUS MARTIUS', -90, 20, 100],
    ];
    for (let i = 0; i < HILLS.length; i++) {
      labels.push([HILLS[i].name.toUpperCase(), HILLS[i].x, HILLS[i].h + 14, HILLS[i].z]);
    }
    labels.push(['ROMAN FORUM', 0, 26, 10]);
    for (let i = 0; i < labels.length; i++) {
      const l = labels[i];
      scene.add(makeLabel(l[0], l[1], l[2], l[3]));
    }
  }

  window.Rome.terrain = {
    heightAt: heightAt,
    isWater: isWater,
    riverX: riverX,
    HILLS: HILLS,
    FLATS: FLATS,
    RIVER_HALF: RIVER_HALF,
    buildTerrain: buildTerrain,
    buildRiver: buildRiver,
    buildLabels: buildLabels,
    makeLabel: makeLabel,
  };
})();
