"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 * IMPL is NOT COMPLETED!!
 */
const kicad_common_1 = require("./kicad_common");
const kicad_pcb_1 = require("./kicad_pcb");
const DEFAULT_LINE_WIDTH = 1;
const DEFAULT_LAYER_COLORS = [
    kicad_common_1.Color.RED, kicad_common_1.Color.YELLOW, kicad_common_1.Color.LIGHTMAGENTA, kicad_common_1.Color.LIGHTRED,
    kicad_common_1.Color.CYAN, kicad_common_1.Color.GREEN, kicad_common_1.Color.BLUE, kicad_common_1.Color.DARKGRAY,
    kicad_common_1.Color.MAGENTA, kicad_common_1.Color.LIGHTGRAY, kicad_common_1.Color.MAGENTA, kicad_common_1.Color.RED,
    kicad_common_1.Color.BROWN, kicad_common_1.Color.LIGHTGRAY, kicad_common_1.Color.BLUE, kicad_common_1.Color.GREEN,
    kicad_common_1.Color.RED, kicad_common_1.Color.YELLOW, kicad_common_1.Color.LIGHTMAGENTA, kicad_common_1.Color.LIGHTRED,
    kicad_common_1.Color.CYAN, kicad_common_1.Color.GREEN, kicad_common_1.Color.BLUE, kicad_common_1.Color.DARKGRAY,
    kicad_common_1.Color.MAGENTA, kicad_common_1.Color.LIGHTGRAY, kicad_common_1.Color.MAGENTA, kicad_common_1.Color.RED,
    kicad_common_1.Color.BROWN, kicad_common_1.Color.LIGHTGRAY, kicad_common_1.Color.BLUE, kicad_common_1.Color.GREEN,
    kicad_common_1.Color.BLUE, kicad_common_1.Color.MAGENTA,
    kicad_common_1.Color.LIGHTCYAN, kicad_common_1.Color.RED,
    kicad_common_1.Color.MAGENTA, kicad_common_1.Color.CYAN,
    kicad_common_1.Color.BROWN, kicad_common_1.Color.MAGENTA,
    kicad_common_1.Color.LIGHTGRAY,
    kicad_common_1.Color.BLUE,
    kicad_common_1.Color.GREEN, kicad_common_1.Color.YELLOW,
    kicad_common_1.Color.YELLOW,
    kicad_common_1.Color.LIGHTMAGENTA,
    kicad_common_1.Color.YELLOW,
    kicad_common_1.Color.DARKGRAY
];
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
    flashPadRoundRect(pos, size, cornerRadius, orientation, fill) {
    }
    flashPadOval(center, size, orientation, fill) {
        size = new kicad_common_1.Size(size.width, size.height);
        if (size.width > size.height) {
            [size.width, size.height] = [size.height, size.width];
            orientation = kicad_common_1.AddAngles(orientation, 900);
        }
        if (fill === kicad_common_1.Fill.FILLED_SHAPE) {
            let delta = size.height - size.width;
            let p0 = new kicad_common_1.Point(0, -delta / 2);
            let p1 = new kicad_common_1.Point(0, delta / 2);
            kicad_common_1.RotatePoint(p0, orientation);
            kicad_common_1.RotatePoint(p1, orientation);
            this.thickSegment(kicad_common_1.Point.add(center, p0), kicad_common_1.Point.add(center, p1), size.width, fill);
        }
        else {
            this.sketchOval(center, size, orientation, DEFAULT_LINE_WIDTH);
        }
    }
    sketchOval(pos, size, orientation, lineWidth) {
        this.plotter.setCurrentLineWidth(lineWidth);
        size = kicad_common_1.Size.from(size);
        if (size.width > size.height) {
            [size.width, size.height] = [size.height, size.width];
            orientation = kicad_common_1.AddAngles(orientation, 900);
        }
        const deltaxy = size.height - size.width;
        const radius = (size.width - lineWidth) / 2;
        let c = new kicad_common_1.Point();
        c.x = -radius;
        c.y = -deltaxy / 2;
        kicad_common_1.RotatePoint(c, orientation);
        this.plotter.moveTo(kicad_common_1.Point.add(c, pos));
        c.x = -radius;
        c.y = deltaxy / 2;
        kicad_common_1.RotatePoint(c, orientation);
        this.plotter.finishTo(kicad_common_1.Point.add(c, pos));
        c.x = radius;
        c.y = -deltaxy / 2;
        kicad_common_1.RotatePoint(c, orientation);
        this.plotter.moveTo(kicad_common_1.Point.add(c, pos));
        c.x = radius;
        c.y = deltaxy / 2;
        kicad_common_1.RotatePoint(c, orientation);
        this.plotter.finishTo(kicad_common_1.Point.add(c, pos));
        c.x = 0;
        c.y = deltaxy / 2;
        kicad_common_1.RotatePoint(c, orientation);
        this.plotter.arc(kicad_common_1.Point.add(c, pos), orientation + 1800, orientation + 3600, radius, kicad_common_1.Fill.NO_FILL, DEFAULT_LINE_WIDTH);
        c.x = 0;
        c.y = -deltaxy / 2;
        kicad_common_1.RotatePoint(c, orientation);
        this.plotter.arc(kicad_common_1.Point.add(c, pos), orientation, orientation + 1800, radius, kicad_common_1.Fill.NO_FILL, DEFAULT_LINE_WIDTH);
    }
    segmentAsOval(start, end, lineWidth, fill) {
        const center = new kicad_common_1.Point((start.x + end.x) / 2, (start.y + end.y) / 2);
        const size = new kicad_common_1.Size(end.x - start.x, end.y - start.y);
        let orientation = 0;
        if (size.height === 0) {
            orientation = 0;
        }
        else if (size.width === 0) {
            orientation = 900;
        }
        else {
            orientation = -kicad_common_1.ArcTangente(size.height, size.width);
        }
        size.width = kicad_common_1.EuclideanNorm(size) + lineWidth;
        size.height = lineWidth;
        this.flashPadOval(center, size, orientation, fill);
    }
    thickSegment(start, end, lineWidth, fill) {
        if (fill === kicad_common_1.Fill.FILLED_SHAPE) {
            this.plotter.setCurrentLineWidth(lineWidth);
            this.plotter.moveTo(start);
            this.plotter.finishTo(end);
        }
        else {
            this.plotter.setCurrentLineWidth(DEFAULT_LINE_WIDTH);
            this.segmentAsOval(start, end, lineWidth, fill);
        }
    }
    thickArc(center, startAngle, endAngle, radius, lineWidth, fill) {
        if (fill === kicad_common_1.Fill.FILLED_SHAPE) {
            this.plotter.arc(center, startAngle, endAngle, radius, kicad_common_1.Fill.NO_FILL, lineWidth);
        }
        else {
            this.plotter.setCurrentLineWidth(DEFAULT_LINE_WIDTH);
            this.plotter.arc(center, startAngle, endAngle, radius - (lineWidth - DEFAULT_LINE_WIDTH) / 2, kicad_common_1.Fill.NO_FILL, lineWidth);
            this.plotter.arc(center, startAngle, endAngle, radius + (lineWidth - DEFAULT_LINE_WIDTH) / 2, kicad_common_1.Fill.NO_FILL, lineWidth);
        }
    }
    thickRect(p1, p2, lineWidth, fill) {
        if (fill === kicad_common_1.Fill.FILLED_SHAPE) {
            this.plotter.rect(p1, p2, kicad_common_1.Fill.NO_FILL, lineWidth);
        }
        else {
            this.plotter.setCurrentLineWidth(DEFAULT_LINE_WIDTH);
            const offsetp1 = new kicad_common_1.Point(p1.x - (lineWidth - DEFAULT_LINE_WIDTH) / 2, p1.y - (lineWidth - DEFAULT_LINE_WIDTH) / 2);
            const offsetp2 = new kicad_common_1.Point(p2.x + (lineWidth - DEFAULT_LINE_WIDTH) / 2, p2.y + (lineWidth - DEFAULT_LINE_WIDTH) / 2);
            this.plotter.rect(offsetp1, offsetp2, kicad_common_1.Fill.NO_FILL, DEFAULT_LINE_WIDTH);
            offsetp1.x += (lineWidth - DEFAULT_LINE_WIDTH);
            offsetp1.y += (lineWidth - DEFAULT_LINE_WIDTH);
            offsetp2.x -= (lineWidth - DEFAULT_LINE_WIDTH);
            offsetp2.y -= (lineWidth - DEFAULT_LINE_WIDTH);
            this.plotter.rect(offsetp1, offsetp2, kicad_common_1.Fill.NO_FILL, DEFAULT_LINE_WIDTH);
        }
    }
    thickCircle(pos, diameter, lineWidth, fill) {
        if (fill === kicad_common_1.Fill.FILLED_SHAPE) {
            this.plotter.circle(pos, diameter, kicad_common_1.Fill.NO_FILL, lineWidth);
        }
        else {
            this.plotter.setCurrentLineWidth(DEFAULT_LINE_WIDTH);
            this.plotter.circle(pos, diameter - lineWidth + DEFAULT_LINE_WIDTH, kicad_common_1.Fill.NO_FILL, DEFAULT_LINE_WIDTH);
            this.plotter.circle(pos, diameter + lineWidth - DEFAULT_LINE_WIDTH, kicad_common_1.Fill.NO_FILL, DEFAULT_LINE_WIDTH);
        }
    }
    plotModule(mod) {
        for (let edge of mod.graphics) {
            if (edge instanceof kicad_pcb_1.EdgeModule) {
                this.plotEdgeModule(edge, mod);
            }
        }
        for (let pad of mod.pads) {
            if (pad.shape === kicad_pcb_1.PadShape.CIRCLE) {
                this.flashPadCircle(pad.pos, pad.size.width, kicad_common_1.Fill.NO_FILL);
            }
            else if (pad.shape === kicad_pcb_1.PadShape.RECT) {
                this.flashPadRect(pad.pos, pad.size, pad.orientation, kicad_common_1.Fill.NO_FILL);
            }
            else if (pad.shape === kicad_pcb_1.PadShape.OVAL) {
                this.flashPadOval(pad.pos, pad.size, pad.orientation, kicad_common_1.Fill.NO_FILL);
            }
            else if (pad.shape === kicad_pcb_1.PadShape.TRAPEZOID) {
            }
            else if (pad.shape === kicad_pcb_1.PadShape.ROUNDRECT) {
            }
        }
    }
    plotEdgeModule(edge, mod) {
        console.log('plotEdgeModule', edge);
        this.plotter.setColor(this.getColor(edge.layer));
        const lineWidth = edge.lineWidth;
        const shape = edge.shape;
        let pos = kicad_common_1.Point.from(edge.start);
        let end = kicad_common_1.Point.from(edge.end);
        if (mod) {
            const angle = mod.orientation;
            kicad_common_1.RotatePoint(pos, angle);
            kicad_common_1.RotatePoint(end, angle);
            pos = kicad_common_1.Point.add(pos, mod.pos);
            end = kicad_common_1.Point.add(end, mod.pos);
        }
        if (shape === kicad_pcb_1.Shape.SEGMENT) {
            this.thickSegment(pos, end, lineWidth, this.getPlotMode());
        }
        else if (shape === kicad_pcb_1.Shape.ARC) {
            const radius = kicad_common_1.GetLineLength(pos, end);
            const startAngle = kicad_common_1.ArcTangente(end.y - pos.y, end.x - pos.x);
            const endAngle = startAngle + edge.angle;
            this.thickArc(pos, -endAngle, -startAngle, radius, lineWidth, this.getPlotMode());
        }
        else if (shape === kicad_pcb_1.Shape.CIRCLE) {
            const radius = kicad_common_1.GetLineLength(pos, end);
            this.thickCircle(pos, radius * 2, lineWidth, this.getPlotMode());
        }
        else if (shape === kicad_pcb_1.Shape.POLYGON) {
            const points = edge.polyPoints;
            if (points.length <= 1)
                return;
            const corners = [];
            for (let point of points) {
                let p = kicad_common_1.Point.from(point);
                if (mod) {
                    kicad_common_1.RotatePoint(p, mod.orientation);
                    p = kicad_common_1.Point.add(p, mod.pos);
                }
                corners.push(p);
            }
            this.plotter.polyline(corners, kicad_common_1.Fill.FILLED_SHAPE, lineWidth);
        }
        else {
            throw "unexpected shape " + shape;
        }
    }
    plotBoard(board) {
        console.log('plotBoard', board);
    }
    plotBoardLayer(board, layer) {
        this.plotter.setColor(this.getColor(layer));
    }
    plotStandardLayer(board, layerMask) {
        console.log('plotStandardLayer');
        for (let mod of board.modules) {
            for (let edge of mod.graphics) {
                console.log('processing module edge', layerMask, edge.layer);
                if (!layerMask.has(edge.layer))
                    continue;
                if (edge instanceof kicad_pcb_1.EdgeModule) {
                    this.plotEdgeModule(edge, mod);
                }
                console.log('processing module edge done');
            }
        }
        for (let mod of board.modules) {
            for (let pad of mod.pads) {
                if (!kicad_pcb_1.LSET.intersect(layerMask, pad.layers).length)
                    continue;
                if (pad.shape === kicad_pcb_1.PadShape.CIRCLE) {
                    this.flashPadCircle(pad.pos, pad.size.width, kicad_common_1.Fill.NO_FILL);
                }
                else if (pad.shape === kicad_pcb_1.PadShape.RECT) {
                    this.flashPadRect(pad.pos, pad.size, pad.orientation, kicad_common_1.Fill.NO_FILL);
                }
                else if (pad.shape === kicad_pcb_1.PadShape.OVAL) {
                    this.flashPadOval(pad.pos, pad.size, pad.orientation, kicad_common_1.Fill.NO_FILL);
                }
                else if (pad.shape === kicad_pcb_1.PadShape.TRAPEZOID) {
                }
                else if (pad.shape === kicad_pcb_1.PadShape.ROUNDRECT) {
                }
            }
        }
    }
    plotLayerOutline(board, layerMask) {
    }
    plotSolderMaskLayer(board, layerMask, minThickness) {
    }
    getColor(layer) {
        const color = DEFAULT_LAYER_COLORS[layer] || kicad_common_1.Color.BLACK;
        if (color.is(kicad_common_1.Color.WHITE)) {
            return kicad_common_1.Color.LIGHTGRAY;
        }
        else {
            return color;
        }
    }
    getPlotMode() {
        return kicad_common_1.Fill.FILLED_SHAPE;
    }
}
exports.PCBPlotter = PCBPlotter;
//# sourceMappingURL=kicad_pcb_plotter.js.map