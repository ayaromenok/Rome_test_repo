/* smoke-test.js - headless runtime test: stubs THREE + DOM, loads all game
   modules in page order and calls every build() to catch wiring errors. */
const fs = require('fs');
const vm = require('vm');
const path = require('path');

// ---------- minimal THREE stub ----------
class V3 {
  constructor(x = 0, y = 0, z = 0) { this.x = x; this.y = y; this.z = z; }
  set(x, y, z) { this.x = x; this.y = y; this.z = z; return this; }
  copy(v) { this.x = v.x; this.y = v.y; this.z = v.z; return this; }
  normalize() { return this; }
  addScaledVector(v, s) { this.x += v.x * s; this.y += v.y * s; this.z += v.z * s; return this; }
  length() { return Math.hypot(this.x, this.y, this.z); }
  lengthSq() { return this.x * this.x + this.y * this.y + this.z * this.z; }
}
class Color {
  constructor(c) {
    if (typeof c === 'number') { this.r = (c >> 16 & 255) / 255; this.g = (c >> 8 & 255) / 255; this.b = (c & 255) / 255; }
    else this.r = this.g = this.b = 0;
  }
  lerp(c, t) { this.r += (c.r - this.r) * t; this.g += (c.g - this.g) * t; this.b += (c.b - this.b) * t; return this; }
  copy(c) { this.r = c.r; this.g = c.g; this.b = c.b; return this; }
  lerpColors(a, b, t) { this.r = a.r + (b.r - a.r) * t; this.g = a.g + (b.g - a.g) * t; this.b = a.b + (b.b - a.b) * t; return this; }
}
class Object3D {
  constructor() {
    this.children = [];
    this.position = new V3(); this.rotation = new V3(); this.rotation.order = '';
    this.scale = new V3(1, 1, 1);
  }
  add(...cs) { cs.forEach(c => this.children.push(c)); return this; }
  clone() { const c = new (this.constructor)(); return c; }
}
class Geometry { constructor() { this.parameters = arguments; } }
class PlaneGeometry extends Geometry {
  constructor(w, h, ws = 4, hs = 4) {
    super();
    const arr = new Float32Array((ws + 1) * (hs + 1) * 3);
    let i = 0;
    for (let y = 0; y <= hs; y++) for (let x = 0; x <= ws; x++) { arr[i++] = -w / 2 + w * x / ws; arr[i++] = -h / 2 + h * y / hs; arr[i++] = 0; }
    this.attributes = { position: { count: (ws + 1) * (hs + 1), getX: j => arr[j * 3], getZ: j => arr[j * 3 + 2], setY: (j, v) => { arr[j * 3 + 1] = v; } } };
  }
  rotateX() { return this; }
  setAttribute(n, a) { this.attributes[n] = a; return this; }
  computeVertexNormals() { }
}
class BoxGeometry extends Geometry { }
class CylinderGeometry extends Geometry { constructor(a, b, c, d, e, f, g, h) { super(); this.radiusTop = a; this.radiusBottom = b; this.height = c; this.radialSegments = d; this.openEnded = e; this.thetaStart = f; this.thetaLength = g; } }
class ConeGeometry extends CylinderGeometry { }
class SphereGeometry extends Geometry { }
class TorusGeometry extends Geometry { }
class CircleGeometry extends Geometry { }
class ExtrudeGeometry extends Geometry { constructor(shape, opts) { super(); this.shape = shape; } translate() { return this; } }
class Shape { constructor() { this.holes = []; } moveTo() { } lineTo() { } absarc() { } closePath() { } }
class Path extends Shape { }
class BufferAttribute { constructor(arr, itemSize) { this.array = arr; this.itemSize = itemSize; } }
class Float32BufferAttribute extends BufferAttribute { }
class BufferGeometry {
  constructor() { this.attributes = {}; this.index = null; }
  setAttribute(n, a) { this.attributes[n] = a; return this; }
  setIndex(i) { this.index = i; return this; }
  computeVertexNormals() { }
}
class Mesh extends Object3D { constructor(g, m) { super(); this.geometry = g; this.material = m; } }
class MeshLambertMaterial { constructor(p) { Object.assign(this, p); } }
class MeshBasicMaterial extends MeshLambertMaterial { }
class Sprite extends Object3D { }
class SpriteMaterial extends MeshBasicMaterial { }
class CanvasTexture { }
class WebGLRenderer { constructor() { this.domElement = {}; } setPixelRatio() { } setSize() { } render() { } }
class Scene extends Object3D { }
class PerspectiveCamera { constructor() { this.rotation = new V3(); this.position = new V3(); } updateProjectionMatrix() { } }
class DirectionalLight { constructor() { this.position = new V3(); } }
class HemisphereLight { }
class Fog { }
const MathUtils = { degToRad: d => d * Math.PI / 180 };

