//#!tsc && NODE_PATH=dist/src node dist/sketch3.js 
/*
 * This program source code file is part of kicad-utils
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
 *
 * IMPL is NOT COMPLETED!!
 */

import {
	Point,
	Fill,
	Size,
	RotatePoint,
	RotatePointWithCenter,
	AddAngles,
	ArcTangente,
	EuclideanNorm,
	GetLineLength,
	Color,
} from "./kicad_common";

import {
	Module,
	Pad,
	Board,
	PadShape,
	EdgeModule,
	Shape,
	LSET,
} from "./kicad_pcb";

import {
	Plotter,
} from "./kicad_plotter";

const DEFAULT_LINE_WIDTH = 1;
const DEFAULT_LAYER_COLORS = [
	Color.RED,           Color.YELLOW,        Color.LIGHTMAGENTA,  Color.LIGHTRED,
	Color.CYAN,          Color.GREEN,         Color.BLUE,          Color.DARKGRAY,
	Color.MAGENTA,       Color.LIGHTGRAY,     Color.MAGENTA,       Color.RED,
	Color.BROWN,         Color.LIGHTGRAY,     Color.BLUE,          Color.GREEN,

	Color.RED,           Color.YELLOW,        Color.LIGHTMAGENTA,  Color.LIGHTRED,
	Color.CYAN,          Color.GREEN,         Color.BLUE,          Color.DARKGRAY,
	Color.MAGENTA,       Color.LIGHTGRAY,     Color.MAGENTA,       Color.RED,
	Color.BROWN,         Color.LIGHTGRAY,     Color.BLUE,          Color.GREEN,

	Color.BLUE,        Color.MAGENTA,
	Color.LIGHTCYAN,   Color.RED,
	Color.MAGENTA,     Color.CYAN,
	Color.BROWN,       Color.MAGENTA,
	Color.LIGHTGRAY,
	Color.BLUE,
	Color.GREEN,       Color.YELLOW,
	Color.YELLOW,
	Color.LIGHTMAGENTA,
	Color.YELLOW,
	Color.DARKGRAY
];

// pcbnew/plot_board_layers.cpp
// pcbnew/plot_brditems_plotter.cpp 
export class PCBPlotter {
	constructor(public plotter: Plotter) {
	}

	flashPadCircle(pos: Point, dia: number, fill: Fill) {
		if (fill === Fill.FILLED_SHAPE) {
			this.plotter.circle(pos, dia, fill, 0);
		} else {
			let lineWidth = DEFAULT_LINE_WIDTH;
			this.plotter.setCurrentLineWidth(lineWidth);

			if (lineWidth > dia -2) lineWidth = dia - 2;

			this.plotter.circle(pos, dia - lineWidth, Fill.NO_FILL, lineWidth);
		}
	}

	flashPadRect(pos: Point, size: Size, orientation: number, fill: Fill) {
		const points: Array<Point> = [];
		let lineWidth = DEFAULT_LINE_WIDTH;
		if (fill === Fill.FILLED_SHAPE) {
			this.plotter.setCurrentLineWidth(0);
		} else {
			this.plotter.setCurrentLineWidth(lineWidth);
		}

		let width = size.width - lineWidth;
		let height = size.height - lineWidth;
		if (width < 1) width = 1;
		if (height < 1) height = 1;
		const dx = width / 2;
		const dy = height / 2;

		points.push(new Point(pos.x - dx, pos.y + dy));
		points.push(new Point(pos.x - dx, pos.y - dy));
		points.push(new Point(pos.x + dx, pos.y - dy));
		points.push(new Point(pos.x + dx, pos.y + dy));
		for (let point of points) {
			RotatePointWithCenter(point, pos, orientation);
		}

		points.push(points[0]);

		this.plotter.polyline(points, fill, lineWidth);
	}

	flashPadRoundRect(pos: Point, size: Size, cornerRadius: number, orientation: number, fill: Fill) {
	}

	flashPadOval(center: Point, size: Size, orientation: number, fill: Fill) {
		size = new Size(size.width, size.height);

		if (size.width > size.height) {
			[size.width, size.height] = [size.height, size.width];
			orientation = AddAngles(orientation, 900);
		}

		if (fill === Fill.FILLED_SHAPE) {
			let delta = size.height - size.width;
			let p0 = new Point(
				0,
				-delta / 2
			);
			let p1 = new Point(
				0,
				delta / 2
			);
			RotatePoint( p0, orientation);
			RotatePoint( p1, orientation);

			this.thickSegment(
				Point.add(center, p0),
				Point.add(center, p1),
				size.width,
				fill
			);
		} else {
			this.sketchOval( center, size, orientation, DEFAULT_LINE_WIDTH );
		}
	}

