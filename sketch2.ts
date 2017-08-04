//#! NODE_PATH=dist/src node dist/sketch2.js 

import { Point, Rect } from "./src/kicad_common";
import { STROKE_FONT } from "./src/kicad_strokefont";

const INTERLINE_PITCH_RATIO = 1.5;
const OVERBAR_POSITION_FACTOR = 1.22;
const BOLD_FACTOR = 1.3;
const STROKE_FONT_SCALE = 1.0 / 21.0;
const ITALIC_TILT = 1.0 / 8;

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
				console.log(point);
				rect = rect.merge(new Rect(0, 0, this.endX - this.startX, point.y).normalize());
			}
		}
		this.boundingBox = rect;
	}
}


const glyphs : Array< Glyph > = [];
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
				glyph.lines.push(points);
				points.length = 0;
			}
		} else {
			const x = (def.charCodeAt(i) - SERIALIZE_OFFSET) * STROKE_FONT_SCALE - glyphStartX;
			const y = (def.charCodeAt(i + 1) - SERIALIZE_OFFSET + FONT_OFFSET) * STROKE_FONT_SCALE;

			points.push(new Point(x, y));
		}
	}

	glyph.startX = glyphStartX;
	glyph.endX = glyphEndX;

	glyphs.push(glyph);
}

const glyph = glyphs['A'.charCodeAt(0) - ' '.charCodeAt(0)];
glyph.computeBoundingBox();
console.log(glyph);