const THREE = { V3, Color, Object3D, Mesh, Group: Object3D, PlaneGeometry, BoxGeometry, CylinderGeometry, ConeGeometry, SphereGeometry, TorusGeometry, CircleGeometry, ExtrudeGeometry, Shape, Path, BufferAttribute, Float32BufferAttribute, BufferGeometry, MeshLambertMaterial, MeshBasicMaterial, Sprite, SpriteMaterial, CanvasTexture, WebGLRenderer, Scene, PerspectiveCamera, DirectionalLight, HemisphereLight, Fog, MathUtils, Vector3: V3 };
THREE.Group = class extends Object3D { };

// ---------- DOM stubs ----------
const sandbox = {
  window: {}, console, performance: { now: () => 0 },
  document: {
    createElement: () => ({ width: 0, height: 0, classList: { add() { }, remove() { }, toggle() { } }, style: {}, innerHTML: '', textContent: '', getContext: () => ({ set font(v) { }, get font() { return ''; }, set textAlign(v) { }, set textBaseline(v) { }, set fillStyle(v) { }, fillText() { } }), appendChild() { }, setAttribute() { } }),
    getElementById: () => null,
    head: { appendChild() { } },
    body: { appendChild() { }, style: {} },
    pointerLockElement: null,
    addEventListener() { },
  },
  addEventListener() { },
  THREE,
};
sandbox.window = sandbox; // window === global sandbox proxy
vm.createContext(sandbox);

// ---------- load scripts in page order (skip three.min.js, ui.js, main.js) ----------
const dir = path.join(__dirname, 'js');
const files = ['core.js', 'terrain.js', 'roads.js', 'walls.js', 'temples.js', 'colosseum.js', 'circuses.js', 'bathes.js', 'buildings.js', 'obelisks.js', 'columns.js', 'arches.js', 'aqueducts.js', 'fountains.js', 'villas.js'];
for (const f of files) {
  vm.runInContext(fs.readFileSync(path.join(dir, f), 'utf8'), sandbox, { filename: f });
  console.log('loaded', f);
}

// ---------- call every builder against a scene ----------
const SceneStub = vm.runInContext('THREE.Scene', sandbox);
const scene = new SceneStub();
let count = 0;
function countNodes(o) { count++; (o.children || []).forEach(countNodes); }

const T = sandbox.Rome.terrain;
// terrain math sanity
const hForum = T.heightAt(0, 5), hPal = T.heightAt(70, 40), hTib = T.heightAt(-150, 0), hCampus = T.heightAt(-85, 0);
console.log('heights: forum', hForum.toFixed(1), 'palatine', hPal.toFixed(1), 'tiber', hTib.toFixed(1), 'campus', hCampus.toFixed(1));
if (hPal < 30 || hTib > -3 || hForum > 5 || hForum < 0) throw new Error('terrain heights look wrong');
if (!T.isWater(-150, 0)) throw new Error('river check failed at (-150,0)');

T.buildTerrain(scene);
T.buildRiver(scene);
const builds = ['roads', 'walls', 'temples', 'colosseum', 'circuses', 'bathes', 'buildings', 'obelisks', 'columns', 'arches', 'aqueducts', 'fountains', 'villas'];
for (const name of builds) {
  const b = sandbox.Rome[name];
  if (!b || typeof b.build !== 'function') throw new Error('module ' + name + ' missing build()');
  b.build(scene);
  console.log('built', name);
}
T.buildLabels(scene);
countNodes(scene);
console.log('scene node count:', count);
if (count < 2000) throw new Error('scene suspiciously small');
console.log('SMOKE TEST PASSED');
