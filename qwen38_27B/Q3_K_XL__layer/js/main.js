/* ============================================================
 * main.js — Roma Aeterna: a walk through ancient Rome
 * Scene setup, terrain, Tiber, player (walk) & bird mode.
 * ============================================================ */
let scene, camera, renderer, clock;
let player, keys = {};
let birdMode = false;
var walkSpeed = 18, birdSpeed = 90;

/* ---------------- renderer / scene ---------------- */
function initThree() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xbfd4e8);
  scene.fog = new THREE.Fog(0xc4d5e4, 900, 3400);

  camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 6000);
  clock = new THREE.Clock();

  const hemi = new THREE.HemisphereLight(0xcfe5ff, 0x8a7a5a, 0.85);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff0d8, 1.15);
  sun.position.set(600, 900, -400);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -800; sun.shadow.camera.right = 800;
  sun.shadow.camera.top = 800; sun.shadow.camera.bottom = -800;
  sun.shadow.camera.far = 3000;
  scene.add(sun);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

/* ---------------- terrain mesh ---------------- */
function buildTerrainMesh() {
  const SIZE = 3400, SEG = 256;
  const geo = new THREE.PlaneGeometry(SIZE, SIZE, SEG, SEG);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  const colors = [];
  const cLow = new THREE.Color(0x6f7d4a);    // grass
  const cHigh = new THREE.Color(0x8d8a6a);   // dry hill
  const cSand = new THREE.Color(0xd3c8a5);   // river sand
  const cRock = new THREE.Color(0x9b9483);
  const tmp = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i);
    const y = ROME.terrainHeight(x, z);
    pos.setY(i, y);
    const rx = ROME.riverX(z);
    const d = Math.abs(x - rx);
    if (y < -0.5 || d < ROME.RIVER_HALF_W + 8) {
      tmp.copy(cSand);
    } else {
      const t = Math.min(1, Math.max(0, y / 30));
      tmp.copy(cLow).lerp(cHigh, t);
      if (y > 22) tmp.lerp(cRock, 0.5);
      // slight noise
      const n = (Math.sin(x * 0.7) * Math.cos(z * 0.6)) * 0.03;
      tmp.offsetHSL(0, 0, n);
    }
    colors.push(tmp.r, tmp.g, tmp.b);
  }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 }));
  mesh.receiveShadow = true;
  scene.add(mesh);

  // Tiber water surface
  const water = new THREE.Mesh(new THREE.PlaneGeometry(SIZE, SIZE), ROME.MAT.water);
  water.rotation.x = -Math.PI / 2;
  water.position.y = -0.15;
  scene.add(water);
}

/* ---------------- scattered trees on the hills ---------------- */
function plantTrees() {
  for (let i = 0; i < 260; i++) {
    const x = (Math.random() - 0.5) * 2200;
    const z = (Math.random() - 0.5) * 2200;
    const y = ROME.terrainHeight(x, z);
    if (y < 1.5 || y > 34) continue;
    const r = ROME.riverX(z);
    if (Math.abs(x - r) < ROME.RIVER_HALF_W + 20) continue;
    ROME.makeTree(scene, x, z, 0.8 + Math.random() * 1.4);
  }
  // olive groves on the Caelian & Aventine
  for (let i = 0; i < 40; i++) {
    const a = Math.random() * Math.PI * 2, d = 30 + Math.random() * 90;
    ROME.makeTree(scene, 60 + Math.cos(a) * d, 190 + Math.sin(a) * d, 0.6 + Math.random() * 0.8);
  }
}

/* ---------------- player & controls ---------------- */
let yaw = 0, pitch = -0.05;

function initPlayer() {
  player = { x: 10, z: 95, y: 0 };
  // start on the Via Sacra looking at the Forum
}

