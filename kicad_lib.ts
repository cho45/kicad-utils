//#!tsc --target ES6 --module commonjs kicad.ts && node kicad.js
// typings install ds~node
///<reference path="./typings/index.d.ts"/>

import {
	DECIDEG2RAD,
	RAD2DECIDEG,
	NORMALIZE_ANGLE_POS,
	DEFAULT_LINE_WIDTH,

	Fill,
	TextHjustify,
	TextVjustify,
	PinOrientation,
	TextAngle,
	PinType,
	PinAttribute,

	Transform,
	Point,
} from "./kicad_common.js";

export class Library {
	components: Array<Component>;

	static load(content: string): Library {
		const lines = content.split(/\n/);
		const lib = new this();
		lib.parse(lines);
		return lib;
	}

	constructor() {
		this.components = [];
	}

	parse(lines: Array<string>): void {
		let line;

		const version = lines.shift();
		if (version.indexOf('EESchema-LIBRARY Version 2.3') !== 0) {
			throw "unknwon library format";
		}

		while (line = lines.shift()) {
			if (line[0] === '#') continue;
			const tokens = line.split(/ +/);
			if (tokens[0] === 'DEF') {
				this.components.push(new Component(tokens.slice(1)).parse(lines));
			} else {
				throw 'unknown token ' + tokens[0];
			}
		}
	}

	findByName(name: string) : Component {
		return this.components.find( (i) => i.name === name);
	}
}

export class Component {
	draw: Draw;
	fplist: Array<string>;
	aliases: Array<string>;
	field: Field0;
	fields: Array<FieldN>;

	name: string;
	reference: string;
	textOffset: number;
	drawPinnumber: boolean;
	drawPinname: boolean;
	unitCount: number;
	unitsLocked: boolean;
	optionFlag: string;

	constructor(params: Array<string>) {
		this.name = params[0];
		this.reference = params[1];
		this.textOffset = Number(params[3]);
		this.drawPinnumber = params[4] === 'Y';
		this.drawPinname   = params[5] === 'Y';
		this.unitCount     = Number(params[6]);
		this.unitsLocked = params[7] === 'Y';
		this.optionFlag = params[8];
		this.fields = [];
	}

	parse(lines: Array<string>): this {
		let line;
		while (line = lines.shift()) {
			if (line === 'ENDDEF') break;
			const tokens = line.split(/ +/);
			if (tokens[0] === 'DRAW') {
				this.draw = new Draw().parse(lines);
			} else
			if (tokens[0] === 'ALIAS') {
				this.aliases = tokens.slice(1);
			} else
			if (tokens[0] === 'F0') {
				this.field = new Field0(tokens.slice(1));
			} else
			if (tokens[0].match(/^F\d+/)) {
				this.fields.push(new FieldN(tokens.slice(1)));
			} else
			if (tokens[0] === '$FPLIST') {
				this.fplist = [];
				while (line = lines.shift()) {
					if (line === '$ENDFPLIST') break;
					this.fplist.push(tokens[0]);
				}
			} else {
				throw 'unknown token ' + tokens[0];
			}
		}
		return this;
	}
}

export class Field0 {
	reference: string;
	posx: number;
	posy: number;
	textSize: number;
	textOrientation: number;
	visibility: string;
	htextJustify: string;
	vtextJustify: string;

	constructor(params: Array<string>) {
		this.reference = params[0].replace(/^"|"$/g, '');
		this.posx = Number(params[1]);
		this.posy = Number(params[2]);
		this.textSize = Number(params[3]);
		this.textOrientation = params[4] === 'H' ? TextAngle.HORIZ : TextAngle.VERT;
		this.visibility = params[5];
		this.htextJustify = params[6];
		this.vtextJustify = params[7];
	}
}

export class FieldN {
	name: string;
	posx: number;
	posy: number;
	textSize: number;
	textOrientation: number;
	visibility: string;
	htextJustify: string;
	vtextJustify: string;
	fieldname: string;

	constructor(params: Array<string>) {
		this.name = params[0].replace(/''/g, '"').replace(/~/g, ' ').replace(/^"|"$/g, '');
		this.posx = Number(params[1]);
		this.posy = Number(params[2]);
		this.textSize = Number(params[3]);
		this.textOrientation = params[4] === 'H' ? TextAngle.HORIZ : TextAngle.VERT;
		this.visibility = params[5];
		this.htextJustify = params[6];
		this.vtextJustify = params[7];
		this.fieldname = params[8];
	}
}

export class Draw {
	objects: Array<DrawObject> = [];

	constructor() {
	}

	parse(lines: Array<string>): this {
		let line;
		while (line = lines.shift()) {
			if (line === 'ENDDRAW') break;
			const tokens = line.split(/ +/);
			if (tokens[0] === 'A') { // ARC
				this.objects.push(new DrawArc(tokens.slice(1)));
			} else
			if (tokens[0] === 'C') { // CIRCLE
				this.objects.push(new DrawCircle(tokens.slice(1)));
			} else
			if (tokens[0] === 'P') { // POLYLINE
				this.objects.push(new DrawPolyline(tokens.slice(1)));
			} else
			if (tokens[0] === 'S') { // SQUEARE
				this.objects.push(new DrawSquare(tokens.slice(1)));
			} else
			if (tokens[0] === 'T') { // TEXT
				this.objects.push(new DrawText(tokens.slice(1)));
			} else
			if (tokens[0] === 'X') { // PIN
				this.objects.push(new DrawPin(tokens.slice(1)));
			} else {
				throw "unknown token " + tokens[0];
			}
		}
		return this;
	}
}

