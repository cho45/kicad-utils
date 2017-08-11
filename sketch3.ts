//#!tsc && NODE_PATH=dist/src node dist/sketch3.js 

import {
	Fill,
	Color,
	Point,
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
	SVGPlotter,
	CanvasPlotter,
} from "./src/kicad_plotter";

// console.log(Foo["xxx" as Foo]);


import * as fs from "fs";
// const content = fs.readFileSync('../keyboard-schematic/Main.kicad_pcb', 'utf-8');
const content = fs.readFileSync('../keyboard-schematic/KeyModule-L.kicad_pcb', 'utf-8');
// const content = fs.readFileSync('../ledlight/ledlight.kicad_pcb', 'utf-8');
// const content = fs.readFileSync('../../KiCad/footprint.pretty/ESP-WROOM-32.kicad_mod', 'utf-8');
// const content = fs.readFileSync('../../../Documents/KiCAD/my/myfootprint.pretty/BLE_NANO.kicad_mod', 'utf-8');
// const content = fs.readFileSync('../../KiCad/footprint.pretty/RJ45-7810-XPXC.kicad_mod', 'utf-8');


//{
//	const plotter = new SVGPlotter();
//	plotter.scale(0.5, 0.5);
//	const pcbPlotter = new PCBPlotter(plotter);
//
//	const item = PCB.load(content);
//	if (item instanceof Board) {
//		plotter.pageInfo = item.pageInfo;
//		plotter.startPlot();
//		plotter.setColor(Color.BLACK);
//		plotter.rect(new Point(0, 0), new Point(plotter.pageInfo.width, plotter.pageInfo.height), Fill.FILLED_SHAPE, 1);
//		console.log(item);
//		pcbPlotter.layerMask =  new LSET(...item.visibleLayers);
//		pcbPlotter.plotStandardLayer(item);
//		pcbPlotter.plotBoardGraphicItems(item);
//
//		plotter.save();
//		plotter.translate(0, -2000);
//		pcbPlotter.layerMask = new LSET(PCB_LAYER_ID.F_Cu);
//		pcbPlotter.plotStandardLayer(item);
//		pcbPlotter.plotBoardGraphicItems(item);
//		plotter.restore();
//
//		plotter.save();
//		plotter.translate(0, item.pageInfo.height - 4500);
//		plotter.scale(1, -1);
//		pcbPlotter.layerMask = new LSET(PCB_LAYER_ID.B_Cu);
//		pcbPlotter.plotStandardLayer(item);
//		pcbPlotter.plotBoardGraphicItems(item);
//		plotter.restore();
//	} else
//	if (item instanceof Module) {
//		{
//			pcbPlotter.plotModule(item);
//			// pcbPlotter.flashPadCircle();
//		}
//	}
//	plotter.endPlot();
//	fs.writeFileSync("text.svg", plotter.output);
//}
{
	const width = 4000;
	const height = 4000;
	const Canvas = require('canvas');
	const canvas = Canvas.createCanvas ? Canvas.createCanvas(width, height) : new Canvas(width, height);
	const ctx = canvas.getContext('2d');
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.scale(0.5, 0.5);
	const plotter = new CanvasPlotter(ctx);
	plotter.setColor(Color.BLACK);

	const pcbPlotter = new PCBPlotter(plotter);

	const item = PCB.load(content);
	if (item instanceof Board) {
		console.log(item);
//		pcbPlotter.layerMask =  new LSET(...item.visibleLayers);
//		pcbPlotter.plotStandardLayer(item);
//		pcbPlotter.plotSilkScreen(item);

//		plotter.save();
//		plotter.translate(0, -2000);
//		pcbPlotter.plotBoardLayers(item, new LSET(
//			PCB_LAYER_ID.F_Cu,
//			PCB_LAYER_ID.F_Fab,
//			PCB_LAYER_ID.F_CrtYd,
//			PCB_LAYER_ID.F_Adhes,
//			PCB_LAYER_ID.F_Paste,
//			PCB_LAYER_ID.F_SilkS,
//			PCB_LAYER_ID.Dwgs_User,
//			PCB_LAYER_ID.Edge_Cuts,
//		));
//		plotter.restore();

		plotter.save();
		plotter.translate(0, item.pageInfo.height - 4500);
		plotter.scale(1, -1);
		pcbPlotter.plotBoardLayers(item, new LSET(
			PCB_LAYER_ID.B_Cu,
			PCB_LAYER_ID.B_Fab,
			PCB_LAYER_ID.B_CrtYd,
			PCB_LAYER_ID.B_Adhes,
			PCB_LAYER_ID.B_Paste,
			PCB_LAYER_ID.B_SilkS,
			PCB_LAYER_ID.Dwgs_User,
			PCB_LAYER_ID.Edge_Cuts,
		));
		plotter.restore();
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
}
