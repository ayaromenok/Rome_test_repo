/* headless smoke test: build the whole city in Node, no DOM/WebGL */
const fs = require('fs');
const vm = require('vm');
const THREE = require('./lib/three.min.js');

const sandbox = {
  THREE,
  console,
  document: {
    createElement: () => ({
      getContext: () => ({ fillRect() {}, fillText() {} }),
      style: {},
    }),
  },
  window: {},
};
sandbox.window = sandbox;
sandbox.addEventListener = () => {};
vm.createContext(sandbox);

const files = ['terrain','temples','colosseum','circuses','bathes','walls','buildings',
  'obelisks','columns','triumphArches','aqueducts','fountains','villas','roads','main'];
for (const f of files) vm.runInContext(fs.readFileSync('js/' + f + '.js', 'utf8'), sandbox, { filename: f + '.js' });

vm.runInContext(`
  scene = new THREE.Scene();
  ROME.initMaterials();
  buildTerrainMesh();
  initBuildings(scene);
  initTemples(scene);
  initColosseum(scene);
  initCircuses(scene);
  initBathes(scene);
  initWalls(scene);
  initTriumphArches(scene);
  initColumns(scene);
  initObelisks(scene);
  initAqueducts(scene);
  initFountains(scene);
  initVillas(scene);
  initRoads(scene);
  plantTrees();
  initPlayer();
  camera = new THREE.PerspectiveCamera(65, 1, 0.1, 6000);
  for (let i = 0; i < 5; i++) updatePlayer(0.016);
  toggleBirdMode(true);
  for (let i = 0; i < 5; i++) updatePlayer(0.016);
  toggleBirdMode(false);
  let count = 0; scene.traverse(() => count++);
  console.log('scene objects:', count);
  const t = ROME.terrainHeight;
  console.log('forum ground      ', t(0, 0).toFixed(1));
  console.log('palatine peak     ', t(0, -110).toFixed(1), t(0, -110) > 25 ? 'ok' : 'CHECK');
  console.log('river bed         ', t(ROME.riverX(150), 150).toFixed(1), t(ROME.riverX(150), 150) < -3 ? 'ok' : 'CHECK');
  console.log('river bank dry    ', t(ROME.riverX(150) + 100, 150).toFixed(1));
  console.log('SMOKE TEST PASSED');
`, sandbox);
vm.runInContext(`
  const pts = { 'forum(0,0)': [0,0], 'rostra(-40,-25)': [-40,-25], 'palatine(100,-180)': [100,-180],
    'capitoline(-170,-60)': [-170,-60], 'circus(-10,40)': [-10,40], 'colosseum(120,120)': [120,120],
    'campus(-280,150)': [-280,150], 'quirinal(240,-300)': [240,-300], 'viminal(350,-330)': [350,-330],
    'esquiline(240,140)': [240,140], 'caelian(110,220)': [110,220], 'aventine(-60,170)': [-60,170],
    'pantheon(185,-60)': [185,-60], 'baths-caracalla(200,480)': [200,480] };
  for (const [n, [x, z]] of Object.entries(pts)) console.log(n.padEnd(24), ROME.terrainHeight(x, z).toFixed(1));
`, sandbox);
