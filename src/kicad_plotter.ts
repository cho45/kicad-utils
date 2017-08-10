/*
 * This program source code file is part of kicad-utils.
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

import {
	DECIDEG2RAD,
	MM2MIL,
	RotatePoint,
	RotatePointWithCenter,

	Fill,
	TextHjustify,
	TextVjustify,
	PinOrientation,
	TextAngle,
	SheetSide,

	Transform,
	Point,
	Rect,
	Net,
	Color,
	ColorDefinition,
	PageInfo,
} from "./kicad_common";

import {
	StrokeFont
} from "./kicad_strokefont";

const DEFAULT_LINE_WIDTH = 6;

/**
 * similar to KiCAD Plotter
 *
 */
export abstract class Plotter {
	fill: Fill;
	color: Color;
	transform: Transform;
	stateHistory: Array<{
		fill: Fill,
		color: Color,
		transform: Transform,
	}> = [];
	font: StrokeFont;
	errors: Array<string> = [];
	pageInfo: PageInfo = PageInfo.A3;

	constructor() {
		this.fill = Fill.NO_FILL;
		this.color = Color.BLACK;
		this.transform = Transform.identify();
		this.font = StrokeFont.instance;
	}

	abstract circle(p: Point, dia: number, fill: Fill, width: number): void;
	abstract arc(p: Point, startAngle: number, endAngle: number, radius: number, fill: Fill, width: number): void;
	abstract penTo(p: Point, s: "U"|"D"|"Z"): void;
	abstract image(p: Point, scale: number, originalWidth:number, originalHeight:number, data: Uint8Array): void;

	abstract setCurrentLineWidth(w: number): void;

	setFill(fill : Fill) {
		this.fill = fill;
	}

	startPlot(): void {}
	endPlot(): void {}

	rect(p1: Point, p2: Point, fill: Fill, width: number) {
		this.setCurrentLineWidth(width);
		this.setFill(fill);
		this.moveTo(p1.x, p1.y);
		this.lineTo(p1.x, p2.y);
		this.lineTo(p2.x, p2.y);
		this.lineTo(p2.x, p1.y);
		this.finishTo(p1.x, p1.y);
	}

	polyline(points: Array<Point>, fill: Fill, width: number) {
		this.setCurrentLineWidth(width);
		this.setFill(fill);
		this.moveTo(points[0]);
		for (var i = 1, len = points.length; i < len; i++) {
			this.lineTo(points[i]);
		}
		this.finishPen();
	}

	text(
		p: Point,
		color: Color,
		text: string,
		orientation: number,
		size: number,
		hjustfy: TextHjustify,
		vjustify: TextVjustify,
		width: number,
		italic: boolean,
		bold: boolean,
		multiline?: boolean,
	): void {
		this.setColor(color);
		this.setFill(Fill.NO_FILL);
		this.font.drawText(
			this,
			p,
			text,
			size,
			width,
			orientation,
			hjustfy,
			vjustify,
			italic,
			bold
		);
	}

	save(): void {
		this.stateHistory.push({
			fill: this.fill,
			color: this.color,
			transform: this.transform.clone(),
		});
	}

	translate(tx: number, ty: number): void {
		this.transform = this.transform.translate(tx, ty);
	}

	scale(sx: number, sy: number): void {
		this.transform = this.transform.scale(sx, sy);
	}

	rotate(radian: number): void {
		this.transform = this.transform.rotate(radian);
	}

	restore(): void {
		const state = this.stateHistory.pop();
		Object.assign(this, state);
	}

	setColor(c: Color): void {
		this.color = c;
	}

	moveTo(p: Point): void;
	moveTo(x: number, y: number): void;
	moveTo(x: any, y?: number): void {
		if (typeof y === 'number') {
			this.penTo({x: x, y: y}, "U");
		} else {
			this.penTo(x, "U");
		}
	}

	lineTo(p: Point): void;
	lineTo(x: number, y: number): void;
	lineTo(x: any, y?: number): void {
		if (typeof y === 'number') {
			this.penTo({x: x, y: y}, "D");
		} else {
			this.penTo(x, "D");
		}
	}

	finishTo(p: Point): void;
	finishTo(x: number, y: number): void;
	finishTo(x: any, y?: number): void {
		if (typeof y === 'number') {
			this.penTo({x: x, y: y}, "D");
			this.penTo({x: x, y: y}, "Z");
		} else {
			this.penTo(x, "D");
			this.penTo(x, "Z");
		}
	}

