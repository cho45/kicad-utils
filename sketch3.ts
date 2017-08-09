//#!tsc && NODE_PATH=dist/src node dist/sketch3.js 

import {
	Fill,
	Color,
} from "./src/kicad_common";

import {
	PCB,
	Board,
	Module,
	PadShape,
	LSET,
	PCB_LAYER_ID,
} from "./src/kicad_pcb";

import {
	PCBPlotter,
} from "./src/kicad_pcb_plotter";

import {
	Plotter,
	CanvasPlotter,
} from "./src/kicad_plotter";

// console.log(Foo["xxx" as Foo]);


import * as fs from "fs";
const content = fs.readFileSync('../keyboard-schematic/Main.kicad_pcb', 'utf-8');
// const content = fs.readFileSync('../../KiCad/footprint.pretty/ESP-WROOM-32.kicad_mod', 'utf-8');
// const content = fs.readFileSync('../../../Documents/KiCAD/my/myfootprint.pretty/BLE_NANO.kicad_mod', 'utf-8');
// const content = fs.readFileSync('../../KiCad/footprint.pretty/RJ45-7810-XPXC.kicad_mod', 'utf-8');

const width = 4000;
const height = 4000;
const Canvas = require('canvas');
const canvas = Canvas.createCanvas ? Canvas.createCanvas(width, height) : new Canvas(width, height);
const ctx = canvas.getContext('2d');
ctx.fillStyle = "#fff";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.scale(0.5, 0.5);
const plotter = new CanvasPlotter(ctx);
plotter.setColor(Color.BLACK);

const pcbPlotter = new PCBPlotter(plotter);

const item = PCB.load(content);
if (item instanceof Board) {
	console.log(item);
	// pcbPlotter.plotStandardLayer(item, new LSET(PCB_LAYER_ID.F_Cu));
	pcbPlotter.plotStandardLayer(item, new LSET(...item.visibleLayers));
} else
if (item instanceof Module) {
	{
		pcbPlotter.plotModule(item);
		// pcbPlotter.flashPadCircle();
	}
}

const out = fs.createWriteStream('text.png'), stream = canvas.pngStream();
stream.on('data', function (chunk: any) {
	out.write(chunk);
});
stream.on('end', function(){
	console.log('saved png');
});
