"use strict";
//#!tsc && NODE_PATH=dist/src node dist/sketch3.js 
Object.defineProperty(exports, "__esModule", { value: true });
const kicad_common_1 = require("./src/kicad_common");
const kicad_pcb_1 = require("./src/kicad_pcb");
const kicad_pcb_plotter_1 = require("./src/kicad_pcb_plotter");
const kicad_plotter_1 = require("./src/kicad_plotter");
// console.log(Foo["xxx" as Foo]);
const fs = require("fs");
const content = fs.readFileSync('../keyboard-schematic/Main.kicad_pcb', 'utf-8');
// const content = fs.readFileSync('../../KiCad/footprint.pretty/ESP-WROOM-32.kicad_mod', 'utf-8');
// const content = fs.readFileSync('../../../Documents/KiCAD/my/myfootprint.pretty/BLE_NANO.kicad_mod', 'utf-8');
// const content = fs.readFileSync('../../KiCad/footprint.pretty/RJ45-7810-XPXC.kicad_mod', 'utf-8');
const width = 4000;
const height = 4000;
const Canvas = require('canvas');
const canvas = Canvas.createCanvas ? Canvas.createCanvas(width, height) : new Canvas(width, height);
const ctx = canvas.getContext('2d');
ctx.fillStyle = "#fff";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.scale(0.5, 0.5);
const plotter = new kicad_plotter_1.CanvasPlotter(ctx);
plotter.setColor(kicad_common_1.Color.BLACK);
const pcbPlotter = new kicad_pcb_plotter_1.PCBPlotter(plotter);
const item = kicad_pcb_1.PCB.load(content);
if (item instanceof kicad_pcb_1.Board) {
    console.log(item);
    // pcbPlotter.plotStandardLayer(item, new LSET(PCB_LAYER_ID.F_Cu));
    pcbPlotter.plotStandardLayer(item, new kicad_pcb_1.LSET(...item.visibleLayers));
}
else if (item instanceof kicad_pcb_1.Module) {
    {
        pcbPlotter.plotModule(item);
        // pcbPlotter.flashPadCircle();
    }
}
const out = fs.createWriteStream('text.png'), stream = canvas.pngStream();
stream.on('data', function (chunk) {
    out.write(chunk);
});
stream.on('end', function () {
    console.log('saved png');
});
//# sourceMappingURL=sketch3.js.map