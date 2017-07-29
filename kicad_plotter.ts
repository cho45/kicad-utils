//#!tsc --target ES6 --noUnusedLocals --module commonjs kicad.ts && node kicad.js
// typings install ds~node
///<reference path="./typings/index.d.ts"/>

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

import {
	DECIDEG2RAD,
	DEFAULT_LINE_WIDTH,

	Fill,
	TextHjustify,
	TextVjustify,
	PinOrientation,
	TextAngle,

	Transform,
	Point,
} from "./kicad_common";

import {
	Component,
	DrawPin,
	DrawArc,
	DrawCircle,
	DrawPolyline,
	DrawSquare,
	DrawText,
} from "./kicad_lib";


/**
 * similar to KiCAD Plotter
 *
 */
export abstract class Plotter {
	fill: Fill;

	abstract rect(p1: Point, p2: Point, fill: Fill, width: number): void;
	abstract circle(p: Point, dia: number, fill: Fill, width: number): void;
	abstract arc(p: Point, startAngle: number, endAngle: number, radius: number, fill: Fill, width: number): void;
	abstract polyline(points: Array<Point>, fill: Fill, width: number): void;
	abstract setCurrentLineWidth(w: number): void;
	abstract penTo(p: Point, s: "U"|"D"|"Z"): void;
	abstract text(
		p: Point,
		color: string,
		text: string,
		orientation: number,
		size: number,
		hjustfy: TextHjustify,
		vjustify: TextVjustify,
		width: number,
		italic: boolean,
		bold: boolean,
		multiline?: boolean,
	): void;

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

	/**
	 * kicad-js implements plot methods to plotter instead of each library items.
	 */
	plotComponent(component: Component, unit: number, convert: number, offset: Point, transform: Transform): void {
		if (component.field) {
			const pos = Point.add(transform.transformCoordinate({ x: component.field.posx, y: component.field.posy}), offset);
			this.text(
				pos,
				"black",
				component.field.reference,
				component.field.textOrientation,
				component.field.textSize,
				TextHjustify.CENTER,
				TextVjustify.CENTER,
				0,
				false,
				false
			);
		}

		if (component.fields[0]) {
			const pos = Point.add(transform.transformCoordinate({ x: component.fields[0].posx, y: component.fields[0].posy}), offset);
			this.text(
				pos,
				"black",
				component.fields[0].name,
				component.field.textOrientation,
				component.fields[0].textSize,
				TextHjustify.CENTER,
				TextVjustify.CENTER,
				0,
				false,
				false
			);
		}

		for (let draw of component.draw.objects) {
			if (draw.unit !== 0 && unit !== draw.unit) {
				continue;
			};
			if (draw.convert !== 0 && convert !== draw.convert) {
				continue;
			}
			if (draw instanceof DrawArc) {
				const pos = Point.add(transform.transformCoordinate({ x: draw.posx, y: draw.posy}), offset);
				const [startAngle, endAngle] = transform.mapAngles(draw.startAngle, draw.endAngle);

				this.arc(
					pos,
					startAngle,
					endAngle,
					draw.radius,
					draw.fill,
					DEFAULT_LINE_WIDTH
				);
			} else
			if (draw instanceof DrawCircle) {
				const pos = Point.add(transform.transformCoordinate({ x: draw.posx, y: draw.posy}), offset);
				this.circle(
					pos,
					draw.radius * 2,
					draw.fill,
					DEFAULT_LINE_WIDTH
				);
			} else
			if (draw instanceof DrawPolyline) {
				const points: Array<Point> = [];
				for (let i = 0, len = draw.points.length; i < len; i += 2) {
					const pos = Point.add(transform.transformCoordinate({x:draw.points[i] , y:draw.points[i+1] }), offset);
					points.push(pos);
				}
				this.polyline(
					points,
					draw.fill,
					DEFAULT_LINE_WIDTH
				);
			} else
			if (draw instanceof DrawSquare) {
				const pos1 = Point.add(transform.transformCoordinate({x: draw.startx, y: draw.starty}), offset);
				const pos2 = Point.add(transform.transformCoordinate({x: draw.endx, y: draw.endy}), offset);
				this.rect(
					pos1,
					pos2,
					draw.fill,
					DEFAULT_LINE_WIDTH
				);
			} else
			if (draw instanceof DrawText) {
				const pos = Point.add(transform.transformCoordinate({ x: draw.posx, y: draw.posy}), offset);
				this.text(
					pos,
					"black",
					draw.text,
					component.field.textOrientation,
					draw.textSize,
					TextHjustify.CENTER,
					TextVjustify.CENTER,
					0,
					false,
					false
				);
			} else
			if (draw instanceof DrawPin) {
				this.plotPin(draw, component, offset, transform);
			} else {
				throw 'unknown draw object type: ' + draw.constructor.name;
			}
		}
	}

