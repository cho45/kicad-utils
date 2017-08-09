"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const kicad_common_1 = require("./kicad_common");
const kicad_strokefont_1 = require("./kicad_strokefont");
const DEFAULT_LINE_WIDTH = 6;
/**
 * similar to KiCAD Plotter
 *
 */
class Plotter {
    constructor() {
        this.stateHistory = [];
        this.errors = [];
        this.pageInfo = kicad_common_1.PageInfo.A3;
        this.fill = kicad_common_1.Fill.NO_FILL;
        this.color = kicad_common_1.Color.BLACK;
        this.transform = kicad_common_1.Transform.identify();
        this.font = kicad_strokefont_1.StrokeFont.instance;
    }
    setFill(fill) {
        this.fill = fill;
    }
    startPlot() { }
    endPlot() { }
    rect(p1, p2, fill, width) {
        this.setCurrentLineWidth(width);
        this.setFill(fill);
        this.moveTo(p1.x, p1.y);
        this.lineTo(p1.x, p2.y);
        this.lineTo(p2.x, p2.y);
        this.lineTo(p2.x, p1.y);
        this.finishTo(p1.x, p1.y);
    }
    polyline(points, fill, width) {
        this.setCurrentLineWidth(width);
        this.setFill(fill);
        this.moveTo(points[0]);
        for (var i = 1, len = points.length; i < len; i++) {
            this.lineTo(points[i]);
        }
        this.finishPen();
    }
    text(p, color, text, orientation, size, hjustfy, vjustify, width, italic, bold, multiline) {
        this.setColor(color);
        this.setFill(kicad_common_1.Fill.NO_FILL);
        this.font.drawText(this, p, text, size, width, orientation, hjustfy, vjustify, italic, bold);
    }
    save() {
        this.stateHistory.push({
            fill: this.fill,
            color: this.color,
            transform: this.transform.clone(),
        });
    }
    translate(tx, ty) {
        this.transform = this.transform.translate(tx, ty);
    }
    scale(sx, sy) {
        this.transform = this.transform.scale(sx, sy);
    }
    rotate(radian) {
        this.transform = this.transform.rotate(radian);
    }
    restore() {
        const state = this.stateHistory.pop();
        Object.assign(this, state);
    }
    setColor(c) {
        this.color = c;
    }
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
}
exports.Plotter = Plotter;
class CanvasPlotter extends Plotter {
    constructor(ctx) {
        super();
        this.ctx = ctx;
        this.penState = "Z";
        this.setFill(kicad_common_1.Fill.NO_FILL);
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = 'round';
        this.ctx.strokeStyle = "#000";
    }
    circle(p, dia, fill, width) {
        p = this.transform.transformCoordinate(p);
        this.setCurrentLineWidth(width);
        this.setFill(fill);
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
        p = this.transform.transformCoordinate(p);
        this.setCurrentLineWidth(width);
        this.setFill(fill);
        this.ctx.beginPath();
        const anticlockwise = false;
        this.ctx.arc(p.x, p.y, radius, startAngle / 10 * Math.PI / 180, endAngle / 10 * Math.PI / 180, anticlockwise);
        if (fill === kicad_common_1.Fill.FILLED_SHAPE) {
            this.ctx.fill();
        }
        else {
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
    penTo(p, s) {
        p = this.transform.transformCoordinate(p);
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
    setColor(c) {
        super.setColor(c);
        this.ctx.fillStyle = c.toCSSColor();
        this.ctx.strokeStyle = c.toCSSColor();
    }
    setCurrentLineWidth(w) {
        this.ctx.lineWidth = w;
    }
    image(p, scale, originalWidth, originalHeight, data) {
        p = this.transform.transformCoordinate(p);
        const start = kicad_common_1.Point.sub(p, { x: originalWidth / 2, y: originalHeight / 2 });
        const end = kicad_common_1.Point.add(p, { x: originalWidth / 2, y: originalHeight / 2 });
        this.rect(start, end, kicad_common_1.Fill.NO_FILL, DEFAULT_LINE_WIDTH);
    }
}
exports.CanvasPlotter = CanvasPlotter;
class SVGPlotter extends Plotter {
    constructor() {
        super();
        this.penState = "Z";
        this.output = "";
        this.lineWidth = DEFAULT_LINE_WIDTH;
        this.color = kicad_common_1.Color.BLACK;
    }
    circle(p, dia, fill, width) {
        this.setCurrentLineWidth(width);
        this.setFill(fill);
        p = this.transform.transformCoordinate(p);
        this.output += this.xmlTag `<circle cx="${p.x}" cy="${p.y}" r="${dia / 2}" `;
        if (this.fill === kicad_common_1.Fill.NO_FILL) {
            this.output += this.xmlTag ` style="stroke: ${this.color.toCSSColor()}; fill: none; stroke-width: ${this.lineWidth}"/>\n`;
        }
        else {
            this.output += this.xmlTag ` style="stroke: ${this.color.toCSSColor()}; fill: ${this.color.toCSSColor()}; stroke-width: ${this.lineWidth}" />\n`;
        }
    }
    arc(p, startAngle, endAngle, radius, fill, width) {
        if (radius <= 0)
            return;
        if (startAngle > endAngle) {
            [startAngle, endAngle] = [endAngle, startAngle];
        }
        this.setCurrentLineWidth(width);
        this.setFill(fill);
        p = this.transform.transformCoordinate(p);
        [startAngle, endAngle] = [-endAngle, -startAngle];
        let start = new kicad_common_1.Point(radius, 0);
        kicad_common_1.RotatePoint(start, startAngle);
        let end = new kicad_common_1.Point(radius, 0);
        kicad_common_1.RotatePoint(end, endAngle);
        start = kicad_common_1.Point.add(start, p);
        end = kicad_common_1.Point.add(end, p);
        let theta1 = kicad_common_1.DECIDEG2RAD(startAngle);
        if (theta1 < 0)
            theta1 += Math.PI * 2;
        let theta2 = kicad_common_1.DECIDEG2RAD(endAngle);
        if (theta2 < 0)
            theta2 += Math.PI * 2;
        if (theta2 < theta1)
            theta2 += Math.PI * 2;
        const isLargeArc = Math.abs(theta2 - theta1) > Math.PI;
        const isSweep = false;
        // console.log('ARC', startAngle, endAngle, radius, start, end, radius, isLargeArc, isSweep);
        const x = this.xmlTag;
        this.output += this.xmlTag `<path d="M${start.x} ${start.y} A${radius} ${radius} 0.0 ${isLargeArc ? 1 : 0} ${isSweep ? 1 : 0} ${end.x} ${end.y}"`;
        if (this.fill === kicad_common_1.Fill.NO_FILL) {
            this.output += this.xmlTag ` style="stroke: ${this.color.toCSSColor()}; fill: none; stroke-width: ${this.lineWidth}" />\n`;
        }
        else {
            this.output += this.xmlTag ` style="stroke: ${this.color.toCSSColor()}; fill: ${this.color.toCSSColor()}; stroke-width: ${this.lineWidth}" />\n`;
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
    penTo(p, s) {
        const x = this.xmlTag;
        p = this.transform.transformCoordinate(p);
        if (s === "Z") {
            if (this.penState !== "Z") {
                if (this.fill === kicad_common_1.Fill.NO_FILL) {
                    this.output += this.xmlTag `" style="stroke: ${this.color.toCSSColor()}; fill: none; stroke-width: ${this.lineWidth}" />\n`;
                }
                else {
                    this.output += this.xmlTag `" style="stroke: ${this.color.toCSSColor()}; fill: ${this.color.toCSSColor()}; stroke-width: ${this.lineWidth}" />\n`;
                }
            }
            else {
                throw "invalid pen state Z -> Z";
            }
            this.penState = "Z";
            return;
        }
        // s is U | D
        if (this.penState === "Z") {
            this.output += this.xmlTag `<path d="M${p.x} ${p.y}\n`;
        }
        else {
            if (s === "U") {
                this.output += this.xmlTag `M${p.x} ${p.y}\n`;
            }
            else {
                this.output += this.xmlTag `L${p.x} ${p.y}\n`;
            }
        }
        this.penState = s;
    }
    setCurrentLineWidth(w) {
        this.lineWidth = w;
    }
    image(p, scale, originalWidth, originalHeight, data) {
        p = this.transform.transformCoordinate(p);
        const width = originalWidth * scale;
        const height = originalHeight * scale;
        const start = kicad_common_1.Point.sub(p, { x: width / 2, y: height / 2 });
        const url = 'data:image/png,' + data.reduce((r, i) => r + '%' + (0x100 + i).toString(16).slice(1), "");
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
    startPlot() {
        const width = this.pageInfo.width;
        const height = this.pageInfo.height;
        this.output = this.xmlTag `<svg preserveAspectRatio="xMinYMin"
			width="${width}"
			height="${height}"
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
    xmlTag(literals, ...placeholders) {
        let result = "";
        for (let i = 0; i < placeholders.length; i++) {
            result += literals[i];
            result += this.xmlentities(placeholders[i]);
        }
        result += literals[literals.length - 1];
        return result;
    }
    xmlentities(s) {
        if (typeof s === "number")
            return String(s);
        const map = {
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;',
            '"': '&x22;',
            "'": '&x27;',
        };
        return String(s).replace(/[<>&]/g, (_) => map[_]);
    }
}
SVGPlotter.font = {
    family: '"Lucida Console", Monaco, monospace',
    widthRatio: 0.60009765625,
};
exports.SVGPlotter = SVGPlotter;
//# sourceMappingURL=kicad_plotter.js.map