abstract class DrawObject {
	/**
	 * Unit identification for multiple parts per package.  Set to 0 if the
	 * item is common to all units.
	 */
	unit: number;

	/**
	 * Shape identification for alternate body styles.  Set 0 if the item
	 * is common to all body styles.  This is commonly referred to as
	 * DeMorgan style and this is typically how it is used in KiCad.
	 */
	convert: number;

	fill: Fill;
}

export class DrawArc extends DrawObject {
	posx: number;
	posy: number;
	radius: number;
	startAngle: number; // First radius angle of the arc in 0.1 degrees. 
	endAngle: number; // Second radius angle of the arc in 0.1 degrees. 
	lineWidth: number;
	startx: number;
	starty: number;
	endx: number;
	endy: number;

	constructor(params: Array<string>) {
		super();
		this.posx = Number(params[0]);
		this.posy = Number(params[1]);
		this.radius = Number(params[2]);
		this.startAngle = Number(params[3]);
		this.endAngle = Number(params[4]);
		this.unit = Number(params[5]);
		this.convert = Number(params[6]);
		this.lineWidth = Number(params[7]);
		this.fill = params[8] as Fill || Fill.NO_FILL;
		this.startx = Number(params[9]);
		this.starty = Number(params[10]);
		this.endx = Number(params[11]);
		this.endy = Number(params[12]);
	}
}

export class DrawCircle extends DrawObject {
	posx: number;
	posy: number;
	radius: number;
	lineWidth: number;
	constructor(params: Array<string>) {
		super();
		this.posx = Number(params[0]);
		this.posy = Number(params[1]);
		this.radius = Number(params[2]);
		this.unit = Number(params[3]);
		this.convert = Number(params[4]);
		this.lineWidth = Number(params[5]);
		this.fill = params[6] as Fill || Fill.NO_FILL;
	}
}

export class DrawPolyline extends DrawObject {
	pointCount: number;
	lineWidth: number;
	points: Array<number>;
	constructor(params: Array<string>) {
		super();
		this.pointCount = Number(params[0]);
		this.unit = Number(params[1]);
		this.convert = Number(params[2]);
		this.lineWidth = Number(params[3]);
		this.points = params.slice(4, 4 + (this.pointCount * 2)).map( (i) => Number(i) );
		this.fill = params[4 + (this.pointCount * 2)] as Fill || Fill.NO_FILL;
	}
}

export class DrawSquare extends DrawObject {
	startx: number;
	starty: number;
	endx: number;
	endy: number;
	lineWidth: number;
	constructor(params: Array<string>) {
		super();
		this.startx = Number(params[0]);
		this.starty = Number(params[1]);
		this.endx = Number(params[2]);
		this.endy = Number(params[3]);
		this.unit = Number(params[4]);
		this.convert = Number(params[5]);
		this.lineWidth = Number(params[6]);
		this.fill = params[7] as Fill || Fill.NO_FILL;
	}
}

export class DrawText extends DrawObject {
	angle: number;
	posx: number;
	posy: number;
	textSize: number;
	textType: number;
	text: string;
	italic: boolean;
	bold: boolean;
	hjustify: TextHjustify;
	vjustify: TextVjustify;
	constructor(params: Array<string>) {
		super();
		this.angle = Number(params[0]);
		this.posx = Number(params[1]);
		this.posy = Number(params[2]);
		this.textSize = Number(params[3]);
		this.textType = Number(params[4]);
		this.unit = Number(params[5]);
		this.convert = Number(params[6]);
		this.text = params[7].replace(/''/g, '"').replace(/~/g, ' ').replace(/^"|"$/g, '');
		this.italic = params[8] === 'Italic';
		this.bold = Number(params[9]) > 0;
		this.hjustify = params[10] as TextHjustify;
		this.vjustify = params[11] as TextVjustify;
	}
}

export class DrawPin extends DrawObject {
	name: string;
	num: string;
	posx: number;
	posy: number;
	length: number;
	orientation: PinOrientation;
	nameTextSize: number;
	numTextSize: number;
	pinType: PinType;
	attributes: Array<PinAttribute>;

	constructor(params: Array<string>) {
		super();
		this.name = params[0];
		this.num = params[1];
		this.posx = Number(params[2]);
		this.posy = Number(params[3]);
		this.length = Number(params[4]);
		this.orientation = params[5] as PinOrientation;
		this.nameTextSize = Number(params[6]);
		this.numTextSize = Number(params[7]);
		this.unit = Number(params[8]);
		this.convert = Number(params[9]);
		this.pinType = params[10] as PinType;
		this.attributes = (params[11] || '').split('') as Array<PinAttribute>;
	}
}

