//#!tsc && NODE_PATH=dist/src node dist/sketch3.js 


import {
	PCB
} from "./src/kicad_pcb";


// console.log(Foo["xxx" as Foo]);


import * as fs from "fs";
// const content = fs.readFileSync('../keyboard-schematic/Main.kicad_pcb', 'utf-8');
const content = fs.readFileSync('../../KiCad/footprint.pretty/ESP-WROOM-32.kicad_mod', 'utf-8');


const item = PCB.load(content);
console.log(item);