	plotPin(draw: DrawPin, component: Component, offset: Point, transform: Transform ):void {
		this.plotPinTexts(draw, component, offset, transform);
		this.plotPinSymbol(draw, component, offset, transform);
	}

	plotPinTexts(draw: DrawPin, component: Component, offset: Point, transform: Transform ): void {
		const pos = Point.add(transform.transformCoordinate({ x: draw.posx, y: draw.posy}), offset);
		let x1 = pos.x, y1 = pos.y;
		if (draw.orientation === PinOrientation.UP) {
			y1 -= draw.length;
		} else
		if (draw.orientation === PinOrientation.DOWN) {
			y1 += draw.length;
		} else
		if (draw.orientation === PinOrientation.LEFT) {
			x1 -= draw.length;
		} else
		if (draw.orientation === PinOrientation.RIGHT) {
			x1 += draw.length;
		}

		const nameOffset = 4;
		const numOffset  = 4;
		const textInside = component.textOffset;

		const isHorizontal = draw.orientation === PinOrientation.LEFT || draw.orientation === PinOrientation.RIGHT;

		if (textInside) {
			if (isHorizontal) {
				if (component.drawPinname) {
					if (draw.orientation === PinOrientation.RIGHT) {
						this.text(
							{x: x1 + textInside, y: y1},
							"black",
							draw.name,
							TextAngle.HORIZ,
							draw.nameTextSize,
							TextHjustify.LEFT,
							TextVjustify.CENTER,
							0,
							false,
							false
						)
					} else {
						this.text(
							{x: x1 - textInside, y: y1},
							"black",
							draw.name,
							TextAngle.HORIZ,
							draw.nameTextSize,
							TextHjustify.RIGHT,
							TextVjustify.CENTER,
							0,
							false,
							false
						)
					}
				}

				if (component.drawPinnumber) {
					this.text(
						{x: (x1 + pos.x) / 2, y: y1 + numOffset},
						"black",
						draw.name,
						TextAngle.HORIZ,
						draw.nameTextSize,
						TextHjustify.CENTER,
						TextVjustify.BOTTOM,
						0,
						false,
						false
					)
				}
			} else {
				if (draw.orientation === PinOrientation.DOWN) {
					if (component.drawPinname) {
						this.text(
							{x: x1, y: y1 + textInside },
							"black",
							draw.name,
							TextAngle.VERT,
							draw.nameTextSize,
							TextHjustify.RIGHT,
							TextVjustify.CENTER,
							0,
							false,
							false
						);
					}
					if (component.drawPinnumber) {
						this.text(
							{x: x1 - numOffset, y: (y1 + pos.y) / 2 },
							"black",
							draw.name,
							TextAngle.VERT,
							draw.nameTextSize,
							TextHjustify.RIGHT,
							TextVjustify.CENTER,
							0,
							false,
							false
						);
					}
				} else {
					if (component.drawPinname) {
						this.text(
							{x: x1, y: y1 - textInside },
							"black",
							draw.name,
							TextAngle.VERT,
							draw.nameTextSize,
							TextHjustify.LEFT,
							TextVjustify.CENTER,
							0,
							false,
							false
						);
					}
					if (component.drawPinnumber) {
						this.text(
							{x: x1 - numOffset, y: (y1 + pos.y) / 2 },
							"black",
							draw.name,
							TextAngle.VERT,
							draw.nameTextSize,
							TextHjustify.CENTER,
							TextVjustify.BOTTOM,
							0,
							false,
							false
						);
					}
				}
			}
		} else {
			if (isHorizontal) {
				if (component.drawPinname) {
					this.text(
						{ x: (x1 + pos.x) / 2, y: y1 - nameOffset },
						"black",
						draw.name,
						TextAngle.HORIZ,
						draw.nameTextSize,
						TextHjustify.CENTER,
						TextVjustify.BOTTOM,
						0,
						false,
						false
					)
				}

				if (component.drawPinnumber) {
					this.text(
						{ x: (x1 + pos.x) / 2, y: y1 + numOffset },
						"black",
						draw.num,
						TextAngle.HORIZ,
						draw.numTextSize,
						TextHjustify.CENTER,
						TextVjustify.TOP,
						0,
						false,
						false
					)
				}
			} else {
				if (component.drawPinname) {
					this.text(
						{x: x1 - nameOffset, y: (y1 + pos.y) / 2},
						"black",
						draw.name,
						TextAngle.VERT,
						draw.nameTextSize,
						TextHjustify.CENTER,
						TextVjustify.BOTTOM,
						0,
						false,
						false
					)
				}

				if (component.drawPinnumber) {
					this.text(
						{x: x1 + numOffset, y: (y1 + pos.y) / 2},
						"black",
						draw.num,
						TextAngle.VERT,
						draw.numTextSize,
						TextHjustify.CENTER,
						TextVjustify.TOP,
						0,
						false,
						false
					)
				}
			}
		}
	}

