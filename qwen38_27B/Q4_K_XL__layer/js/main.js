/* ============================================================
   main.js — Scene, lighting, player (on foot + bird mode)
   ============================================================ */
(function () {
  'use strict';

  /* ---------- renderer / scene / camera ---------- */
  const canvas = document.getElementById('scene');
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x9cc2e6);
  scene.fog = new THREE.Fog(0xc6d8e8, 350, 2600);

  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 5000);

  /* ---------- lights ---------- */
  const hemi = new THREE.HemisphereLight(0xdfeaff, 0x6d6350, 0.85);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff0d0, 1.05);
  sun.position.set(700, 1100, 350);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  const S = 750;
  sun.shadow.camera.left = -S; sun.shadow.camera.right = S;
  sun.shadow.camera.top = S; sun.shadow.camera.bottom = -S;
  sun.shadow.camera.far = 3000;
  sun.shadow.bias = -0.0006;
  scene.add(sun);
  scene.add(sun.target);

  // a visible sun disc
  const sunDisc = new THREE.Mesh(
    new THREE.SphereGeometry(60, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xfff3c0 })
  );
  sunDisc.position.set(1400, 1900, 700);
  scene.add(sunDisc);

  /* ---------- build the world ---------- */
  ROME.buildTerrain(scene);
  ROME.buildRiver(scene);
  RomeRoads.buildRoads(scene);
  RomeWalls.buildWallsGates(scene);
  RomeTemples.buildTemples(scene);
  RomeColosseum.buildColosseum(scene);
  RomeCircuses.buildCircuses(scene);
  RomeBaths.buildBaths(scene);
  RomeBuildings.buildBuildings(scene);
  RomeObelisks.buildObelisks(scene);
  RomeColumns.buildColumns(scene);
  RomeArches.buildArches(scene);
  RomeAqueducts.buildAqueducts(scene);
  RomeFountains.buildFountains(scene);
  RomeVillas.buildVillas(scene);

  /* ---------- player ---------- */
  const EYE = 1.8;
  const player = {
    x: 30, z: 300,           // spawn on the Via Sacra, in the Forum
    y: 0, vy: 0,
    yaw: Math.PI,            // facing into the city
    pitch: 0,
    grounded: true,
    bird: false
  };
  player.y = ROME.heightAt(player.x, player.z) + EYE;

  const keys = {};
  let locked = false;

  document.addEventListener('keydown', e => {
    keys[e.code] = true;
    if (e.code === 'KeyB') {
      player.bird = !player.bird;
      UI.setMode(player.bird);
      if (player.bird) {
        // rise into the air
        player.vy = 8;
      } else {
        player.grounded = false;
      }
    }
    if (e.code === 'Space') e.preventDefault();
  });
  document.addEventListener('keyup', e => { keys[e.code] = false; });

  canvas.addEventListener('click', () => {
    if (!locked) canvas.requestPointerLock();
  });
  document.addEventListener('pointerlockchange', () => {
    locked = document.pointerLockElement === canvas;
    UI.setLocked(locked);
  });
  document.addEventListener('mousemove', e => {
    if (!locked) return;
    player.yaw += e.movementX * 0.0022;
    player.pitch -= e.movementY * 0.0022;
    player.pitch = Math.max(-1.5, Math.min(1.5, player.pitch));
  });

  /* ---------- main loop ---------- */
  const clock = new THREE.Clock();
  let hudTimer = 0;

  function update(dt) {
    const sprint = keys['ShiftLeft'] || keys['ShiftRight'];
    const fwd = (keys['KeyW'] || keys['ArrowUp'] ? 1 : 0) - (keys['KeyS'] || keys['ArrowDown'] ? 1 : 0);
    const strafe = (keys['KeyD'] || keys['ArrowRight'] ? 1 : 0) - (keys['KeyA'] || keys['ArrowLeft'] ? 1 : 0);

    if (player.bird) {
      /* --- bird mode: free flight over the city --- */
      const speed = sprint ? 90 : 45;
      const sin = Math.sin(player.yaw), cos = Math.cos(player.yaw);
      // forward = -z in view space
      player.x += (-sin * fwd + cos * strafe) * speed * dt;
      player.z += (-cos * fwd - sin * strafe) * speed * dt;
      const up = (keys['Space'] ? 1 : 0) - (keys['KeyC'] ? 1 : 0);
      player.y += up * speed * 0.6 * dt;
      const minY = ROME.heightAt(player.x, player.z) + 3;
      if (player.y < minY) { player.y = minY; }
      if (player.y > 600) player.y = 600;
    } else {
      /* --- on foot: walk with gravity, terrain collision --- */
      const speed = sprint ? 16 : 8;
      const sin = Math.sin(player.yaw), cos = Math.cos(player.yaw);
      const len = Math.hypot(fwd, strafe) || 1;
      player.x += (-sin * fwd / len + cos * strafe / len) * speed * dt;
      player.z += (-cos * fwd / len - sin * strafe / len) * speed * dt;
      const ground = ROME.heightAt(player.x, player.z) + EYE;
      // walking in the river: keep at water level
      const nearRiver = Math.abs(player.x - ROME.riverXAt(player.z)) < 34;
      const floorY = nearRiver ? Math.max(ground, ROME.RIVER_BED_Y + 1.2) : ground;
      if (keys['Space'] && player.grounded) { player.vy = 5.5; player.grounded = false; }
      player.vy -= 14 * dt;
      player.y += player.vy * dt;
      if (player.y <= floorY) { player.y = floorY; player.vy = 0; player.grounded = true; }
    }

    // keep the player in the world
    const BOUND = 1650;
    player.x = Math.max(-BOUND, Math.min(BOUND, player.x));
    player.z = Math.max(-BOUND, Math.min(BOUND, player.z));

    camera.position.set(player.x, player.y, player.z);
    camera.rotation.order = 'YXZ';
    camera.rotation.y = player.yaw;
    camera.rotation.x = player.pitch;

    // HUD (throttled)
    hudTimer += dt;
    if (hudTimer > 0.15) {
      hudTimer = 0;
      UI.setPos(player.x, player.z);
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05);
    update(dt);
    renderer.render(scene, camera);
  }

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  UI.init();
  UI.setPos(player.x, player.z);
  animate();
})();