	sketchOval(pos: Point, size: Size, orientation: number, lineWidth: number) {
		this.plotter.setCurrentLineWidth(lineWidth);
		size = Size.from(size);

		if (size.width > size.height) {
			[size.width, size.height] = [size.height, size.width];
			orientation = AddAngles(orientation, 900);
		}

		const deltaxy = size.height - size.width;
		const radius  = (size.width - lineWidth) / 2;

		let c = new Point();
		c.x = -radius;
		c.y = -deltaxy / 2;
		RotatePoint(c, orientation);
		this.plotter.moveTo(Point.add(c, pos));
		c.x = -radius;
		c.y = deltaxy / 2;
		RotatePoint(c, orientation );
		this.plotter.finishTo(Point.add(c, pos));

		c.x = radius;
		c.y = -deltaxy / 2;
		RotatePoint( c, orientation );
		this.plotter.moveTo(Point.add(c, pos));
		c.x = radius;
		c.y = deltaxy / 2;
		RotatePoint( c, orientation );
		this.plotter.finishTo(Point.add(c, pos));

		c.x = 0;
		c.y = deltaxy / 2;
		RotatePoint( c, orientation );
		this.plotter.arc(
			Point.add(c, pos),
			orientation + 1800, orientation + 3600,
			radius, Fill.NO_FILL, DEFAULT_LINE_WIDTH
		);
		c.x = 0;
		c.y = -deltaxy / 2;
		RotatePoint( c, orientation );
		this.plotter.arc(
			Point.add(c, pos),
			orientation, orientation + 1800,
			radius, Fill.NO_FILL, DEFAULT_LINE_WIDTH
		);
	}

	segmentAsOval(start: Point, end: Point, lineWidth: number, fill: Fill) {
		const center = new Point(
			(start.x + end.x) / 2,
			(start.y + end.y) / 2
		);
		const size = new Size(
			end.x - start.x,
			end.y - start.y
		);

		let orientation = 0;
		if (size.height === 0) {
			orientation = 0;
		} else
		if (size.width === 0) {
			orientation = 900;
		} else {
			orientation = -ArcTangente( size.height, size.width );
		}

		size.width = EuclideanNorm(size) + lineWidth;
		size.height = lineWidth;

		this.flashPadOval( center, size, orientation, fill);
	}

	thickSegment(start: Point, end: Point, lineWidth: number, fill: Fill) {
		if (fill === Fill.FILLED_SHAPE) {
			this.plotter.setCurrentLineWidth(lineWidth);
			this.plotter.moveTo(start);
			this.plotter.finishTo(end);
		} else {
			this.plotter.setCurrentLineWidth(DEFAULT_LINE_WIDTH);
			this.segmentAsOval(start, end, lineWidth, fill);
		}
	}

	thickArc(center: Point, startAngle: number, endAngle: number, radius: number, lineWidth: number, fill: Fill) {
		if (fill === Fill.FILLED_SHAPE) {
			this.plotter.arc(center, startAngle, endAngle, radius, Fill.NO_FILL, lineWidth);
		} else {
			this.plotter.setCurrentLineWidth(DEFAULT_LINE_WIDTH);
			this.plotter.arc(center, startAngle, endAngle, radius - (lineWidth - DEFAULT_LINE_WIDTH) / 2, Fill.NO_FILL, lineWidth);
			this.plotter.arc(center, startAngle, endAngle, radius + (lineWidth - DEFAULT_LINE_WIDTH) / 2, Fill.NO_FILL, lineWidth);
		}
	}

	thickRect(p1: Point, p2: Point, lineWidth: number, fill: Fill) {
		if (fill === Fill.FILLED_SHAPE) {
			this.plotter.rect(p1, p2, Fill.NO_FILL, lineWidth);
		} else {
			this.plotter.setCurrentLineWidth(DEFAULT_LINE_WIDTH);
			const offsetp1 = new Point(
				p1.x - (lineWidth - DEFAULT_LINE_WIDTH) / 2,
				p1.y - (lineWidth - DEFAULT_LINE_WIDTH) / 2 
			);
			const offsetp2 = new Point(
				p2.x + (lineWidth - DEFAULT_LINE_WIDTH) / 2,
				p2.y + (lineWidth - DEFAULT_LINE_WIDTH) / 2 
			);
			this.plotter.rect( offsetp1, offsetp2, Fill.NO_FILL, DEFAULT_LINE_WIDTH );
			offsetp1.x += (lineWidth - DEFAULT_LINE_WIDTH);
			offsetp1.y += (lineWidth - DEFAULT_LINE_WIDTH);
			offsetp2.x -= (lineWidth - DEFAULT_LINE_WIDTH);
			offsetp2.y -= (lineWidth - DEFAULT_LINE_WIDTH);
			this.plotter.rect( offsetp1, offsetp2, Fill.NO_FILL, DEFAULT_LINE_WIDTH );
		}
	}

