"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//#!tsc && NODE_PATH=dist/src node dist/sketch3.js 
//
const kicad_common_1 = require("./kicad_common");
const DEFAULT_LINE_WIDTH = 6;
// pcbnew/plot_board_layers.cpp
// pcbnew/plot_brditems_plotter.cpp 
class PCBPlotter {
    constructor(plotter) {
        this.plotter = plotter;
    }
    flashPadCircle(pos, dia, fill) {
        if (fill === kicad_common_1.Fill.FILLED_SHAPE) {
            this.plotter.circle(pos, dia, fill, 0);
        }
        else {
            let lineWidth = DEFAULT_LINE_WIDTH;
            this.plotter.setCurrentLineWidth(lineWidth);
            if (lineWidth > dia - 2)
                lineWidth = dia - 2;
            this.plotter.circle(pos, dia - lineWidth, kicad_common_1.Fill.NO_FILL, lineWidth);
        }
    }
    flashPadRect(pos, size, orientation, fill) {
        const points = [];
        let lineWidth = DEFAULT_LINE_WIDTH;
        if (fill === kicad_common_1.Fill.FILLED_SHAPE) {
            this.plotter.setCurrentLineWidth(0);
        }
        else {
            this.plotter.setCurrentLineWidth(lineWidth);
        }
        let width = size.width - lineWidth;
        let height = size.height - lineWidth;
        if (width < 1)
            width = 1;
        if (height < 1)
            height = 1;
        const dx = width / 2;
        const dy = height / 2;
        points.push(new kicad_common_1.Point(pos.x - dx, pos.y + dy));
        points.push(new kicad_common_1.Point(pos.x - dx, pos.y - dy));
        points.push(new kicad_common_1.Point(pos.x + dx, pos.y - dy));
        points.push(new kicad_common_1.Point(pos.x + dx, pos.y + dy));
        for (let point of points) {
            kicad_common_1.RotatePointWithCenter(point, pos, orientation);
        }
        points.push(points[0]);
        this.plotter.polyline(points, fill, lineWidth);
    }
}
exports.PCBPlotter = PCBPlotter;
//# sourceMappingURL=kicad_pcb_plotter.js.map