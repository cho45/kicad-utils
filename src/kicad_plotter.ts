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
	MM2MIL,
	RotatePoint,

	Fill,
	TextHjustify,
	TextVjustify,
	PinOrientation,
	TextAngle,

	Transform,
	Point,
	Net,
	Color,
	ColorDefinition,
} from "./kicad_common";

import {
	LibComponent,
	Library,
	DrawPin,
	DrawArc,
	DrawCircle,
	DrawPolyline,
	DrawSquare,
	DrawText,
} from "./kicad_lib";

import {
	Schematic,
	Sheet,
	SheetPin,
	Field,
	Bitmap,
	Text,
	Wire,
	Entry,
	Connection,
	NoConn,
	SchComponent,
	TextOrientationType,
} from "./kicad_sch";

import {
	StrokeFont
} from "./kicad_strokefont";

const TXT_MARGIN = 4;
const PIN_TXT_MARGIN = 4;
const DEFAULT_LINE_WIDTH = 6;
const DEFAULT_LINE_WIDTH_BUS = 12;

const SCH_COLORS = {
	LAYER_WIRE:                 Color.GREEN,
	LAYER_BUS:                  Color.BLUE,
	LAYER_JUNCTION:             Color.GREEN,
	LAYER_LOCLABEL:             Color.BLACK,
	LAYER_HIERLABEL:            Color.BROWN,
	LAYER_GLOBLABEL:            Color.RED,
	LAYER_PINNUM:               Color.RED,
	LAYER_PINNAM:               Color.CYAN,
	LAYER_FIELDS:               Color.MAGENTA,
	LAYER_REFERENCEPART:        Color.CYAN,
	LAYER_VALUEPART:            Color.CYAN,
	LAYER_NOTES:                Color.LIGHTBLUE,
	LAYER_DEVICE:               Color.RED,
	LAYER_DEVICE_BACKGROUND:    Color.LIGHTYELLOW,
	LAYER_NETNAM:               Color.DARKGRAY,
	LAYER_PIN:                  Color.RED,
	LAYER_SHEET:                Color.MAGENTA,
	LAYER_SHEETFILENAME:        Color.BROWN,
	LAYER_SHEETNAME:            Color.CYAN,
	LAYER_SHEETLABEL:           Color.BROWN,
	LAYER_NOCONNECT:            Color.BLUE,
	LAYER_ERC_WARN:             Color.GREEN,
	LAYER_ERC_ERR:              Color.RED,
	LAYER_SCHEMATIC_GRID:       Color.DARKGRAY,
	LAYER_SCHEMATIC_BACKGROUND: Color.WHITE,
	LAYER_BRIGHTENED:           Color.PUREMAGENTA,
};

