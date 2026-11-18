/* main.js - scene setup, player controller (walk + bird mode), game loop */
(function () {
  const T = window.Rome.terrain;
  const C = window.Rome.core;
  const UI = window.Rome.ui;

  // ---------------- Renderer / scene / camera ----------------
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xbfd8e8);
  scene.fog = new THREE.Fog(0xbfd8e8, 250, 1150);

  const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.1, 2500);

  // Sky dome
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(1400, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshBasicMaterial({ color: 0x87b5d8, side: THREE.BackSide, fog: false })
  );
  scene.add(sky);

  // Lights - warm Mediterranean sun
  const sun = new THREE.DirectionalLight(0xfff2d8, 1.15);
  sun.position.set(300, 420, 180);
  scene.add(sun);
  scene.add(new THREE.HemisphereLight(0xbcd8f0, 0x8a7a5c, 0.55));

  // ---------------- Build the world (each system is a separate module) ----------------
  T.buildTerrain(scene);
  T.buildRiver(scene);
  window.Rome.roads.build(scene);
  window.Rome.walls.build(scene);
  window.Rome.temples.build(scene);
  window.Rome.colosseum.build(scene);
  window.Rome.circuses.build(scene);
  window.Rome.bathes.build(scene);
  window.Rome.buildings.build(scene);
  window.Rome.obelisks.build(scene);
  window.Rome.columns.build(scene);
  window.Rome.arches.build(scene);
  window.Rome.aqueducts.build(scene);
  window.Rome.fountains.build(scene);
  window.Rome.villas.build(scene);
  T.buildLabels(scene);

  // ---------------- Player state ----------------
  const player = {
    pos: new THREE.Vector3(-24, 0, -48),   // start at the Forum entrance (Via Sacra)
    yaw: 0, pitch: 0,
    mode: 'walk',
    speed: 14,
    flySpeed: 55,
    fov: 62,
  };
  player.pos.y = T.heightAt(player.pos.x, player.pos.z) + 1.7;

  // ---------------- Input ----------------
  const keys = {};
  window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if (e.code === 'KeyF') toggleBirdMode();
    if (e.code === 'Space') e.preventDefault();
  });
  window.addEventListener('keyup', (e) => { keys[e.code] = false; });

  // Mouse look: pointer lock, or hold-left-drag fallback
  let dragging = false;
  const canvas = renderer.domElement;
  canvas.addEventListener('click', () => {
    if (!document.pointerLockElement) canvas.requestPointerLock();
  });
  canvas.addEventListener('mousedown', (e) => { if (e.button === 0) dragging = true; });
  window.addEventListener('mouseup', (e) => { if (e.button === 0) dragging = false; });
  document.addEventListener('pointerlockchange', () => {
    UI.setLocked(!!document.pointerLockElement);
  });
  window.addEventListener('mousemove', (e) => {
    const active = document.pointerLockElement || dragging;
    if (!active) return;
    const dx = e.movementX, dy = e.movementY;
    player.yaw -= dx * 0.0022;
    player.pitch -= dy * 0.0022;
    player.pitch = Math.max(-1.45, Math.min(1.45, player.pitch));
  });
  window.addEventListener('wheel', (e) => {
    player.fov = Math.max(24, Math.min(100, player.fov + (e.deltaY > 0 ? 4 : -4)));
    camera.fov = player.fov;
    camera.updateProjectionMatrix();
  });
  window.addEventListener('contextmenu', (e) => e.preventDefault());

  function toggleBirdMode() {
    if (player.mode === 'walk') {
      player.mode = 'bird';
      player.pos.y = Math.max(player.pos.y, 120);
      player.pitch = -0.35;
    } else {
      player.mode = 'walk';
    }
    UI.setMode(player.mode);
  }

  // ---------------- Update ----------------
  function update(dt) {
    const k = 1 - Math.exp(-dt * 8); // smooth acceleration
    const run = keys['ShiftLeft'] || keys['ShiftRight'];
    const fwd = (keys['KeyW'] || keys['ArrowUp'] ? 1 : 0) - (keys['KeyS'] || keys['ArrowDown'] ? 1 : 0);
    const strafe = (keys['KeyD'] || keys['ArrowRight'] ? 1 : 0) - (keys['KeyA'] || keys['ArrowLeft'] ? 1 : 0);
    const up = keys['Space'] ? 1 : 0;
    const down = keys['KeyC'] ? 1 : 0;

    let v = new THREE.Vector3(
      Math.sin(player.yaw) * -fwd + Math.cos(player.yaw) * strafe,
      0,
      Math.cos(player.yaw) * -fwd - Math.sin(player.yaw) * strafe
    );
    if (v.lengthSq() > 0) v.normalize();
    let spd = (player.mode === 'bird' ? player.flySpeed : player.speed) * (run ? 2 : 1);
    player.pos.addScaledVector(v, spd * dt);
    if (player.mode === 'bird') player.pos.y += (up - down) * spd * dt;

    // world bounds
    player.pos.x = Math.max(-700, Math.min(700, player.pos.x));
    player.pos.z = Math.max(-700, Math.min(700, player.pos.z));

    if (player.mode === 'walk') {
      const h = T.heightAt(player.pos.x, player.pos.z);
      const groundY = Math.max(h, 0.55) + 1.7;  // stand on ground or wade in the Tiber
      player.pos.y += (groundY - player.pos.y) * Math.min(1, k * 2.5);
      player.pos.y = Math.max(player.pos.y, 1.0);
    } else {
      player.pos.y = Math.max(4, Math.min(600, player.pos.y));
    }

    camera.position.copy(player.pos);
    camera.rotation.order = 'YXZ';
    camera.rotation.y = player.yaw;
    camera.rotation.x = player.pitch;

    UI.updateHUD(player.pos.x, player.pos.z, player.pos.y, v.length() * spd);
  }

  function animate() {
    requestAnimationFrame(animate);
    const t = performance.now() / 1000;
    const dt = Math.min(0.05, t - (animate.last || t));
    animate.last = t;
    update(dt);
    renderer.render(scene, camera);
  }

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ---------------- Boot ----------------
  UI.buildUI();
  UI.setMode('walk');
  UI.setLocked(false);
  animate();
})();
