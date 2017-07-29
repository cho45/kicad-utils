"use strict";
//#!tsc --target ES6 --module commonjs kicad.ts && node kicad.js
// typings install ds~node
///<reference path="./typings/index.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_LINE_WIDTH = 6;
function DECIDEG2RAD(deg) {
    return deg * Math.PI / 1800;
}
exports.DECIDEG2RAD = DECIDEG2RAD;
function RAD2DECIDEG(rad) {
    return rad * 1800 / Math.PI;
}
exports.RAD2DECIDEG = RAD2DECIDEG;
function NORMALIZE_ANGLE_POS(angle) {
    while (angle < 0)
        angle += 3600;
    while (angle >= 3600)
        angle -= 3600;
    return angle;
}
exports.NORMALIZE_ANGLE_POS = NORMALIZE_ANGLE_POS;
class Transform {
    constructor(x1 = 1, y1 = 0, x2 = 0, y2 = -1) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
    transformCoordinate(p) {
        return {
            x: (this.x1 * p.x) + (this.y1 * p.y),
            y: (this.x2 * p.x) + (this.y2 * p.y)
        };
    }
    mapAngles(angle1, angle2) {
        let angle, delta;
        let x, y, t;
        let swap = 0;
        delta = angle2 - angle1;
        if (delta >= 1800) {
            angle1 -= 1;
            angle2 += 1;
        }
        x = Math.cos(DECIDEG2RAD(angle1));
        y = Math.sin(DECIDEG2RAD(angle1));
        t = x * this.x1 + y * this.y1;
        y = x * this.x2 + y * this.y2;
        x = t;
        angle1 = Math.round(RAD2DECIDEG(Math.atan2(y, x)));
        x = Math.cos(DECIDEG2RAD(angle2));
        y = Math.sin(DECIDEG2RAD(angle2));
        t = x * this.x1 + y * this.y1;
        y = x * this.x2 + y * this.y2;
        x = t;
        angle2 = Math.round(RAD2DECIDEG(Math.atan2(y, x)));
        angle1 = NORMALIZE_ANGLE_POS(angle1);
        angle2 = NORMALIZE_ANGLE_POS(angle2);
        if (angle2 < angle1)
            angle2 += 3600;
        if (angle2 - angle1 > 1800) {
            angle = (angle1);
            angle1 = (angle2);
            angle2 = angle;
            angle1 = NORMALIZE_ANGLE_POS(angle1);
            angle2 = NORMALIZE_ANGLE_POS(angle2);
            if (angle2 < angle1)
                angle2 += 3600;
            swap = 1;
        }
        if (delta >= 1800) {
            angle1 += 1;
            angle2 -= 1;
        }
        return [angle1, angle2, swap];
    }
}
exports.Transform = Transform;
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    static add(p1, p2) {
        return {
            x: p1.x + p2.x,
            y: p1.y + p2.y,
        };
    }
    static sub(p1, p2) {
        return {
            x: p1.x - p2.x,
            y: p1.y - p2.y,
        };
    }
    static isZero(p) {
        return p.x === 0 && p.y === 0;
    }
}
exports.Point = Point;
class Rect {
    constructor(pos1x, pos1y, pos2x, pos2y) {
        this.pos1 = new Point(pos1x, pos1y);
        this.pos2 = new Point(pos2x, pos2y);
    }
    getWidth() {
        return this.pos2.x - this.pos1.x;
    }
    getHeight() {
        return this.pos2.y - this.pos1.y;
    }
    merge(o) {
        return new Rect(Math.min(this.pos1.x, o.pos1.x), Math.min(this.pos1.y, o.pos1.y), Math.max(this.pos2.x, o.pos2.x), Math.max(this.pos2.y, o.pos2.y));
    }
    inflate(n) {
        this.pos1.x -= n;
        this.pos1.y -= n;
        this.pos2.x += n;
        this.pos2.y += n;
        return this;
    }
}
exports.Rect = Rect;
var Fill;
(function (Fill) {
    Fill["NO_FILL"] = "N";
    Fill["FILLED_SHAPE"] = "F";
    Fill["FILLED_WITH_BG_BODYCOLOR"] = "f";
})(Fill = exports.Fill || (exports.Fill = {}));
var TextHjustify;
(function (TextHjustify) {
    TextHjustify["LEFT"] = "L";
    TextHjustify["CENTER"] = "C";
    TextHjustify["RIGHT"] = " R";
})(TextHjustify = exports.TextHjustify || (exports.TextHjustify = {}));
var TextVjustify;
(function (TextVjustify) {
    TextVjustify["TOP"] = "T";
    TextVjustify["CENTER"] = "C";
    TextVjustify["BOTTOM"] = "B";
})(TextVjustify = exports.TextVjustify || (exports.TextVjustify = {}));
var PinOrientation;
(function (PinOrientation) {
    PinOrientation["RIGHT"] = "R";
    PinOrientation["LEFT"] = "L";
    PinOrientation["UP"] = "U";
    PinOrientation["DOWN"] = "D";
})(PinOrientation = exports.PinOrientation || (exports.PinOrientation = {}));
var TextAngle;
(function (TextAngle) {
    TextAngle[TextAngle["HORIZ"] = 0] = "HORIZ";
    TextAngle[TextAngle["VERT"] = 900] = "VERT";
})(TextAngle = exports.TextAngle || (exports.TextAngle = {}));
var PinType;
(function (PinType) {
    PinType["PIN_INPUT"] = "I";
    PinType["PIN_OUTPUT"] = "O";
    PinType["PIN_BIDI"] = "B";
    PinType["PIN_TRISTATE"] = "T";
    PinType["PIN_PASSIVE"] = "P";
    PinType["PIN_UNSPECIFIED"] = "U";
    PinType["PIN_POWER_IN"] = "W";
    PinType["PIN_POWER_OUT"] = "w";
    PinType["PIN_OPENCOLLECTOR"] = "C";
    PinType["PIN_OPENEMITTER"] = "E";
    PinType["PIN_NC"] = "N";
})(PinType = exports.PinType || (exports.PinType = {}));
;
var PinAttribute;
(function (PinAttribute) {
    PinAttribute["NONE"] = "~";
    PinAttribute["INVERTED"] = "I";
    PinAttribute["CLOCK"] = "C";
    PinAttribute["LOWLEVEL_IN"] = "L";
    PinAttribute["LOWLEVEL_OUT"] = "V";
    PinAttribute["FALLING_EDGE"] = "F";
    PinAttribute["NONLOGIC"] = "X";
    PinAttribute["INVISIBLE"] = "N";
})(PinAttribute = exports.PinAttribute || (exports.PinAttribute = {}));
