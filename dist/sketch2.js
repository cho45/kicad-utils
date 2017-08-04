"use strict";
//#!tsc && NODE_PATH=dist/src node dist/sketch2.js 
Object.defineProperty(exports, "__esModule", { value: true });
const kicad_common_1 = require("./src/kicad_common");
const kicad_strokefont_1 = require("./src/kicad_strokefont");
const kicad_plotter_1 = require("./src/kicad_plotter");
const fs = require("fs");
{
    const font = new kicad_strokefont_1.StrokeFont();
    const n = '%'.charCodeAt(0) - ' '.charCodeAt(0);
    console.log(n);
    const glyph = font.glyphs[n];
    console.log(glyph);
    const width = 500, height = 500;
    const Canvas = require('canvas');
    const canvas = Canvas.createCanvas ? Canvas.createCanvas(width, height) : new Canvas(width, height);
    const ctx = canvas.getContext('2d');
    let size = 18;
    ctx.strokeStyle = "#666666";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    ctx.lineCap = "round";
    // ctx.translate(canvas.width / 2, canvas.height / 2);
    const plotter = new kicad_plotter_1.CanvasPlotter(ctx);
    font.drawText(plotter, { x: canvas.width / 2, y: canvas.height / 2 }, 'foobar', 18, 3, kicad_common_1.TextAngle.VERT, kicad_common_1.TextHjustify.LEFT, kicad_common_1.TextVjustify.BOTTOM);
    const out = fs.createWriteStream('text.png'), stream = canvas.pngStream();
    stream.on('data', function (chunk) {
        out.write(chunk);
    });
    stream.on('end', function () {
        console.log('saved png');
    });
}
//# sourceMappingURL=sketch2.js.map