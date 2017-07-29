/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_LINE_WIDTH", function() { return DEFAULT_LINE_WIDTH; });
/* harmony export (immutable) */ __webpack_exports__["DECIDEG2RAD"] = DECIDEG2RAD;
/* harmony export (immutable) */ __webpack_exports__["RAD2DECIDEG"] = RAD2DECIDEG;
/* harmony export (immutable) */ __webpack_exports__["NORMALIZE_ANGLE_POS"] = NORMALIZE_ANGLE_POS;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Transform", function() { return Transform; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Point", function() { return Point; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Rect", function() { return Rect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Fill", function() { return Fill; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TextHjustify", function() { return TextHjustify; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TextVjustify", function() { return TextVjustify; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PinOrientation", function() { return PinOrientation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TextAngle", function() { return TextAngle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PinType", function() { return PinType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PinAttribute", function() { return PinAttribute; });
//#!tsc --target ES6 --module commonjs kicad.ts && node kicad.js
// typings install ds~node
///<reference path="./typings/index.d.ts"/>
//
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
var DEFAULT_LINE_WIDTH = 6;
function DECIDEG2RAD(deg) {
    return deg * Math.PI / 1800;
}
function RAD2DECIDEG(rad) {
    return rad * 1800 / Math.PI;
}
function NORMALIZE_ANGLE_POS(angle) {
    while (angle < 0)
        angle += 3600;
    while (angle >= 3600)
        angle -= 3600;
    return angle;
}
var Transform = (function () {
    function Transform(x1, y1, x2, y2) {
        if (x1 === void 0) { x1 = 1; }
        if (y1 === void 0) { y1 = 0; }
        if (x2 === void 0) { x2 = 0; }
        if (y2 === void 0) { y2 = -1; }
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
    Transform.prototype.transformCoordinate = function (p) {
        return {
            x: (this.x1 * p.x) + (this.y1 * p.y),
            y: (this.x2 * p.x) + (this.y2 * p.y)
        };
    };
    Transform.prototype.mapAngles = function (angle1, angle2) {
        var angle, delta;
        var x, y, t;
        var swap = 0;
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
    };
    return Transform;
}());

var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    Point.add = function (p1, p2) {
        return {
            x: p1.x + p2.x,
            y: p1.y + p2.y,
        };
    };
    Point.sub = function (p1, p2) {
        return {
            x: p1.x - p2.x,
            y: p1.y - p2.y,
        };
    };
    Point.isZero = function (p) {
        return p.x === 0 && p.y === 0;
    };
    return Point;
}());

var Rect = (function () {
    function Rect(pos1x, pos1y, pos2x, pos2y) {
        this.pos1 = new Point(pos1x, pos1y);
        this.pos2 = new Point(pos2x, pos2y);
    }
    Rect.prototype.getWidth = function () {
        return this.pos2.x - this.pos1.x;
    };
    Rect.prototype.getHeight = function () {
        return this.pos2.y - this.pos1.y;
    };
    Rect.prototype.merge = function (o) {
        return new Rect(Math.min(this.pos1.x, o.pos1.x), Math.min(this.pos1.y, o.pos1.y), Math.max(this.pos2.x, o.pos2.x), Math.max(this.pos2.y, o.pos2.y));
    };
    Rect.prototype.inflate = function (n) {
        this.pos1.x -= n;
        this.pos1.y -= n;
        this.pos2.x += n;
        this.pos2.y += n;
        return this;
    };
    return Rect;
}());

var Fill;
(function (Fill) {
    Fill["NO_FILL"] = "N";
    Fill["FILLED_SHAPE"] = "F";
    Fill["FILLED_WITH_BG_BODYCOLOR"] = "f";
})(Fill || (Fill = {}));
var TextHjustify;
(function (TextHjustify) {
    TextHjustify["LEFT"] = "L";
    TextHjustify["CENTER"] = "C";
    TextHjustify["RIGHT"] = " R";
})(TextHjustify || (TextHjustify = {}));
var TextVjustify;
(function (TextVjustify) {
    TextVjustify["TOP"] = "T";
    TextVjustify["CENTER"] = "C";
    TextVjustify["BOTTOM"] = "B";
})(TextVjustify || (TextVjustify = {}));
var PinOrientation;
(function (PinOrientation) {
    PinOrientation["RIGHT"] = "R";
    PinOrientation["LEFT"] = "L";
    PinOrientation["UP"] = "U";
    PinOrientation["DOWN"] = "D";
})(PinOrientation || (PinOrientation = {}));
var TextAngle;
(function (TextAngle) {
    TextAngle[TextAngle["HORIZ"] = 0] = "HORIZ";
    TextAngle[TextAngle["VERT"] = 900] = "VERT";
})(TextAngle || (TextAngle = {}));
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
})(PinType || (PinType = {}));
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
})(PinAttribute || (PinAttribute = {}));


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Library", function() { return Library; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Component", function() { return Component; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Field0", function() { return Field0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FieldN", function() { return FieldN; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Draw", function() { return Draw; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DrawArc", function() { return DrawArc; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DrawCircle", function() { return DrawCircle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DrawPolyline", function() { return DrawPolyline; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DrawSquare", function() { return DrawSquare; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DrawText", function() { return DrawText; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DrawPin", function() { return DrawPin; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__kicad_common__ = __webpack_require__(0);
//#!tsc --target ES6 --noUnusedLocals --module commonjs kicad.ts && node kicad.js
// typings install ds~node
///<reference path="./typings/index.d.ts"/>
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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

var Library = (function () {
    function Library() {
        this.components = [];
    }
    Library.load = function (content) {
        var lines = content.split(/\n/);
        var lib = new this();
        lib.parse(lines);
        return lib;
    };
    Library.prototype.parse = function (lines) {
        var line;
        var version = lines.shift();
        if (!version || version.indexOf('EESchema-LIBRARY Version 2.3') !== 0) {
            throw "unknwon library format";
        }
        while (line = lines.shift()) {
            if (line[0] === '#')
                continue;
            var tokens = line.split(/ +/);
            if (tokens[0] === 'DEF') {
                this.components.push(new Component(tokens.slice(1)).parse(lines));
            }
            else {
                throw 'unknown token ' + tokens[0];
            }
        }
    };
    Library.prototype.findByName = function (name) {
        var ret = this.components.find(function (i) { return i.name === name; });
        if (!ret) {
            throw "Component notfound";
        }
        return ret;
    };
    return Library;
}());

var Component = (function () {
    function Component(params) {
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
    Component.prototype.parse = function (lines) {
        var line;
        while (line = lines.shift()) {
            if (line === 'ENDDEF')
                break;
            var tokens = line.split(/ +/);
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
    };
    return Component;
}());

var Field0 = (function () {
    function Field0(params) {
        this.reference = params[0].replace(/^"|"$/g, '');
        this.posx = Number(params[1]);
        this.posy = Number(params[2]);
        this.textSize = Number(params[3]);
        this.textOrientation = params[4] === 'H' ? __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextAngle"].HORIZ : __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextAngle"].VERT;
        this.visibility = params[5];
        this.htextJustify = params[6];
        this.vtextJustify = params[7];
    }
    return Field0;
}());

var FieldN = (function () {
    function FieldN(params) {
        this.name = params[0].replace(/''/g, '"').replace(/~/g, ' ').replace(/^"|"$/g, '');
        this.posx = Number(params[1]);
        this.posy = Number(params[2]);
        this.textSize = Number(params[3]);
        this.textOrientation = params[4] === 'H' ? __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextAngle"].HORIZ : __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextAngle"].VERT;
        this.visibility = params[5];
        this.htextJustify = params[6];
        this.vtextJustify = params[7];
        this.fieldname = params[8];
    }
    return FieldN;
}());

var Draw = (function () {
    function Draw() {
        this.objects = [];
    }
    Draw.prototype.parse = function (lines) {
        var line;
        while (line = lines.shift()) {
            if (line === 'ENDDRAW')
                break;
            var tokens = line.split(/ +/);
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
    };
    Draw.prototype.getBoundingRect = function () {
        var rect;
        for (var _i = 0, _a = this.objects; _i < _a.length; _i++) {
            var o = _a[_i];
            var box = o.getBoundingBox();
            if (!rect) {
                rect = box;
            }
            else {
                rect = rect.merge(box);
            }
        }
        return rect;
    };
    return Draw;
}());

var DrawObject = (function () {
    function DrawObject() {
    }
    return DrawObject;
}());
var DrawArc = (function (_super) {
    __extends(DrawArc, _super);
    function DrawArc(params) {
        var _this = _super.call(this) || this;
        _this.posx = Number(params[0]);
        _this.posy = Number(params[1]);
        _this.radius = Number(params[2]);
        _this.startAngle = Number(params[3]);
        _this.endAngle = Number(params[4]);
        _this.unit = Number(params[5]);
        _this.convert = Number(params[6]);
        _this.lineWidth = Number(params[7]);
        _this.fill = params[8] || __WEBPACK_IMPORTED_MODULE_0__kicad_common__["Fill"].NO_FILL;
        _this.startx = Number(params[9]);
        _this.starty = Number(params[10]);
        _this.endx = Number(params[11]);
        _this.endy = Number(params[12]);
        return _this;
    }
    DrawArc.prototype.getBoundingBox = function () {
        var ret = new __WEBPACK_IMPORTED_MODULE_0__kicad_common__["Rect"](0, 0, 0, 0);
        var arcStart = { x: this.startx, y: this.starty };
        var arcEnd = { x: this.endx, y: this.endy };
        var pos = { x: this.posx, y: this.posy };
        var normStart = __WEBPACK_IMPORTED_MODULE_0__kicad_common__["Point"].sub(arcStart, pos);
        var normEnd = __WEBPACK_IMPORTED_MODULE_0__kicad_common__["Point"].sub(arcEnd, pos);
        if (__WEBPACK_IMPORTED_MODULE_0__kicad_common__["Point"].isZero(normStart) || __WEBPACK_IMPORTED_MODULE_0__kicad_common__["Point"].isZero(normEnd) || this.radius === 0) {
            return ret;
        }
        var transform = new __WEBPACK_IMPORTED_MODULE_0__kicad_common__["Transform"]();
        var startPos = transform.transformCoordinate(arcStart);
        var endPos = transform.transformCoordinate(arcEnd);
        var centerPos = transform.transformCoordinate(pos);
        var _a = transform.mapAngles(this.startAngle, this.endAngle), startAngle = _a[0], endAngle = _a[1], swap = _a[2];
        if (swap) {
            _b = [startPos.x, endPos.x], endPos.x = _b[0], startPos.x = _b[1];
            _c = [startPos.y, endPos.y], endPos.y = _c[0], startPos.y = _c[1];
        }
        var minX = Math.min(startPos.x, endPos.x);
        var minY = Math.min(startPos.y, endPos.y);
        var maxX = Math.max(startPos.x, endPos.x);
        var maxY = Math.max(startPos.y, endPos.y);
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
        var _b, _c;
    };
    return DrawArc;
}(DrawObject));

var DrawCircle = (function (_super) {
    __extends(DrawCircle, _super);
    function DrawCircle(params) {
        var _this = _super.call(this) || this;
        _this.posx = Number(params[0]);
        _this.posy = Number(params[1]);
        _this.radius = Number(params[2]);
        _this.unit = Number(params[3]);
        _this.convert = Number(params[4]);
        _this.lineWidth = Number(params[5]);
        _this.fill = params[6] || __WEBPACK_IMPORTED_MODULE_0__kicad_common__["Fill"].NO_FILL;
        return _this;
    }
    DrawCircle.prototype.getBoundingBox = function () {
        var transform = new __WEBPACK_IMPORTED_MODULE_0__kicad_common__["Transform"]();
        var pos1 = transform.transformCoordinate({ x: this.posx - this.radius, y: this.posy - this.radius });
        var pos2 = transform.transformCoordinate({ x: this.posx + this.radius, y: this.posy + this.radius });
        return new __WEBPACK_IMPORTED_MODULE_0__kicad_common__["Rect"](Math.min(pos1.x, pos2.x), Math.min(pos1.y, pos2.y), Math.max(pos1.x, pos2.x), Math.max(pos1.y, pos2.y));
    };
    return DrawCircle;
}(DrawObject));

var DrawPolyline = (function (_super) {
    __extends(DrawPolyline, _super);
    function DrawPolyline(params) {
        var _this = _super.call(this) || this;
        _this.pointCount = Number(params[0]);
        _this.unit = Number(params[1]);
        _this.convert = Number(params[2]);
        _this.lineWidth = Number(params[3]);
        _this.points = params.slice(4, 4 + (_this.pointCount * 2)).map(function (i) { return Number(i); });
        _this.fill = params[4 + (_this.pointCount * 2)] || __WEBPACK_IMPORTED_MODULE_0__kicad_common__["Fill"].NO_FILL;
        return _this;
    }
    DrawPolyline.prototype.getBoundingBox = function () {
        var minx, maxx;
        var miny, maxy;
        minx = maxx = this.points[0];
        miny = maxy = this.points[1];
        for (var i = 2, len = this.points.length; i < len; i += 2) {
            var x = this.points[i];
            var y = this.points[i + 1];
            minx = Math.min(minx, x);
            maxx = Math.max(maxx, x);
            miny = Math.min(miny, y);
            maxy = Math.max(maxy, y);
        }
        var transform = new __WEBPACK_IMPORTED_MODULE_0__kicad_common__["Transform"]();
        var pos1 = transform.transformCoordinate({ x: minx, y: miny });
        var pos2 = transform.transformCoordinate({ x: maxx, y: maxy });
        return new __WEBPACK_IMPORTED_MODULE_0__kicad_common__["Rect"](Math.min(pos1.x, pos2.x), Math.min(pos1.y, pos2.y), Math.max(pos1.x, pos2.x), Math.max(pos1.y, pos2.y));
    };
    return DrawPolyline;
}(DrawObject));

var DrawSquare = (function (_super) {
    __extends(DrawSquare, _super);
    function DrawSquare(params) {
        var _this = _super.call(this) || this;
        _this.startx = Number(params[0]);
        _this.starty = Number(params[1]);
        _this.endx = Number(params[2]);
        _this.endy = Number(params[3]);
        _this.unit = Number(params[4]);
        _this.convert = Number(params[5]);
        _this.lineWidth = Number(params[6]);
        _this.fill = params[7] || __WEBPACK_IMPORTED_MODULE_0__kicad_common__["Fill"].NO_FILL;
        return _this;
    }
    DrawSquare.prototype.getBoundingBox = function () {
        var transform = new __WEBPACK_IMPORTED_MODULE_0__kicad_common__["Transform"]();
        var pos1 = transform.transformCoordinate({ x: this.startx, y: this.starty });
        var pos2 = transform.transformCoordinate({ x: this.endx, y: this.endy });
        return new __WEBPACK_IMPORTED_MODULE_0__kicad_common__["Rect"](Math.min(pos1.x, pos2.x), Math.min(pos1.y, pos2.y), Math.max(pos1.x, pos2.x), Math.max(pos1.y, pos2.y));
    };
    return DrawSquare;
}(DrawObject));

var DrawText = (function (_super) {
    __extends(DrawText, _super);
    function DrawText(params) {
        var _this = _super.call(this) || this;
        _this.angle = Number(params[0]);
        _this.posx = Number(params[1]);
        _this.posy = Number(params[2]);
        _this.textSize = Number(params[3]);
        _this.textType = Number(params[4]);
        _this.unit = Number(params[5]);
        _this.convert = Number(params[6]);
        _this.text = params[7].replace(/''/g, '"').replace(/~/g, ' ').replace(/^"|"$/g, '');
        _this.italic = params[8] === 'Italic';
        _this.bold = Number(params[9]) > 0;
        _this.hjustify = params[10];
        _this.vjustify = params[11];
        return _this;
    }
    DrawText.prototype.getBoundingBox = function () {
        // TODO
        return new __WEBPACK_IMPORTED_MODULE_0__kicad_common__["Rect"](this.posx - (this.angle === 0 ? this.text.length * this.textSize : 0), this.posy - (this.angle !== 0 ? this.text.length * this.textSize : 0), this.posx + (this.angle === 0 ? this.text.length * this.textSize : 0), this.posy + (this.angle !== 0 ? this.text.length * this.textSize : 0));
    };
    return DrawText;
}(DrawObject));

var DrawPin = (function (_super) {
    __extends(DrawPin, _super);
    function DrawPin(params) {
        var _this = _super.call(this) || this;
        _this.name = params[0];
        _this.num = params[1];
        _this.posx = Number(params[2]);
        _this.posy = Number(params[3]);
        _this.length = Number(params[4]);
        _this.orientation = params[5];
        _this.nameTextSize = Number(params[6]);
        _this.numTextSize = Number(params[7]);
        _this.unit = Number(params[8]);
        _this.convert = Number(params[9]);
        _this.pinType = params[10];
        _this.attributes = (params[11] || '').split('');
        return _this;
    }
    DrawPin.prototype.getBoundingBox = function () {
        // TODO
        return new __WEBPACK_IMPORTED_MODULE_0__kicad_common__["Rect"](this.posx - this.length, this.posy - this.length, this.posx + this.length, this.posy + this.length);
    };
    return DrawPin;
}(DrawObject));



/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {


const { Transform } = __webpack_require__(0);
const { CanvasPlotter } = __webpack_require__(3);
const { Library } = __webpack_require__(1);
//import { Trasform } from "../../kicad_common";
//import { CanvasPlotter } from "../../kicad_plotter";
//import { Library } from "../../kicad_lib";

//const lib = Library.load("foobar");
//console.log(lib);


const app = new Vue({
	el: '#app',
	data: {
		lib: {},
		components: [],
	},

	created: function () {
		this.loadLibrary();
	},

	methods: {
		loadLibrary: async function (url) {
			console.log('loadLibrary');
			// const res = await fetch("/lib/device.lib");
			const res = await fetch(location.search.substring(1) || '/lib/device.lib');
			const text = await res.text();
			const lib = Library.load(text);
			this.lib = lib;
			this.components = lib.components;
		},

		plot: function (component) {
			const rect = component.draw.getBoundingRect();
			if (!rect) {
				return "data:";
			}
			const width = rect.getWidth(), height = rect.getHeight();
			console.log('plot', component.name, rect, width, height);
			const canvas = document.createElement('canvas');
			canvas.width = width + 400;
			canvas.height = height + 400;
			const ctx = canvas.getContext('2d');
			ctx.translate(canvas.width / 2, canvas.height / 2);
			ctx.stokeStyle = '#000';
			ctx.fillStyle  = '#000';

			const plotter = new CanvasPlotter(ctx);
			plotter.plotComponent(component, { x: 0, y: 0 }, new Transform());

			return canvas.toDataURL();
		}
	}
})


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Plotter", function() { return Plotter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CanvasPlotter", function() { return CanvasPlotter; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__kicad_common__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__kicad_lib__ = __webpack_require__(1);
//#!tsc --target ES6 --noUnusedLocals --module commonjs kicad.ts && node kicad.js
// typings install ds~node
///<reference path="./typings/index.d.ts"/>
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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


/**
 * similar to KiCAD Plotter
 *
 */
var Plotter = (function () {
    function Plotter() {
    }
    Plotter.prototype.moveTo = function (x, y) {
        if (typeof y === 'number') {
            this.penTo({ x: x, y: y }, "U");
        }
        else {
            this.penTo(x, "U");
        }
    };
    Plotter.prototype.lineTo = function (x, y) {
        if (typeof y === 'number') {
            this.penTo({ x: x, y: y }, "D");
        }
        else {
            this.penTo(x, "D");
        }
    };
    Plotter.prototype.finishTo = function (x, y) {
        if (typeof y === 'number') {
            this.penTo({ x: x, y: y }, "D");
            this.penTo({ x: x, y: y }, "Z");
        }
        else {
            this.penTo(x, "D");
            this.penTo(x, "Z");
        }
    };
    Plotter.prototype.finishPen = function () {
        this.penTo({ x: 0, y: 0 }, "Z");
    };
    /**
     * kicad-js implements plot methods to plotter instead of each library items.
     */
    Plotter.prototype.plotComponent = function (component, offset, transform) {
        if (component.field) {
            var pos = __WEBPACK_IMPORTED_MODULE_0__kicad_common__["Point"].add(transform.transformCoordinate({ x: component.field.posx, y: component.field.posy }), offset);
            this.text(pos, "black", component.field.reference, component.field.textOrientation, component.field.textSize, __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextHjustify"].CENTER, __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextVjustify"].CENTER, 0, false, false);
        }
        if (component.fields[0]) {
            var pos = __WEBPACK_IMPORTED_MODULE_0__kicad_common__["Point"].add(transform.transformCoordinate({ x: component.fields[0].posx, y: component.fields[0].posy }), offset);
            this.text(pos, "black", component.fields[0].name, component.field.textOrientation, component.fields[0].textSize, __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextHjustify"].CENTER, __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextVjustify"].CENTER, 0, false, false);
        }
        for (var _i = 0, _a = component.draw.objects; _i < _a.length; _i++) {
            var draw = _a[_i];
            if (draw instanceof __WEBPACK_IMPORTED_MODULE_1__kicad_lib__["DrawArc"]) {
                var pos = __WEBPACK_IMPORTED_MODULE_0__kicad_common__["Point"].add(transform.transformCoordinate({ x: draw.posx, y: draw.posy }), offset);
                var _b = transform.mapAngles(draw.startAngle, draw.endAngle), startAngle = _b[0], endAngle = _b[1];
                this.arc(pos, startAngle, endAngle, draw.radius, draw.fill, __WEBPACK_IMPORTED_MODULE_0__kicad_common__["DEFAULT_LINE_WIDTH"]);
            }
            else if (draw instanceof __WEBPACK_IMPORTED_MODULE_1__kicad_lib__["DrawCircle"]) {
                var pos = __WEBPACK_IMPORTED_MODULE_0__kicad_common__["Point"].add(transform.transformCoordinate({ x: draw.posx, y: draw.posy }), offset);
                this.circle(pos, draw.radius * 2, draw.fill, __WEBPACK_IMPORTED_MODULE_0__kicad_common__["DEFAULT_LINE_WIDTH"]);
            }
            else if (draw instanceof __WEBPACK_IMPORTED_MODULE_1__kicad_lib__["DrawPolyline"]) {
                var points = [];
                for (var i = 0, len = draw.points.length; i < len; i += 2) {
                    var pos = __WEBPACK_IMPORTED_MODULE_0__kicad_common__["Point"].add(transform.transformCoordinate({ x: draw.points[i], y: draw.points[i + 1] }), offset);
                    points.push(pos);
                }
                this.polyline(points, draw.fill, __WEBPACK_IMPORTED_MODULE_0__kicad_common__["DEFAULT_LINE_WIDTH"]);
            }
            else if (draw instanceof __WEBPACK_IMPORTED_MODULE_1__kicad_lib__["DrawSquare"]) {
                var pos1 = __WEBPACK_IMPORTED_MODULE_0__kicad_common__["Point"].add(transform.transformCoordinate({ x: draw.startx, y: draw.starty }), offset);
                var pos2 = __WEBPACK_IMPORTED_MODULE_0__kicad_common__["Point"].add(transform.transformCoordinate({ x: draw.endx, y: draw.endy }), offset);
                this.rect(pos1, pos2, draw.fill, __WEBPACK_IMPORTED_MODULE_0__kicad_common__["DEFAULT_LINE_WIDTH"]);
            }
            else if (draw instanceof __WEBPACK_IMPORTED_MODULE_1__kicad_lib__["DrawText"]) {
                var pos = __WEBPACK_IMPORTED_MODULE_0__kicad_common__["Point"].add(transform.transformCoordinate({ x: draw.posx, y: draw.posy }), offset);
                this.text(pos, "black", draw.text, component.field.textOrientation, draw.textSize, __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextHjustify"].CENTER, __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextVjustify"].CENTER, 0, false, false);
            }
            else if (draw instanceof __WEBPACK_IMPORTED_MODULE_1__kicad_lib__["DrawPin"]) {
                this.plotPin(draw, component, offset, transform);
            }
            else {
                throw 'unknown draw object type: ' + draw.constructor.name;
            }
        }
    };
    Plotter.prototype.plotPin = function (draw, component, offset, transform) {
        this.plotPinTexts(draw, component, offset, transform);
        this.plotPinSymbol(draw, component, offset, transform);
    };
    Plotter.prototype.plotPinTexts = function (draw, component, offset, transform) {
        var pos = __WEBPACK_IMPORTED_MODULE_0__kicad_common__["Point"].add(transform.transformCoordinate({ x: draw.posx, y: draw.posy }), offset);
        var x1 = pos.x, y1 = pos.y;
        if (draw.orientation === __WEBPACK_IMPORTED_MODULE_0__kicad_common__["PinOrientation"].UP) {
            y1 -= draw.length;
        }
        else if (draw.orientation === __WEBPACK_IMPORTED_MODULE_0__kicad_common__["PinOrientation"].DOWN) {
            y1 += draw.length;
        }
        else if (draw.orientation === __WEBPACK_IMPORTED_MODULE_0__kicad_common__["PinOrientation"].LEFT) {
            x1 -= draw.length;
        }
        else if (draw.orientation === __WEBPACK_IMPORTED_MODULE_0__kicad_common__["PinOrientation"].RIGHT) {
            x1 += draw.length;
        }
        var nameOffset = 4;
        var numOffset = 4;
        var textInside = component.textOffset;
        var isHorizontal = draw.orientation === __WEBPACK_IMPORTED_MODULE_0__kicad_common__["PinOrientation"].LEFT || draw.orientation === __WEBPACK_IMPORTED_MODULE_0__kicad_common__["PinOrientation"].RIGHT;
        if (textInside) {
            if (isHorizontal) {
                if (component.drawPinname) {
                    if (draw.orientation === __WEBPACK_IMPORTED_MODULE_0__kicad_common__["PinOrientation"].RIGHT) {
                        this.text({ x: x1 + textInside, y: y1 }, "black", draw.name, __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextAngle"].HORIZ, draw.nameTextSize, __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextHjustify"].LEFT, __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextVjustify"].CENTER, 0, false, false);
                    }
                    else {
                        this.text({ x: x1 - textInside, y: y1 }, "black", draw.name, __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextAngle"].HORIZ, draw.nameTextSize, __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextHjustify"].RIGHT, __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextVjustify"].CENTER, 0, false, false);
                    }
                }
                if (component.drawPinnumber) {
                    this.text({ x: (x1 + pos.x) / 2, y: y1 + numOffset }, "black", draw.name, __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextAngle"].HORIZ, draw.nameTextSize, __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextHjustify"].CENTER, __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextVjustify"].BOTTOM, 0, false, false);
                }
            }
            else {
                if (draw.orientation === __WEBPACK_IMPORTED_MODULE_0__kicad_common__["PinOrientation"].DOWN) {
                    if (component.drawPinname) {
                        this.text({ x: x1, y: y1 + textInside }, "black", draw.name, __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextAngle"].VERT, draw.nameTextSize, __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextHjustify"].RIGHT, __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextVjustify"].CENTER, 0, false, false);
                    }
                    if (component.drawPinnumber) {
                        this.text({ x: x1 - numOffset, y: (y1 + pos.y) / 2 }, "black", draw.name, __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextAngle"].VERT, draw.nameTextSize, __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextHjustify"].RIGHT, __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextVjustify"].CENTER, 0, false, false);
                    }
                }
                else {
                    if (component.drawPinname) {
                        this.text({ x: x1, y: y1 - textInside }, "black", draw.name, __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextAngle"].VERT, draw.nameTextSize, __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextHjustify"].LEFT, __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextVjustify"].CENTER, 0, false, false);
                    }
                    if (component.drawPinnumber) {
                        this.text({ x: x1 - numOffset, y: (y1 + pos.y) / 2 }, "black", draw.name, __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextAngle"].VERT, draw.nameTextSize, __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextHjustify"].CENTER, __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextVjustify"].BOTTOM, 0, false, false);
                    }
                }
            }
        }
        else {
            if (isHorizontal) {
                if (component.drawPinname) {
                    this.text({ x: (x1 + pos.x) / 2, y: y1 - nameOffset }, "black", draw.name, __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextAngle"].HORIZ, draw.nameTextSize, __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextHjustify"].CENTER, __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextVjustify"].BOTTOM, 0, false, false);
                }
                if (component.drawPinnumber) {
                    this.text({ x: (x1 + pos.x) / 2, y: y1 + numOffset }, "black", draw.num, __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextAngle"].HORIZ, draw.numTextSize, __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextHjustify"].CENTER, __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextVjustify"].TOP, 0, false, false);
                }
            }
            else {
                if (component.drawPinname) {
                    this.text({ x: x1 - nameOffset, y: (y1 + pos.y) / 2 }, "black", draw.name, __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextAngle"].VERT, draw.nameTextSize, __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextHjustify"].CENTER, __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextVjustify"].BOTTOM, 0, false, false);
                }
                if (component.drawPinnumber) {
                    this.text({ x: x1 + numOffset, y: (y1 + pos.y) / 2 }, "black", draw.num, __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextAngle"].VERT, draw.numTextSize, __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextHjustify"].CENTER, __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextVjustify"].TOP, 0, false, false);
                }
            }
        }
    };
    Plotter.prototype.plotPinSymbol = function (draw, component, offset, transform) {
        var pos = __WEBPACK_IMPORTED_MODULE_0__kicad_common__["Point"].add(transform.transformCoordinate({ x: draw.posx, y: draw.posy }), offset);
        var orientation = this.pinDrawOrientation(draw, transform);
        var x1 = pos.x, y1 = pos.y;
        var mapX1 = 0, mapY1 = 0;
        if (orientation === __WEBPACK_IMPORTED_MODULE_0__kicad_common__["PinOrientation"].UP) {
            y1 -= draw.length;
            mapY1 = 1;
        }
        else if (orientation === __WEBPACK_IMPORTED_MODULE_0__kicad_common__["PinOrientation"].DOWN) {
            y1 += draw.length;
            mapY1 = -1;
        }
        else if (orientation === __WEBPACK_IMPORTED_MODULE_0__kicad_common__["PinOrientation"].LEFT) {
            x1 -= draw.length;
            mapX1 = 1;
        }
        else if (orientation === __WEBPACK_IMPORTED_MODULE_0__kicad_common__["PinOrientation"].RIGHT) {
            x1 += draw.length;
            mapX1 = -1;
        }
        // TODO shape
        this.fill = __WEBPACK_IMPORTED_MODULE_0__kicad_common__["Fill"].NO_FILL;
        this.setCurrentLineWidth(__WEBPACK_IMPORTED_MODULE_0__kicad_common__["DEFAULT_LINE_WIDTH"]);
        this.moveTo({ x: x1, y: y1 });
        this.finishTo({ x: pos.x, y: pos.y });
        this.circle({ x: pos.x, y: pos.y }, 20, __WEBPACK_IMPORTED_MODULE_0__kicad_common__["Fill"].NO_FILL, 2);
    };
    Plotter.prototype.pinDrawOrientation = function (draw, transform) {
        var end = { x: 0, y: 0 };
        if (draw.orientation === __WEBPACK_IMPORTED_MODULE_0__kicad_common__["PinOrientation"].UP) {
            end.y = 1;
        }
        else if (draw.orientation === __WEBPACK_IMPORTED_MODULE_0__kicad_common__["PinOrientation"].DOWN) {
            end.y = -1;
        }
        else if (draw.orientation === __WEBPACK_IMPORTED_MODULE_0__kicad_common__["PinOrientation"].LEFT) {
            end.x = -1;
        }
        else if (draw.orientation === __WEBPACK_IMPORTED_MODULE_0__kicad_common__["PinOrientation"].RIGHT) {
            end.x = 1;
        }
        end = transform.transformCoordinate(end);
        if (end.x === 0) {
            if (end.y > 0) {
                return __WEBPACK_IMPORTED_MODULE_0__kicad_common__["PinOrientation"].DOWN;
            }
            else {
                return __WEBPACK_IMPORTED_MODULE_0__kicad_common__["PinOrientation"].UP;
            }
        }
        else {
            if (end.x < 0) {
                return __WEBPACK_IMPORTED_MODULE_0__kicad_common__["PinOrientation"].LEFT;
            }
            else {
                return __WEBPACK_IMPORTED_MODULE_0__kicad_common__["PinOrientation"].RIGHT;
            }
        }
    };
    return Plotter;
}());

var CanvasPlotter = (function (_super) {
    __extends(CanvasPlotter, _super);
    function CanvasPlotter(ctx) {
        var _this = _super.call(this) || this;
        _this.ctx = ctx;
        _this.penState = "Z";
        _this.fill = __WEBPACK_IMPORTED_MODULE_0__kicad_common__["Fill"].NO_FILL;
        _this.ctx.lineCap = "round";
        _this.ctx.strokeStyle = "#000";
        return _this;
    }
    CanvasPlotter.prototype.rect = function (p1, p2, fill, width) {
        this.setCurrentLineWidth(width);
        this.fill = fill;
        this.moveTo(p1.x, p1.y);
        this.lineTo(p1.x, p2.y);
        this.lineTo(p2.x, p2.y);
        this.lineTo(p2.x, p1.y);
        this.finishTo(p1.x, p1.y);
    };
    CanvasPlotter.prototype.circle = function (p, dia, fill, width) {
        this.setCurrentLineWidth(width);
        this.fill = fill;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, dia / 2, 0, Math.PI * 2, false);
        if (fill === __WEBPACK_IMPORTED_MODULE_0__kicad_common__["Fill"].FILLED_SHAPE) {
            this.ctx.fill();
        }
        else {
            this.ctx.stroke();
        }
    };
    CanvasPlotter.prototype.arc = function (p, startAngle, endAngle, radius, fill, width) {
        this.setCurrentLineWidth(width);
        this.fill = fill;
        this.ctx.beginPath();
        var anticlockwise = false;
        //		this.ctx.save();
        //		this.ctx.scale(1, -1);
        this.ctx.arc(p.x, p.y, radius, startAngle / 10 * Math.PI / 180, endAngle / 10 * Math.PI / 180, anticlockwise);
        if (fill === __WEBPACK_IMPORTED_MODULE_0__kicad_common__["Fill"].FILLED_SHAPE) {
            this.ctx.fill();
        }
        else {
            this.ctx.stroke();
        }
        //		this.ctx.restore();
    };
    CanvasPlotter.prototype.polyline = function (points, fill, width) {
        this.setCurrentLineWidth(width);
        this.fill = fill;
        this.moveTo(points[0]);
        for (var i = 1, len = points.length; i < len; i++) {
            this.lineTo(points[i]);
        }
        this.finishPen();
    };
    CanvasPlotter.prototype.text = function (p, color, text, orientation, size, hjustfy, vjustify, width, italic, bold, multiline) {
        if (hjustfy === __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextHjustify"].LEFT) {
            this.ctx.textAlign = "left";
        }
        else if (hjustfy === __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextHjustify"].CENTER) {
            this.ctx.textAlign = "center";
        }
        else if (hjustfy === __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextHjustify"].RIGHT) {
            this.ctx.textAlign = "right";
        }
        if (vjustify === __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextVjustify"].TOP) {
            this.ctx.textBaseline = "top";
        }
        else if (vjustify === __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextVjustify"].CENTER) {
            this.ctx.textBaseline = "middle";
        }
        else if (vjustify === __WEBPACK_IMPORTED_MODULE_0__kicad_common__["TextVjustify"].BOTTOM) {
            this.ctx.textBaseline = "bottom";
        }
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(-Object(__WEBPACK_IMPORTED_MODULE_0__kicad_common__["DECIDEG2RAD"])(orientation));
        this.ctx.font = size + "px monospace";
        this.ctx.fillText(text, 0, 0);
        this.ctx.restore();
    };
    /**
     * U = Pen is up
     * D = Pen is down
     * Z = Pen is outof canvas
     */
    CanvasPlotter.prototype.penTo = function (p, s) {
        if (s === "Z") {
            if (this.fill === __WEBPACK_IMPORTED_MODULE_0__kicad_common__["Fill"].FILLED_SHAPE) {
                // console.log('ctx.fill', p);
                this.ctx.fill();
            }
            else {
                // console.log('ctx.stroke', p);
                this.ctx.stroke();
            }
            this.penState = "Z";
            return;
        }
        // s is U | D
        if (this.penState === "Z") {
            this.ctx.beginPath();
            // console.log('ctx.beginPath');
            // console.log('ctx.moveTo', p);
            this.ctx.moveTo(p.x, p.y);
        }
        else {
            if (s === "U") {
                // console.log('ctx.moveTo', p);
                this.ctx.moveTo(p.x, p.y);
            }
            else {
                // console.log('ctx.lineTo', p);
                this.ctx.lineTo(p.x, p.y);
            }
        }
        this.penState = s;
    };
    CanvasPlotter.prototype.setCurrentLineWidth = function (w) {
        this.ctx.lineWidth = w;
    };
    return CanvasPlotter;
}(Plotter));



/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map