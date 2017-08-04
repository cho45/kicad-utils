//#! NODE_PATH=dist/src node dist/sketch2.js 

import {
	Point,
	Rect,
	TextHjustify,
	TextVjustify,
} from "./src/kicad_common";
import { STROKE_FONT } from "./src/kicad_strokefont";
import { Plotter, CanvasPlotter } from "./src/kicad_plotter";

const INTERLINE_PITCH_RATIO = 1.5;
const OVERBAR_POSITION_FACTOR = 1.22;
const BOLD_FACTOR = 1.3;
const STROKE_FONT_SCALE = 1.0 / 21.0;
const ITALIC_TILT = 1.0 / 8;

// common/drawtxt.cpp
// common/gal/stroke_font.cpp
class Glyph {
	lines: Array< Array<Point> >;
	startX: number;
	endX: number;
	boundingBox: Rect;

	constructor() {
		this.lines = [];
	}

	computeBoundingBox() {
		let points: Array<Point> = [];
		let rect = new Rect(0, 0, this.endX - this.startX, 0);
		for (let line of this.lines) {
			for (let point of line) {
				rect = rect.merge(new Rect(0, 0, this.endX - this.startX, point.y).normalize());
			}
		}
		this.boundingBox = rect;
	}
}

class TransformMatrix {
	constructor(
		public xx:number = 1,
		public yx:number = 0,
		public xy:number = 0,
		public yy:number = 1,
		public tx:number = 0,
		public ty:number = 0
	) {
	}

	static identify() {
		return new TransformMatrix(
			1, 0,
			0, 1,
			0, 0
		);
	}

	static translate(tx: number, ty: number) {
		return new TransformMatrix(
			1, 0,
			0, 1,
			tx, ty
		);
	}

	static scale(sx:number, sy: number) {
		return new TransformMatrix(
			sx, 0,
			0, sy,
			0,  0
		);
	}

	static rotate(radian: number) {
		const s = Math.sin(radian);
		const c = Math.cos(radian);
		return new TransformMatrix(
			 c,  s,
			-s,  c,
			 0,  0
		);
	}

	translate(tx: number, ty: number) {
		return this.multiply(TransformMatrix.translate(tx, ty));
	}

	scale(sx: number, sy: number) {
		return this.multiply(TransformMatrix.scale(sx, sy));
	}

	rotate(radian: number) {
		return this.multiply(TransformMatrix.rotate(radian));
	}

	multiply(b: TransformMatrix): TransformMatrix {
		const a = this;

		return new TransformMatrix(
			a.xx * b.xx + a.yx * b.xy,
			a.xx * b.yx + a.yx * b.yy,

			a.xy * b.xx + a.yy * b.xy,
			a.xy * b.yx + a.yy * b.yy,

			a.tx * b.xx + a.ty * b.xy + b.tx,
			a.tx * b.yx + a.ty * b.yy + b.ty,
		);
	}

	transformPoint(p: Point): Point {
		const x = (this.xx * p.x + this.xy * p.y) + this.tx;
		const y = (this.yx * p.x + this.yy * p.y) + this.ty;
		return new Point(x, y);
	}
}

class GAL {
	history: Array<any>;

	constructor() {
	}

	save() {
	}

	restore() {
	}

	translate() {
	}

	scale() {
	}

	rotate() {
	}
}

class StrokeFont {
	glyphs : Array< Glyph > = [];

