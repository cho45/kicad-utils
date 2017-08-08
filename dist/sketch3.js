"use strict";
//#!tsc && NODE_PATH=dist/src node dist/sketch3.js 
Object.defineProperty(exports, "__esModule", { value: true });
const kicad_pcb_1 = require("./src/kicad_pcb");
// console.log(Foo["xxx" as Foo]);
const fs = require("fs");
// const content = fs.readFileSync('../keyboard-schematic/Main.kicad_pcb', 'utf-8');
const content = fs.readFileSync('../../KiCad/footprint.pretty/ESP-WROOM-32.kicad_mod', 'utf-8');
const item = kicad_pcb_1.PCB.load(content);
if (item instanceof kicad_pcb_1.Board) {
}
else if (item instanceof kicad_pcb_1.Module) {
    console.log(item.pads);
}
//# sourceMappingURL=sketch3.js.map