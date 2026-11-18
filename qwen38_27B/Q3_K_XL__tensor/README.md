# Roma Aeterna — Walk Ancient Rome (Three.js)

A browser game where you can walk (or fly as a bird over) ancient Rome:
the seven hills, the Tiber river, the Roman Forum, the Colosseum, the
Circus Maximus, the Aurelian walls, aqueducts, bathes, villas and more.

City layout follows the reference texts in `../../input/`
(general description, forum, walls & gates, temples, villas).

## Run

```
node server.js
```

Then open: **http://192.168.1.103:7998** (or http://127.0.0.1:7998)

## Controls

| Key / input      | Action                                   |
|------------------|------------------------------------------|
| Click            | capture the mouse (pointer lock)         |
| Mouse            | look around (or hold LMB + drag)         |
| Mouse wheel      | zoom (camera FOV)                        |
| W A S D / arrows | walk / fly                               |
| Shift            | run / fly faster                         |
| Space / C        | rise / sink (bird mode)                  |
| F                | toggle bird mode / walk mode             |
| Esc              | release mouse                            |

The full control list is also shown in the overlay UI in the
right-bottom corner (see `js/ui.js`).

## File layout

| File                | Contents                                                       |
|---------------------|-----------------------------------------------------------------|
| `js/core.js`        | shared materials + geometry helpers (columns, roofs, arches…)   |
| `js/terrain.js`     | 7 hills, Tiber river, Campus Martius, flats, terrain mesh       |
| `js/roads.js`       | viae (Flaminia, Appia, Tiburtina, Sacra…), bridges, paving      |
| `js/walls.js`       | Aurelian walls circuit, towers, 12 named gates                 |
| `js/temples.js`     | Saturn, Vesta, Portunus, Capitoline Jupiter, Venus & Roma,     |
|                     | Serapis, Mars Ultor, Pantheon with dome & oculus                |
| `js/colosseum.js`   | Flavian Amphitheatre: tiered oval, arched facade, seating       |
| `js/circuses.js`    | Circus Maximus (spina, metae, obelisk, egg, carceres) +         |
|                     | Circus Flaminius                                                |
| `js/bathes.js`      | Caracalla, Diocletian, Constantine, Domus Aurea                |
| `js/buildings.js`   | Curia, Rostra, basilicas, Maxentius, Palatine palaces, insulae  |
| `js/obelisks.js`    | obelisks: Forum, Campus Martius, Circus spina                  |
| `js/columns.js`     | columns of Trajan, Marcus Aurelius, Phocas                      |
| `js/arches.js`      | arches of Titus, Septimius Severus, Constantine, Claudius       |
| `js/aqueducts.js`   | Aqua Claudia, Alsietina, Marcia (piers, arches, water channel) |
| `js/fountains.js`   | tiered fountains + nymphaeum                                    |
| `js/villas.js`      | suburban villas: atrium/impluvium, peristyle, pars rustica     |
| `js/ui.js`          | overlay UI, right-bottom controls panel                         |
| `js/main.js`        | scene, lighting, player controller (walk + bird modes)          |
| `server.js`         | static web server on 192.168.1.103:7998                        |
| `smoke-test.js`     | headless runtime test of all modules (`node smoke-test.js`)     |