	constructor() {
		for (let def of STROKE_FONT) {
			const glyph = new Glyph();
			let points: Array<Point> = [];

			const SERIALIZE_OFFSET = 'R'.charCodeAt(0);
			const FONT_OFFSET = -10;

			const glyphStartX = (def.charCodeAt(0) - SERIALIZE_OFFSET) * STROKE_FONT_SCALE;
			const glyphEndX = (def.charCodeAt(1) - SERIALIZE_OFFSET) * STROKE_FONT_SCALE;

			for (let i = 2; i < def.length; i += 2) {
				if (def[i] === ' ' && def[i+1] === 'R') {
					// raise pen
					if (points.length) {
						glyph.lines.push(points.slice(0));
						points.length = 0;
					}
				} else {
					const x = (def.charCodeAt(i) - SERIALIZE_OFFSET) * STROKE_FONT_SCALE - glyphStartX;
					const y = (def.charCodeAt(i + 1) - SERIALIZE_OFFSET + FONT_OFFSET) * STROKE_FONT_SCALE;

					points.push(new Point(x, y));
				}
			}

			if (points.length) {
				glyph.lines.push(points.slice(0));
			}

			glyph.startX = glyphStartX;
			glyph.endX = glyphEndX;
			glyph.computeBoundingBox();

			this.glyphs.push(glyph);
		}
	}

	getInterline(size: number, lineWidth:number): number {
		return (size * INTERLINE_PITCH_RATIO ) + lineWidth;
	}

	drawLineText(plotter: Plotter, text: string, pos: Point, size: number, lineWidth: number, angle: number, hjustify: TextHjustify, vjustify: TextVjustify) {
	}
}


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

ctx.translate(canvas.width / 2, canvas.height / 2);
ctx.lineCap = "round";
ctx.lineWidth = 2;

function drawGlyph(p: Point, glyph: Glyph, size: number) {
	for (let line of glyph.lines) {
		ctx.beginPath();
		ctx.moveTo(line[0].x * size + p.x, line[0].y * size + p.y);
		for (let point of line) {
			ctx.lineTo(point.x * size + p.x, point.y * size + p.y);
		}
		ctx.stroke();
	}
}

function calcLine(line: string, size: number) {
	let width = 0;
	for (let i = 0, len = line.length; i < len; i++) {
		const c = line.charCodeAt(i);
		const n = c - ' '.charCodeAt(0);
		const glyph = font.glyphs[n];
		width += glyph.boundingBox.width * size;
	}
	return width;
}

function drawLine(p: Point, line: string, size: number, hjustify: TextHjustify) {
	let offset = 0;
	if (hjustify === TextHjustify.LEFT) {
		offset = 0;
	} else
	if (hjustify === TextHjustify.CENTER) {
		offset = -calcLine(line, size) / 2;
	} else
	if (hjustify === TextHjustify.RIGHT) {
		offset = -calcLine(line, size);
	}

	for (let i = 0, len = line.length; i < len; i++) {
		const c = line.charCodeAt(i);
		const n = c - ' '.charCodeAt(0);
		const glyph = font.glyphs[n];
		drawGlyph({ x: offset + p.x, y: p.y }, glyph, size);
		offset += glyph.boundingBox.pos2.x * size;
	}
}

function drawText(p: Point, text: string, size: number, hjustify: TextHjustify, vjustify: TextVjustify) {
	let offset = 0;
	const lines = text.split(/\n/);
	if (vjustify === TextVjustify.TOP) {
		offset = 0;
	} else
	if (vjustify === TextVjustify.CENTER) {
		offset = -(size * lines.length * INTERLINE_PITCH_RATIO) / 2;
	} else
	if (vjustify === TextVjustify.BOTTOM) {
		offset = -(size * lines.length * INTERLINE_PITCH_RATIO);
	}
	for (let line of lines) {
		drawLine({ x: p.x, y: p.y + offset}, line, size, hjustify);
		offset += size * INTERLINE_PITCH_RATIO + ctx.lineWidth;
	}
}

drawText({x: 0, y: 0}, "foobar@xxxx.xxx\nfoobar", 20, TextHjustify.CENTER, TextVjustify.CENTER);

import * as fs from "fs";

const plotter = new CanvasPlotter(ctx);

const out = fs.createWriteStream('text.png'), stream = canvas.pngStream();
stream.on('data', function (chunk: any) {
	out.write(chunk);
});
stream.on('end', function(){
	console.log('saved png');
});