function updatePlayer(dt) {
  const speed = birdMode ? birdSpeed : walkSpeed;
  const f = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
  const r = new THREE.Vector3(-f.z, 0, f.x);
  let mx = 0, mz = 0;
  if (keys['w'] || keys['arrowup']) { mx += f.x; mz += f.z; }
  if (keys['s'] || keys['arrowdown']) { mx -= f.x; mz -= f.z; }
  if (keys['a'] || keys['arrowleft']) { mx += r.x; mz += r.z; }
  if (keys['d'] || keys['arrowright']) { mx -= r.x; mz -= r.z; }
  const len = Math.hypot(mx, mz);
  if (len > 0) {
    player.x += mx / len * speed * dt;
    player.z += mz / len * speed * dt;
  }
  if (birdMode) {
    if (keys[' '] || keys['e']) player.y += speed * dt * 0.6;
    if (keys['shift'] || keys['q']) player.y -= speed * dt * 0.6;
    player.y = Math.max(player.y, ROME.terrainHeight(player.x, player.z) + 6);
    player.y = Math.min(player.y, 900);
  } else {
    const g = Math.max(ROME.terrainHeight(player.x, player.z), -0.4);
    player.y = g + 1.8; // eye height
  }
  camera.position.set(player.x, player.y, player.z);
  camera.rotation.set(0, 0, 0);
  camera.rotateY(yaw);
  camera.rotateX(pitch);
}

function initInput() {
  window.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    keys[k] = true;
    if (k === 'b') toggleBirdMode();
    if (k === 'r') { // reset to Forum
      player.x = 10; player.z = 95; player.y = 0;
      if (birdMode) player.y = 40;
    }
  });
  window.addEventListener('keyup', (e) => { keys[e.key.toLowerCase()] = false; });

  let dragging = false, lastX = 0, lastY = 0;
  const cv = renderer.domElement;
  cv.addEventListener('mousedown', (e) => { dragging = true; lastX = e.clientX; lastY = e.clientY; });
  window.addEventListener('mouseup', () => { dragging = false; });
  window.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    lastX = e.clientX; lastY = e.clientY;
    yaw -= dx * 0.0032;
    pitch = Math.max(-1.5, Math.min(1.5, pitch - dy * 0.0032));
  });
  cv.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (birdMode) {
      // scroll = fly up/down in bird mode
      player.y += e.deltaY * -0.5;
    } else {
      // scroll adjusts walking speed
      walkSpeed = Math.max(4, Math.min(60, walkSpeed - e.deltaY * 0.02));
      if (window.UI) window.UI.setSpeedUI(walkSpeed);
    }
  }, { passive: false });

  // touch: single finger drag = look
  let tX = 0, tY = 0;
  cv.addEventListener('touchstart', (e) => {
    if (e.touches.length) { tX = e.touches[0].clientX; tY = e.touches[0].clientY; }
  });
  cv.addEventListener('touchmove', (e) => {
    if (!e.touches.length) return;
    const dx = e.touches[0].clientX - tX, dy = e.touches[0].clientY - tY;
    tX = e.touches[0].clientX; tY = e.touches[0].clientY;
    yaw -= dx * 0.004; pitch = Math.max(-1.5, Math.min(1.5, pitch - dy * 0.004));
  });
}

function toggleBirdMode(force) {
  birdMode = force != null ? force : !birdMode;
  if (window.UI) window.UI.setBirdModeUI(birdMode);
  if (!birdMode) {
    const g = Math.max(ROME.terrainHeight(player.x, player.z), -0.4);
    player.y = g + 1.8;
  } else if (player.y < 30) {
    player.y = 60;
  }
}

/* ---------------- main loop ---------------- */
function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  updatePlayer(dt);
  renderer.render(scene, camera);
}

/* ---------------- boot ---------------- */
window.addEventListener('DOMContentLoaded', () => {
  initThree();
  ROME.initMaterials();
  buildTerrainMesh();

  // Build the city — one module per structure type
  initBuildings(scene);      // Forum: Curia, Rostra, basilicas, insulae
  initTemples(scene);        // Pantheon, Jupiter, Vesta, Portunus...
  initColosseum(scene);      // Flavian Amphitheatre
  initCircuses(scene);       // Circus Maximus
  initBathes(scene);         // Caracalla, Diocletian, Trajan
  initWalls(scene);          // Aurelian walls + gates
  initTriumphArches(scene);  // Titus, Constantine, Septimius Severus...
  initColumns(scene);        // Trajan, Marcus Aurelius
  initObelisks(scene);       // Vatican obelisk...
  initAqueducts(scene);      // Aqua Claudia, Aqua Appia
  initFountains(scene);      // Mocho, Forum fountains
  initVillas(scene);         // urbana, rustica, marittima
  initRoads(scene);          // Via Appia/Flaminia/... pontes

  plantTrees();
  initPlayer();
  initInput();
  if (window.UI) window.UI.init();
  animate();
});
