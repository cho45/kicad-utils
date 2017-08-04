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
const kicad_common_1 = require("./kicad_common");
const kicad_strokefont_data_1 = require("./kicad_strokefont_data");
const INTERLINE_PITCH_RATIO = 1.5;
const OVERBAR_POSITION_FACTOR = 1.22;
const BOLD_FACTOR = 1.3;
const STROKE_FONT_SCALE = 1.0 / 21.0;
const ITALIC_TILT = 1.0 / 8;
// common/drawtxt.cpp
// common/gal/stroke_font.cpp
class Glyph {
    constructor() {
        this.lines = [];
    }
    computeBoundingBox() {
        let points = [];
        let rect = new kicad_common_1.Rect(0, 0, this.endX - this.startX, 0);
        for (let line of this.lines) {
            for (let point of line) {
                rect = rect.merge(new kicad_common_1.Rect(0, 0, this.endX - this.startX, point.y).normalize());
            }
        }
        this.boundingBox = rect;
    }
}
exports.Glyph = Glyph;
class StrokeFont {
    constructor() {
        this.glyphs = [];
        for (let def of kicad_strokefont_data_1.STROKE_FONT) {
            const glyph = new Glyph();
            let points = [];
            const SERIALIZE_OFFSET = 'R'.charCodeAt(0);
            const FONT_OFFSET = -10;
            const glyphStartX = (def.charCodeAt(0) - SERIALIZE_OFFSET) * STROKE_FONT_SCALE;
            const glyphEndX = (def.charCodeAt(1) - SERIALIZE_OFFSET) * STROKE_FONT_SCALE;
            for (let i = 2; i < def.length; i += 2) {
                if (def[i] === ' ' && def[i + 1] === 'R') {
                    // raise pen
                    if (points.length) {
                        glyph.lines.push(points.slice(0));
                        points.length = 0;
                    }
                }
                else {
                    const x = (def.charCodeAt(i) - SERIALIZE_OFFSET) * STROKE_FONT_SCALE - glyphStartX;
                    const y = (def.charCodeAt(i + 1) - SERIALIZE_OFFSET + FONT_OFFSET) * STROKE_FONT_SCALE;
                    points.push(new kicad_common_1.Point(x, y));
                }
            }
            if (points.length) {
                glyph.lines.push(points.slice(0));
            }
            glyph.startX = glyphStartX;
            glyph.endX = glyphEndX;
            glyph.computeBoundingBox();
            this.glyphs.push(glyph);
        }
    }
    getInterline(size, lineWidth) {
        return (size * INTERLINE_PITCH_RATIO) + lineWidth;
    }
    computeTextLineSize(line, size, lineWidth) {
        let width = 0;
        for (let i = 0, len = line.length; i < len; i++) {
            const c = line.charCodeAt(i);
            const n = c - ' '.charCodeAt(0);
            const glyph = this.glyphs[n] || this.glyphs['?'.charCodeAt(0) - ' '.charCodeAt(0)];
            width += glyph.boundingBox.width * size;
        }
        return width + lineWidth;
    }
    drawGlyph(plotter, p, glyph, size) {
        for (let line of glyph.lines) {
            plotter.moveTo(line[0].x * size + p.x, line[0].y * size + p.y);
            for (let i = 1, len = line.length; i < len; i++) {
                const point = line[i];
                plotter.lineTo(point.x * size + p.x, point.y * size + p.y);
            }
            plotter.finishPen();
        }
    }
    drawLineText(plotter, p, line, size, lineWidth, hjustify, vjustify) {
        let offset = 0;
        if (hjustify === kicad_common_1.TextHjustify.LEFT) {
            offset = 0;
        }
        else if (hjustify === kicad_common_1.TextHjustify.CENTER) {
            offset = -this.computeTextLineSize(line, size, lineWidth) / 2;
        }
        else if (hjustify === kicad_common_1.TextHjustify.RIGHT) {
            offset = -this.computeTextLineSize(line, size, lineWidth);
        }
        for (let i = 0, len = line.length; i < len; i++) {
            const c = line.charCodeAt(i);
            const n = c - ' '.charCodeAt(0);
            const glyph = this.glyphs[n];
            this.drawGlyph(plotter, { x: offset + p.x, y: p.y }, glyph, size);
            offset += glyph.boundingBox.pos2.x * size;
        }
    }
    drawText(plotter, p, text, size, lineWidth, angle, hjustify, vjustify) {
        plotter.save();
        plotter.setCurrentLineWidth(lineWidth);
        plotter.translate(p.x, p.y);
        plotter.rotate(-kicad_common_1.DECIDEG2RAD(angle));
        let offset = 0;
        const lines = text.split(/\n/);
        if (vjustify === kicad_common_1.TextVjustify.TOP) {
            offset = (size * lines.length * INTERLINE_PITCH_RATIO);
        }
        else if (vjustify === kicad_common_1.TextVjustify.CENTER) {
            offset = (size * lines.length * INTERLINE_PITCH_RATIO) / 2;
        }
        else if (vjustify === kicad_common_1.TextVjustify.BOTTOM) {
            offset = 0;
        }
        for (let line of lines) {
            this.drawLineText(plotter, { x: 0, y: offset }, line, size, lineWidth, hjustify, vjustify);
            offset += size * INTERLINE_PITCH_RATIO + lineWidth;
        }
        plotter.restore();
    }
}
exports.StrokeFont = StrokeFont;
//# sourceMappingURL=kicad_strokefont.js.map