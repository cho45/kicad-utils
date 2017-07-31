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
const kicad_common_1 = require("kicad_common");
class Schematic {
    static load(content) {
        const lines = content.split(/\n/);
        const sch = new this();
        sch.parse(lines);
        return sch;
    }
    constructor() {
        this.items = [];
        this.parsed = false;
    }
    parse(lines) {
        const version = lines.shift();
        if (!version || version.indexOf('EESchema Schematic File Version 2') !== 0) {
            throw "unknwon library format";
        }
        let line;
        while ((line = lines.shift()) !== undefined) {
            if (line[0] === '#')
                continue;
            if (!line)
                continue;
            if (line.indexOf("LIBS:") === 0) {
                // skip this section
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
                this.items.push(new Component().parse(lines));
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
                    this.sheetName = tokens[1];
                    this.sheetNameSize = Number(tokens[2]);
                }
                else if (n === 1) {
                    this.fileName = tokens[1];
                    this.fileNameSize = Number(tokens[2]);
                }
                else {
                    this.sheetPins.push(new SheetPin(tokens.slice(1)).parse(lines));
                }
            }
        }
        return this;
    }
}
exports.Sheet = Sheet;
class SheetPin extends SchItem {
    constructor(tokens) {
        super();
        this.name = tokens[0];
        this.connectType = tokens[1];
        this.sheetSide = tokens[2];
        this.posx = Number(tokens[3]);
        this.posy = Number(tokens[4]);
        this.textWidth = Number(tokens[5]);
    }
    parse(lines) {
        return this;
    }
}
exports.SheetPin = SheetPin;
class Component extends SchItem {
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
                this.name = tokens[1].replace(/''/g, '"').replace(/~/g, ' ').replace(/^"|"$/g, '');
                this.reference = tokens[2];
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
exports.Component = Component;
class Field extends SchItem {
    constructor(tokens) {
        super();
        this.number = Number(tokens[0]);
        this.text = tokens[1];
        this.angle = tokens[2];
        this.posx = Number(tokens[3]);
        this.posy = Number(tokens[4]);
        this.width = Number(tokens[5]);
        this.visible = Number(tokens[6]) == 0;
        this.hjustify = tokens[7];
        this.vjustify = tokens[8];
        this.italic = tokens[9] === 'I';
        this.bold = tokens[10] === 'B';
        this.name = tokens[11];
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
                this.data = '';
                while ((line = lines.shift()) !== undefined) {
                    if (line === 'EndData')
                        break;
                    // raw hex data
                    this.data += line;
                }
            }
            else {
                throw "unexpected token " + tokens[0];
            }
        }
        return this;
    }
}
exports.Bitmap = Bitmap;
class Text extends SchItem {
    constructor(tokens) {
        super();
        this.name1 = tokens[0];
        this.posx = Number(tokens[1]);
        this.posy = Number(tokens[2]);
        let orientationType = Number(tokens[3]);
        if (this.name1 === "GLabel") {
            if (orientationType === 0) {
                this.orientation = kicad_common_1.TextAngle.HORIZ;
                this.hjustify = kicad_common_1.TextHjustify.RIGHT;
                this.vjustify = kicad_common_1.TextVjustify.CENTER;
            }
            else if (orientationType === 1) {
                this.orientation = kicad_common_1.TextAngle.VERT;
                this.hjustify = kicad_common_1.TextHjustify.LEFT;
                this.vjustify = kicad_common_1.TextVjustify.CENTER;
            }
            else if (orientationType === 2) {
                this.orientation = kicad_common_1.TextAngle.HORIZ;
                this.hjustify = kicad_common_1.TextHjustify.LEFT;
                this.vjustify = kicad_common_1.TextVjustify.CENTER;
            }
            else if (orientationType === 3) {
                this.orientation = kicad_common_1.TextAngle.VERT;
                this.hjustify = kicad_common_1.TextHjustify.RIGHT;
                this.vjustify = kicad_common_1.TextVjustify.CENTER;
            }
            else {
                throw "invalid orientationType: " + orientationType;
            }
        }
        else {
            if (orientationType === 0) {
                this.orientation = kicad_common_1.TextAngle.HORIZ;
                this.hjustify = kicad_common_1.TextHjustify.LEFT;
                this.vjustify = kicad_common_1.TextVjustify.CENTER;
            }
            else if (orientationType === 1) {
                this.orientation = kicad_common_1.TextAngle.VERT;
                this.hjustify = kicad_common_1.TextHjustify.LEFT;
                this.vjustify = kicad_common_1.TextVjustify.CENTER;
            }
            else if (orientationType === 2) {
                this.orientation = kicad_common_1.TextAngle.HORIZ;
                this.hjustify = kicad_common_1.TextHjustify.RIGHT;
                this.vjustify = kicad_common_1.TextVjustify.CENTER;
            }
            else if (orientationType === 3) {
                this.orientation = kicad_common_1.TextAngle.VERT;
                this.hjustify = kicad_common_1.TextHjustify.RIGHT;
                this.vjustify = kicad_common_1.TextVjustify.CENTER;
            }
            else {
                throw "invalid orientationType: " + orientationType;
            }
        }
        this.size = Number(tokens[4]);
        this.italic = tokens[5] === 'Italic';
        this.bold = Number(tokens[6]) != 0;
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
    parse(lines) {
        const entry = lines.shift();
        if (!entry)
            throw "expected text wire but not";
        [this.posx, this.posy, this.sizex, this.sizey] = entry.split(/\s+/).map((i) => Number(i));
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
//# sourceMappingURL=kicad_sch.js.map