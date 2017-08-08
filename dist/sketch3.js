"use strict";
//#!tsc && NODE_PATH=dist/src node dist/sketch3.js 
Object.defineProperty(exports, "__esModule", { value: true });
const kicad_common_1 = require("./src/kicad_common");
const kicad_pcb_1 = require("./src/kicad_pcb");
const kicad_pcb_plotter_1 = require("./src/kicad_pcb_plotter");
const kicad_plotter_1 = require("./src/kicad_plotter");
// console.log(Foo["xxx" as Foo]);
const fs = require("fs");
// const content = fs.readFileSync('../keyboard-schematic/Main.kicad_pcb', 'utf-8');
const content = fs.readFileSync('../../KiCad/footprint.pretty/ESP-WROOM-32.kicad_mod', 'utf-8');
const item = kicad_pcb_1.PCB.load(content);
if (item instanceof kicad_pcb_1.Board) {
}
else if (item instanceof kicad_pcb_1.Module) {
    const width = 2000;
    const height = 2000;
    const Canvas = require('canvas');
    const canvas = Canvas.createCanvas ? Canvas.createCanvas(width, height) : new Canvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.translate(1000, 1000);
    const plotter = new kicad_plotter_1.CanvasPlotter(ctx);
    plotter.setColor(kicad_common_1.Color.BLACK);
    {
        const pcbPlotter = new kicad_pcb_plotter_1.PCBPlotter(plotter);
        for (let pad of item.pads) {
            console.log(pad);
            if (pad.shape === kicad_pcb_1.PadShape.CIRCLE) {
                pcbPlotter.flashPadCircle(pad.pos, pad.size.width, kicad_common_1.Fill.NO_FILL);
            }
            else if (pad.shape === kicad_pcb_1.PadShape.RECT) {
                pcbPlotter.flashPadRect(pad.pos, pad.size, pad.orientation, kicad_common_1.Fill.FILLED_SHAPE);
            }
            else if (pad.shape === kicad_pcb_1.PadShape.OVAL) {
            }
            else if (pad.shape === kicad_pcb_1.PadShape.TRAPEZOID) {
            }
            else if (pad.shape === kicad_pcb_1.PadShape.ROUNDRECT) {
            }
        }
        // pcbPlotter.flashPadCircle();
    }
    const out = fs.createWriteStream('text.png'), stream = canvas.pngStream();
    stream.on('data', function (chunk) {
        out.write(chunk);
    });
    stream.on('end', function () {
        console.log('saved png');
    });
}
//# sourceMappingURL=sketch3.js.map