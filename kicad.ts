//#!tsc --target ES6 --module commonjs kicad.ts && node kicad.js
// typings install ds~node
///<reference path="./typings/index.d.ts"/>

import { Transform, Rect } from "./kicad_common";
import { CanvasPlotter } from "./kicad_plotter";
import { Library } from "./kicad_lib";

const fs = require('fs');

// const content = fs.readFileSync('../project/keyboard-schematic/Root-cache.lib', 'utf-8')
{
	const content = fs.readFileSync('/Library/Application Support/kicad/library/device.lib', 'utf-8')
	const lib = Library.load(content);
	const component = lib.findByName("CP1");
	console.log(component);
	console.log(component.draw);
}
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
const content = fs.readFileSync('/Library/Application Support/kicad/library/device.lib', 'utf-8')
const lib = Library.load(content);

// const component = lib.findByName("INDUCTOR");
// const component = lib.findByName("JUMPER3");
// const component = lib.findByName("LED_RGB");
// const component = lib.findByName("Led_x2");

const plotter = new CanvasPlotter(ctx);
plotter.plotComponent(lib.findByName("Coded_Switch"), 1, 1, { x: 500, y: 500 }, new Transform());
plotter.plotComponent(lib.findByName("LED_RGB"), 1, 1, { x: 1500, y: 500 }, new Transform());
plotter.plotComponent(lib.findByName("ZENER"), 1, 1, { x: 500, y: 1500 }, new Transform());
plotter.plotComponent(lib.findByName("TVS"), 1, 1, { x: 1500, y: 1500 }, new Transform());

const out = fs.createWriteStream(__dirname + '/text.png'), stream = canvas.pngStream();

stream.on('data', function (chunk: any) {
	out.write(chunk);
});

stream.on('end', function(){
	console.log('saved png');
});
