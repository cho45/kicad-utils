"use strict";
//#! NODE_PATH=dist/src node dist/sketch2.js 
Object.defineProperty(exports, "__esModule", { value: true });
const kicad_common_1 = require("./src/kicad_common");
const kicad_strokefont_1 = require("./src/kicad_strokefont");
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
class GAL {
    constructor() {
        this.matrix = {
            a: 1, b: 0,
            c: 0, d: 1,
            tx: 0, ty: 0
        };
    }
    save() {
    }
    restore() {
    }
    translate() {
    }
    scale() {
    }
    rotate() {
    }
}
class StrokeFont {
    constructor() {
        this.glyphs = [];
        for (let def of kicad_strokefont_1.STROKE_FONT) {
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
                        glyph.lines.push(points);
                        points.length = 0;
                    }
                }
                else {
                    const x = (def.charCodeAt(i) - SERIALIZE_OFFSET) * STROKE_FONT_SCALE - glyphStartX;
                    const y = (def.charCodeAt(i + 1) - SERIALIZE_OFFSET + FONT_OFFSET) * STROKE_FONT_SCALE;
                    points.push(new kicad_common_1.Point(x, y));
                }
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
    drawSingleLineText(plotter, text, pos, size, lineWidth, angle, hjustify, vjustify) {
    }
}
const font = new StrokeFont();
const glyph = font.glyphs['A'.charCodeAt(0) - ' '.charCodeAt(0)];
console.log(glyph);
//# sourceMappingURL=sketch2.js.map