	finishPen(): void {
		this.penTo({x: 0, y: 0}, "Z");
	}

}

export class CanvasPlotter extends Plotter {
	ctx : any;
	penState: "U"|"D"|"Z";

	constructor(ctx: any) {
		super();
		this.ctx = ctx;
		this.penState = "Z";
		this.setFill(Fill.NO_FILL);

		this.ctx.lineCap = "round";
		this.ctx.lineJoin = 'round';
		this.ctx.strokeStyle = "#000";
	}

	circle(p: Point, dia: number, fill: Fill, width: number): void {
		p = this.transform.transformCoordinate(p);
		this.setCurrentLineWidth(width);
		this.setFill(fill);
		this.ctx.beginPath();
		this.ctx.arc(p.x, p.y, dia / 2, 0, Math.PI * 2, false);
		if (fill === Fill.FILLED_SHAPE) {
			this.ctx.fill();
		} else {
			this.ctx.stroke();
		}
	}

	arc(p: Point, startAngle: number, endAngle: number, radius: number, fill: Fill, width: number): void {
		p = this.transform.transformCoordinate(p);
		this.setCurrentLineWidth(width);
		this.setFill(fill);
		this.ctx.beginPath();
		const anticlockwise = false;
		this.ctx.arc(p.x, p.y, radius, startAngle / 10 * Math.PI / 180, endAngle / 10 * Math.PI / 180, anticlockwise);
		if (fill === Fill.FILLED_SHAPE) {
			this.ctx.fill();
		} else {
			this.ctx.stroke();
		}
	}

	/*
	text(
		p: Point,
		color: Color,
		text: string,
		orientation: number,
		size: number,
		hjustfy: TextHjustify,
		vjustify: TextVjustify,
		width: number,
		italic: boolean,
		bold: boolean,
		multiline?: boolean,
	): void {
		p = this.transform.transformCoordinate(p);
		this.setColor(color);
		if (hjustfy === TextHjustify.LEFT) {
			this.ctx.textAlign = "left";
		} else
		if (hjustfy === TextHjustify.CENTER) {
			this.ctx.textAlign = "center";
		} else
		if (hjustfy === TextHjustify.RIGHT) {
			this.ctx.textAlign = "right";
		}
		if (vjustify === TextVjustify.TOP) {
			this.ctx.textBaseline = "top";
		} else
		if (vjustify === TextVjustify.CENTER) {
			this.ctx.textBaseline = "middle";
		} else
		if (vjustify === TextVjustify.BOTTOM) {
			this.ctx.textBaseline = "bottom";
		}
		this.ctx.fillStyle = this.color.toCSSColor();
		this.ctx.save();
		this.ctx.translate(p.x, p.y);
		this.ctx.rotate(-DECIDEG2RAD(orientation));
		this.ctx.font = (italic ? "italic " : "") + (bold ? "bold " : "") + size + "px monospace";
		// console.log('fillText', text, p.x, p.y, hjustfy, vjustify);
		this.ctx.fillText(text, 0, 0);
		this.ctx.restore();
	} */

	/**
	 * U = Pen is up
	 * D = Pen is down
	 * Z = Pen is outof canvas
	 */
	penTo(p: Point, s: "U"|"D"|"Z"): void {
		p = this.transform.transformCoordinate(p);
		if (s === "Z") {
			if (this.fill === Fill.FILLED_SHAPE) {
				// console.log('ctx.fill', p);
				this.ctx.fill();
			} else {
				// console.log('ctx.stroke', p);
				this.ctx.stroke();
			}
			this.penState = "Z";
			return;
		}

		// s is U | D

		if (this.penState === "Z") {
			this.ctx.beginPath();
			// console.log('ctx.beginPath');
			// console.log('ctx.moveTo', p);
			this.ctx.moveTo(p.x, p.y);
		} else {
			if (s === "U") {
				// console.log('ctx.moveTo', p);
				this.ctx.moveTo(p.x, p.y);
			} else {
				// console.log('ctx.lineTo', p);
				this.ctx.lineTo(p.x, p.y);
			}
		}

		this.penState = s;
	} 

	setColor(c: Color): void {
		super.setColor(c);
		this.ctx.fillStyle = c.toCSSColor();
		this.ctx.strokeStyle = c.toCSSColor();
	}

	setCurrentLineWidth(w: number): void {
		this.ctx.lineWidth = w;
	}

