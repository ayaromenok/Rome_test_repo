/* roads.js — the viae of Rome: Via Sacra, the consular roads leaving the
   Aurelian gates, and the streets linking forum, colosseum and circuses */
window.Roads = (function () {
  const R = window.Roman, M = R.M;

  function build(scene) {
    // Via Sacra — the sacred processional road through the Forum
    scene.add(R.roadRibbon([[130, 210], [95, 150], [60, 100], [30, 60], [0, 25], [-25, 0]], 12));

    // Consular roads out of the Aurelian gates
    scene.add(R.roadRibbon([[40, 460], [70, 640], [90, 800]], 16));                  // Via Appia (Porta San Sebastiano)
    scene.add(R.roadRibbon([[-358, 296], [-480, 460], [-560, 640]], 14));            // Via Ostiensis
    scene.add(R.roadRibbon([[-50, 452], [-90, 620], [-110, 800]], 14));              // Via Labicana
    scene.add(R.roadRibbon([[130, -452], [150, -640], [170, -800]], 16));            // Via Flaminia
    scene.add(R.roadRibbon([[-137, -431], [-190, -600], [-220, -780]], 14));         // Via Salaria
    scene.add(R.roadRibbon([[-449, -157], [-620, -200], [-780, -240]], 14));         // Via Pinciana
    scene.add(R.roadRibbon([[529, -157], [680, -200], [820, -240]], 14));            // Via Tiburtina
    scene.add(R.roadRibbon([[552, 80], [700, 110], [840, 140]], 14));                // Via Esquilina
    scene.add(R.roadRibbon([[490, 230], [620, 290], [760, 340], [920, 380]], 14));   // Via Latina → villa urbana

    // Internal streets
    scene.add(R.roadRibbon([[100, 130], [140, 105], [180, 90], [230, 100]], 10));    // to the Colosseum
    scene.add(R.roadRibbon([[-40, 20], [15, 80], [15, 140], [15, 200], [15, 280], [-30, 330]], 10)); // Circus Maximus street
    scene.add(R.roadRibbon([[145, 95], [165, 160], [150, 230]], 10));                // Colosseum → Caelian
    scene.add(R.roadRibbon([[40, 45], [-40, 40], [-120, -50]], 10));                // Forum → Campus Martius → Temple of Portunus
    scene.add(R.roadRibbon([[60, -100], [150, -150], [240, -230]], 10));             // Viminal → Baths of Caracalla
    scene.add(R.roadRibbon([[260, 0], [310, 35], [330, 70]], 10));                   // Esquiline → Baths of Trajan
    scene.add(R.roadRibbon([[-93, -40], [-30, -10], [15, 30]], 10));                 // bridge east end → Campus → Forum
    scene.add(R.roadRibbon([[-93, -40], [-95, -75], [-95, -110]], 8));               // Campus Martius → Circus Flaminius
    scene.add(R.roadRibbon([[40, 460], [150, 400], [300, 480], [420, 540], [520, 620]], 12)); // Appian way to villa rustica
    scene.add(R.roadRibbon([[40, 30], [-50, 70], [-90, 100], [-88, 110]], 8));       // to the riverside villa

    // bridge over the Tiber on the Campus Martius road (runs east–west)
    const zB = -40, xB = window.Terrain.riverX(zB);
    scene.add(R.roadRibbon([[xB - 80, zB], [xB, zB], [xB + 120, zB]], 12));
    scene.add(R.box(215, 1.2, 14, M.stone, xB + 20, 1.6, zB));   // bridge deck
    for (let i = 0; i < 4; i++) {                               // piers
      scene.add(R.box(4, 3.5, 10, M.stone, xB - 60 + i * 40, 0.8, zB));
    }
  }

  return { build };
})();
