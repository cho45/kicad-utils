/*
 * This program source code file is part of kicad-js.
 * Copyright (C) 2017 cho45 <cho45@lowreal.net>.
 *
 * And this program source code file is imported from KiCad, a free EDA CAD application.
 *
 * Original Author Copyright:
 *
 * Copyright (C) 2015 Jean-Pierre Charras, jaen-pierre.charras@gipsa-lab.inpg.com
 * Copyright (C) 1992-2017 KiCad Developers, see KiCAD AUTHORS.txt for contributors.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, you may find one here:
 * http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 * or you may search the http://www.gnu.org website for the version 2 license,
 * or you may write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA
 */

/**
 * KiCAD internal unit:
 *	length: mil (1/1000 inch)
 *	angles: decidegree (1/10 degrees)
 */

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

export function RotatePoint(p: Point, angle: number): Point {
	angle = NORMALIZE_ANGLE_POS(angle);
	if (angle === 0) {
		return p;
	}
	if ( angle === 900 ) {        /* sin = 1, cos = 0 */
		[p.x, p.y] = [p.y, -p.x]
	} else
	if ( angle == 1800 ) {  /* sin = 0, cos = -1 */
		[p.x, p.y] = [-p.x, -p.y]
	} else
	if ( angle == 2700 ) {  /* sin = -1, cos = 0 */
		[p.x, p.y] = [-p.y, p.x]
	} else {
		const fangle = DECIDEG2RAD( angle );
		const sinus = Math.sin( fangle );
		const cosinus = Math.cos( fangle );
		const rx = (p.y * sinus ) + (p.x * cosinus );
		const ry = (p.y * cosinus ) - (p.x * sinus );
		p.x = rx; p.y = ry;
	}
	return p;
}

export function MM2MIL(mm: number) {
	return mm / 0.0254;
}

export function MIL2MM(mil: number) {
	return mil * 0.0254;
}

export function ReadDelimitedText(s: string): string {
	const match = s.match(/"((?:\\"|[^"])+)"/);
	if (!match) return "";
	const inner = match[1];
	return inner.replace(/\\([\\"])/g, (_, c) => c);
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

	constructor(x: number = 0, y: number = 0) {
		this.x = x;
		this.y = y;
	}

	static add(p1: Point, p2: Point): Point {
		return {
			x: p1.x + p2.x,
			y: p1.y + p2.y,
		};
	}

	static sub(p1: Point, p2: Point): Point {
		return {
			x: p1.x - p2.x,
			y: p1.y - p2.y,
		};
	}

	static isZero(p: Point): boolean {
		return p.x === 0 && p.y === 0;
	}
}

export class Rect {
	pos1: Point;
	pos2: Point;

	constructor(pos1x: number, pos1y: number, pos2x: number, pos2y: number) {
		this.pos1 = new Point(pos1x, pos1y);
		this.pos2 = new Point(pos2x, pos2y);
	}

	getWidth(): number {
		return this.pos2.x - this.pos1.x;
	}

	getHeight(): number {
		return this.pos2.y - this.pos1.y;
	}

	merge(o: Rect): Rect {
		return new Rect(
			Math.min(this.pos1.x, o.pos1.x),
			Math.min(this.pos1.y, o.pos1.y),
			Math.max(this.pos2.x, o.pos2.x),
			Math.max(this.pos2.y, o.pos2.y)
		);
	}

	inflate(n: number): this {
		this.pos1.x -= n;
		this.pos1.y -= n;
		this.pos2.x += n;
		this.pos2.y += n;
		return this;
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
	RIGHT = "R",
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
	INPUT = "I",
	OUTPUT = "O",
	BIDI = "B",
	TRISTATE = "T",
	PASSIVE = "P",
	UNSPECIFIED = "U",
	POWER_IN = "W",
	POWER_OUT = "w",
	OPENCOLLECTOR = "C",
	OPENEMITTER = "E",
	NC = "N",
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

export enum SheetSide {
	RIGHT = "R",
	TOP = "T",
	BOTTOM = "B",
	LEFT = "L",
}

export enum Net {
	INPUT = "I",
	OUTPUT = "O",
	BIDI = "B",
	TRISTATE = "T",
	UNSPECIFIED = "U",
}