	image(p: Point, scale: number, originalWidth:number, originalHeight:number, data: Uint8Array): void {
		p = this.transform.transformCoordinate(p);
		const start = Point.sub(p, { x: originalWidth / 2, y: originalHeight / 2 });
		const end = Point.add(p, { x: originalWidth / 2, y: originalHeight / 2 });
		this.rect(start, end, Fill.NO_FILL, DEFAULT_LINE_WIDTH);
	}
}

export class SVGPlotter extends Plotter {
	penState: "U"|"D"|"Z";
	lineWidth: number;
	output: string;
	
	static font = {
		family: '"Lucida Console", Monaco, monospace',
		widthRatio: 0.60009765625,
	};

	constructor() {
		super();
		this.penState = "Z";
		this.output = "";
		this.lineWidth = DEFAULT_LINE_WIDTH;
		this.color = Color.BLACK;
	}

	circle(p: Point, dia: number, fill: Fill, width: number): void {
		this.setCurrentLineWidth(width);
		this.setFill(fill);

		p = this.transform.transformCoordinate(p);

		dia = this.transform.transformScalar(dia);
		const lineWidth = this.transform.transformScalar(this.lineWidth);
		this.output += this.xmlTag `<circle cx="${p.x}" cy="${p.y}" r="${dia/2}" `;
		if (this.fill === Fill.NO_FILL) {
			this.output += this.xmlTag ` style="stroke: ${this.color.toCSSColor()}; fill: none; stroke-width: ${lineWidth}"/>\n`;
		} else {
			this.output += this.xmlTag ` style="stroke: ${this.color.toCSSColor()}; fill: ${this.color.toCSSColor()}; stroke-width: ${lineWidth}" />\n`;
		}
	}

	arc(p: Point, startAngle: number, endAngle: number, radius: number, fill: Fill, width: number): void {
		if (radius <= 0) return;
		if (startAngle > endAngle) {
			[startAngle, endAngle] = [endAngle, startAngle];
		}
		this.setCurrentLineWidth(width);
		this.setFill(fill);
		p = this.transform.transformCoordinate(p);

		[startAngle, endAngle] = [-endAngle, -startAngle];

		let start = new Point(radius, 0);
		RotatePoint(start, startAngle);
		let end = new Point(radius, 0);
		RotatePoint(end, endAngle);
		start = Point.add(start, p);
		end   = Point.add(end, p);

		let theta1 = DECIDEG2RAD(startAngle);
		if (theta1 < 0) theta1 += Math.PI * 2;

		let theta2 = DECIDEG2RAD(endAngle);
		if (theta2 < 0) theta2 += Math.PI * 2;

		if (theta2 < theta1) theta2 += Math.PI * 2;

		const isLargeArc = Math.abs(theta2 - theta1) > Math.PI;
		const isSweep = false;
		// console.log('ARC', startAngle, endAngle, radius, start, end, radius, isLargeArc, isSweep);

		radius = this.transform.transformScalar(radius);
		const lineWidth = this.transform.transformScalar(this.lineWidth);

		const x = this.xmlTag;
		this.output += this.xmlTag `<path d="M${start.x} ${start.y} A${radius} ${radius} 0.0 ${isLargeArc ? 1 : 0} ${isSweep ? 1 : 0} ${end.x} ${end.y}"`;
		if (this.fill === Fill.NO_FILL) {
			this.output += this.xmlTag ` style="stroke: ${this.color.toCSSColor()}; fill: none; stroke-width: ${lineWidth}" />\n`;
		} else {
			this.output += this.xmlTag ` style="stroke: ${this.color.toCSSColor()}; fill: ${this.color.toCSSColor()}; stroke-width: ${lineWidth}" />\n`;
		}
	}