	plotPinSymbol(draw: DrawPin, component: Component, offset: Point, transform: Transform): void {
		const pos = Point.add(transform.transformCoordinate({ x: draw.posx, y: draw.posy}), offset);
		const orientation = this.pinDrawOrientation(draw, transform);
		
		let x1 = pos.x, y1 = pos.y;
		let mapX1 = 0, mapY1 = 0;

		if (orientation === PinOrientation.UP) {
			y1 -= draw.length;
			mapY1 = 1;
		} else
		if (orientation === PinOrientation.DOWN) {
			y1 += draw.length;
			mapY1 = -1;
		} else
		if (orientation === PinOrientation.LEFT) {
			x1 -= draw.length;
			mapX1 = 1;
		} else
		if (orientation === PinOrientation.RIGHT) {
			x1 += draw.length;
			mapX1 = -1;
		}

		// TODO shape
		this.fill = Fill.NO_FILL;
		this.setCurrentLineWidth(DEFAULT_LINE_WIDTH);
		this.moveTo({ x: x1, y: y1 });
		this.finishTo({ x: pos.x, y: pos.y});
		this.circle({ x: pos.x, y: pos.y}, 20, Fill.NO_FILL, 2);
	}

	pinDrawOrientation(draw: DrawPin, transform: Transform): PinOrientation {
		let end = { x: 0, y: 0 };
		if (draw.orientation === PinOrientation.UP) {
			end.y = 1;
		} else
		if (draw.orientation === PinOrientation.DOWN) {
			end.y = -1;
		} else
		if (draw.orientation === PinOrientation.LEFT) {
			end.x = -1;
		} else
		if (draw.orientation === PinOrientation.RIGHT) {
			end.x = 1;
		}

		end = transform.transformCoordinate(end);

		if (end.x === 0) {
			if (end.y > 0) {
				return PinOrientation.DOWN;
			} else {
				return PinOrientation.UP;
			}
		} else {
			if (end.x < 0) {
				return PinOrientation.LEFT;
			} else {
				return PinOrientation.RIGHT;
			}
		}
	}
}

export class CanvasPlotter extends Plotter {
	ctx : any;
	penState: "U"|"D"|"Z";

	constructor(ctx: any) {
		super();
		this.ctx = ctx;
		this.penState = "Z";
		this.fill = Fill.NO_FILL;

		this.ctx.lineCap = "round";
		this.ctx.strokeStyle = "#000";
	}

	rect(p1: Point, p2: Point, fill: Fill, width: number): void {
		this.setCurrentLineWidth(width);
		this.fill = fill;
		this.moveTo(p1.x, p1.y);
		this.lineTo(p1.x, p2.y);
		this.lineTo(p2.x, p2.y);
		this.lineTo(p2.x, p1.y);
		this.finishTo(p1.x, p1.y);
	}

	circle(p: Point, dia: number, fill: Fill, width: number): void {
		this.setCurrentLineWidth(width);
		this.fill = fill;
		this.ctx.beginPath();
		this.ctx.arc(p.x, p.y, dia / 2, 0, Math.PI * 2, false);
		if (fill === Fill.FILLED_SHAPE) {
			this.ctx.fill();
		} else {
			this.ctx.stroke();
		}
	}

	arc(p: Point, startAngle: number, endAngle: number, radius: number, fill: Fill, width: number): void {
		this.setCurrentLineWidth(width);
		this.fill = fill;
		this.ctx.beginPath();
		const anticlockwise = false;
//		this.ctx.save();
//		this.ctx.scale(1, -1);
		this.ctx.arc(p.x, p.y, radius, startAngle / 10 * Math.PI / 180, endAngle / 10 * Math.PI / 180, anticlockwise);
		if (fill === Fill.FILLED_SHAPE) {
			this.ctx.fill();
		} else {
			this.ctx.stroke();
		}
//		this.ctx.restore();
	}

	polyline(points: Array<Point>, fill: Fill, width: number): void {
		this.setCurrentLineWidth(width);
		this.fill = fill;
		this.moveTo(points[0]);
		for (var i = 1, len = points.length; i < len; i++) {
			this.lineTo(points[i]);
		}
		this.finishPen();
	}

	text(
		p: Point,
		color: string,
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
		this.ctx.save();
		this.ctx.translate(p.x, p.y);
		this.ctx.rotate(-DECIDEG2RAD(orientation));
		this.ctx.font = size + "px monospace";
		this.ctx.fillText(text, 0, 0);
		this.ctx.restore();
	}

	/**
	 * U = Pen is up
	 * D = Pen is down
	 * Z = Pen is outof canvas
	 */
	penTo(p: Point, s: "U"|"D"|"Z"): void {
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

	setCurrentLineWidth(w: number): void {
		this.ctx.lineWidth = w;
	}
}
