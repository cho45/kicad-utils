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
        this.layerMask = new kicad_pcb_1.LSET(kicad_pcb_1.PCB_LAYER_ID.F_Cu, kicad_pcb_1.PCB_LAYER_ID.B_Cu);
        this.plotOpt = new PCBPlotOptions();
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
            this.plotter.setFill(kicad_common_1.Fill.NO_FILL);
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
    plotTextModule(mod, text, color) {
        let pos = kicad_common_1.Point.from(text.pos);
        if (mod) {
            const angle = mod.orientation;
            kicad_common_1.RotatePoint(pos, angle);
            pos = kicad_common_1.Point.add(pos, mod.pos);
        }
        const size = text.mirror ? -text.size : text.size;
        this.plotter.text(pos, color, text.text, text.angle, size, text.hjustify, text.vjustify, text.lineWidth, text.italic, text.bold);
    }
    plotAllTextModule(mod) {
        if (this.layerMask.has(mod.reference.layer)) {
            this.plotTextModule(mod, mod.reference, this.getColor(mod.reference.layer));
        }
        if (this.layerMask.has(mod.value.layer)) {
            this.plotTextModule(mod, mod.value, this.getColor(mod.value.layer));
        }
        for (let text of mod.graphics) {
            if (!this.layerMask.has(text.layer))
                continue;
            if (text instanceof kicad_pcb_1.TextModule) {
                if (!text.visibility)
                    continue;
                this.plotTextModule(mod, text, this.getColor(text.layer));
            }
        }
    }
    plotEdgeModule(edge, mod) {
        // console.log('plotEdgeModule', edge);
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
            this.thickArc(pos, endAngle, startAngle, radius, lineWidth, this.getPlotMode());
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
        // console.log('plotBoard', board);
    }
    plotBoardLayer(board, layer) {
        this.plotter.setColor(this.getColor(layer));
    }
    plotStandardLayer(board) {
        console.log('plotStandardLayer');
        for (let mod of board.modules) {
            for (let pad of mod.pads) {
                if (!kicad_pcb_1.LSET.intersect(this.layerMask, pad.layers).length)
                    continue;
                const margin = new kicad_common_1.Size(0, 0);
                /*
                const maskOrPaste = new LSET(PCB_LAYER_ID.B_Mask, PCB_LAYER_ID.F_Mask, PCB_LAYER_ID.B_Paste, PCB_LAYER_ID.F_Paste);
                const anded = LSET.intersect(maskOrPaste, this.layerMask);
                if (anded.is(new LSET(PCB_LAYER_ID.F_Mask)) ||anded.is(new LSET(PCB_LAYER_ID.B_Mask))) {
                    margin.x = margin.y = pad.getSolderMaskMargin(mod);
                } else
                if (anded.is(new LSET(PCB_LAYER_ID.F_Paste)) ||anded.is(new LSET(PCB_LAYER_ID.B_Paste))) {
                    margin = pad.getSolderPasteMargin(mod);
                }
                */
                let color = kicad_common_1.Color.BLACK;
                if (pad.layers.has(kicad_pcb_1.PCB_LAYER_ID.B_Cu)) {
                    color = kicad_common_1.Color.GREEN;
                }
                if (pad.layers.has(kicad_pcb_1.PCB_LAYER_ID.F_Cu)) {
                    color = color.mix(kicad_common_1.Color.RED);
                }
                this.plotPad(board, pad, color, this.getPlotMode());
            }
        }
        for (let via of board.vias) {
            if (!this.layerMask.has(via.layer1) && this.layerMask.has(via.layer2))
                continue;
            const diameter = via.width + 2;
            if (diameter <= 0)
                continue;
            this.plotter.setColor(kicad_common_1.Color.BLACK);
            this.flashPadCircle(via.start, diameter, this.getPlotMode());
        }
        for (let track of board.tracks) {
            if (!this.layerMask.has(track.layer))
                continue;
            this.plotter.setColor(this.getColor(track.layer));
            this.thickSegment(track.start, track.end, track.width, this.getPlotMode());
        }
        for (let zone of board.zones) {
            if (!this.layerMask.has(zone.layer))
                continue;
            this.plotFilledAreas(board, zone);
        }
        for (let mod of board.modules) {
            if (!this.layerMask.has(mod.layer))
                continue;
            for (let edge of mod.graphics) {
                if (!this.layerMask.has(edge.layer))
                    continue;
                if (edge instanceof kicad_pcb_1.EdgeModule) {
                    this.plotEdgeModule(edge, mod);
                }
            }
        }
        this.plotDrillMarks(board);
    }
    plotSilkScreen(board) {
        this.plotBoardGraphicItems(board);
        for (let mod of board.modules) {
            this.plotAllTextModule(mod);
        }
    }
    plotLayerOutline(board) {
    }
    plotSolderMaskLayer(board, minThickness) {
    }
    plotBoardLayers(board, layerMask) {
        this.layerMask = layerMask;
        this.plotStandardLayer(board);
        this.plotSilkScreen(board);
    }
    plotOneBoardLayer(board, layerId) {
        const layerMask = new kicad_pcb_1.LSET(layerId);
        this.layerMask = layerMask;
        if (kicad_pcb_1.IsCopperLayer(layerId)) {
            this.plotOpt.skipNPTH_Pads = true;
            this.plotStandardLayer(board);
        }
        else {
            switch (layerId) {
                case kicad_pcb_1.PCB_LAYER_ID.B_Mask:
                case kicad_pcb_1.PCB_LAYER_ID.F_Mask:
                    this.plotOpt.skipNPTH_Pads = false;
                    this.plotOpt.drillMarks = DrillMarksType.NO_DRILL_SHAPE;
                    if (board.boardDesignSetting.solderMaskMinWidth === 0) {
                        this.plotStandardLayer(board);
                    }
                    else {
                        this.plotSolderMaskLayer(board, board.boardDesignSetting.solderMaskMinWidth);
                    }
                    break;
                case kicad_pcb_1.PCB_LAYER_ID.B_Adhes:
                case kicad_pcb_1.PCB_LAYER_ID.F_Adhes:
                case kicad_pcb_1.PCB_LAYER_ID.B_Paste:
                case kicad_pcb_1.PCB_LAYER_ID.F_Paste:
                    this.plotOpt.skipNPTH_Pads = false;
                    this.plotOpt.drillMarks = DrillMarksType.NO_DRILL_SHAPE;
                    this.plotStandardLayer(board);
                    break;
                case kicad_pcb_1.PCB_LAYER_ID.F_SilkS:
                case kicad_pcb_1.PCB_LAYER_ID.B_SilkS:
                    this.plotSilkScreen(board);
                    break;
                case kicad_pcb_1.PCB_LAYER_ID.Dwgs_User:
                case kicad_pcb_1.PCB_LAYER_ID.Cmts_User:
                case kicad_pcb_1.PCB_LAYER_ID.Eco1_User:
                case kicad_pcb_1.PCB_LAYER_ID.Eco2_User:
                case kicad_pcb_1.PCB_LAYER_ID.Edge_Cuts:
                case kicad_pcb_1.PCB_LAYER_ID.Margin:
                case kicad_pcb_1.PCB_LAYER_ID.F_CrtYd:
                case kicad_pcb_1.PCB_LAYER_ID.B_CrtYd:
                case kicad_pcb_1.PCB_LAYER_ID.F_Fab:
                case kicad_pcb_1.PCB_LAYER_ID.B_Fab:
                    this.plotOpt.skipNPTH_Pads = false;
                    this.plotOpt.drillMarks = DrillMarksType.NO_DRILL_SHAPE;
                    this.plotSilkScreen(board);
                    break;
                default:
                    this.plotOpt.skipNPTH_Pads = false;
                    this.plotOpt.drillMarks = DrillMarksType.NO_DRILL_SHAPE;
                    this.plotSilkScreen(board);
                    break;
            }
        }
    }
    plotFilledAreas(board, zone) {
        const polyList = zone.filledPolygons;
        if (!polyList.length)
            return;
        this.plotter.setColor(this.getColor(zone.layer));
        for (let poly of polyList) {
            const corners = [];
            for (let point of poly) {
                corners.push(point);
            }
            corners.push(corners[0]);
            if (this.getPlotMode() === kicad_common_1.Fill.FILLED_SHAPE) {
                if (zone.fillMode === 0) {
                    this.plotter.polyline(corners, kicad_common_1.Fill.FILLED_SHAPE, zone.minThickness);
                }
                else {
                    for (let segs of zone.fillSegments) {
                        for (let seg of segs) {
                            this.thickSegment(seg.start, seg.end, zone.minThickness, this.getPlotMode());
                        }
                    }
                    if (zone.minThickness > 0) {
                        this.plotter.polyline(corners, kicad_common_1.Fill.NO_FILL, zone.minThickness);
                    }
                }
            }
            else {
                if (zone.minThickness > 0) {
                    for (var i = 1, len = corners.length; i < len; i++) {
                        this.thickSegment(corners[i - 1], corners[i], zone.minThickness, this.getPlotMode());
                    }
                }
            }
        }
    }
    plotPad(board, pad, color, fill) {
        // console.log('plotPad', pad, color, fill);
        this.plotter.setColor(color);
        if (pad.shape === kicad_pcb_1.PadShape.CIRCLE) {
            this.flashPadCircle(pad.pos, pad.size.width, fill);
        }
        else if (pad.shape === kicad_pcb_1.PadShape.RECT) {
            this.flashPadRect(pad.pos, pad.size, pad.orientation, fill);
        }
        else if (pad.shape === kicad_pcb_1.PadShape.OVAL) {
            this.flashPadOval(pad.pos, pad.size, pad.orientation, fill);
        }
        else if (pad.shape === kicad_pcb_1.PadShape.TRAPEZOID) {
            // TODO
        }
        else if (pad.shape === kicad_pcb_1.PadShape.ROUNDRECT) {
            // TODO
        }
    }
    plotDrillMarks(board) {
        if (this.getPlotMode() === kicad_common_1.Fill.FILLED_SHAPE) {
            this.plotter.setColor(kicad_common_1.Color.WHITE);
        }
        for (let via of board.vias) {
            this.plotOneDrillMark(kicad_pcb_1.PadDrillShape.CIRCLE, via.start, new kicad_common_1.Size(via.drill, 0), new kicad_common_1.Size(via.width, 0), 0, 0);
        }
        for (let mod of board.modules) {
            for (let pad of mod.pads) {
                if (!pad.drillSize.width)
                    continue;
                this.plotOneDrillMark(pad.drillShape, pad.pos, pad.drillSize, pad.size, pad.orientation, 0);
            }
        }
    }
    plotOneDrillMark(shape, pos, drillSize, padSize, orientation, smallDrill) {
        drillSize = kicad_common_1.Size.from(drillSize);
        if (smallDrill && shape === kicad_pcb_1.PadDrillShape.CIRCLE) {
            drillSize.width = Math.min(smallDrill, drillSize.width);
        }
        drillSize.width = kicad_common_1.Clamp(1, drillSize.width, padSize.width - 1);
        drillSize.height = kicad_common_1.Clamp(1, drillSize.height, padSize.height - 1);
        if (shape === kicad_pcb_1.PadDrillShape.OBLONG) {
            this.flashPadOval(pos, drillSize, orientation, this.getPlotMode());
        }
        else {
            this.flashPadCircle(pos, drillSize.width, this.getPlotMode());
        }
    }
    plotBoardGraphicItems(board) {
        for (let seg of board.drawSegments) {
            this.plotDrawSegment(board, seg);
        }
        for (let dim of board.dimensions) {
            this.plotDimension(board, dim);
        }
        for (let text of board.texts) {
            this.plotBoardText(board, text);
        }
        for (let target of board.targets) {
            // TODO
        }
    }
    plotBoardText(board, text) {
        if (!this.layerMask.has(text.layer))
            return;
        const color = this.getColor(text.layer);
        const t = text.text.replace(/\\n/g, "\n");
        this.plotter.text(text.pos, color, t, text.angle, text.size, text.hjustify, text.vjustify, text.lineWidth, text.bold, text.italic);
    }
    plotDrawSegment(board, seg) {
        const start = kicad_common_1.Point.from(seg.start);
        const end = kicad_common_1.Point.from(seg.end);
        const lineWidth = seg.lineWidth;
        this.plotter.setColor(this.getColor(seg.layer));
        this.plotter.setCurrentLineWidth(lineWidth);
        if (seg.shape === kicad_pcb_1.Shape.CIRCLE) {
            const radius = kicad_common_1.GetLineLength(end, start);
            this.thickCircle(start, radius * 2, lineWidth, this.getPlotMode());
        }
        else if (seg.shape === kicad_pcb_1.Shape.ARC) {
            const radius = kicad_common_1.GetLineLength(end, start);
            const startAngle = kicad_common_1.ArcTangente(end.y - start.y, end.x - start.x);
            const endAngle = startAngle + seg.angle;
            this.thickArc(start, endAngle, startAngle, radius, lineWidth, this.getPlotMode());
        }
        else if (seg.shape === kicad_pcb_1.Shape.CURVE) {
            for (var i = 1, len = seg.bezierPoints.length; i < len; i++) {
                this.thickSegment(seg.bezierPoints[i - 1], seg.bezierPoints[i], lineWidth, this.getPlotMode());
            }
        }
        else {
            this.thickSegment(start, end, lineWidth, this.getPlotMode());
        }
    }
    plotDimension(board, dim) {
        if (!this.layerMask.has(dim.layer))
            return;
        const draw = new kicad_pcb_1.DrawSegment();
        draw.lineWidth = dim.lineWidth;
        draw.layer = dim.layer;
        this.plotter.setColor(this.getColor(dim.layer));
        console.log(dim.text);
        this.plotBoardText(board, dim.text);
        draw.start = dim.crossBarO;
        draw.end = dim.crossBarF;
        this.plotDrawSegment(board, draw);
        draw.start = dim.featureLineGO;
        draw.end = dim.featureLineGF;
        this.plotDrawSegment(board, draw);
        draw.start = dim.featureLineDO;
        draw.end = dim.featureLineDF;
        this.plotDrawSegment(board, draw);
        draw.start = dim.crossBarF;
        draw.end = dim.arrowD1F;
        this.plotDrawSegment(board, draw);
        draw.start = dim.crossBarF;
        draw.end = dim.arrowD2F;
        this.plotDrawSegment(board, draw);
        draw.start = dim.crossBarO;
        draw.end = dim.arrowG1F;
        this.plotDrawSegment(board, draw);
        draw.start = dim.crossBarO;
        draw.end = dim.arrowG2F;
        this.plotDrawSegment(board, draw);
    }
    getColor(layer) {
        const color = DEFAULT_LAYER_COLORS[layer] || kicad_common_1.Color.WHITE;
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
var DrillMarksType;
(function (DrillMarksType) {
    DrillMarksType[DrillMarksType["NO_DRILL_SHAPE"] = 0] = "NO_DRILL_SHAPE";
    DrillMarksType[DrillMarksType["SMALL_DRILL_SHAPE"] = 1] = "SMALL_DRILL_SHAPE";
    DrillMarksType[DrillMarksType["FULL_DRILL_SHAPE"] = 2] = "FULL_DRILL_SHAPE";
})(DrillMarksType = exports.DrillMarksType || (exports.DrillMarksType = {}));
class PCBPlotOptions {
    constructor() {
        this.drillMarks = DrillMarksType.SMALL_DRILL_SHAPE;
        this.skipNPTH_Pads = true;
    }
}
exports.PCBPlotOptions = PCBPlotOptions;
//# sourceMappingURL=kicad_pcb_plotter.js.map