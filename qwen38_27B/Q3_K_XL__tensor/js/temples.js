/* temples.js - temples of ancient Rome: Forum shrines, Pantheon, Capitoline, Portunus, Venus & Roma, Serapis */
window.Rome = window.Rome || {};

(function () {
  const T = () => window.Rome.terrain;
  const C = () => window.Rome.core;

  function at(g, x, z, rotY, y) {
    g.position.x = x;
    g.position.z = z;
    g.rotation.y = rotY || 0;
    g.position.y = y === undefined ? T().heightAt(x, z) : y;
    return g;
  }

  // Circular shrine: Temple of Vesta & Atrium Vestae (eternal flame, guarded by Vestal Virgins)
  function templeOfVesta(scene) {
    const g = new THREE.Group();
    const M = C().mats;
    const r = 4;
    // circular cella
    const cella = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 4, 20), M.travertine);
    cella.position.y = 2;
    g.add(cella);
    g.add(C().box(2 * r + 3, 0.4, 2 * r + 3, M.stone, 0, 0.2, 0));
    // conical roof with central opening
    const roof = new THREE.Mesh(new THREE.ConeGeometry(r + 1.2, 3.2, 20), M.travertine);
    roof.position.y = 5.6;
    g.add(roof);
    // peristyle of surrounding columns (Atrium Vestae)
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      const col = C().column(0.4, 3.2, M.marble);
      col.position.set(Math.cos(a) * (r + 3.5), 0.4, Math.sin(a) * (r + 3.5));
      g.add(col);
    }
    // eternal flame (glowing)
    const flame = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xffaa33 })
    );
    flame.position.set(0, 5.2, r + 3.5);
    g.add(flame);
    at(g, 18, -14, 0);
    scene.add(g);
  }

  // The Pantheon - unreinforced concrete dome with oculus
  function pantheon(scene) {
    const g = new THREE.Group();
    const M = C().mats;
    const r = 16, h = 16;
    // drum
    const drum = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 28), M.travertine);
    drum.position.y = h / 2;
    g.add(drum);
    // dome (hemisphere)
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(r, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2), M.stone);
    dome.position.y = h;
    g.add(dome);
    // oculus ring
    const oc = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.5, 8, 16), M.black);
    oc.rotation.x = Math.PI / 2;
    oc.position.y = h + r - 0.2;
    g.add(oc);
    // brick band
    const band = new THREE.Mesh(new THREE.CylinderGeometry(r + 0.2, r + 0.2, 3, 28), M.brick);
    band.position.y = h - 1.5;
    g.add(band);
    // front portico: pronaos with columns + gabled pediment
    const port = C().romanTemple({ cols: 8, width: 22, depth: 14, colH: 10, podiumH: 3, mat: M.marble });
    port.position.set(0, 0, r + 7);
    g.add(port);
    at(g, 42, 58, Math.PI * 0.92);
    scene.add(g);
  }

  function buildTemples(scene) {
    const M = C().mats;

    // ---- Temple of Saturn (Forum, housed the state treasury) ----
    let t = C().romanTemple({ cols: 6, width: 16, depth: 22, colH: 7, mat: M.travertine });
    at(t, -4, 48, Math.PI, T().heightAt(-4, 48));
    scene.add(t);
    scene.add(T().makeLabel('TEMPLE OF SATURN', -4, 15, 48));

    // ---- Temple of Vesta & Atrium Vestae ----
    templeOfVesta(scene);
    scene.add(T().makeLabel('TEMPLE OF VESTA', 18, 9, -14));

    // ---- Temple of Portunus (Forum Boarium, near the Tiber; Ionic colonnade) ----
    t = C().romanTemple({ cols: 5, width: 12, depth: 18, colH: 6, mat: M.marble });
    at(t, -78, -52, Math.PI * 0.75);
    scene.add(t);
    scene.add(T().makeLabel('TEMPLE OF PORTUNUS', -78, 14, -52));

    // ---- Temple of Jupiter Optimus Maximus (Capitoline summit - religious citadel) ----
    t = C().romanTemple({ cols: 8, width: 22, depth: 26, colH: 10, podiumH: 4, mat: M.travertine });
    at(t, -70, 40, Math.PI * 0.5, T().heightAt(-70, 40));
    scene.add(t);
    scene.add(T().makeLabel('TEMPLE OF JUPITER (CAPITOLINE)', -70, 60, 40));

    // ---- Temple of Venus and Roma (Hadrian; largest temple, between Palatine and Forum) ----
    t = C().romanTemple({ cols: 8, width: 26, depth: 34, colH: 9, mat: M.travertine });
    at(t, 55, 68, Math.PI * 0.35);
    scene.add(t);
    scene.add(T().makeLabel('TEMPLE OF VENUS & ROMA', 55, 16, 68));

    // ---- Temple of Serapis (Quirinal Hill) ----
    t = C().romanTemple({ cols: 6, width: 16, depth: 22, colH: 8, mat: M.marble });
    at(t, 110, 145, 0, T().heightAt(110, 145));
    scene.add(t);
    scene.add(T().makeLabel('TEMPLE OF SERAPIS', 110, 62, 145));

    // ---- Temple of Mars Ultor (Campus Martius) ----
    t = C().romanTemple({ cols: 6, width: 15, depth: 20, colH: 7, mat: M.travertine });
    at(t, -100, -55, Math.PI * 0.9);
    scene.add(t);
    scene.add(T().makeLabel('TEMPLE OF MARS ULTOR', -100, 13, -55));

    // ---- Pantheon ----
    pantheon(scene);
    scene.add(T().makeLabel('PANTHEON', 42, 32, 58));
  }

  window.Rome.temples = { build: buildTemples };
})();
