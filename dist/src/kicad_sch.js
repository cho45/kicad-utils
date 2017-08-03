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
const kicad_common_1 = require("./kicad_common");
var TextOrientationType;
(function (TextOrientationType) {
    TextOrientationType[TextOrientationType["HORIZ_LEFT"] = 0] = "HORIZ_LEFT";
    TextOrientationType[TextOrientationType["UP"] = 1] = "UP";
    TextOrientationType[TextOrientationType["HORIZ_RIGHT"] = 2] = "HORIZ_RIGHT";
    TextOrientationType[TextOrientationType["BOTTOM"] = 3] = "BOTTOM";
})(TextOrientationType = exports.TextOrientationType || (exports.TextOrientationType = {}));
;
class Schematic {
    static load(content) {
        const lines = content.split(/\n/);
        const sch = new this();
        sch.parse(lines);
        return sch;
    }
    constructor() {
        this.libs = [];
        this.items = [];
        this.parsed = false;
    }
    parse(lines) {
        const version = lines.shift();
        const SCHEMATIC_HEADER = "EESchema Schematic File Version ";
        const SUPPORTED_VERSION = 2;
        if (!version || version.indexOf(SCHEMATIC_HEADER) !== 0) {
            throw "unknwon library format";
        }
        this.version = Number(version.slice(SCHEMATIC_HEADER.length));
        if (this.version > SUPPORTED_VERSION) {
            throw "schematic format version is greater than supported version: " +
                this.version + '>' + SUPPORTED_VERSION;
        }
        let line;
        while ((line = lines.shift()) !== undefined) {
            if (line[0] === '#')
                continue;
            if (!line)
                continue;
            if (line.indexOf("LIBS:") === 0) {
                // should be skipped and see .pro file but it is parsed.
                this.libs.push(line.slice(5));
                continue;
            }
            const tokens = line.split(/ +/);
            if (tokens[0] === 'EELAYER') {
                while ((line = lines.shift()) !== undefined) {
                    if (line === 'EELAYER END')
                        break;
                    // skip this section
                }
            }
            else if (tokens[0] === '$Descr') {
                this.descr = new Descr(tokens.slice(1)).parse(lines);
            }
            else if (tokens[0] === '$Comp') {
                this.items.push(new SchComponent().parse(lines));
            }
            else if (tokens[0] === '$Sheet') {
                this.items.push(new Sheet().parse(lines));
            }
            else if (tokens[0] === '$Bitmap') {
                this.items.push(new Bitmap().parse(lines));
            }
            else if (tokens[0] === 'Text') {
                this.items.push(new Text(tokens.slice(1)).parse(lines));
            }
            else if (tokens[0] === 'Entry') {
                this.items.push(new Entry(tokens.slice(1)).parse(lines));
            }
            else if (tokens[0] === 'Connection') {
                this.items.push(new Connection(tokens.slice(1)).parse(lines));
            }
            else if (tokens[0] === 'NoConn') {
                this.items.push(new NoConn(tokens.slice(1)).parse(lines));
            }
            else if (tokens[0] === 'Wire') {
                this.items.push(new Wire(tokens.slice(1)).parse(lines));
            }
            else if (tokens[0] === '$EndSCHEMATC') {
                this.parsed = true;
            }
            else {
                throw 'unkown token ' + tokens[0];
            }
        }
    }
}
exports.Schematic = Schematic;
class SchItem {
}
exports.SchItem = SchItem;
class Sheet extends SchItem {
    constructor() {
        super();
        this.sheetPins = [];
    }
    parse(lines) {
        let line;
        while ((line = lines.shift()) !== undefined) {
            if (line === '$EndSheet')
                break;
            const tokens = line.split(/\s+/);
            if (tokens[0] === 'S') {
                this.posx = Number(tokens[1]);
                this.posy = Number(tokens[2]);
                this.sizex = Number(tokens[3]);
                this.sizey = Number(tokens[4]);
            }
            else if (tokens[0] === 'U') {
                this.timestamp = Number(tokens[1]);
            }
            else if (tokens[0].match(/F(\d)/)) {
                const n = Number(RegExp.$1);
                if (n === 0) {
                    this.sheetName = kicad_common_1.ReadDelimitedText(tokens[1]);
                    this.sheetNameSize = Number(tokens[2]);
                }
                else if (n === 1) {
                    this.fileName = kicad_common_1.ReadDelimitedText(tokens[1]);
                    this.fileNameSize = Number(tokens[2]);
                }
                else {
                    this.sheetPins.push(new SheetPin(n, tokens.slice(1)).parse(lines));
                }
            }
        }
        return this;
    }
}
exports.Sheet = Sheet;
class SchComponent extends SchItem {
    constructor() {
        super();
        this.ar = {};
        this.fields = [];
    }
    parse(lines) {
        let line;
        let tabLines = [];
        while ((line = lines.shift()) !== undefined) {
            if (line === '$EndComp')
                break;
            if (line[0] === "\t") {
                tabLines.push(line.substring(1));
                continue;
            }
            const tokens = line.split(/\s+/);
            if (tokens[0] === 'L') {
                this.name = tokens[1].replace(/~/g, ' ');
                this.reference = tokens[2].replace(/~/g, ' ').replace(/^\s+|\s+$/g, '');
                if (!this.reference)
                    this.reference = "U";
            }
            else if (tokens[0] === 'U') {
                this.unit = Number(tokens[1]);
                this.convert = Number(tokens[2]);
                this.timestamp = Number(tokens[3]);
            }
            else if (tokens[0] === 'P') {
                this.posx = Number(tokens[1]);
                this.posy = Number(tokens[2]);
            }
            else if (tokens[0] === 'AR') {
                tokens.slice(1).reduce((r, i) => {
                    const [name, value] = i.split(/=/);
                    r[name] = value;
                    return r;
                }, this.ar);
            }
            else if (tokens[0] === 'F') {
                this.fields.push(new Field(tokens.slice(1)));
            }
        }
        const _oldPosAndUnit = tabLines.shift();
        if (!_oldPosAndUnit) {
            throw 'unexpected line';
        }
        const transform = tabLines.shift();
        if (!transform) {
            throw 'unexpected line';
        }
        this.transform = new kicad_common_1.Transform(...transform.split(/\s+/).map((i) => Number(i)));
        return this;
    }
}
exports.SchComponent = SchComponent;
class Field extends SchItem {
    constructor(tokens) {
        super();
        let i = 0;
        this.number = Number(tokens[i++]);
        this.text = kicad_common_1.ReadDelimitedText(tokens[i++]);
        if (tokens[i + 1][0] === '"') {
            this.name = kicad_common_1.ReadDelimitedText(tokens[i++]);
        }
        this.angle = tokens[i++] === 'V' ? kicad_common_1.TextAngle.VERT : kicad_common_1.TextAngle.HORIZ;
        this.posx = Number(tokens[i++]);
        this.posy = Number(tokens[i++]);
        this.width = Number(tokens[i++]);
        this.visibility = Number(tokens[i++]) !== 0;
        this.hjustify = tokens[i++];
        let char3 = tokens[i++];
        this.vjustify = char3[0];
        this.italic = char3[1] === 'I';
        this.bold = char3[2] === 'B';
    }
}
exports.Field = Field;
class Descr {
    constructor(tokens) {
        this.pageType = tokens[0];
        this.width = Number(tokens[1]);
        this.height = Number(tokens[2]);
        this.orientation = Number(tokens[3] || 0);
    }
    parse(lines) {
        let line;
        while ((line = lines.shift()) !== undefined) {
            if (line === '$EndDescr')
                break;
            const tokens = line.split(/\s+/);
            if (tokens[0] === 'Sheet') {
                this.screenNumber = Number(tokens[1]);
                this.numberOfScreens = Number(tokens[2]);
            }
            else if (tokens[0] === 'Title') {
                this.title = tokens[1];
            }
            else if (tokens[0] === 'Date') {
                this.date = tokens[1];
            }
            else if (tokens[0] === 'Rev') {
                this.rev = tokens[1];
            }
            else if (tokens[0] === 'Comp') {
                this.date = tokens[1];
            }
            else if (tokens[0] === 'Date') {
                this.date = tokens[1];
            }
            else if (tokens[0] === 'Comment1') {
                this.comment1 = tokens[1];
            }
            else if (tokens[0] === 'Comment2') {
                this.comment2 = tokens[1];
            }
            else if (tokens[0] === 'Comment3') {
                this.comment3 = tokens[1];
            }
            else if (tokens[0] === 'Comment4') {
                this.comment4 = tokens[1];
            }
        }
        return this;
    }
}
exports.Descr = Descr;
class Bitmap extends SchItem {
    constructor() {
        super();
    }
    parse(lines) {
        let line;
        while ((line = lines.shift()) !== undefined) {
            if (line === '$EndBitmap')
                break;
            const tokens = line.split(/ +/);
            if (tokens[0] === 'Pos') {
                this.posx = Number(tokens[1]);
                this.posy = Number(tokens[2]);
            }
            else if (tokens[0] === 'Scale') {
                this.scale = Number(tokens[1]);
            }
            else if (tokens[0] === 'Data') {
                const chunks = [];
                while ((line = lines.shift()) !== undefined) {
                    if (line === 'EndData')
                        break;
                    chunks.push(Uint8Array.from(line.replace(/^\s+|\s+$/g, '').split(/\s+/).map((hex) => parseInt(hex, 16))));
                }
                const size = chunks.reduce((r, i) => r + i.length, 0);
                this.data = new Uint8Array(size);
                let offset = 0;
                for (let chunk of chunks) {
                    this.data.set(chunk, offset);
                    offset += chunk.length;
                }
            }
            else {
                throw "unexpected token " + tokens[0];
            }
        }
        return this;
    }
    get isValidPNG() {
        const signature = String.fromCharCode(...this.data.slice(0, Bitmap.PNG_SIGNATURE.length));
        return signature === Bitmap.PNG_SIGNATURE;
    }
    // we need to parse png file to know image dimension
    parseIHDR() {
        if (!this.isValidPNG) {
            throw "this is not a valid png file: invalid signature";
        }
        const IHDR = new DataView(this.data.buffer, Bitmap.PNG_SIGNATURE.length, 25);
        const size = IHDR.getUint32(0);
        const name = String.fromCharCode(IHDR.getUint8(4), IHDR.getUint8(5), IHDR.getUint8(6), IHDR.getUint8(7));
        if (name !== 'IHDR' || size !== 13) {
            throw "this is not a valid png file: invalid IHDR";
        }
        this.width = IHDR.getUint32(0x08);
        this.height = IHDR.getUint32(0x0c);
    }
}
Bitmap.PNG_SIGNATURE = "\x89\x50\x4E\x47\x0D\x0A\x1A\x0A";
exports.Bitmap = Bitmap;
class Text extends SchItem {
    constructor(tokens) {
        super();
        if (!tokens)
            return;
        this.name1 = tokens[0];
        this.posx = Number(tokens[1]);
        this.posy = Number(tokens[2]);
        let orientationType = Number(tokens[3]);
        this.setOrientationType(orientationType);
        this.size = Number(tokens[4]);
        this.shape = tokens[5][0];
        this.italic = tokens[6] == "Italic";
        this.bold = Number(tokens[7]) !== 0;
    }
    setOrientationType(orientationType) {
        this.orientationType = orientationType;
        if (this.name1 === "GLabel") {
            if (orientationType === TextOrientationType.HORIZ_LEFT) {
                this.orientation = kicad_common_1.TextAngle.HORIZ;
                this.hjustify = kicad_common_1.TextHjustify.RIGHT;
                this.vjustify = kicad_common_1.TextVjustify.CENTER;
            }
            else if (orientationType === TextOrientationType.UP) {
                this.orientation = kicad_common_1.TextAngle.VERT;
                this.hjustify = kicad_common_1.TextHjustify.LEFT;
                this.vjustify = kicad_common_1.TextVjustify.CENTER;
            }
            else if (orientationType === TextOrientationType.HORIZ_RIGHT) {
                this.orientation = kicad_common_1.TextAngle.HORIZ;
                this.hjustify = kicad_common_1.TextHjustify.LEFT;
                this.vjustify = kicad_common_1.TextVjustify.CENTER;
            }
            else if (orientationType === TextOrientationType.BOTTOM) {
                this.orientation = kicad_common_1.TextAngle.VERT;
                this.hjustify = kicad_common_1.TextHjustify.RIGHT;
                this.vjustify = kicad_common_1.TextVjustify.CENTER;
            }
            else {
                throw "invalid orientationType: " + orientationType;
            }
        }
        else if (this.name1 === 'HLabel') {
            if (orientationType === TextOrientationType.HORIZ_LEFT) {
                this.orientation = kicad_common_1.TextAngle.HORIZ;
                this.hjustify = kicad_common_1.TextHjustify.RIGHT;
                this.vjustify = kicad_common_1.TextVjustify.CENTER;
            }
            else if (orientationType === TextOrientationType.UP) {
                this.orientation = kicad_common_1.TextAngle.VERT;
                this.hjustify = kicad_common_1.TextHjustify.LEFT;
                this.vjustify = kicad_common_1.TextVjustify.CENTER;
            }
            else if (orientationType === TextOrientationType.HORIZ_RIGHT) {
                this.orientation = kicad_common_1.TextAngle.HORIZ;
                this.hjustify = kicad_common_1.TextHjustify.LEFT;
                this.vjustify = kicad_common_1.TextVjustify.CENTER;
            }
            else if (orientationType === TextOrientationType.BOTTOM) {
                this.orientation = kicad_common_1.TextAngle.VERT;
                this.hjustify = kicad_common_1.TextHjustify.RIGHT;
                this.vjustify = kicad_common_1.TextVjustify.CENTER;
            }
            else {
                throw "invalid orientationType: " + orientationType;
            }
        }
        else {
            if (orientationType === TextOrientationType.HORIZ_LEFT) {
                this.orientation = kicad_common_1.TextAngle.HORIZ;
                this.hjustify = kicad_common_1.TextHjustify.LEFT;
                this.vjustify = kicad_common_1.TextVjustify.BOTTOM;
            }
            else if (orientationType === TextOrientationType.UP) {
                this.orientation = kicad_common_1.TextAngle.VERT;
                this.hjustify = kicad_common_1.TextHjustify.LEFT;
                this.vjustify = kicad_common_1.TextVjustify.BOTTOM;
            }
            else if (orientationType === TextOrientationType.HORIZ_RIGHT) {
                this.orientation = kicad_common_1.TextAngle.HORIZ;
                this.hjustify = kicad_common_1.TextHjustify.RIGHT;
                this.vjustify = kicad_common_1.TextVjustify.BOTTOM;
            }
            else if (orientationType === TextOrientationType.BOTTOM) {
                this.orientation = kicad_common_1.TextAngle.VERT;
                this.hjustify = kicad_common_1.TextHjustify.RIGHT;
                this.vjustify = kicad_common_1.TextVjustify.BOTTOM;
            }
            else {
                throw "invalid orientationType: " + orientationType;
            }
        }
    }
    parse(lines) {
        const text = lines.shift();
        if (!text)
            throw "expected text line but not";
        this.text = text.replace(/\\n/g, "\n");
        return this;
    }
}
exports.Text = Text;
class Wire extends SchItem {
    constructor(tokens) {
        super();
        this.name1 = tokens[0];
        this.name2 = tokens[1];
    }
    get isBus() {
        return this.name1[0] === 'B';
    }
    parse(lines) {
        const wire = lines.shift();
        if (!wire)
            throw "expected text wire but not";
        [this.startx, this.starty, this.endx, this.endy] = wire.substring(1).split(/\s+/).map((i) => Number(i));
        return this;
    }
}
exports.Wire = Wire;
class Entry extends SchItem {
    constructor(tokens) {
        super();
        this.name1 = tokens[0];
        this.name2 = tokens[1];
    }
    get isBus() {
        return this.name1[0] === 'B';
    }
    parse(lines) {
        const entry = lines.shift();
        if (!entry)
            throw "expected text entry but not";
        [this.posx, this.posy, this.sizex, this.sizey] = entry.substring(1).split(/\s+/).map((i) => Number(i));
        this.sizex -= this.posx;
        this.sizey -= this.posy;
        return this;
    }
}
exports.Entry = Entry;
class Connection extends SchItem {
    constructor(tokens) {
        super();
        this.name1 = tokens[0];
        this.posx = Number(tokens[1]);
        this.posy = Number(tokens[2]);
    }
    parse(lines) {
        return this;
    }
}
exports.Connection = Connection;
class NoConn extends SchItem {
    constructor(tokens) {
        super();
        this.name1 = tokens[0];
        this.posx = Number(tokens[1]);
        this.posy = Number(tokens[2]);
    }
    parse(lines) {
        return this;
    }
}
exports.NoConn = NoConn;
class SheetPin extends Text {
    constructor(n, tokens) {
        super();
        this.number = n;
        this.text = kicad_common_1.ReadDelimitedText(tokens[0]);
        this.shape = tokens[1][0];
        this.sheetSide = tokens[2][0];
        this.posx = Number(tokens[3]);
        this.posy = Number(tokens[4]);
        this.size = Number(tokens[5]);
        if (this.sheetSide === kicad_common_1.SheetSide.LEFT) {
            this.setOrientationType(TextOrientationType.HORIZ_RIGHT);
        }
        else if (this.sheetSide === kicad_common_1.SheetSide.RIGHT) {
            this.setOrientationType(TextOrientationType.HORIZ_LEFT);
        }
        else if (this.sheetSide === kicad_common_1.SheetSide.TOP) {
            this.setOrientationType(TextOrientationType.BOTTOM);
        }
        else if (this.sheetSide === kicad_common_1.SheetSide.BOTTOM) {
            this.setOrientationType(TextOrientationType.UP);
        }
    }
    parse(lines) {
        return this;
    }
}
exports.SheetPin = SheetPin;
//# sourceMappingURL=kicad_sch.js.map