/* main.js — scene, sky, lights, player controller (walk + bird mode) */
(function () {
  'use strict';
  const R = window.Roman, T = window.Terrain;

  // ---------- renderer / scene ----------
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa8c8e0);
  scene.fog = new THREE.Fog(0xbcd0e2, 400, 2400);

  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 6000);
  camera.rotation.order = 'YXZ';

  // sky dome with a soft gradient
  (function () {
    const sky = new THREE.Mesh(
      new THREE.SphereGeometry(3000, 24, 16),
      new THREE.MeshBasicMaterial({ side: THREE.BackSide, vertexColors: true })
    );
    const pos = sky.geometry.attributes.position, cols = [];
    const top = new THREE.Color(0x5d8fc4), hor = new THREE.Color(0xdce8ee);
    for (let i = 0; i < pos.count; i++) {
      const t = Math.max(0, pos.getY(i) / 3000);
      const c = hor.clone().lerp(top, Math.pow(t, 0.6));
      cols.push(c.r, c.g, c.b);
    }
    sky.geometry.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
    scene.add(sky);
  })();

  // lights
  scene.add(new THREE.HemisphereLight(0xcfe4ff, 0x8a7a58, 0.85));
  const sun = new THREE.DirectionalLight(0xfff0d0, 1.15);
  sun.position.set(600, 900, -300);
  scene.add(sun);

  // ---------- build the city ----------
  T.build(scene);
  window.Temples.build(scene);
  window.Colosseum.build(scene);
  window.Circuses.build(scene);
  window.Bathes.build(scene);
  window.Walls.build(scene);
  window.Gates.build(scene);
  window.Buildings.build(scene);
  window.Obelisks.build(scene);
  window.Columns.build(scene);
  window.TriumphalArches.build(scene);
  window.Aqueducts.build(scene);
  window.Fountains.build(scene);
  window.Villas.build(scene);
  window.Roads.build(scene);

  // cypress groves on the hillsides
  for (const hl of T.HILLS) {
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + hl.x;
      const rr = hl.r * (1.05 + (i % 3) * 0.12);
      const x = hl.x + Math.cos(a) * rr, z = hl.z + Math.sin(a) * rr;
      const h = T.heightAt(x, z);
      if (h > 1 && h < 30) scene.add(R.makeCypress(x, z, 7 + (i % 4) * 2));
    }
  }
  for (let i = 0; i < 30; i++) {                     // trees in the lowlands
    const x = (Math.sin(i * 12.9898) * 43758.5453) % 1;
    const z = (Math.sin(i * 78.233) * 12543.123) % 1;
    const px = -700 + Math.abs(x) * 1400, pz = -700 + Math.abs(z) * 1400;
    const h = T.heightAt(px, pz);
    if (h > 1 && h < 12) scene.add(R.makeTree(px, pz, 7 + (i % 5)));
  }

  // ---------- player ----------
  const player = {
    pos: new THREE.Vector3(150, 0, 150),
    yaw: Math.PI, pitch: 0,
    mode: 'walk',
  };
  function groundY(x, z) { return Math.max(T.heightAt(x, z), 0.3); }
  player.pos.y = groundY(player.pos.x, player.pos.z) + 1.7;

  const keys = {};
  window.addEventListener('keydown', e => {
    keys[e.code] = true;
    if (e.code === 'KeyB') toggleMode();
  });
  window.addEventListener('keyup', e => { keys[e.code] = false; });

  function toggleMode(force) {
    const target = force || (player.mode === 'walk' ? 'bird' : 'walk');
    if (target === player.mode) return;
    player.mode = target;
    if (target === 'bird') {
      player.pos.y = Math.max(player.pos.y, 380);
    } else {
      player.pos.y = groundY(player.pos.x, player.pos.z) + 1.7;
    }
    UI.setMode(target);
  }

  // ---------- mouse (pointer lock) ----------
  const hint = document.getElementById('start-hint');
  renderer.domElement.addEventListener('click', () => {
    renderer.domElement.requestPointerLock();
  });
  document.addEventListener('pointerlockchange', () => {
    const locked = document.pointerLockElement === renderer.domElement;
    if (hint) hint.style.display = locked ? 'none' : 'block';
    if (hint && locked) hint.textContent = 'Walking ancient Rome';
  });
  document.addEventListener('mousemove', e => {
    if (document.pointerLockElement !== renderer.domElement) return;
    player.yaw -= e.movementX * 0.0024;
    player.pitch -= e.movementY * 0.0024;
    const lim = player.mode === 'bird' ? 1.5 : 1.45;
    player.pitch = Math.max(-lim, Math.min(lim, player.pitch));
  });

  // ---------- UI ----------
  UI.init(function (mode) { toggleMode(mode); });

  // ---------- loop ----------
  const clock = new THREE.Clock();
  function frame() {
    requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = performance.now();

    // movement
    const running = keys['ShiftLeft'] || keys['ShiftRight'];
    let speed = player.mode === 'bird' ? (running ? 170 : 90) : (running ? 26 : 10);
    const f = (keys['KeyW'] || keys['ArrowUp'] ? 1 : 0) - (keys['KeyS'] || keys['ArrowDown'] ? 1 : 0);
    const s = (keys['KeyD'] || keys['ArrowRight'] ? 1 : 0) - (keys['KeyA'] || keys['ArrowLeft'] ? 1 : 0);
    if (f || s) {
      const len = Math.hypot(f, s);
      const sin = Math.sin(player.yaw), cos = Math.cos(player.yaw);
      // forward = -z rotated by yaw
      const dx = (-sin * f + cos * s) / len;
      const dz = (-cos * f - sin * s) / len;
      player.pos.x += dx * speed * dt;
      player.pos.z += dz * speed * dt;
    }
    if (player.mode === 'bird') {
      const up = (keys['Space'] || keys['KeyE'] ? 1 : 0) - (keys['KeyQ'] ? 1 : 0);
      // Shift descends in bird mode
      const shift = running ? -1 : 0;
      player.pos.y += (up + shift * 0.7) * speed * dt;
      player.pos.y = Math.max(6, player.pos.y);
    } else {
      const target = groundY(player.pos.x, player.pos.z) + 1.7;
      // smooth step up / follow slopes
      player.pos.y += (target - player.pos.y) * Math.min(1, dt * 10);
    }
    // keep inside the world
    player.pos.x = Math.max(-820, Math.min(820, player.pos.x));
    player.pos.z = Math.max(-820, Math.min(820, player.pos.z));

    camera.position.copy(player.pos);
    camera.rotation.y = player.yaw;
    camera.rotation.x = player.pitch;

    T.animate(t);
    renderer.render(scene, camera);
  }
  frame();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
