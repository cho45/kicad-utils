"use strict";
/*
 * This program source code file is part of kicad-utils
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
/**
 * KiCAD internal unit:
 *	length: mil (1/1000 inch)
 *	angles: decidegree (1/10 degrees)
 */
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
function AddAngles(angle1, angle2) {
    return NORMALIZE_ANGLE_POS(angle1 + angle2);
}
exports.AddAngles = AddAngles;
function ArcTangente(dy, dx) {
    if (dx == 0 && dy == 0)
        return 0;
    if (dy == 0) {
        if (dx >= 0)
            return 0;
        else
            return -1800;
    }
    if (dx == 0) {
        if (dy >= 0)
            return 900;
        else
            return -900;
    }
    if (dx == dy) {
        if (dx >= 0)
            return 450;
        else
            return -1800 + 450;
    }
    if (dx == -dy) {
        if (dx >= 0)
            return -450;
        else
            return 1800 - 450;
    }
    return RAD2DECIDEG(Math.atan2(dy, dx));
}
exports.ArcTangente = ArcTangente;
function EuclideanNorm(v) {
    if (v instanceof Size) {
        return Math.hypot(v.width, v.height);
    }
    else {
        return Math.hypot(v.x, v.y);
    }
}
exports.EuclideanNorm = EuclideanNorm;
function GetLineLength(p1, p2) {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}
exports.GetLineLength = GetLineLength;
function RotatePoint(p, angle) {
    angle = NORMALIZE_ANGLE_POS(angle);
    if (angle === 0) {
        return p;
    }
    if (angle === 900) {
        [p.x, p.y] = [p.y, -p.x];
    }
    else if (angle == 1800) {
        [p.x, p.y] = [-p.x, -p.y];
    }
    else if (angle == 2700) {
        [p.x, p.y] = [-p.y, p.x];
    }
    else {
        const fangle = DECIDEG2RAD(angle);
        const sinus = Math.sin(fangle);
        const cosinus = Math.cos(fangle);
        const rx = (p.y * sinus) + (p.x * cosinus);
        const ry = (p.y * cosinus) - (p.x * sinus);
        p.x = rx;
        p.y = ry;
    }
    return p;
}
exports.RotatePoint = RotatePoint;
function RotatePointWithCenter(p, center, angle) {
    const t = {
        x: p.x - center.x,
        y: p.y - center.y,
    };
    RotatePoint(t, angle);
    p.x = t.x + center.x;
    p.y = t.y + center.y;
    return p;
}
exports.RotatePointWithCenter = RotatePointWithCenter;
function MM2MIL(mm) {
    return mm / 0.0254;
}
exports.MM2MIL = MM2MIL;
function MIL2MM(mil) {
    return mil * 0.0254;
}
exports.MIL2MM = MIL2MM;
function ReadDelimitedText(s) {
    const match = s.match(/"((?:\\"|[^"])+)"/);
    if (!match)
        return "";
    const inner = match[1];
    return inner.replace(/\\([\\"])/g, (_, c) => c);
}
exports.ReadDelimitedText = ReadDelimitedText;
function Clamp(lower, value, upper) {
    if (value < lower)
        return lower;
    if (upper < value)
        return upper;
    return value;
}
exports.Clamp = Clamp;
class Transform {
    constructor(x1 = 1, x2 = 0, y1 = 0, y2 = -1, tx = 0, ty = 0) {
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
        this.tx = tx;
        this.ty = ty;
    }
    // default in KiCAD
    static default() {
        return new Transform(1, 0, 0, -1, 0, 0);
    }
    static identify() {
        return new Transform(1, 0, 0, 1, 0, 0);
    }
    static translate(tx, ty) {
        return new Transform(1, 0, 0, 1, tx, ty);
    }
    static scale(sx, sy) {
        return new Transform(sx, 0, 0, sy, 0, 0);
    }
    static rotate(radian) {
        const s = Math.sin(radian);
        const c = Math.cos(radian);
        return new Transform(c, s, -s, c, 0, 0);
    }
    clone() {
        return new Transform(this.x1, this.x2, this.y1, this.y2, this.tx, this.ty);
    }
    translate(tx, ty) {
        return Transform.translate(tx, ty).multiply(this);
    }
    scale(sx, sy) {
        // only supports same xy ratio
        if (Math.abs(sx) !== Math.abs(sy)) {
            throw "invalid scale ratio";
        }
        return Transform.scale(sx, sy).multiply(this);
    }
    rotate(radian) {
        return Transform.rotate(radian).multiply(this);
    }
    multiply(b) {
        const a = this;
        return new Transform(a.x1 * b.x1 + a.x2 * b.y1, a.x1 * b.x2 + a.x2 * b.y2, a.y1 * b.x1 + a.y2 * b.y1, a.y1 * b.x2 + a.y2 * b.y2, a.tx * b.x1 + a.ty * b.y1 + b.tx, a.tx * b.x2 + a.ty * b.y2 + b.ty);
    }
    transformCoordinate(p) {
        const x = (this.x1 * p.x + this.y1 * p.y) + this.tx;
        const y = (this.x2 * p.x + this.y2 * p.y) + this.ty;
        return new Point(x, y);
    }
    transformScalar(n) {
        return n * this.x1;
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
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    static from(p) {
        return new Point(p.x, p.y);
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
    get width() {
        return this.getWidth();
    }
    get height() {
        return this.getHeight();
    }
    getWidth() {
        return this.pos2.x - this.pos1.x;
    }
    getHeight() {
        return this.pos2.y - this.pos1.y;
    }
    normalize() {
        [
            this.pos1.x,
            this.pos1.y,
            this.pos2.x,
            this.pos2.y,
        ] = [
            Math.min(this.pos1.x, this.pos2.x),
            Math.min(this.pos1.y, this.pos2.y),
            Math.max(this.pos1.x, this.pos2.x),
            Math.max(this.pos1.y, this.pos2.y),
        ];
        return this;
    }
    merge(o) {
        return new Rect(Math.min(this.pos1.x, o.pos1.x, this.pos2.x, o.pos2.x), Math.min(this.pos1.y, o.pos1.y, this.pos2.y, o.pos2.y), Math.max(this.pos1.x, o.pos1.x, this.pos2.x, o.pos2.x), Math.max(this.pos1.y, o.pos1.y, this.pos2.y, o.pos2.y));
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
class Color {
    // max 255 int
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
    is(c) {
        return this.r === c.r && this.g === c.g && this.b === c.b;
    }
    toCSSColor() {
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }
    mix(c) {
        return new Color(this.r | c.r, this.g | c.g, this.b | c.b);
    }
}
// common/colors.cpp 
Color.BLACK = new Color(0, 0, 0);
Color.DARKDARKGRAY = new Color(72, 72, 72);
Color.DARKGRAY = new Color(132, 132, 132);
Color.LIGHTGRAY = new Color(194, 194, 194);
Color.WHITE = new Color(255, 255, 255);
Color.LIGHTYELLOW = new Color(255, 255, 194);
Color.DARKBLUE = new Color(0, 0, 72);
Color.DARKGREEN = new Color(0, 72, 0);
Color.DARKCYAN = new Color(0, 72, 72);
Color.DARKRED = new Color(72, 0, 0);
Color.DARKMAGENTA = new Color(72, 0, 72);
Color.DARKBROWN = new Color(72, 72, 0);
Color.BLUE = new Color(0, 0, 132);
Color.GREEN = new Color(0, 132, 0);
Color.CYAN = new Color(0, 132, 132);
Color.RED = new Color(132, 0, 0);
Color.MAGENTA = new Color(132, 0, 132);
Color.BROWN = new Color(132, 132, 0);
Color.LIGHTBLUE = new Color(0, 0, 194);
Color.LIGHTGREEN = new Color(0, 194, 0);
Color.LIGHTCYAN = new Color(0, 194, 194);
Color.LIGHTRED = new Color(194, 0, 0);
Color.LIGHTMAGENTA = new Color(194, 0, 194);
Color.YELLOW = new Color(194, 194, 0);
Color.PUREBLUE = new Color(0, 0, 255);
Color.PUREGREEN = new Color(0, 255, 0);
Color.PURECYAN = new Color(0, 255, 255);
Color.PURERED = new Color(255, 0, 0);
Color.PUREMAGENTA = new Color(255, 0, 255);
Color.PUREYELLOW = new Color(255, 255, 0);
exports.Color = Color;
class ColorDefinition extends Color {
    constructor(c, name, light) {
        super(c.r, c.g, c.b);
        this.name = name;
        this.light = light;
    }
}
ColorDefinition.BLACK = new ColorDefinition(Color.BLACK, "Black", Color.DARKDARKGRAY);
ColorDefinition.DARKDARKGRAY = new ColorDefinition(Color.DARKDARKGRAY, "Gray 1", Color.DARKGRAY);
ColorDefinition.DARKGRAY = new ColorDefinition(Color.DARKGRAY, "Gray 2", Color.LIGHTGRAY);
ColorDefinition.LIGHTGRAY = new ColorDefinition(Color.LIGHTGRAY, "Gray 3", Color.WHITE);
ColorDefinition.WHITE = new ColorDefinition(Color.WHITE, "White", Color.WHITE);
ColorDefinition.LIGHTYELLOW = new ColorDefinition(Color.LIGHTYELLOW, "L.Yellow", Color.WHITE);
ColorDefinition.DARKBLUE = new ColorDefinition(Color.DARKBLUE, "Blue 1", Color.BLUE);
ColorDefinition.DARKGREEN = new ColorDefinition(Color.DARKGREEN, "Green 1", Color.GREEN);
ColorDefinition.DARKCYAN = new ColorDefinition(Color.DARKCYAN, "Cyan 1", Color.CYAN);
ColorDefinition.DARKRED = new ColorDefinition(Color.DARKRED, "Red 1", Color.RED);
ColorDefinition.DARKMAGENTA = new ColorDefinition(Color.DARKMAGENTA, "Magenta 1", Color.MAGENTA);
ColorDefinition.DARKBROWN = new ColorDefinition(Color.DARKBROWN, "Brown 1", Color.BROWN);
ColorDefinition.BLUE = new ColorDefinition(Color.BLUE, "Blue 2", Color.LIGHTBLUE);
ColorDefinition.GREEN = new ColorDefinition(Color.GREEN, "Green 2", Color.LIGHTGREEN);
ColorDefinition.CYAN = new ColorDefinition(Color.CYAN, "Cyan 2", Color.LIGHTCYAN);
ColorDefinition.RED = new ColorDefinition(Color.RED, "Red 2", Color.LIGHTRED);
ColorDefinition.MAGENTA = new ColorDefinition(Color.MAGENTA, "Magenta 2", Color.LIGHTMAGENTA);
ColorDefinition.BROWN = new ColorDefinition(Color.BROWN, "Brown 2", Color.YELLOW);
ColorDefinition.LIGHTBLUE = new ColorDefinition(Color.LIGHTBLUE, "Blue 3", Color.PUREBLUE);
ColorDefinition.LIGHTGREEN = new ColorDefinition(Color.LIGHTGREEN, "Green 3", Color.PUREGREEN);
ColorDefinition.LIGHTCYAN = new ColorDefinition(Color.LIGHTCYAN, "Cyan 3", Color.PURECYAN);
ColorDefinition.LIGHTRED = new ColorDefinition(Color.LIGHTRED, "Red 3", Color.PURERED);
ColorDefinition.LIGHTMAGENTA = new ColorDefinition(Color.LIGHTMAGENTA, "Magenta 3", Color.PUREMAGENTA);
ColorDefinition.YELLOW = new ColorDefinition(Color.YELLOW, "Yellow 3", Color.PUREYELLOW);
ColorDefinition.PUREBLUE = new ColorDefinition(Color.PUREBLUE, "Blue 4", Color.WHITE);
ColorDefinition.PUREGREEN = new ColorDefinition(Color.PUREGREEN, "Green 4", Color.WHITE);
ColorDefinition.PURECYAN = new ColorDefinition(Color.PURECYAN, "Cyan 4", Color.WHITE);
ColorDefinition.PURERED = new ColorDefinition(Color.PURERED, "Red 4", Color.WHITE);
ColorDefinition.PUREMAGENTA = new ColorDefinition(Color.PUREMAGENTA, "Magenta 4", Color.WHITE);
ColorDefinition.PUREYELLOW = new ColorDefinition(Color.PUREYELLOW, "Yellow 4", Color.WHITE);
exports.ColorDefinition = ColorDefinition;
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
    TextHjustify["RIGHT"] = "R";
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
    PinType["INPUT"] = "I";
    PinType["OUTPUT"] = "O";
    PinType["BIDI"] = "B";
    PinType["TRISTATE"] = "T";
    PinType["PASSIVE"] = "P";
    PinType["UNSPECIFIED"] = "U";
    PinType["POWER_IN"] = "W";
    PinType["POWER_OUT"] = "w";
    PinType["OPENCOLLECTOR"] = "C";
    PinType["OPENEMITTER"] = "E";
    PinType["NC"] = "N";
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
var SheetSide;
(function (SheetSide) {
    SheetSide["RIGHT"] = "R";
    SheetSide["TOP"] = "T";
    SheetSide["BOTTOM"] = "B";
    SheetSide["LEFT"] = "L";
})(SheetSide = exports.SheetSide || (exports.SheetSide = {}));
var Net;
(function (Net) {
    Net["INPUT"] = "I";
    Net["OUTPUT"] = "O";
    Net["BIDI"] = "B";
    Net["TRISTATE"] = "T";
    Net["UNSPECIFIED"] = "U";
})(Net = exports.Net || (exports.Net = {}));
class Size {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
    static from(s) {
        return new Size(s.width, s.height);
    }
}
exports.Size = Size;
class PageInfo {
    constructor(pageType, portrait = false, width, height) {
        this.portrait = false;
        this.width = width || 0;
        this.height = height || 0;
        if (!width && !height) {
            this.setPageType(pageType);
        }
        else {
            this.pageType = pageType;
        }
        this.setPortrait(portrait);
    }
    setPageType(pageType) {
        const page = PageInfo.PAGE_TYPES.find((i) => i.pageType === pageType);
        Object.assign(this, page);
        this.pageType = pageType;
    }
    setPortrait(portrait) {
        if (this.portrait != portrait) {
            [this.width, this.height] = [this.height, this.width];
            this.portrait = portrait;
        }
    }
}
PageInfo.A4 = new PageInfo("A4", false, MM2MIL(297), MM2MIL(210));
PageInfo.A3 = new PageInfo("A3", false, MM2MIL(420), MM2MIL(297));
PageInfo.A2 = new PageInfo("A2", false, MM2MIL(594), MM2MIL(420));
PageInfo.A1 = new PageInfo("A1", false, MM2MIL(841), MM2MIL(594));
PageInfo.A0 = new PageInfo("A0", false, MM2MIL(1189), MM2MIL(841));
PageInfo.A = new PageInfo("A", false, 11000, 8500);
PageInfo.B = new PageInfo("B", false, 17000, 11000);
PageInfo.C = new PageInfo("C", false, 22000, 17000);
PageInfo.D = new PageInfo("D", false, 34000, 22000);
PageInfo.E = new PageInfo("E", false, 44000, 34000);
PageInfo.GERBER = new PageInfo("GERBER", false, 32000, 32000);
PageInfo.User = new PageInfo("User", false, 17000, 11000);
PageInfo.USLetter = new PageInfo("USLetter", false, 11000, 8500);
PageInfo.USLegal = new PageInfo("USLegal", false, 14000, 8500);
PageInfo.USLedger = new PageInfo("USLedger", false, 17000, 11000);
PageInfo.PAGE_TYPES = [
    PageInfo.A4,
    PageInfo.A3,
    PageInfo.A2,
    PageInfo.A1,
    PageInfo.A0,
    PageInfo.A,
    PageInfo.B,
    PageInfo.C,
    PageInfo.D,
    PageInfo.E,
    PageInfo.GERBER,
    PageInfo.User,
    PageInfo.USLetter,
    PageInfo.USLegal,
    PageInfo.USLedger,
];
exports.PageInfo = PageInfo;
//# sourceMappingURL=kicad_common.js.map