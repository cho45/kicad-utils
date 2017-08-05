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
	const font = StrokeFont.instance;

	const width = 2000, height = 2000;
	const Canvas = require('canvas');
	const canvas = Canvas.createCanvas ? Canvas.createCanvas(width, height) : new Canvas(width, height);
	const ctx = canvas.getContext('2d');

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
	ctx.lineJoin = 'round';


	// ctx.translate(canvas.width / 2, canvas.height / 2);

	const plotter = new CanvasPlotter(ctx);

	const text = 'jeyjmcNV';
	const size = 100;
	const lineWidth = 20;
	const bold = false;
	const italic = false;
	const pos = { x: canvas.width / 2, y: canvas.height / 2 };
	const vjustify = TextVjustify.CENTER;

	{
		const boundingbox = font.computeStringBoundaryLimits(text, size, lineWidth, italic);
		ctx.save();
		ctx.translate(pos.x, pos.y);
		ctx.translate(0, size / 2);
		ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
		ctx.fillRect(0, 0, boundingbox.width, -boundingbox.height);
		ctx.fillStyle = "rgba(0, 0, 255, 0.3)";
		ctx.fillRect(0, 0, boundingbox.width, boundingbox.topLimit);
		ctx.fillRect(0, 0, boundingbox.width, boundingbox.bottomLimit);
		{
			const n = text.charCodeAt(0) - ' '.charCodeAt(0);
			const glyph = font.glyphs[n];
			console.log(JSON.stringify(glyph));
			ctx.fillStyle = "rgba(0, 255, 0, 0.3)";
			ctx.fillRect(
				glyph.boundingBox.pos1.x * size,
				glyph.boundingBox.pos1.y * size,
				glyph.boundingBox.width * size,
				glyph.boundingBox.height * size
			);
			ctx.restore();
		}
	}
	font.drawText(plotter, pos, text, size, lineWidth, TextAngle.HORIZ, TextHjustify.LEFT, vjustify, italic, bold);

	const out = fs.createWriteStream('text.png'), stream = canvas.pngStream();
	stream.on('data', function (chunk: any) {
		out.write(chunk);
	});
	stream.on('end', function(){
		console.log('saved png');
	});
}