const TEMPLATE_SHAPES = {
	[Net.INPUT]: {
		[TextOrientationType.HORIZ_LEFT]: [ 6, 0, 0, -1, -1, -2, -1, -2, 1, -1, 1, 0, 0 ],
		[TextOrientationType.UP]: [ 6, 0, 0, 1, -1, 1, -2, -1, -2, -1, -1, 0, 0 ],
		[TextOrientationType.HORIZ_RIGHT]: [ 6, 0, 0, 1, 1, 2, 1, 2, -1, 1, -1, 0, 0 ],
		[TextOrientationType.BOTTOM]: [ 6, 0, 0, 1, 1, 1, 2, -1, 2, -1, 1, 0, 0 ],
	},
	[Net.OUTPUT]: {
		[TextOrientationType.HORIZ_LEFT]: [ 6, -2, 0, -1, 1, 0, 1, 0, -1, -1, -1, -2, 0 ],
		[TextOrientationType.HORIZ_RIGHT]: [ 6, 2, 0, 1, -1, 0, -1, 0, 1, 1, 1, 2, 0 ],
		[TextOrientationType.UP]: [ 6, 0, -2, 1, -1, 1, 0, -1, 0, -1, -1, 0, -2 ],
		[TextOrientationType.BOTTOM]: [ 6, 0, 2, 1, 1, 1, 0, -1, 0, -1, 1, 0, 2 ],
	},
	[Net.UNSPECIFIED]: {
		[TextOrientationType.HORIZ_LEFT]: [ 5, 0, -1, -2, -1, -2, 1, 0, 1, 0, -1 ],
		[TextOrientationType.HORIZ_RIGHT]: [ 5, 0, -1, 2, -1, 2, 1, 0, 1, 0, -1 ],
		[TextOrientationType.UP]: [ 5, 1, 0, 1, -2, -1, -2, -1, 0, 1, 0 ],
		[TextOrientationType.BOTTOM]: [ 5, 1, 0, 1, 2, -1, 2, -1, 0, 1, 0 ],
	},
	[Net.BIDI]: {
		[TextOrientationType.HORIZ_LEFT]: [ 5, 0, 0, -1, -1, -2, 0, -1, 1, 0, 0 ],
		[TextOrientationType.HORIZ_RIGHT]: [ 5, 0, 0, 1, -1, 2, 0, 1, 1, 0, 0 ],
		[TextOrientationType.UP]: [ 5, 0, 0, -1, -1, 0, -2, 1, -1, 0, 0 ],
		[TextOrientationType.BOTTOM]: [ 5, 0, 0, -1, 1, 0, 2, 1, 1, 0, 0 ],
	},
	[Net.TRISTATE]: {
		[TextOrientationType.HORIZ_LEFT]: [ 5, 0, 0, -1, -1, -2, 0, -1, 1, 0, 0 ],
		[TextOrientationType.HORIZ_RIGHT]: [ 5, 0, 0, 1, -1, 2, 0, 1, 1, 0, 0 ],
		[TextOrientationType.UP]: [ 5, 0, 0, -1, -1, 0, -2, 1, -1, 0, 0 ],
		[TextOrientationType.BOTTOM]: [ 5, 0, 0, -1, 1, 0, 2, 1, 1, 0, 0 ],
	}
};


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
	}>;
	font: StrokeFont;

	constructor() {
		this.fill = Fill.NO_FILL;
		this.color = Color.BLACK;
		this.transform = Transform.identify();
		this.stateHistory = [];
		this.font = new StrokeFont();
	}

	abstract rect(p1: Point, p2: Point, fill: Fill, width: number): void;
	abstract circle(p: Point, dia: number, fill: Fill, width: number): void;
	abstract arc(p: Point, startAngle: number, endAngle: number, radius: number, fill: Fill, width: number): void;
	abstract polyline(points: Array<Point>, fill: Fill, width: number): void;
	abstract setCurrentLineWidth(w: number): void;
	abstract penTo(p: Point, s: "U"|"D"|"Z"): void;
	abstract image(p: Point, scale: number, originalWidth:number, originalHeight:number, data: Uint8Array): void;

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
		this.fill = Fill.NO_FILL;
		// p = this.transform.transformCoordinate(p);
		this.font.drawText(
			this,
			p,
			text,
			size,
			width,
			orientation,
			hjustfy,
			vjustify
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

	/**
	 * kicad-js implements plot methods to plotter instead of each library items for simplify parsing dependencies.
	 */
	plotLibComponent(component: LibComponent, unit: number, convert: number, transform: Transform, reference?: string, name?: string): void {
		if (component.field && component.field.visibility) {
			const pos = transform.transformCoordinate({ x: component.field.posx, y: component.field.posy});
			let orientation = component.field.textOrientation;
			if (transform.y1) {
				if (orientation === TextAngle.HORIZ) {
					orientation = TextAngle.VERT;
				} else {
					orientation = TextAngle.HORIZ;
				}
			}

			let text  = (typeof reference !== 'undefined') ? reference : component.field.reference;
			const width  = 0;//this.font.computeTextLineSize(text, component.field.textSize, DEFAULT_LINE_WIDTH);
			const height = 0;//this.font.getInterline(component.field.textSize, DEFAULT_LINE_WIDTH);

			this.text(
				Point.add({ x: width / 2, y: height /2 }, pos),
				SCH_COLORS.LAYER_REFERENCEPART,
				text,
				orientation,
				component.field.textSize,
				TextHjustify.CENTER,
				TextVjustify.CENTER,
				DEFAULT_LINE_WIDTH,
				component.field.italic,
				component.field.bold,
			);
		}

		if (component.fields[0] && component.fields[0].visibility) {
			const pos = transform.transformCoordinate({ x: component.fields[0].posx, y: component.fields[0].posy});
			let orientation = component.fields[0].textOrientation;
			if (transform.y1) {
				if (orientation === TextAngle.HORIZ) {
					orientation = TextAngle.VERT;
				} else {
					orientation = TextAngle.HORIZ;
				}
			}
			let text  = (typeof name !== 'undefined') ? name : component.fields[0].name;
			const width  = 0; // this.font.computeTextLineSize(text, component.fields[0].textSize, DEFAULT_LINE_WIDTH);
			const height = 0; // this.font.getInterline(component.fields[0].textSize, DEFAULT_LINE_WIDTH);
			this.text(
				Point.add({ x: width / 2, y: height / 2 }, pos),
				SCH_COLORS.LAYER_VALUEPART,
				text,
				orientation,
				component.fields[0].textSize,
				TextHjustify.CENTER,
				TextVjustify.CENTER,
				DEFAULT_LINE_WIDTH,
				component.fields[0].italic,
				component.fields[0].bold
			);
		}

		this.setColor(SCH_COLORS.LAYER_DEVICE);
		for (let draw of component.draw.objects) {
			if (draw.unit !== 0 && unit !== draw.unit) {
				continue;
			};
			if (draw.convert !== 0 && convert !== draw.convert) {
				continue;
			}
			if (draw instanceof DrawArc) {
				this.plotDrawArc(draw, component, transform);
			} else
			if (draw instanceof DrawCircle) {
				this.plotDrawCircle(draw, component, transform);
			} else
			if (draw instanceof DrawPolyline) {
				this.plotDrawPolyline(draw, component, transform);
			} else
			if (draw instanceof DrawSquare) {
				this.plotDrawSquare(draw, component, transform);
			} else
			if (draw instanceof DrawText) {
				this.plotDrawText(draw, component, transform);
			} else
			if (draw instanceof DrawPin) {
				this.plotDrawPin(draw, component, transform);
			} else {
				throw 'unknown draw object type: ' + draw.constructor.name;
			}
		}
	}

	plotDrawArc(draw: DrawArc, component: LibComponent, transform: Transform ):void {
		const pos = transform.transformCoordinate({ x: draw.posx, y: draw.posy});
		const [startAngle, endAngle] = transform.mapAngles(draw.startAngle, draw.endAngle);

		this.arc(
			pos,
			startAngle,
			endAngle,
			draw.radius,
			draw.fill,
			draw.lineWidth || DEFAULT_LINE_WIDTH
		);
	}

	plotDrawCircle(draw: DrawCircle, component: LibComponent, transform: Transform ):void {
		const pos = transform.transformCoordinate({ x: draw.posx, y: draw.posy});
		this.circle(
			pos,
			draw.radius * 2,
			draw.fill,
			draw.lineWidth || DEFAULT_LINE_WIDTH
		);
	}

	plotDrawPolyline(draw: DrawPolyline, component: LibComponent,transform: Transform ):void {
		const points: Array<Point> = [];
		for (let i = 0, len = draw.points.length; i < len; i += 2) {
			const pos = transform.transformCoordinate({x:draw.points[i] , y:draw.points[i+1] });
			points.push(pos);
		}
		this.polyline(
			points,
			draw.fill,
			draw.lineWidth || DEFAULT_LINE_WIDTH
		);
	}

	plotDrawSquare(draw: DrawSquare, component: LibComponent, transform: Transform ):void {
		const pos1 = transform.transformCoordinate({x: draw.startx, y: draw.starty});
		const pos2 = transform.transformCoordinate({x: draw.endx, y: draw.endy});
		this.rect(
			pos1,
			pos2,
			draw.fill,
			draw.lineWidth || DEFAULT_LINE_WIDTH
		);
	}
	
	plotDrawText(draw: DrawText, component: LibComponent, transform: Transform ):void {
		const pos = transform.transformCoordinate({ x: draw.posx, y: draw.posy});
		this.text(
			pos,
			this.color,
			draw.text,
			component.field.textOrientation,
			draw.textSize,
			TextHjustify.CENTER,
			TextVjustify.CENTER,
			DEFAULT_LINE_WIDTH,
			draw.italic,
			draw.bold
		);
	}

	plotDrawPin(draw: DrawPin, component: LibComponent, transform: Transform ):void {
		if (!draw.visibility) return;
		this.plotDrawPinTexts(draw, component, transform);
		this.plotDrawPinSymbol(draw, component, transform);
	}

	plotDrawPinTexts(draw: DrawPin, component: LibComponent, transform: Transform ): void {
		let drawPinname = component.drawPinname;
		let drawPinnumber = component.drawPinnumber;
		if (draw.name === "" || draw.name === "~") {
			drawPinname = false;
		}
		if (draw.num === "") {
			drawPinnumber = false;
		}

		if (!drawPinname && !drawPinnumber) return;

		const pos = transform.transformCoordinate({ x: draw.posx, y: draw.posy});
		const orientation = this.pinDrawOrientation(draw, transform);

		let x1 = pos.x, y1 = pos.y;
		if (orientation === PinOrientation.UP) {
			y1 -= draw.length;
		} else
		if (orientation === PinOrientation.DOWN) {
			y1 += draw.length;
		} else
		if (orientation === PinOrientation.LEFT) {
			x1 -= draw.length;
		} else
		if (orientation === PinOrientation.RIGHT) {
			x1 += draw.length;
		}

		const nameOffset = PIN_TXT_MARGIN + DEFAULT_LINE_WIDTH / 2;
		const numOffset  = PIN_TXT_MARGIN + DEFAULT_LINE_WIDTH / 2;
		const textInside = component.textOffset;

		const isHorizontal = orientation === PinOrientation.LEFT || orientation === PinOrientation.RIGHT;

		if (textInside) {
			if (isHorizontal) {
				if (drawPinname) {
					if (orientation === PinOrientation.RIGHT) {
						this.text(
							{x: x1 + textInside, y: y1},
							SCH_COLORS.LAYER_PINNAM,
							draw.name,
							TextAngle.HORIZ,
							draw.nameTextSize,
							TextHjustify.LEFT,
							TextVjustify.CENTER,
							DEFAULT_LINE_WIDTH,
							false,
							false
						)
					} else {
						this.text(
							{x: x1 - textInside, y: y1},
							SCH_COLORS.LAYER_PINNAM,
							draw.name,
							TextAngle.HORIZ,
							draw.nameTextSize,
							TextHjustify.RIGHT,
							TextVjustify.CENTER,
							DEFAULT_LINE_WIDTH,
							false,
							false
						)
					}
				}

				if (drawPinnumber) {
					this.text(
						{x: (x1 + pos.x) / 2, y: y1 + numOffset},
						SCH_COLORS.LAYER_PINNUM,
						draw.num,
						TextAngle.HORIZ,
						draw.nameTextSize,
						TextHjustify.CENTER,
						TextVjustify.BOTTOM,
						DEFAULT_LINE_WIDTH,
						false,
						false
					)
				}
			} else {
				if (orientation === PinOrientation.DOWN) {
					if (drawPinname) {
						this.text(
							{x: x1, y: y1 + textInside },
							SCH_COLORS.LAYER_PINNAM,
							draw.name,
							TextAngle.VERT,
							draw.nameTextSize,
							TextHjustify.RIGHT,
							TextVjustify.CENTER,
							DEFAULT_LINE_WIDTH,
							false,
							false
						);
					}
					if (drawPinnumber) {
						this.text(
							{x: x1 - numOffset, y: (y1 + pos.y) / 2 },
							SCH_COLORS.LAYER_PINNUM,
							draw.num,
							TextAngle.VERT,
							draw.nameTextSize,
							TextHjustify.CENTER,
							TextVjustify.BOTTOM,
							DEFAULT_LINE_WIDTH,
							false,
							false
						);
					}
				} else {
					if (drawPinname) {
						this.text(
							{x: x1, y: y1 - textInside },
							SCH_COLORS.LAYER_PINNAM,
							draw.name,
							TextAngle.VERT,
							draw.nameTextSize,
							TextHjustify.LEFT,
							TextVjustify.CENTER,
							DEFAULT_LINE_WIDTH,
							false,
							false
						);
					}
					if (drawPinnumber) {
						this.text(
							{x: x1 - numOffset, y: (y1 + pos.y) / 2 },
							SCH_COLORS.LAYER_PINNUM,
							draw.num,
							TextAngle.VERT,
							draw.nameTextSize,
							TextHjustify.CENTER,
							TextVjustify.BOTTOM,
							DEFAULT_LINE_WIDTH,
							false,
							false
						);
					}
				}
			}
		} else {
			if (isHorizontal) {
				if (drawPinname) {
					this.text(
						{ x: (x1 + pos.x) / 2, y: y1 - nameOffset },
						SCH_COLORS.LAYER_PINNAM,
						draw.name,
						TextAngle.HORIZ,
						draw.nameTextSize,
						TextHjustify.CENTER,
						TextVjustify.BOTTOM,
						DEFAULT_LINE_WIDTH,
						false,
						false
					)
				}

				if (drawPinnumber) {
					this.text(
						{ x: (x1 + pos.x) / 2, y: y1 + numOffset },
						SCH_COLORS.LAYER_PINNUM,
						draw.num,
						TextAngle.HORIZ,
						draw.numTextSize,
						TextHjustify.CENTER,
						TextVjustify.TOP,
						DEFAULT_LINE_WIDTH,
						false,
						false
					)
				}
			} else {
				if (drawPinname) {
					this.text(
						{x: x1 - nameOffset, y: (y1 + pos.y) / 2},
						SCH_COLORS.LAYER_PINNAM,
						draw.name,
						TextAngle.VERT,
						draw.nameTextSize,
						TextHjustify.CENTER,
						TextVjustify.BOTTOM,
						DEFAULT_LINE_WIDTH,
						false,
						false
					)
				}

				if (drawPinnumber) {
					this.text(
						{x: x1 + numOffset, y: (y1 + pos.y) / 2},
						SCH_COLORS.LAYER_PINNUM,
						draw.num,
						TextAngle.VERT,
						draw.numTextSize,
						TextHjustify.CENTER,
						TextVjustify.TOP,
						DEFAULT_LINE_WIDTH,
						false,
						false
					)
				}
			}
		}
	}

	plotDrawPinSymbol(draw: DrawPin, component: LibComponent, transform: Transform): void {
		const pos = transform.transformCoordinate({ x: draw.posx, y: draw.posy});
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
		// this.circle({ x: pos.x, y: pos.y}, 20, Fill.NO_FILL, 2);
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

		end = transform.translate(-transform.tx, -transform.ty).transformCoordinate(end);

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

	plotSchematic(sch: Schematic, libs: Array<Library>) {
		// default page layout
		const MARGIN = MM2MIL(10);
		this.rect(
			{ x: MARGIN, y: MARGIN },
			{ x: sch.descr.width - MARGIN, y: sch.descr.height - MARGIN },
			Fill.NO_FILL,
			DEFAULT_LINE_WIDTH
		);
		const OFFSET = MM2MIL(2);
		this.rect(
			{ x: MARGIN + OFFSET, y: MARGIN + OFFSET },
			{ x: sch.descr.width - MARGIN - OFFSET, y: sch.descr.height - MARGIN - OFFSET },
			Fill.NO_FILL,
			DEFAULT_LINE_WIDTH
		);
		// up
		this.moveTo(sch.descr.width / 2, MARGIN);
		this.finishTo(sch.descr.width / 2, MARGIN + OFFSET);
		// bottom
		this.moveTo(sch.descr.width / 2, sch.descr.height - MARGIN - OFFSET);
		this.finishTo(sch.descr.width / 2, sch.descr.height - MARGIN);
		// left
		this.moveTo(MARGIN, sch.descr.height / 2);
		this.finishTo(MARGIN + OFFSET, sch.descr.height / 2);
		// right
		this.moveTo(sch.descr.width - MARGIN - OFFSET, sch.descr.height / 2);
		this.finishTo(sch.descr.width - MARGIN, sch.descr.height / 2);

		for (let item of sch.items) {
			if (item instanceof SchComponent) {
				let component;
				for (let lib of libs) {
					if (!lib) continue;
					component = lib.findByName(item.name);
					if (component) break;
				}
				if (!component) {
					console.warn("component " + item.name + " is not found in libraries");
					continue;
				}
				this.plotLibComponent(component, item.unit, item.convert, item.transform, item.fields[0].text, item.fields[1].text);
			} else
			if (item instanceof Sheet) {
				this.setColor(SCH_COLORS.LAYER_SHEET);
				this.setCurrentLineWidth(DEFAULT_LINE_WIDTH);
				this.fill = Fill.NO_FILL;
				this.moveTo(item.posx, item.posy);
				this.lineTo(item.posx, item.posy + item.sizey);
				this.lineTo(item.posx + item.sizex, item.posy + item.sizey);
				this.lineTo(item.posx + item.sizex, item.posy);
				this.finishTo(item.posx, item.posy);
				this.text(
					{x: item.posx, y: item.posy - 4},
					SCH_COLORS.LAYER_SHEETNAME,
					item.sheetName,
					0,
					item.sheetNameSize,
					TextHjustify.LEFT,
					TextVjustify.BOTTOM,
					DEFAULT_LINE_WIDTH,
					false,
					false
				);
				this.text(
					{x: item.posx, y: item.posy + item.sizey + 4},
					SCH_COLORS.LAYER_SHEETFILENAME,
					item.fileName,
					0,
					item.fileNameSize,
					TextHjustify.LEFT,
					TextVjustify.TOP,
					DEFAULT_LINE_WIDTH,
					false,
					false
				);

				this.setColor(SCH_COLORS.LAYER_SHEETLABEL);
				for (let pin of item.sheetPins) {
					const tmp = pin.shape;
					if (pin.shape === Net.INPUT) {
						pin.shape = Net.OUTPUT;
					} else
					if (pin.shape === Net.OUTPUT) {
						pin.shape = Net.INPUT;
					}
					this.plotSchTextHierarchicalLabel(pin);
					pin.shape = tmp;
				}
			} else
			if (item instanceof Bitmap) {
				item.parseIHDR();
				const PPI = 300;
				const PIXEL_SCALE = 1000 / PPI;
				this.image({ x: item.posx, y: item.posy }, item.scale * PIXEL_SCALE, item.width, item.height, item.data);
			} else
			if (item instanceof Text) {
				if (item.name1 === 'GLabel') {
					this.plotSchTextGlobalLabel(item);
				} else
				if (item.name1 === 'HLabel') {
					this.plotSchTextHierarchicalLabel(item);
				} else {
					this.plotSchText(item);
				}
			} else
			if (item instanceof Entry) {
				this.setColor(item.isBus ? SCH_COLORS.LAYER_BUS : SCH_COLORS.LAYER_WIRE);
				this.setCurrentLineWidth(item.isBus ? DEFAULT_LINE_WIDTH_BUS : DEFAULT_LINE_WIDTH);
				this.moveTo(item.posx, item.posy);
				this.finishTo(item.posx + item.sizex, item.posy + item.sizey);
			} else
			if (item instanceof Connection) {
				this.setColor(SCH_COLORS.LAYER_JUNCTION);
				this.circle({ x: item.posx, y: item.posy }, 40, Fill.FILLED_SHAPE, DEFAULT_LINE_WIDTH);
			} else
			if (item instanceof NoConn) {
				this.fill = Fill.NO_FILL;
				const DRAWNOCONNECT_SIZE = 48;
				const delta = DRAWNOCONNECT_SIZE / 2;
				this.setColor(SCH_COLORS.LAYER_NOCONNECT);
				this.setCurrentLineWidth(DEFAULT_LINE_WIDTH);
				this.moveTo( item.posx - delta, item.posy - delta);
				this.finishTo(item.posx + delta, item.posy + delta);
				this.moveTo( item.posx + delta, item.posy - delta);
				this.finishTo(item.posx - delta, item.posy + delta);
			} else
			if (item instanceof Wire) {
				this.setColor(item.isBus ? SCH_COLORS.LAYER_BUS : SCH_COLORS.LAYER_WIRE);
				this.setCurrentLineWidth(item.isBus ? DEFAULT_LINE_WIDTH_BUS : DEFAULT_LINE_WIDTH);
				this.fill = Fill.NO_FILL;
				this.moveTo(item.startx, item.starty);
				this.finishTo(item.endx, item.endy);
			} else {
				throw "unknown SchItem: " + item.constructor.name;
			}
		}
	}

	plotSchTextGlobalLabel(item: Text) {
		{
			const halfSize = item.size / 2;
			const lineWidth = DEFAULT_LINE_WIDTH;
			const points: Array<Point> = [];
			const symLen = this.font.computeTextLineSize(item.text, item.size, lineWidth);
			const hasOverBar = /~[^~]/.test(item.text);

			const Y_CORRECTION = 1.40;
			const Y_OVERBAR_CORRECTION = 1.2;

			let x = symLen + lineWidth + 3;
			let y = halfSize * Y_CORRECTION;
			if (hasOverBar) {
				// TODO
			}

			y += lineWidth + lineWidth / 2;

			points.push( new Point( 0, 0 ) );
			points.push( new Point( 0, -y ) );     // Up
			points.push( new Point( -x, -y ) );    // left
			points.push( new Point( -x, 0 ) );     // Up left
			points.push( new Point( -x, y ) );     // left down
			points.push( new Point( 0, y ) );      // down

			let xOffset = 0;

			if (item.shape === Net.INPUT) {
				xOffset -= halfSize;
				points[0].x += halfSize;
			} else
			if (item.shape === Net.OUTPUT) {
				points[3].x -= halfSize;
			} else
			if (item.shape === Net.BIDI ||
				item.shape === Net.TRISTATE) {
				xOffset = -halfSize;
				points[0].x += halfSize;
				points[3].x -= halfSize;
			}

			let angle = 0;
			if (item.orientationType === TextOrientationType.HORIZ_LEFT) {
				angle = 0;
			} else
			if (item.orientationType === TextOrientationType.UP) {
				angle = -900;
			} else
			if (item.orientationType === TextOrientationType.HORIZ_RIGHT) {
				angle = 1800;
			} else
			if (item.orientationType === TextOrientationType.BOTTOM) {
				angle = 900;
			}

			for (let p of points) {
				p.x += xOffset;
				if (angle) {
					RotatePoint(p, angle);
				}

				p.x += item.posx;
				p.y += item.posy;
			}

			points.push(points[0]);

			this.setColor(SCH_COLORS.LAYER_GLOBLABEL);
			this.polyline(points, Fill.NO_FILL, DEFAULT_LINE_WIDTH);
		}

		{
			let p = new Point(item.posx, item.posy);
			const width = DEFAULT_LINE_WIDTH;
			console.log(item);
			const halfSize = this.font.computeTextLineSize(' ', item.size, width) / 2;
			let offset = width;
			if (item.shape === Net.INPUT ||
				item.shape === Net.BIDI ||
				item.shape === Net.TRISTATE
			) {
				offset += halfSize;
			} else
			if (item.shape === Net.OUTPUT ||
				item.shape === Net.UNSPECIFIED) {
				offset += TXT_MARGIN;
			}
			if (item.orientationType === 0) {
				p.x -= offset;
			} else
			if (item.orientationType === 1) {
				p.y -= offset;
			} else
			if (item.orientationType === 2) {
				p.x += offset;
			} else
			if (item.orientationType === 3) {
				p.y += offset;
			}
			this.text(
				p,
				SCH_COLORS.LAYER_GLOBLABEL,
				item.text,
				item.orientation,
				item.size,
				item.hjustify,
				item.vjustify,
				width,
				item.italic,
				item.bold
			);
		}
	}

	plotSchTextHierarchicalLabel(item: Text) {
		{
			let p = new Point(item.posx, item.posy);
			const halfSize = item.size / 2;
			const template = TEMPLATE_SHAPES[item.shape][item.orientationType];
			const points: Array<Point> = [];
			// first of template is number of corners
			for (let i = 1; i < template.length; i += 2) {
				const x = template[i] * halfSize;
				const y = template[i+1] * halfSize;
				points.push(Point.add(new Point(x, y), p));
			}

			this.polyline(points, Fill.NO_FILL, DEFAULT_LINE_WIDTH);
		};
		{
			let p = new Point(item.posx, item.posy);
			const txtOffset =  this.font.computeTextLineSize(' ', item.size, DEFAULT_LINE_WIDTH) + TXT_MARGIN + DEFAULT_LINE_WIDTH / 2;
			if (item.orientationType === 0) {
				p.x -= txtOffset;
			} else
			if (item.orientationType === 1) {
				p.y -= txtOffset;
			} else
			if (item.orientationType === 2) {
				p.x += txtOffset;
			} else
			if (item.orientationType === 3) {
				p.y += txtOffset;
			}
			this.text(
				p,
				SCH_COLORS.LAYER_HIERLABEL,
				item.text,
				item.orientation,
				item.size,
				item.hjustify,
				item.vjustify,
				DEFAULT_LINE_WIDTH,
				item.italic,
				item.bold
			);
		}
	}

	plotSchText(item: Text) {
		let color = SCH_COLORS.LAYER_NOTES;
		if (item.name1 === 'Label') {
			color = SCH_COLORS.LAYER_LOCLABEL;
		}
		let p = new Point(item.posx, item.posy);
		const txtOffset = TXT_MARGIN + DEFAULT_LINE_WIDTH / 2;
		if (item.orientationType === 0) {
			p.y -= txtOffset;
		} else
		if (item.orientationType === 1) {
			p.x -= txtOffset;
		} else
		if (item.orientationType === 2) {
			p.y -= txtOffset;
		} else
		if (item.orientationType === 3) {
			p.x -= txtOffset;
		}
		this.text(
			p,
			color,
			item.text,
			item.orientation,
			item.size,
			item.hjustify,
			item.vjustify,
			DEFAULT_LINE_WIDTH,
			item.italic,
			item.bold
		);
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
		p = this.transform.transformCoordinate(p);
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
		p = this.transform.transformCoordinate(p);
		this.setCurrentLineWidth(width);
		this.fill = fill;
		this.ctx.beginPath();
		const anticlockwise = false;
		this.ctx.arc(p.x, p.y, radius, startAngle / 10 * Math.PI / 180, endAngle / 10 * Math.PI / 180, anticlockwise);
		if (fill === Fill.FILLED_SHAPE) {
			this.ctx.fill();
		} else {
			this.ctx.stroke();
		}
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
	}

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

		p = this.transform.transformCoordinate(p);

		this.output += this.xmlTag `<circle cx="${p.x}" cy="${p.y}" r="${dia/2}" `;
		if (this.fill === Fill.NO_FILL) {
			this.output += this.xmlTag ` style="stroke: ${this.color.toCSSColor()}; fill: none; stroke-width: ${this.lineWidth}" stroke-linecap="round"/>\n`;
		} else {
			this.output += this.xmlTag ` style="stroke: ${this.color.toCSSColor()}; fill: ${this.color.toCSSColor()}; stroke-width: ${this.lineWidth}" stroke-linecap="round"/>\n`;
		}
	}

	arc(p: Point, startAngle: number, endAngle: number, radius: number, fill: Fill, width: number): void {
		if (radius <= 0) return;
		if (startAngle > endAngle) {
			[startAngle, endAngle] = [endAngle, startAngle];
		}
		this.setCurrentLineWidth(width);
		this.fill = fill;
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

		const x = this.xmlTag;
		this.output += this.xmlTag `<path d="M${start.x} ${start.y} A${radius} ${radius} 0.0 ${isLargeArc ? 1 : 0} ${isSweep ? 1 : 0} ${end.x} ${end.y}"`;
		if (this.fill === Fill.NO_FILL) {
			this.output += this.xmlTag ` style="stroke: ${this.color.toCSSColor()}; fill: none; stroke-width: ${this.lineWidth}" stroke-linecap="round"/>\n`;
		} else {
			this.output += this.xmlTag ` style="stroke: ${this.color.toCSSColor()}; fill: ${this.color.toCSSColor()}; stroke-width: ${this.lineWidth}" stroke-linecap="round"/>\n`;
		}
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
		if (s === "Z") {
			if (this.penState !== "Z") {
				if (this.fill === Fill.NO_FILL) {
					this.output += this.xmlTag `" style="stroke: ${this.color.toCSSColor()}; fill: none; stroke-width: ${this.lineWidth}" stroke-linecap="round"/>\n`;
				} else {
					this.output += this.xmlTag `" style="stroke: ${this.color.toCSSColor()}; fill: ${this.color.toCSSColor()}; stroke-width: ${this.lineWidth}" stroke-linecap="round"/>\n`;
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
			width="${width}"
			height="${height}"
			/>`;
	}

	plotSchematic(sch: Schematic, libs: Array<Library>) {
		const width = sch.descr.width;
		const height =sch.descr.height;
		this.output = this.xmlTag `<svg preserveAspectRatio="xMinYMin"
			width="${width}"
			height="${height}"
			viewBox="0 0 ${sch.descr.width} ${sch.descr.height}"
			xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink"
			version="1.1">`;
		super.plotSchematic(sch, libs);
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