	/*
	text(
		p: Point,
		color: Color,
		text: string,
		orientation: number,
		size: number,
		hjustfy: TextHjustify,
		vjustify: TextVjustify,
		width: number,
		italic: boolean,
		bold: boolean,
		multiline?: boolean,
	): void {
		this.setColor(color);
		p = this.transform.transformCoordinate(p);

		let textAnchor;
		if (hjustfy === TextHjustify.LEFT) {
			textAnchor = "start";
		} else
		if (hjustfy === TextHjustify.CENTER) {
			textAnchor = "middle";
		} else
		if (hjustfy === TextHjustify.RIGHT) {
			textAnchor = "end";
		}
		let dominantBaseline;
		if (vjustify === TextVjustify.TOP) {
			dominantBaseline = "text-before-edge";
		} else
		if (vjustify === TextVjustify.CENTER) {
			dominantBaseline = "middle";
		} else
		if (vjustify === TextVjustify.BOTTOM) {
			dominantBaseline = "text-after-edge";
		}

		const fontWeight = bold ? "bold" : "normal";
		const fontStyle = italic ? "italic" : "normal";

		const rotate = -orientation / 10;
		const x = this.xmlTag;
		const lines = text.split(/\n/);
		for (var i = 0, len = lines.length; i < len; i++) {
			const y = p.y + (i * size * 1.2);
			this.output += this.xmlTag `<text x="${p.x}" y="${y}"
				text-anchor="${textAnchor}"
				dominant-baseline="${dominantBaseline}"
				font-family="${SVGPlotter.font.family}"
				font-size="${size}"
				font-weight="${fontWeight}"
				font-style="${fontStyle}"
				stroke="none"
				fill="${this.color.toCSSColor()}"
				transform="rotate(${rotate}, ${p.x}, ${p.y})">${lines[i]}</text>`;
		}
	} */

	/**
	 * U = Pen is up
	 * D = Pen is down
	 * Z = Pen is outof canvas
	 */
	penTo(p: Point, s: "U"|"D"|"Z"): void {
		const x = this.xmlTag;
		p = this.transform.transformCoordinate(p);
		const lineWidth = this.transform.transformScalar(this.lineWidth);
		if (s === "Z") {
			if (this.penState !== "Z") {
				if (this.fill === Fill.NO_FILL) {
					this.output += this.xmlTag `" style="stroke: ${this.color.toCSSColor()}; fill: none; stroke-width: ${lineWidth}" />\n`;
				} else {
					this.output += this.xmlTag `" style="stroke: ${this.color.toCSSColor()}; fill: ${this.color.toCSSColor()}; stroke-width: ${lineWidth}" />\n`;
				}
			} else {
				throw "invalid pen state Z -> Z";
			}
			this.penState = "Z";
			return;
		}

		// s is U | D

		if (this.penState === "Z") {
			this.output += this.xmlTag `<path d="M${p.x} ${p.y}\n`;
		} else {
			if (s === "U") {
				this.output += this.xmlTag `M${p.x} ${p.y}\n`;
			} else {
				this.output += this.xmlTag `L${p.x} ${p.y}\n`;
			}
		}

		this.penState = s;
	} 

	setCurrentLineWidth(w: number): void {
		this.lineWidth = w;
	}

	image(p: Point, scale: number, originalWidth:number, originalHeight:number, data: Uint8Array): void {
		p = this.transform.transformCoordinate(p);
		const width = originalWidth * scale;
		const height = originalHeight * scale;
		const start = Point.sub(p, { x: width / 2, y: height / 2 });
		const url = 'data:image/png,' + data.reduce( (r, i) => r + '%' + (0x100 + i).toString(16).slice(1), "");
		console.log(url);

		/*
		this.rect(start, end, Fill.NO_FILL, DEFAULT_LINE_WIDTH);
		*/
		this.output += this.xmlTag `<image
			xlink:href="${url}"
			x="${start.x}"
			y="${start.y}"
			width="${this.transform.transformScalar(width)}"
			height="${this.transform.transformScalar(height)}"
			/>`;
	}

	startPlot() {
		const width  = this.pageInfo.width;
		const height = this.pageInfo.height;
		this.output = this.xmlTag `<svg preserveAspectRatio="xMinYMin"
			width="${this.transform.transformScalar(width)}"
			height="${this.transform.transformScalar(height)}"
			viewBox="0 0 ${width} ${height}"
			xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink"
			version="1.1">`;
		this.output += this.xmlTag `<g stroke-linejoin="round" stroke-linecap="round">`;
	}

	endPlot() {
		this.output += this.xmlTag `</g>`;
		this.output += `</svg>`;
	}

	xmlTag(literals: TemplateStringsArray, ...placeholders: Array<any>): string {
		let result = "";

		for (let i = 0; i < placeholders.length; i++) {
			result += literals[i];
			result += this.xmlentities(placeholders[i]);
		}

		result += literals[literals.length - 1];
		return result;
	}

	xmlentities(s: any): string {
		if (typeof s === "number") return String(s);

		const map : { [key: string]:string } = {
			'<': '&lt;',
			'>': '&gt;',
			'&': '&amp;',
			'"': '&x22;',
			"'": '&x27;',
		};
		return String(s).replace(/[<>&]/g, (_) => map[_] );
	}
}
