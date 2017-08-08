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
// const content = fs.readFileSync('../keyboard-schematic/Main.kicad_pcb', 'utf-8');
const content = fs.readFileSync('../../KiCad/footprint.pretty/ESP-WROOM-32.kicad_mod', 'utf-8');


const item = PCB.load(content);
if (item instanceof Board) {
} else
if (item instanceof Module) {

	const width = 2000;
	const height = 2000;
	const Canvas = require('canvas');
	const canvas = Canvas.createCanvas ? Canvas.createCanvas(width, height) : new Canvas(width, height);
	const ctx = canvas.getContext('2d');
	ctx.fillStyle = "#fff";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.translate(1000, 1000);
	const plotter = new CanvasPlotter(ctx);
	plotter.setColor(Color.BLACK);

	{
		const pcbPlotter = new PCBPlotter(plotter);

		for (let pad of item.pads) {
			console.log(pad);
			if (pad.shape === PadShape.CIRCLE) {
				pcbPlotter.flashPadCircle(pad.pos, pad.size.width, Fill.NO_FILL);
			} else
			if (pad.shape === PadShape.RECT) {
				pcbPlotter.flashPadRect(pad.pos, pad.size, pad.orientation, Fill.FILLED_SHAPE);
			} else
			if (pad.shape === PadShape.OVAL) {
			} else
			if (pad.shape === PadShape.TRAPEZOID) {
			} else
			if (pad.shape === PadShape.ROUNDRECT) {
			}
		}
		// pcbPlotter.flashPadCircle();
	}

	const out = fs.createWriteStream('text.png'), stream = canvas.pngStream();
	stream.on('data', function (chunk: any) {
		out.write(chunk);
	});
	stream.on('end', function(){
		console.log('saved png');
	});
}
