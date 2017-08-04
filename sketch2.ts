//#!tsc && NODE_PATH=dist/src node dist/sketch2.js 

import {
	Point,
	Rect,
	TextHjustify,
	TextVjustify,
	Transform,
	DECIDEG2RAD,
	TextAngle,
} from "./src/kicad_common";
import { StrokeFont } from "./src/kicad_strokefont";
import { Plotter, CanvasPlotter } from "./src/kicad_plotter";

import * as fs from "fs";
{
	const font = new StrokeFont();

	const n = '%'.charCodeAt(0) - ' '.charCodeAt(0);
	console.log(n);
	const glyph = font.glyphs[n];
	console.log(glyph);

	const width = 500, height = 500;
	const Canvas = require('canvas');
	const canvas = Canvas.createCanvas ? Canvas.createCanvas(width, height) : new Canvas(width, height);
	const ctx = canvas.getContext('2d');

	let size = 18;

	ctx.strokeStyle = "#666666";
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.moveTo(canvas.width / 2, 0);
	ctx.lineTo(canvas.width / 2, canvas.height);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(0, canvas.height / 2);
	ctx.lineTo(canvas.width, canvas.height / 2);
	ctx.stroke();
	ctx.lineCap = "round";

	// ctx.translate(canvas.width / 2, canvas.height / 2);

	const plotter = new CanvasPlotter(ctx);

	font.drawText(plotter, { x: canvas.width / 2, y: canvas.height / 2 }, 'foobar', 18, 3, TextAngle.VERT, TextHjustify.LEFT, TextVjustify.BOTTOM);

	const out = fs.createWriteStream('text.png'), stream = canvas.pngStream();
	stream.on('data', function (chunk: any) {
		out.write(chunk);
	});
	stream.on('end', function(){
		console.log('saved png');
	});
}
