//#!tsc && NODE_PATH=dist/src node dist/sketch3.js 


import {
	PCB,
	Board,
	Module,
} from "./src/kicad_pcb";

import {
	BoardItemPlotter,
} from "./src/kicad_pcb_plotter";

import {
	Plotter,
	SVGPlotter,
} from "./src/kicad_plotter";

// console.log(Foo["xxx" as Foo]);


import * as fs from "fs";
// const content = fs.readFileSync('../keyboard-schematic/Main.kicad_pcb', 'utf-8');
const content = fs.readFileSync('../../KiCad/footprint.pretty/ESP-WROOM-32.kicad_mod', 'utf-8');


const item = PCB.load(content);
if (item instanceof Board) {
} else
if (item instanceof Module) {
	console.log(item.pads);
}
