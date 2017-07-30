"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const kicad_common_1 = require("kicad_common");
const kicad_lib_1 = require("kicad_lib");
/**
 * similar to KiCAD Plotter
 *
 */
class Plotter {
    moveTo(x, y) {
        if (typeof y === 'number') {
            this.penTo({ x: x, y: y }, "U");
        }
        else {
            this.penTo(x, "U");
        }
    }
    lineTo(x, y) {
        if (typeof y === 'number') {
            this.penTo({ x: x, y: y }, "D");
        }
        else {
            this.penTo(x, "D");
        }
    }
    finishTo(x, y) {
        if (typeof y === 'number') {
            this.penTo({ x: x, y: y }, "D");
            this.penTo({ x: x, y: y }, "Z");
        }
        else {
            this.penTo(x, "D");
            this.penTo(x, "Z");
        }
    }
    finishPen() {
        this.penTo({ x: 0, y: 0 }, "Z");
    }
    /**
     * kicad-js implements plot methods to plotter instead of each library items.
     */
    plotLibComponent(component, unit, convert, offset, transform) {
        if (component.field) {
            const pos = kicad_common_1.Point.add(transform.transformCoordinate({ x: component.field.posx, y: component.field.posy }), offset);
            this.text(pos, "black", component.field.reference, component.field.textOrientation, component.field.textSize, kicad_common_1.TextHjustify.CENTER, kicad_common_1.TextVjustify.CENTER, 0, false, false);
        }
        if (component.fields[0]) {
            const pos = kicad_common_1.Point.add(transform.transformCoordinate({ x: component.fields[0].posx, y: component.fields[0].posy }), offset);
            this.text(pos, "black", component.fields[0].name, component.field.textOrientation, component.fields[0].textSize, kicad_common_1.TextHjustify.CENTER, kicad_common_1.TextVjustify.CENTER, 0, false, false);
        }
        for (let draw of component.draw.objects) {
            if (draw.unit !== 0 && unit !== draw.unit) {
                continue;
            }
            ;
            if (draw.convert !== 0 && convert !== draw.convert) {
                continue;
            }
            if (draw instanceof kicad_lib_1.DrawArc) {
                const pos = kicad_common_1.Point.add(transform.transformCoordinate({ x: draw.posx, y: draw.posy }), offset);
                const [startAngle, endAngle] = transform.mapAngles(draw.startAngle, draw.endAngle);
                this.arc(pos, startAngle, endAngle, draw.radius, draw.fill, kicad_common_1.DEFAULT_LINE_WIDTH);
            }
            else if (draw instanceof kicad_lib_1.DrawCircle) {
                const pos = kicad_common_1.Point.add(transform.transformCoordinate({ x: draw.posx, y: draw.posy }), offset);
                this.circle(pos, draw.radius * 2, draw.fill, kicad_common_1.DEFAULT_LINE_WIDTH);
            }
            else if (draw instanceof kicad_lib_1.DrawPolyline) {
                const points = [];
                for (let i = 0, len = draw.points.length; i < len; i += 2) {
                    const pos = kicad_common_1.Point.add(transform.transformCoordinate({ x: draw.points[i], y: draw.points[i + 1] }), offset);
                    points.push(pos);
                }
                this.polyline(points, draw.fill, kicad_common_1.DEFAULT_LINE_WIDTH);
            }
            else if (draw instanceof kicad_lib_1.DrawSquare) {
                const pos1 = kicad_common_1.Point.add(transform.transformCoordinate({ x: draw.startx, y: draw.starty }), offset);
                const pos2 = kicad_common_1.Point.add(transform.transformCoordinate({ x: draw.endx, y: draw.endy }), offset);
                this.rect(pos1, pos2, draw.fill, kicad_common_1.DEFAULT_LINE_WIDTH);
            }
            else if (draw instanceof kicad_lib_1.DrawText) {
                const pos = kicad_common_1.Point.add(transform.transformCoordinate({ x: draw.posx, y: draw.posy }), offset);
                this.text(pos, "black", draw.text, component.field.textOrientation, draw.textSize, kicad_common_1.TextHjustify.CENTER, kicad_common_1.TextVjustify.CENTER, 0, false, false);
            }
            else if (draw instanceof kicad_lib_1.DrawPin) {
                this.plotDrawPin(draw, component, offset, transform);
            }
            else {
                throw 'unknown draw object type: ' + draw.constructor.name;
            }
        }
    }
    plotDrawPin(draw, component, offset, transform) {
        this.plotDrawPinTexts(draw, component, offset, transform);
        this.plotDrawPinSymbol(draw, component, offset, transform);
    }
    plotDrawPinTexts(draw, component, offset, transform) {
        const pos = kicad_common_1.Point.add(transform.transformCoordinate({ x: draw.posx, y: draw.posy }), offset);
        let x1 = pos.x, y1 = pos.y;
        if (draw.orientation === kicad_common_1.PinOrientation.UP) {
            y1 -= draw.length;
        }
        else if (draw.orientation === kicad_common_1.PinOrientation.DOWN) {
            y1 += draw.length;
        }
        else if (draw.orientation === kicad_common_1.PinOrientation.LEFT) {
            x1 -= draw.length;
        }
        else if (draw.orientation === kicad_common_1.PinOrientation.RIGHT) {
            x1 += draw.length;
        }
        const nameOffset = 4;
        const numOffset = 4;
        const textInside = component.textOffset;
        const isHorizontal = draw.orientation === kicad_common_1.PinOrientation.LEFT || draw.orientation === kicad_common_1.PinOrientation.RIGHT;
        if (textInside) {
            if (isHorizontal) {
                if (component.drawPinname) {
                    if (draw.orientation === kicad_common_1.PinOrientation.RIGHT) {
                        this.text({ x: x1 + textInside, y: y1 }, "black", draw.name, kicad_common_1.TextAngle.HORIZ, draw.nameTextSize, kicad_common_1.TextHjustify.LEFT, kicad_common_1.TextVjustify.CENTER, 0, false, false);
                    }
                    else {
                        this.text({ x: x1 - textInside, y: y1 }, "black", draw.name, kicad_common_1.TextAngle.HORIZ, draw.nameTextSize, kicad_common_1.TextHjustify.RIGHT, kicad_common_1.TextVjustify.CENTER, 0, false, false);
                    }
                }
                if (component.drawPinnumber) {
                    this.text({ x: (x1 + pos.x) / 2, y: y1 + numOffset }, "black", draw.name, kicad_common_1.TextAngle.HORIZ, draw.nameTextSize, kicad_common_1.TextHjustify.CENTER, kicad_common_1.TextVjustify.BOTTOM, 0, false, false);
                }
            }
            else {
                if (draw.orientation === kicad_common_1.PinOrientation.DOWN) {
                    if (component.drawPinname) {
                        this.text({ x: x1, y: y1 + textInside }, "black", draw.name, kicad_common_1.TextAngle.VERT, draw.nameTextSize, kicad_common_1.TextHjustify.RIGHT, kicad_common_1.TextVjustify.CENTER, 0, false, false);
                    }
                    if (component.drawPinnumber) {
                        this.text({ x: x1 - numOffset, y: (y1 + pos.y) / 2 }, "black", draw.name, kicad_common_1.TextAngle.VERT, draw.nameTextSize, kicad_common_1.TextHjustify.RIGHT, kicad_common_1.TextVjustify.CENTER, 0, false, false);
                    }
                }
                else {
                    if (component.drawPinname) {
                        this.text({ x: x1, y: y1 - textInside }, "black", draw.name, kicad_common_1.TextAngle.VERT, draw.nameTextSize, kicad_common_1.TextHjustify.LEFT, kicad_common_1.TextVjustify.CENTER, 0, false, false);
                    }
                    if (component.drawPinnumber) {
                        this.text({ x: x1 - numOffset, y: (y1 + pos.y) / 2 }, "black", draw.name, kicad_common_1.TextAngle.VERT, draw.nameTextSize, kicad_common_1.TextHjustify.CENTER, kicad_common_1.TextVjustify.BOTTOM, 0, false, false);
                    }
                }
            }
        }
        else {
            if (isHorizontal) {
                if (component.drawPinname) {
                    this.text({ x: (x1 + pos.x) / 2, y: y1 - nameOffset }, "black", draw.name, kicad_common_1.TextAngle.HORIZ, draw.nameTextSize, kicad_common_1.TextHjustify.CENTER, kicad_common_1.TextVjustify.BOTTOM, 0, false, false);
                }
                if (component.drawPinnumber) {
                    this.text({ x: (x1 + pos.x) / 2, y: y1 + numOffset }, "black", draw.num, kicad_common_1.TextAngle.HORIZ, draw.numTextSize, kicad_common_1.TextHjustify.CENTER, kicad_common_1.TextVjustify.TOP, 0, false, false);
                }
            }
            else {
                if (component.drawPinname) {
                    this.text({ x: x1 - nameOffset, y: (y1 + pos.y) / 2 }, "black", draw.name, kicad_common_1.TextAngle.VERT, draw.nameTextSize, kicad_common_1.TextHjustify.CENTER, kicad_common_1.TextVjustify.BOTTOM, 0, false, false);
                }
                if (component.drawPinnumber) {
                    this.text({ x: x1 + numOffset, y: (y1 + pos.y) / 2 }, "black", draw.num, kicad_common_1.TextAngle.VERT, draw.numTextSize, kicad_common_1.TextHjustify.CENTER, kicad_common_1.TextVjustify.TOP, 0, false, false);
                }
            }
        }
    }
    plotDrawPinSymbol(draw, component, offset, transform) {
        const pos = kicad_common_1.Point.add(transform.transformCoordinate({ x: draw.posx, y: draw.posy }), offset);
        const orientation = this.pinDrawOrientation(draw, transform);
        let x1 = pos.x, y1 = pos.y;
        let mapX1 = 0, mapY1 = 0;
        if (orientation === kicad_common_1.PinOrientation.UP) {
            y1 -= draw.length;
            mapY1 = 1;
        }
        else if (orientation === kicad_common_1.PinOrientation.DOWN) {
            y1 += draw.length;
            mapY1 = -1;
        }
        else if (orientation === kicad_common_1.PinOrientation.LEFT) {
            x1 -= draw.length;
            mapX1 = 1;
        }
        else if (orientation === kicad_common_1.PinOrientation.RIGHT) {
            x1 += draw.length;
            mapX1 = -1;
        }
        // TODO shape
        this.fill = kicad_common_1.Fill.NO_FILL;
        this.setCurrentLineWidth(kicad_common_1.DEFAULT_LINE_WIDTH);
        this.moveTo({ x: x1, y: y1 });
        this.finishTo({ x: pos.x, y: pos.y });
        this.circle({ x: pos.x, y: pos.y }, 20, kicad_common_1.Fill.NO_FILL, 2);
    }
    pinDrawOrientation(draw, transform) {
        let end = { x: 0, y: 0 };
        if (draw.orientation === kicad_common_1.PinOrientation.UP) {
            end.y = 1;
        }
        else if (draw.orientation === kicad_common_1.PinOrientation.DOWN) {
            end.y = -1;
        }
        else if (draw.orientation === kicad_common_1.PinOrientation.LEFT) {
            end.x = -1;
        }
        else if (draw.orientation === kicad_common_1.PinOrientation.RIGHT) {
            end.x = 1;
        }
        end = transform.transformCoordinate(end);
        if (end.x === 0) {
            if (end.y > 0) {
                return kicad_common_1.PinOrientation.DOWN;
            }
            else {
                return kicad_common_1.PinOrientation.UP;
            }
        }
        else {
            if (end.x < 0) {
                return kicad_common_1.PinOrientation.LEFT;
            }
            else {
                return kicad_common_1.PinOrientation.RIGHT;
            }
        }
    }
}
exports.Plotter = Plotter;
class CanvasPlotter extends Plotter {
    constructor(ctx) {
        super();
        this.ctx = ctx;
        this.penState = "Z";
        this.fill = kicad_common_1.Fill.NO_FILL;
        this.ctx.lineCap = "round";
        this.ctx.strokeStyle = "#000";
    }
    rect(p1, p2, fill, width) {
        this.setCurrentLineWidth(width);
        this.fill = fill;
        this.moveTo(p1.x, p1.y);
        this.lineTo(p1.x, p2.y);
        this.lineTo(p2.x, p2.y);
        this.lineTo(p2.x, p1.y);
        this.finishTo(p1.x, p1.y);
    }
    circle(p, dia, fill, width) {
        this.setCurrentLineWidth(width);
        this.fill = fill;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, dia / 2, 0, Math.PI * 2, false);
        if (fill === kicad_common_1.Fill.FILLED_SHAPE) {
            this.ctx.fill();
        }
        else {
            this.ctx.stroke();
        }
    }
    arc(p, startAngle, endAngle, radius, fill, width) {
        this.setCurrentLineWidth(width);
        this.fill = fill;
        this.ctx.beginPath();
        const anticlockwise = false;
        //		this.ctx.save();
        //		this.ctx.scale(1, -1);
        this.ctx.arc(p.x, p.y, radius, startAngle / 10 * Math.PI / 180, endAngle / 10 * Math.PI / 180, anticlockwise);
        if (fill === kicad_common_1.Fill.FILLED_SHAPE) {
            this.ctx.fill();
        }
        else {
            this.ctx.stroke();
        }
        //		this.ctx.restore();
    }
    polyline(points, fill, width) {
        this.setCurrentLineWidth(width);
        this.fill = fill;
        this.moveTo(points[0]);
        for (var i = 1, len = points.length; i < len; i++) {
            this.lineTo(points[i]);
        }
        this.finishPen();
    }
    text(p, color, text, orientation, size, hjustfy, vjustify, width, italic, bold, multiline) {
        if (hjustfy === kicad_common_1.TextHjustify.LEFT) {
            this.ctx.textAlign = "left";
        }
        else if (hjustfy === kicad_common_1.TextHjustify.CENTER) {
            this.ctx.textAlign = "center";
        }
        else if (hjustfy === kicad_common_1.TextHjustify.RIGHT) {
            this.ctx.textAlign = "right";
        }
        if (vjustify === kicad_common_1.TextVjustify.TOP) {
            this.ctx.textBaseline = "top";
        }
        else if (vjustify === kicad_common_1.TextVjustify.CENTER) {
            this.ctx.textBaseline = "middle";
        }
        else if (vjustify === kicad_common_1.TextVjustify.BOTTOM) {
            this.ctx.textBaseline = "bottom";
        }
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(-kicad_common_1.DECIDEG2RAD(orientation));
        this.ctx.font = size + "px monospace";
        this.ctx.fillText(text, 0, 0);
        this.ctx.restore();
    }
    /**
     * U = Pen is up
     * D = Pen is down
     * Z = Pen is outof canvas
     */
    penTo(p, s) {
        if (s === "Z") {
            if (this.fill === kicad_common_1.Fill.FILLED_SHAPE) {
                // console.log('ctx.fill', p);
                this.ctx.fill();
            }
            else {
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
        }
        else {
            if (s === "U") {
                // console.log('ctx.moveTo', p);
                this.ctx.moveTo(p.x, p.y);
            }
            else {
                // console.log('ctx.lineTo', p);
                this.ctx.lineTo(p.x, p.y);
            }
        }
        this.penState = s;
    }
    setCurrentLineWidth(w) {
        this.ctx.lineWidth = w;
    }
}
exports.CanvasPlotter = CanvasPlotter;
//# sourceMappingURL=kicad_plotter.js.map