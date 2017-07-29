"use strict";
//#!tsc --target ES6 --noUnusedLocals --module commonjs kicad.ts && node kicad.js
// typings install ds~node
///<reference path="./typings/index.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * imported from:
 * eeschema/lib_text.cpp
 * eeschema/lib_rectangle.cpp
 * eeschema/lib_polyline.cpp
 * eeschema/lib_pin.cpp
 * eeschema/lib_field.cpp
 * eeschema/lib_draw_item.cpp
 * eeschema/lib_circle.cpp
 * eeschema/lib_arc.cpp
 */
const kicad_common_1 = require("./kicad_common");
class Library {
    static load(content) {
        const lines = content.split(/\n/);
        const lib = new this();
        lib.parse(lines);
        return lib;
    }
    constructor() {
        this.components = [];
    }
    parse(lines) {
        let line;
        const version = lines.shift();
        if (!version || version.indexOf('EESchema-LIBRARY Version 2.3') !== 0) {
            throw "unknwon library format";
        }
        while (line = lines.shift()) {
            if (line[0] === '#')
                continue;
            const tokens = line.split(/ +/);
            if (tokens[0] === 'DEF') {
                this.components.push(new Component(tokens.slice(1)).parse(lines));
            }
            else {
                throw 'unknown token ' + tokens[0];
            }
        }
    }
    findByName(name) {
        const ret = this.components.find((i) => i.name === name);
        if (!ret) {
            throw "Component notfound";
        }
        return ret;
    }
}
exports.Library = Library;
class Component {
    constructor(params) {
        this.name = params[0];
        this.reference = params[1];
        this.textOffset = Number(params[3]);
        this.drawPinnumber = params[4] === 'Y';
        this.drawPinname = params[5] === 'Y';
        this.unitCount = Number(params[6]);
        this.unitsLocked = params[7] === 'Y';
        this.optionFlag = params[8];
        this.fields = [];
    }
    parse(lines) {
        let line;
        while (line = lines.shift()) {
            if (line === 'ENDDEF')
                break;
            const tokens = line.split(/ +/);
            if (tokens[0] === 'DRAW') {
                this.draw = new Draw().parse(lines);
            }
            else if (tokens[0] === 'ALIAS') {
                this.aliases = tokens.slice(1);
            }
            else if (tokens[0] === 'F0') {
                this.field = new Field0(tokens.slice(1));
            }
            else if (tokens[0].match(/^F\d+/)) {
                this.fields.push(new FieldN(tokens.slice(1)));
            }
            else if (tokens[0] === '$FPLIST') {
                this.fplist = [];
                while (line = lines.shift()) {
                    if (line === '$ENDFPLIST')
                        break;
                    this.fplist.push(tokens[0]);
                }
            }
            else {
                throw 'unknown token ' + tokens[0];
            }
        }
        return this;
    }
}
exports.Component = Component;
class Field0 {
    constructor(params) {
        this.reference = params[0].replace(/^"|"$/g, '');
        this.posx = Number(params[1]);
        this.posy = Number(params[2]);
        this.textSize = Number(params[3]);
        this.textOrientation = params[4] === 'H' ? kicad_common_1.TextAngle.HORIZ : kicad_common_1.TextAngle.VERT;
        this.visibility = params[5];
        this.htextJustify = params[6];
        this.vtextJustify = params[7];
    }
}
exports.Field0 = Field0;
class FieldN {
    constructor(params) {
        this.name = params[0].replace(/''/g, '"').replace(/~/g, ' ').replace(/^"|"$/g, '');
        this.posx = Number(params[1]);
        this.posy = Number(params[2]);
        this.textSize = Number(params[3]);
        this.textOrientation = params[4] === 'H' ? kicad_common_1.TextAngle.HORIZ : kicad_common_1.TextAngle.VERT;
        this.visibility = params[5];
        this.htextJustify = params[6];
        this.vtextJustify = params[7];
        this.fieldname = params[8];
    }
}
exports.FieldN = FieldN;
class Draw {
    constructor() {
        this.objects = [];
    }
    parse(lines) {
        let line;
        while (line = lines.shift()) {
            if (line === 'ENDDRAW')
                break;
            const tokens = line.split(/ +/);
            if (tokens[0] === 'A') {
                this.objects.push(new DrawArc(tokens.slice(1)));
            }
            else if (tokens[0] === 'C') {
                this.objects.push(new DrawCircle(tokens.slice(1)));
            }
            else if (tokens[0] === 'P') {
                this.objects.push(new DrawPolyline(tokens.slice(1)));
            }
            else if (tokens[0] === 'S') {
                this.objects.push(new DrawSquare(tokens.slice(1)));
            }
            else if (tokens[0] === 'T') {
                this.objects.push(new DrawText(tokens.slice(1)));
            }
            else if (tokens[0] === 'X') {
                this.objects.push(new DrawPin(tokens.slice(1)));
            }
            else {
                throw "unknown token " + tokens[0];
            }
        }
        return this;
    }
    getBoundingRect() {
        let rect;
        for (let o of this.objects) {
            const box = o.getBoundingBox();
            if (box.getWidth() === 0 || box.getHeight() === 0)
                continue;
            if (!rect) {
                rect = box;
            }
            else {
                rect = rect.merge(box);
            }
        }
        return rect;
    }
}
exports.Draw = Draw;
class DrawObject {
}
class DrawArc extends DrawObject {
    constructor(params) {
        super();
        this.posx = Number(params[0]);
        this.posy = Number(params[1]);
        this.radius = Number(params[2]);
        this.startAngle = Number(params[3]);
        this.endAngle = Number(params[4]);
        this.unit = Number(params[5]);
        this.convert = Number(params[6]);
        this.lineWidth = Number(params[7]);
        this.fill = params[8] || kicad_common_1.Fill.NO_FILL;
        this.startx = Number(params[9]);
        this.starty = Number(params[10]);
        this.endx = Number(params[11]);
        this.endy = Number(params[12]);
    }
    getBoundingBox() {
        const ret = new kicad_common_1.Rect(0, 0, 0, 0);
        const arcStart = { x: this.startx, y: this.starty };
        const arcEnd = { x: this.endx, y: this.endy };
        const pos = { x: this.posx, y: this.posy };
        const normStart = kicad_common_1.Point.sub(arcStart, pos);
        const normEnd = kicad_common_1.Point.sub(arcEnd, pos);
        if (kicad_common_1.Point.isZero(normStart) || kicad_common_1.Point.isZero(normEnd) || this.radius === 0) {
            return ret;
        }
        const transform = new kicad_common_1.Transform();
        const startPos = transform.transformCoordinate(arcStart);
        const endPos = transform.transformCoordinate(arcEnd);
        const centerPos = transform.transformCoordinate(pos);
        let [startAngle, endAngle, swap] = transform.mapAngles(this.startAngle, this.endAngle);
        if (swap) {
            [endPos.x, startPos.x] = [startPos.x, endPos.x];
            [endPos.y, startPos.y] = [startPos.y, endPos.y];
        }
        let minX = Math.min(startPos.x, endPos.x);
        let minY = Math.min(startPos.y, endPos.y);
        let maxX = Math.max(startPos.x, endPos.x);
        let maxY = Math.max(startPos.y, endPos.y);
        /* Zero degrees is a special case. */
        if (this.startAngle === 0)
            maxX = centerPos.x + this.radius;
        /* Arc end angle wrapped passed 360. */
        if (startAngle > endAngle)
            endAngle += 3600;
        if (startAngle <= 900 && endAngle >= 900)
            maxY = centerPos.y + this.radius;
        if (startAngle <= 1800 && endAngle >= 1800)
            minX = centerPos.x - this.radius;
        if (startAngle <= 2700 && endAngle >= 2700)
            minY = centerPos.y - this.radius;
        if (startAngle <= 3600 && endAngle >= 3600)
            maxX = centerPos.x + this.radius;
        ret.pos1.x = minX;
        ret.pos1.y = minY;
        ret.pos2.x = maxX;
        ret.pos2.y = maxY;
        return ret;
    }
}
exports.DrawArc = DrawArc;
class DrawCircle extends DrawObject {
    constructor(params) {
        super();
        this.posx = Number(params[0]);
        this.posy = Number(params[1]);
        this.radius = Number(params[2]);
        this.unit = Number(params[3]);
        this.convert = Number(params[4]);
        this.lineWidth = Number(params[5]);
        this.fill = params[6] || kicad_common_1.Fill.NO_FILL;
    }
    getBoundingBox() {
        const transform = new kicad_common_1.Transform();
        const pos1 = transform.transformCoordinate({ x: this.posx - this.radius, y: this.posy - this.radius });
        const pos2 = transform.transformCoordinate({ x: this.posx + this.radius, y: this.posy + this.radius });
        return new kicad_common_1.Rect(Math.min(pos1.x, pos2.x), Math.min(pos1.y, pos2.y), Math.max(pos1.x, pos2.x), Math.max(pos1.y, pos2.y));
    }
}
exports.DrawCircle = DrawCircle;
class DrawPolyline extends DrawObject {
    constructor(params) {
        super();
        this.pointCount = Number(params[0]);
        this.unit = Number(params[1]);
        this.convert = Number(params[2]);
        this.lineWidth = Number(params[3]);
        this.points = params.slice(4, 4 + (this.pointCount * 2)).map((i) => Number(i));
        this.fill = params[4 + (this.pointCount * 2)] || kicad_common_1.Fill.NO_FILL;
    }
    getBoundingBox() {
        let minx, maxx;
        let miny, maxy;
        minx = maxx = this.points[0];
        miny = maxy = this.points[1];
        for (var i = 2, len = this.points.length; i < len; i += 2) {
            const x = this.points[i];
            const y = this.points[i + 1];
            minx = Math.min(minx, x);
            maxx = Math.max(maxx, x);
            miny = Math.min(miny, y);
            maxy = Math.max(maxy, y);
        }
        const transform = new kicad_common_1.Transform();
        const pos1 = transform.transformCoordinate({ x: minx, y: miny });
        const pos2 = transform.transformCoordinate({ x: maxx, y: maxy });
        return new kicad_common_1.Rect(Math.min(pos1.x, pos2.x), Math.min(pos1.y, pos2.y), Math.max(pos1.x, pos2.x), Math.max(pos1.y, pos2.y));
    }
}
exports.DrawPolyline = DrawPolyline;
class DrawSquare extends DrawObject {
    constructor(params) {
        super();
        this.startx = Number(params[0]);
        this.starty = Number(params[1]);
        this.endx = Number(params[2]);
        this.endy = Number(params[3]);
        this.unit = Number(params[4]);
        this.convert = Number(params[5]);
        this.lineWidth = Number(params[6]);
        this.fill = params[7] || kicad_common_1.Fill.NO_FILL;
    }
    getBoundingBox() {
        const transform = new kicad_common_1.Transform();
        const pos1 = transform.transformCoordinate({ x: this.startx, y: this.starty });
        const pos2 = transform.transformCoordinate({ x: this.endx, y: this.endy });
        return new kicad_common_1.Rect(Math.min(pos1.x, pos2.x), Math.min(pos1.y, pos2.y), Math.max(pos1.x, pos2.x), Math.max(pos1.y, pos2.y));
    }
}
exports.DrawSquare = DrawSquare;
class DrawText extends DrawObject {
    constructor(params) {
        super();
        this.angle = Number(params[0]);
        this.posx = Number(params[1]);
        this.posy = Number(params[2]);
        this.textSize = Number(params[3]);
        this.textType = Number(params[4]);
        this.unit = Number(params[5]);
        this.convert = Number(params[6]);
        this.text = params[7].replace(/''/g, '"').replace(/~/g, ' ').replace(/^"|"$/g, '');
        this.italic = params[8] === 'Italic';
        this.bold = Number(params[9]) > 0;
        this.hjustify = params[10];
        this.vjustify = params[11];
    }
    getBoundingBox() {
        // TODO
        return new kicad_common_1.Rect(this.posx - (this.angle === 0 ? this.text.length * this.textSize : 0), this.posy - (this.angle !== 0 ? this.text.length * this.textSize : 0), this.posx + (this.angle === 0 ? this.text.length * this.textSize : 0), this.posy + (this.angle !== 0 ? this.text.length * this.textSize : 0));
    }
}
exports.DrawText = DrawText;
class DrawPin extends DrawObject {
    constructor(params) {
        super();
        this.name = params[0];
        this.num = params[1];
        this.posx = Number(params[2]);
        this.posy = Number(params[3]);
        this.length = Number(params[4]);
        this.orientation = params[5];
        this.nameTextSize = Number(params[6]);
        this.numTextSize = Number(params[7]);
        this.unit = Number(params[8]);
        this.convert = Number(params[9]);
        this.pinType = params[10];
        this.attributes = (params[11] || '').split('');
    }
    getBoundingBox() {
        // TODO
        return new kicad_common_1.Rect(this.posx - this.length, this.posy - this.length, this.posx + this.length, this.posy + this.length);
    }
}
exports.DrawPin = DrawPin;