	thickCircle(pos: Point, diameter: number, lineWidth: number, fill: Fill) {
		if (fill === Fill.FILLED_SHAPE) {
			this.plotter.circle(pos, diameter, Fill.NO_FILL, lineWidth);
		} else {
			this.plotter.setCurrentLineWidth(DEFAULT_LINE_WIDTH);
			this.plotter.circle( pos, diameter - lineWidth + DEFAULT_LINE_WIDTH, Fill.NO_FILL, DEFAULT_LINE_WIDTH );
			this.plotter.circle( pos, diameter + lineWidth - DEFAULT_LINE_WIDTH, Fill.NO_FILL, DEFAULT_LINE_WIDTH );
		}
	}


	plotModule(mod: Module) {
		for (let edge of mod.graphics) {
			if (edge instanceof EdgeModule) {
				this.plotEdgeModule(edge, mod);
			}
		}

		for (let pad of mod.pads) {
			if (pad.shape === PadShape.CIRCLE) {
				this.flashPadCircle(pad.pos, pad.size.width, Fill.NO_FILL);
			} else
			if (pad.shape === PadShape.RECT) {
				this.flashPadRect(pad.pos, pad.size, pad.orientation, Fill.NO_FILL);
			} else
			if (pad.shape === PadShape.OVAL) {
				this.flashPadOval(pad.pos, pad.size, pad.orientation, Fill.NO_FILL);
			} else
			if (pad.shape === PadShape.TRAPEZOID) {
			} else
			if (pad.shape === PadShape.ROUNDRECT) {
			}
		}
	}

	plotEdgeModule(edge: EdgeModule, mod: Module) {
		console.log('plotEdgeModule', edge);
		this.plotter.setColor(this.getColor(edge.layer));

		const lineWidth = edge.lineWidth;
		const shape = edge.shape;
		let pos = Point.from(edge.start);
		let end = Point.from(edge.end);
		if (mod) {
			const angle = mod.orientation;
			RotatePoint(pos, angle);
			RotatePoint(end, angle);
			pos = Point.add(pos, mod.pos);
			end = Point.add(end, mod.pos);
		}

		if (shape === Shape.SEGMENT) {
			this.thickSegment(pos, end, lineWidth, this.getPlotMode());
		} else
		if (shape === Shape.ARC) {
			const radius = GetLineLength(pos, end);
			const startAngle  = ArcTangente( end.y - pos.y, end.x - pos.x );
			const endAngle = startAngle + edge.angle;
			this.thickArc( pos, -endAngle, -startAngle, radius, lineWidth, this.getPlotMode());
		} else
		if (shape === Shape.CIRCLE) {
			const radius = GetLineLength(pos, end);
			this.thickCircle(pos, radius * 2, lineWidth, this.getPlotMode());
		} else
		if (shape === Shape.POLYGON) {
			const points = edge.polyPoints;
			if (points.length <= 1) return;

			const corners: Array<Point> = [];
			for (let point of points) {
				let p = Point.from(point);
				if (mod) {
					RotatePoint(p, mod.orientation);
					p = Point.add(p, mod.pos);
				}
				corners.push(p);
			}
			this.plotter.polyline(corners, Fill.FILLED_SHAPE, lineWidth);
		} else {
			throw "unexpected shape " + shape;
		}
	}

	plotBoard(board: Board) {
		console.log('plotBoard', board);
	}

	plotBoardLayer(board: Board, layer: number) {
		this.plotter.setColor(this.getColor(layer));
	}

	plotStandardLayer(board: Board, layerMask: LSET) {
		console.log('plotStandardLayer');
		for (let mod of board.modules) {
			for (let edge of mod.graphics) {
				console.log('processing module edge', layerMask, edge.layer);
				if (!layerMask.has(edge.layer)) continue;

				if (edge instanceof EdgeModule) {
					this.plotEdgeModule(edge, mod);
				}
				console.log('processing module edge done');
			}
		}

		for (let mod of board.modules) {
			for (let pad of mod.pads) {
				if (!LSET.intersect(layerMask, pad.layers).length) continue;

				if (pad.shape === PadShape.CIRCLE) {
					this.flashPadCircle(pad.pos, pad.size.width, Fill.NO_FILL);
				} else
				if (pad.shape === PadShape.RECT) {
					this.flashPadRect(pad.pos, pad.size, pad.orientation, Fill.NO_FILL);
				} else
				if (pad.shape === PadShape.OVAL) {
					this.flashPadOval(pad.pos, pad.size, pad.orientation, Fill.NO_FILL);
				} else
				if (pad.shape === PadShape.TRAPEZOID) {
				} else
				if (pad.shape === PadShape.ROUNDRECT) {
				}
			}
		}
	}

	plotLayerOutline(board: Board, layerMask: LSET) {
	}

	plotSolderMaskLayer(board: Board, layerMask: LSET, minThickness: number) {
	}

	getColor(layer: number) {
		const color = DEFAULT_LAYER_COLORS[layer] || Color.BLACK;
		if (color.is(Color.WHITE)) {
			return Color.LIGHTGRAY;
		} else {
			return color;
		}
	}

	getPlotMode() {
		return Fill.FILLED_SHAPE;
	}
}
