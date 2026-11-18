/* arches.js - triumphal arches: Titus, Septimius Severus, Constantine, Claudius */
window.Rome = window.Rome || {};

(function () {
  const T = () => window.Rome.terrain;
  const C = () => window.Rome.core;

  function buildArches(scene) {
    const M = C().mats;

    // Arch of Titus - east end of the Via Sacra, celebrates the sacking of Jerusalem (70 CE)
    let a = C().triumphalArch(1.5, M.travertine);
    a.position.set(45, T().heightAt(45, 35), 35);
    a.rotation.y = -Math.PI / 4 - Math.PI / 2;   // faces along the Via Sacra
    scene.add(a);
    scene.add(T().makeLabel('ARCH OF TITUS', 45, 17, 35));

    // Arch of Septimius Severus - west end of the Forum, triple-arched (largest)
    a = C().triumphalArch(2.0, M.travertine);
    a.position.set(-36, T().heightAt(-36, -32), -32);
    a.rotation.y = Math.PI / 4 - Math.PI / 2;
    scene.add(a);
    // flanking side arches
    const sideL = C().triumphalArch(1.0, M.travertine);
    sideL.position.set(-44, T().heightAt(-44, -24), -24);
    sideL.rotation.y = a.rotation.y;
    const sideR = C().triumphalArch(1.0, M.travertine);
    sideR.position.set(-28, T().heightAt(-28, -40), -40);
    sideR.rotation.y = a.rotation.y;
    scene.add(sideL, sideR);
    scene.add(T().makeLabel('ARCH OF SEPTIMIUS SEVERUS', -36, 20, -32));

    // Arch of Constantine - just west of the Colosseum, at the end of the Circus
    a = C().triumphalArch(1.8, M.travertine);
    const xc = 62, zc = 30;
    a.position.set(xc, T().heightAt(xc, zc), zc);
    a.rotation.y = Math.PI / 2;
    scene.add(a);
    scene.add(T().makeLabel('ARCH OF CONSTANTINE', xc, 18, zc));

    // Arch of Claudius (Porta Maggiore) - already merged into the wall; a monument here
    a = C().triumphalArch(1.2, M.stone);
    const xg = 60 + 330 * Math.cos(THREE.MathUtils.degToRad(20));
    const zg = 30 + 330 * Math.sin(THREE.MathUtils.degToRad(20));
    a.position.set(xg, T().heightAt(xg, zg), zg);
    a.rotation.y = -THREE.MathUtils.degToRad(20) - Math.PI / 2;
    scene.add(a);
  }

  window.Rome.arches = { build: buildArches };
})();
