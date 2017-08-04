"use strict";
//#! NODE_PATH=dist/src node dist/sketch2.js 
Object.defineProperty(exports, "__esModule", { value: true });
const kicad_common_1 = require("./src/kicad_common");
const kicad_strokefont_1 = require("./src/kicad_strokefont");
const kicad_plotter_1 = require("./src/kicad_plotter");
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
class TransformMatrix {
    constructor(xx = 1, yx = 0, xy = 0, yy = 1, tx = 0, ty = 0) {
        this.xx = xx;
        this.yx = yx;
        this.xy = xy;
        this.yy = yy;
        this.tx = tx;
        this.ty = ty;
    }
    static identify() {
        return new TransformMatrix(1, 0, 0, 1, 0, 0);
    }
    static translate(tx, ty) {
        return new TransformMatrix(1, 0, 0, 1, tx, ty);
    }
    static scale(sx, sy) {
        return new TransformMatrix(sx, 0, 0, sy, 0, 0);
    }
    static rotate(radian) {
        const s = Math.sin(radian);
        const c = Math.cos(radian);
        return new TransformMatrix(c, s, -s, c, 0, 0);
    }
    translate(tx, ty) {
        return this.multiply(TransformMatrix.translate(tx, ty));
    }
    scale(sx, sy) {
        return this.multiply(TransformMatrix.scale(sx, sy));
    }
    rotate(radian) {
        return this.multiply(TransformMatrix.rotate(radian));
    }
    multiply(b) {
        const a = this;
        return new TransformMatrix(a.xx * b.xx + a.yx * b.xy, a.xx * b.yx + a.yx * b.yy, a.xy * b.xx + a.yy * b.xy, a.xy * b.yx + a.yy * b.yy, a.tx * b.xx + a.ty * b.xy + b.tx, a.tx * b.yx + a.ty * b.yy + b.ty);
    }
    transformPoint(p) {
        const x = (this.xx * p.x + this.xy * p.y) + this.tx;
        const y = (this.yx * p.x + this.yy * p.y) + this.ty;
        return new kicad_common_1.Point(x, y);
    }
}
class GAL {
    constructor() {
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
    drawLineText(plotter, text, pos, size, lineWidth, angle, hjustify, vjustify) {
    }
}
const font = new StrokeFont();
const n = '%'.charCodeAt(0) - ' '.charCodeAt(0);
console.log(n);
const glyph = font.glyphs[n];
console.log(glyph);
const width = 500, height = 500;
const Canvas = require('canvas');
const canvas = Canvas.createCanvas ? Canvas.createCanvas(width, height) : new Canvas(width, height);
const ctx = canvas.getContext('2d');
let size = 18;
ctx.translate(canvas.width / 2, canvas.height / 2);
ctx.lineCap = "round";
ctx.lineWidth = 2;
function drawGlyph(p, glyph, size) {
    for (let line of glyph.lines) {
        ctx.beginPath();
        ctx.moveTo(line[0].x * size + p.x, line[0].y * size + p.y);
        for (let point of line) {
            ctx.lineTo(point.x * size + p.x, point.y * size + p.y);
        }
        ctx.stroke();
    }
}
function calcLine(line, size) {
    let width = 0;
    for (let i = 0, len = line.length; i < len; i++) {
        const c = line.charCodeAt(i);
        const n = c - ' '.charCodeAt(0);
        const glyph = font.glyphs[n];
        width += glyph.boundingBox.width * size;
    }
    return width;
}
function drawLine(p, line, size, hjustify) {
    let offset = 0;
    if (hjustify === kicad_common_1.TextHjustify.LEFT) {
        offset = 0;
    }
    else if (hjustify === kicad_common_1.TextHjustify.CENTER) {
        offset = -calcLine(line, size) / 2;
    }
    else if (hjustify === kicad_common_1.TextHjustify.RIGHT) {
        offset = -calcLine(line, size);
    }
    for (let i = 0, len = line.length; i < len; i++) {
        const c = line.charCodeAt(i);
        const n = c - ' '.charCodeAt(0);
        const glyph = font.glyphs[n];
        drawGlyph({ x: offset + p.x, y: p.y }, glyph, size);
        offset += glyph.boundingBox.pos2.x * size;
    }
}
function drawText(p, text, size, hjustify, vjustify) {
    let offset = 0;
    const lines = text.split(/\n/);
    if (vjustify === kicad_common_1.TextVjustify.TOP) {
        offset = 0;
    }
    else if (vjustify === kicad_common_1.TextVjustify.CENTER) {
        offset = -(size * lines.length * INTERLINE_PITCH_RATIO) / 2;
    }
    else if (vjustify === kicad_common_1.TextVjustify.BOTTOM) {
        offset = -(size * lines.length * INTERLINE_PITCH_RATIO);
    }
    for (let line of lines) {
        drawLine({ x: p.x, y: p.y + offset }, line, size, hjustify);
        offset += size * INTERLINE_PITCH_RATIO + ctx.lineWidth;
    }
}
drawText({ x: 0, y: 0 }, "foobar@xxxx.xxx\nfoobar", 20, kicad_common_1.TextHjustify.CENTER, kicad_common_1.TextVjustify.CENTER);
const fs = require("fs");
const plotter = new kicad_plotter_1.CanvasPlotter(ctx);
const out = fs.createWriteStream('text.png'), stream = canvas.pngStream();
stream.on('data', function (chunk) {
    out.write(chunk);
});
stream.on('end', function () {
    console.log('saved png');
});
//# sourceMappingURL=sketch2.js.map