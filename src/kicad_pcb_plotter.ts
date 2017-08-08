//#!tsc && NODE_PATH=dist/src node dist/sketch3.js 
//
import {
	Point,
	Fill,
	Size,
	RotatePoint,
	RotatePointWithCenter,
} from "./kicad_common";

import {
	Plotter,
} from "./kicad_plotter";

const DEFAULT_LINE_WIDTH = 6;

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
}
