/* terrain.js — historically-placed Seven Hills of Rome + the Tiber river */
window.Terrain = (function () {
  // The famous Seven Hills. City coordinate system: +x = east, +z = south.
  const HILLS = [
    { name: 'Palatine',   x:   0, z:  120, h: 42, r: 95  },  // imperial centre
    { name: 'Capitoline', x: -110, z:  -40, h: 38, r: 80  },  // religious citadel
    { name: 'Quirinal',   x:  170, z: -180, h: 32, r: 85  },  // NE — Serapis, Constantine baths
    { name: 'Viminal',    x:   60, z: -100, h: 24, r: 55  },  // small central hill, residential
    { name: 'Esquiline',  x:  260, z:    0, h: 36, r: 110 },  // E — Domus Aurea, Trajan baths
    { name: 'Caelian',    x:  120, z:  220, h: 32, r: 85  },  // SE — villas, residential
    { name: 'Aventine',   x:  -60, z:  260, h: 26, r: 75  },  // S near river, luxury zone
  ];

  // The Tiber curves through the city, bending west to enclose Campus Martius.
  const RIVER_W = 42;
  function riverX(z) { return -260 + 140 * Math.sin(z * 0.004 + 0.5); }

  // Flattened levels where the Romans levelled the ground for monuments
  const TERRACES = [
    { x: 35,   z: 45,  r: 130, level: 6  },  // Roman Forum valley (drained marsh)
    { x: 15,   z: 195, r: 100, level: 12 },  // Circus Maximus bed
    { x: -60,  z: 20,  r: 150, level: 3  },  // Campus Martius plain
    { x: 145,  z: 95,  r: 85,  level: 15 },  // Colosseum site
    { x: -120, z: -50, r: 50,  level: 8  },  // Forum Boarium near the Tiber
  ];

  function heightAt(x, z) {
    let h = 4; // flat lowland base
    for (let i = 0; i < HILLS.length; i++) {
      const hl = HILLS[i];
      const dx = x - hl.x, dz = z - hl.z;
      h += hl.h * Math.exp(-(dx * dx + dz * dz) / (2 * hl.r * hl.r));
    }
    // smooth terrace blending (levelled monument ground)
    for (let i = 0; i < TERRACES.length; i++) {
      const t = TERRACES[i];
      const d = Math.hypot(x - t.x, z - t.z);
      if (d < t.r) {
        const u = d / t.r;
        const w = 1 - (u * u * (3 - 2 * u));
        h = h * (1 - w) + t.level * w;
      }
    }
    // carve the river channel with a smooth transition bank
    const dx = x - riverX(z);
    const half = RIVER_W + 70;
    if (dx > -half && dx < half) {
      let t = 1 - Math.abs(dx) / half;
      t = t * t * (3 - 2 * t);
      h = h * (1 - t) + (-3.5) * t;
    }
    return h;
  }

  let waterMesh = null;
  function build(scene) {
    const S = 1700, SEG = 180;
    const geo = new THREE.PlaneGeometry(S, S, SEG, SEG);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    const colors = [];
    const cSand = [0.74, 0.66, 0.45], cLow = [0.63, 0.61, 0.42],
          cHigh = [0.5, 0.47, 0.38], cGrass = [0.42, 0.55, 0.3];
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getZ(i);
      const h = heightAt(x, z);
      pos.setY(i, h);
      let c = (h < 0.8) ? cSand : (h < 2.5) ? cLow : (h > 30) ? cHigh : cGrass;
      const n = Math.sin(x * 0.13) * Math.cos(z * 0.11) * 0.035;
      colors.push(c[0] + n, c[1] + n, c[2] + n);
    }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    scene.add(new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ vertexColors: true })));

    waterMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(S, S),
      new THREE.MeshLambertMaterial({ color: 0x2a6f97, transparent: true, opacity: 0.82 })
    );
    waterMesh.rotation.x = -Math.PI / 2;
    waterMesh.position.y = 0.3;
    scene.add(waterMesh);
  }

  function animate(t) {
    if (waterMesh) waterMesh.position.y = 0.3 + Math.sin(t * 0.0012) * 0.15;
  }

  return { HILLS, riverX, RIVER_W, heightAt, build, animate };
})();
