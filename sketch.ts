//#!tsc && NODE_PATH=dist/src node dist/sketch.js 

import { Transform } from "kicad_common";
import { CanvasPlotter, SVGPlotter } from "kicad_plotter";
import { Library } from "kicad_lib";
import { Schematic } from "kicad_sch";

import * as fs from "fs";

function ensure<T>(arg: T | null | undefined): T {
	if (!arg) throw "arg is falsy";
	return arg;
}

{ // do sch
//	const lib = Library.load(fs.readFileSync('../keyboard-schematic/Root-cache.lib', 'utf-8'));
//	const sch = Schematic.load(fs.readFileSync('../keyboard-schematic/Root.sch', 'utf-8'));
//	const lib = Library.load(fs.readFileSync('../keyboard-schematic/KeyModule-L-cache.lib', 'utf-8'));
//	const sch = Schematic.load(fs.readFileSync('../keyboard-schematic/KeyModule-L.sch', 'utf-8'));
	const lib = Library.load(fs.readFileSync('../keyboard-schematic/Root-cache.lib', 'utf-8'));
	const sch = Schematic.load(fs.readFileSync('../keyboard-schematic/_keymodule_l.sch', 'utf-8'));
//	const lib = Library.load(fs.readFileSync('../schematic-test/schematic-test-cache.lib', 'utf-8'));
//	const sch = Schematic.load(fs.readFileSync('../schematic-test/file59827D42.sch', 'utf-8'));
//	const sch = Schematic.load(fs.readFileSync('../schematic-test/schematic-test.sch', 'utf-8'));
	console.log(sch);
	console.log(lib.findByName("GND"));

	const MAX_WIDTH = 1920 * 2;
	const MAX_HEIGHT = 1080 * 2;

	const scale = Math.min(MAX_WIDTH / sch.descr.width, MAX_HEIGHT / sch.descr.height);


	const Canvas = require('canvas');

	const canvas = Canvas.createCanvas ? Canvas.createCanvas(sch.descr.width * scale, sch.descr.height * scale) : new Canvas(sch.descr.width * scale, sch.descr.height * scale);
	const ctx = canvas.getContext('2d');
	console.log(scale, canvas);
	ctx.fillStyle = "#fff";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.translate(0, 0);
	ctx.scale(scale, scale);

	const plotter = new CanvasPlotter(ctx);
	plotter.translate(-sch.descr.width, 0);
	plotter.scale(-1, 1);
	// plotter.plotLibComponent(lib.findByName("RJ45"), 1, 1, { x: 500, y: 500 }, new Transform(0, 1, 1, 0));
	plotter.plotSchematic(sch, [ lib ]);

	const out = fs.createWriteStream('text.png'), stream = canvas.pngStream();

	stream.on('data', function (chunk: any) {
		out.write(chunk);
	});

	stream.on('end', function(){
		console.log('saved png');
	});

	const svgPlotter = new SVGPlotter();
	svgPlotter.translate(-sch.descr.width, 0);
	svgPlotter.scale(-1, 1);
	svgPlotter.plotSchematic(sch, [ lib ]);

	let dpi = 72; // 72 dpi == 72000 dot/mil
	// sch.descr.{width,height} is mil
	// 1000mil = 1inch = 72dot

	fs.writeFileSync("text.svg", svgPlotter.output);
}

/*
//{
//	const content = fs.readFileSync('/Library/Application Support/kicad/library/74xx.lib', 'utf-8')
//	const lib = Library.load(content);
//	const component = lib.findByName("74LS00");
//	console.log(component);
//	console.log(component.draw);
//};

const Canvas = require('canvas');
const canvas = new Canvas(2000, 2000);

const ctx = canvas.getContext('2d');
const content = fs.readFileSync('../keyboard-schematic/Root-cache.lib', 'utf-8')
const lib = Library.load(content);

// const component = lib.findByName("INDUCTOR");
// const component = lib.findByName("JUMPER3");
// const component = lib.findByName("LED_RGB");
// const component = lib.findByName("Led_x2");

const plotter = new CanvasPlotter(ctx);
plotter.plotLibComponent(ensure(lib.findByName("Battery")), 1, 1, { x: 500, y: 500 }, new Transform());

const out = fs.createWriteStream('text.png'), stream = canvas.pngStream();

stream.on('data', function (chunk: any) {
	out.write(chunk);
});

stream.on('end', function(){
	console.log('saved png');
});
*/
