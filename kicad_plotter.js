"use strict";
//#!tsc --target ES6 --noUnusedLocals --module commonjs kicad.ts && node kicad.js
// typings install ds~node
///<reference path="./typings/index.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
const kicad_common_1 = require("./kicad_common");
const kicad_lib_1 = require("./kicad_lib");
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
    plotComponent(component, offset, transform) {
        if (component.field) {
            const pos = kicad_common_1.Point.add(transform.transformCoordinate({ x: component.field.posx, y: component.field.posy }), offset);
            this.text(pos, "black", component.field.reference, component.field.textOrientation, component.field.textSize, kicad_common_1.TextHjustify.CENTER, kicad_common_1.TextVjustify.CENTER, 0, false, false);
        }
        if (component.fields[0]) {
            const pos = kicad_common_1.Point.add(transform.transformCoordinate({ x: component.fields[0].posx, y: component.fields[0].posy }), offset);
            this.text(pos, "black", component.fields[0].name, component.field.textOrientation, component.fields[0].textSize, kicad_common_1.TextHjustify.CENTER, kicad_common_1.TextVjustify.CENTER, 0, false, false);
        }
        for (let draw of component.draw.objects) {
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
                this.plotPin(draw, component, offset, transform);
            }
            else {
                throw 'unknown draw object type: ' + draw.constructor.name;
            }
        }
    }
    plotPin(draw, component, offset, transform) {
        this.plotPinTexts(draw, component, offset, transform);
        this.plotPinSymbol(draw, component, offset, transform);
    }
    plotPinTexts(draw, component, offset, transform) {
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
    plotPinSymbol(draw, component, offset, transform) {
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
