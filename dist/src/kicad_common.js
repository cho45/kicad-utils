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
/**
 * KiCAD internal unit:
 *	length: mil (1/1000 inch)
 *	angles: decidegree (1/10 degrees)
 */
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
function RotatePoint(p, angle) {
    angle = NORMALIZE_ANGLE_POS(angle);
    if (angle === 0) {
        return;
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
}
exports.RotatePoint = RotatePoint;
function MM2MIL(mm) {
    return mm / 0.0254;
}
exports.MM2MIL = MM2MIL;
function MIL2MM(mil) {
    return mil * 0.0254;
}
exports.MIL2MM = MIL2MM;
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
//# sourceMappingURL=kicad_common.js.map