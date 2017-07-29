//#!tsc --target ES6 --module commonjs kicad.ts && node kicad.js
// typings install ds~node
///<reference path="./typings/index.d.ts"/>

export const DEFAULT_LINE_WIDTH = 6;

export function DECIDEG2RAD(deg: number): number {
	return deg * Math.PI / 1800;
}

export function RAD2DECIDEG(rad: number): number {
	return rad * 1800 / Math.PI;
}

export function NORMALIZE_ANGLE_POS(angle: number): number {
	while ( angle < 0 ) angle += 3600;
	while ( angle >= 3600 ) angle -= 3600;
	return angle;
}

export class Transform {
	constructor(public x1: number = 1, public y1: number = 0, public x2: number = 0, public y2: number = -1) {
	}

	transformCoordinate(p: Point): Point {
		return {
			x: (this.x1 * p.x) + (this.y1 * p.y),
			y: (this.x2 * p.x) + (this.y2 * p.y)
		};
	}

	mapAngles(angle1: number, angle2: number): Array<number> {
		let angle, delta;
		let x, y, t;
		let swap = 0;

		delta = angle2 - angle1;
		if( delta >= 1800 )
		{
			angle1 -= 1;
			angle2 += 1;
		}

		x = Math.cos( DECIDEG2RAD( angle1 ) );
		y = Math.sin( DECIDEG2RAD( angle1 ) );
		t = x * this.x1 + y * this.y1;
		y = x * this.x2 + y * this.y2;
		x = t;
		angle1 = Math.round( RAD2DECIDEG( Math.atan2( y, x ) ) );

		x = Math.cos( DECIDEG2RAD( angle2 ) );
		y = Math.sin( DECIDEG2RAD( angle2 ) );
		t = x * this.x1 + y * this.y1;
		y = x * this.x2 + y * this.y2;
		x = t;
		angle2 = Math.round( RAD2DECIDEG( Math.atan2( y, x ) ) );

		angle1 = NORMALIZE_ANGLE_POS( angle1 );
		angle2 = NORMALIZE_ANGLE_POS( angle2 );
		if( angle2 < angle1 )
			angle2 += 3600;

		if( angle2 - angle1 > 1800 ) // Need to swap the two angles
		{
			angle   = (angle1);
			angle1 = (angle2);
			angle2 = angle;

			angle1 = NORMALIZE_ANGLE_POS( angle1 );
			angle2 = NORMALIZE_ANGLE_POS( angle2 );
			if( angle2 < angle1 )
				angle2 += 3600;
			swap = 1;
		}

		if( delta >= 1800 )
		{
			angle1 += 1;
			angle2 -= 1;
		}

		return [angle1, angle2, swap];
	}
}

export class Point {
	x: number;
	y: number;

	static add(p1: Point, p2: Point): Point {
		return {
			x: p1.x + p2.x,
			y: p1.y + p2.y,
		};
	}
}

export enum Fill {
	NO_FILL = "N",
	FILLED_SHAPE = "F",
	FILLED_WITH_BG_BODYCOLOR = "f",
}

export enum TextHjustify {
	LEFT = "L",
	CENTER = "C",
	RIGHT =" R",
}

export enum TextVjustify {
	TOP = "T",
	CENTER = "C",
	BOTTOM = "B",
}

export enum PinOrientation {
	RIGHT = "R",
	LEFT = "L",
	UP = "U",
	DOWN = "D",
}

export enum TextAngle {
	HORIZ = 0,
	VERT = 900,
}

export enum PinType {
	PIN_INPUT = "I",
	PIN_OUTPUT = "O",
	PIN_BIDI = "B",
	PIN_TRISTATE = "T",
	PIN_PASSIVE = "P",
	PIN_UNSPECIFIED = "U",
	PIN_POWER_IN = "W",
	PIN_POWER_OUT = "w",
	PIN_OPENCOLLECTOR = "C",
	PIN_OPENEMITTER = "E",
	PIN_NC = "N",
};

export enum PinAttribute {
	NONE            = "~",
	INVERTED        = "I",
	CLOCK           = "C",
	LOWLEVEL_IN     = "L",
	LOWLEVEL_OUT    = "V",
	FALLING_EDGE    = "F",
	NONLOGIC        = "X",
	INVISIBLE       = "N",
}

