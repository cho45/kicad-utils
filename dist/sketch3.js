"use strict";
//#!tsc && NODE_PATH=dist/src node dist/sketch3.js 
Object.defineProperty(exports, "__esModule", { value: true });
const kicad_pcb_1 = require("./src/kicad_pcb");
// console.log(Foo["xxx" as Foo]);
const fs = require("fs");
const content = fs.readFileSync('../keyboard-schematic/Main.kicad_pcb', 'utf-8');
/*
const content = `
(kicad_pcb (version 4) (host pcbnew 4.0.2-stable)

  (general # comment
    (links 24)
    (no_connects 0)
    (area 129.949999 77.949999 154.050001 137.050001)
    (thickness 1.6)
    (drawings 7)
    (tracks 80)
    (zones 0)
    (modules 14)
    (nets 18)
    (string "foo\\"bar")
  )


  (page A4)
  (layers
    (0 F.Cu signal)
    (31 B.Cu signal)
    (32 B.Adhes user)
    (33 F.Adhes user)
    (34 B.Paste user)
    (35 F.Paste user)
    (36 B.SilkS user)
    (37 F.SilkS user)
    (38 B.Mask user)
    (39 F.Mask user)
    (40 Dwgs.User user)
    (41 Cmts.User user)
    (42 Eco1.User user)
    (43 Eco2.User user)
    (44 Edge.Cuts user)
    (45 Margin user)
    (46 B.CrtYd user)
    (47 F.CrtYd user)
    (48 B.Fab user)
    (49 F.Fab user)
  )
)`;
*/
const pcb = kicad_pcb_1.PCB.load(content);
console.log(pcb.layerIndices);
console.log(pcb.layerMasks);
console.log(pcb.board);
//# sourceMappingURL=sketch3.js.map