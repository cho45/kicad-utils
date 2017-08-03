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
const kicad_lib_1 = require("./kicad_lib");
const kicad_sch_1 = require("./kicad_sch");
const TXT_MARGIN = 4;
const PIN_TXT_MARGIN = 4;
const DEFAULT_LINE_WIDTH = 6;
const DEFAULT_LINE_WIDTH_BUS = 12;
const SCH_COLORS = {
    LAYER_WIRE: kicad_common_1.Color.GREEN,
    LAYER_BUS: kicad_common_1.Color.BLUE,
    LAYER_JUNCTION: kicad_common_1.Color.GREEN,
    LAYER_LOCLABEL: kicad_common_1.Color.BLACK,
    LAYER_HIERLABEL: kicad_common_1.Color.BROWN,
    LAYER_GLOBLABEL: kicad_common_1.Color.RED,
    LAYER_PINNUM: kicad_common_1.Color.RED,
    LAYER_PINNAM: kicad_common_1.Color.CYAN,
    LAYER_FIELDS: kicad_common_1.Color.MAGENTA,
    LAYER_REFERENCEPART: kicad_common_1.Color.CYAN,
    LAYER_VALUEPART: kicad_common_1.Color.CYAN,
    LAYER_NOTES: kicad_common_1.Color.LIGHTBLUE,
    LAYER_DEVICE: kicad_common_1.Color.RED,
    LAYER_DEVICE_BACKGROUND: kicad_common_1.Color.LIGHTYELLOW,
    LAYER_NETNAM: kicad_common_1.Color.DARKGRAY,
    LAYER_PIN: kicad_common_1.Color.RED,
    LAYER_SHEET: kicad_common_1.Color.MAGENTA,
    LAYER_SHEETFILENAME: kicad_common_1.Color.BROWN,
    LAYER_SHEETNAME: kicad_common_1.Color.CYAN,
    LAYER_SHEETLABEL: kicad_common_1.Color.BROWN,
    LAYER_NOCONNECT: kicad_common_1.Color.BLUE,
    LAYER_ERC_WARN: kicad_common_1.Color.GREEN,
    LAYER_ERC_ERR: kicad_common_1.Color.RED,
    LAYER_SCHEMATIC_GRID: kicad_common_1.Color.DARKGRAY,
    LAYER_SCHEMATIC_BACKGROUND: kicad_common_1.Color.WHITE,
    LAYER_BRIGHTENED: kicad_common_1.Color.PUREMAGENTA,
};
const TEMPLATE_SHAPES = {
    [kicad_common_1.Net.INPUT]: {
        [kicad_sch_1.TextOrientationType.HORIZ_LEFT]: [6, 0, 0, -1, -1, -2, -1, -2, 1, -1, 1, 0, 0],
        [kicad_sch_1.TextOrientationType.UP]: [6, 0, 0, 1, -1, 1, -2, -1, -2, -1, -1, 0, 0],
        [kicad_sch_1.TextOrientationType.HORIZ_RIGHT]: [6, 0, 0, 1, 1, 2, 1, 2, -1, 1, -1, 0, 0],
        [kicad_sch_1.TextOrientationType.BOTTOM]: [6, 0, 0, 1, 1, 1, 2, -1, 2, -1, 1, 0, 0],
    },
    [kicad_common_1.Net.OUTPUT]: {
        [kicad_sch_1.TextOrientationType.HORIZ_LEFT]: [6, -2, 0, -1, 1, 0, 1, 0, -1, -1, -1, -2, 0],
        [kicad_sch_1.TextOrientationType.HORIZ_RIGHT]: [6, 2, 0, 1, -1, 0, -1, 0, 1, 1, 1, 2, 0],
        [kicad_sch_1.TextOrientationType.UP]: [6, 0, -2, 1, -1, 1, 0, -1, 0, -1, -1, 0, -2],
        [kicad_sch_1.TextOrientationType.BOTTOM]: [6, 0, 2, 1, 1, 1, 0, -1, 0, -1, 1, 0, 2],
    },
    [kicad_common_1.Net.UNSPECIFIED]: {
        [kicad_sch_1.TextOrientationType.HORIZ_LEFT]: [5, 0, -1, -2, -1, -2, 1, 0, 1, 0, -1],
        [kicad_sch_1.TextOrientationType.HORIZ_RIGHT]: [5, 0, -1, 2, -1, 2, 1, 0, 1, 0, -1],
        [kicad_sch_1.TextOrientationType.UP]: [5, 1, 0, 1, -2, -1, -2, -1, 0, 1, 0],
        [kicad_sch_1.TextOrientationType.BOTTOM]: [5, 1, 0, 1, 2, -1, 2, -1, 0, 1, 0],
    },
    [kicad_common_1.Net.BIDI]: {
        [kicad_sch_1.TextOrientationType.HORIZ_LEFT]: [5, 0, 0, -1, -1, -2, 0, -1, 1, 0, 0],
        [kicad_sch_1.TextOrientationType.HORIZ_RIGHT]: [5, 0, 0, 1, -1, 2, 0, 1, 1, 0, 0],
        [kicad_sch_1.TextOrientationType.UP]: [5, 0, 0, -1, -1, 0, -2, 1, -1, 0, 0],
        [kicad_sch_1.TextOrientationType.BOTTOM]: [5, 0, 0, -1, 1, 0, 2, 1, 1, 0, 0],
    },
    [kicad_common_1.Net.TRISTATE]: {
        [kicad_sch_1.TextOrientationType.HORIZ_LEFT]: [5, 0, 0, -1, -1, -2, 0, -1, 1, 0, 0],
        [kicad_sch_1.TextOrientationType.HORIZ_RIGHT]: [5, 0, 0, 1, -1, 2, 0, 1, 1, 0, 0],
        [kicad_sch_1.TextOrientationType.UP]: [5, 0, 0, -1, -1, 0, -2, 1, -1, 0, 0],
        [kicad_sch_1.TextOrientationType.BOTTOM]: [5, 0, 0, -1, 1, 0, 2, 1, 1, 0, 0],
    }
};
/**
 * similar to KiCAD Plotter
 *
 */
class Plotter {
    setColor(c) {
        this.color = c;
    }
    moveTo(x, y) {
        if (typeof y === 'number') {
            this.penTo({ x: x, y: y }, "U");
        }
        else {
            this.penTo(x, "U");
        }
    }
    lineTo(x, y) {
        if (typeof y === 'number') {
            this.penTo({ x: x, y: y }, "D");
        }
        else {
            this.penTo(x, "D");
        }
    }
    finishTo(x, y) {
        if (typeof y === 'number') {
            this.penTo({ x: x, y: y }, "D");
            this.penTo({ x: x, y: y }, "Z");
        }
        else {
            this.penTo(x, "D");
            this.penTo(x, "Z");
        }
    }
    finishPen() {
        this.penTo({ x: 0, y: 0 }, "Z");
    }
    /**
     * kicad-js implements plot methods to plotter instead of each library items for simplify parsing dependencies.
     */
    plotLibComponent(component, unit, convert, offset, transform, reference, name) {
        if (component.field && component.field.visibility) {
            const pos = kicad_common_1.Point.add(transform.transformCoordinate({ x: component.field.posx, y: component.field.posy }), offset);
            let orientation = component.field.textOrientation;
            if (transform.y1) {
                if (orientation === kicad_common_1.TextAngle.HORIZ) {
                    orientation = kicad_common_1.TextAngle.VERT;
                }
                else {
                    orientation = kicad_common_1.TextAngle.HORIZ;
                }
            }
            this.text(pos, SCH_COLORS.LAYER_REFERENCEPART, (typeof reference !== 'undefined') ? reference : component.field.reference, orientation, component.field.textSize, kicad_common_1.TextHjustify.CENTER, kicad_common_1.TextVjustify.CENTER, 0, component.field.italic, component.field.bold);
        }
        if (component.fields[0] && component.fields[0].visibility) {
            const pos = kicad_common_1.Point.add(transform.transformCoordinate({ x: component.fields[0].posx, y: component.fields[0].posy }), offset);
            let orientation = component.fields[0].textOrientation;
            if (transform.y1) {
                if (orientation === kicad_common_1.TextAngle.HORIZ) {
                    orientation = kicad_common_1.TextAngle.VERT;
                }
                else {
                    orientation = kicad_common_1.TextAngle.HORIZ;
                }
            }
            this.text(pos, SCH_COLORS.LAYER_VALUEPART, (typeof name !== 'undefined') ? name : component.fields[0].name, orientation, component.fields[0].textSize, kicad_common_1.TextHjustify.CENTER, kicad_common_1.TextVjustify.CENTER, 0, component.fields[0].italic, component.fields[0].bold);
        }
        this.setColor(SCH_COLORS.LAYER_DEVICE);
        for (let draw of component.draw.objects) {
            if (draw.unit !== 0 && unit !== draw.unit) {
                continue;
            }
            ;
            if (draw.convert !== 0 && convert !== draw.convert) {
                continue;
            }
            if (draw instanceof kicad_lib_1.DrawArc) {
                this.plotDrawArc(draw, component, offset, transform);
            }
            else if (draw instanceof kicad_lib_1.DrawCircle) {
                this.plotDrawCircle(draw, component, offset, transform);
            }
            else if (draw instanceof kicad_lib_1.DrawPolyline) {
                this.plotDrawPolyline(draw, component, offset, transform);
            }
            else if (draw instanceof kicad_lib_1.DrawSquare) {
                this.plotDrawSquare(draw, component, offset, transform);
            }
            else if (draw instanceof kicad_lib_1.DrawText) {
                this.plotDrawText(draw, component, offset, transform);
            }
            else if (draw instanceof kicad_lib_1.DrawPin) {
                this.plotDrawPin(draw, component, offset, transform);
            }
            else {
                throw 'unknown draw object type: ' + draw.constructor.name;
            }
        }
    }
    plotDrawArc(draw, component, offset, transform) {
        const pos = kicad_common_1.Point.add(transform.transformCoordinate({ x: draw.posx, y: draw.posy }), offset);
        const [startAngle, endAngle] = transform.mapAngles(draw.startAngle, draw.endAngle);
        this.arc(pos, startAngle, endAngle, draw.radius, draw.fill, draw.lineWidth || DEFAULT_LINE_WIDTH);
    }
    plotDrawCircle(draw, component, offset, transform) {
        const pos = kicad_common_1.Point.add(transform.transformCoordinate({ x: draw.posx, y: draw.posy }), offset);
        this.circle(pos, draw.radius * 2, draw.fill, draw.lineWidth || DEFAULT_LINE_WIDTH);
    }
    plotDrawPolyline(draw, component, offset, transform) {
        const points = [];
        for (let i = 0, len = draw.points.length; i < len; i += 2) {
            const pos = kicad_common_1.Point.add(transform.transformCoordinate({ x: draw.points[i], y: draw.points[i + 1] }), offset);
            points.push(pos);
        }
        this.polyline(points, draw.fill, draw.lineWidth || DEFAULT_LINE_WIDTH);
    }
    plotDrawSquare(draw, component, offset, transform) {
        const pos1 = kicad_common_1.Point.add(transform.transformCoordinate({ x: draw.startx, y: draw.starty }), offset);
        const pos2 = kicad_common_1.Point.add(transform.transformCoordinate({ x: draw.endx, y: draw.endy }), offset);
        this.rect(pos1, pos2, draw.fill, draw.lineWidth || DEFAULT_LINE_WIDTH);
    }
    plotDrawText(draw, component, offset, transform) {
        const pos = kicad_common_1.Point.add(transform.transformCoordinate({ x: draw.posx, y: draw.posy }), offset);
        this.text(pos, this.color, draw.text, component.field.textOrientation, draw.textSize, kicad_common_1.TextHjustify.CENTER, kicad_common_1.TextVjustify.CENTER, 0, draw.italic, draw.bold);
    }
    plotDrawPin(draw, component, offset, transform) {
        if (!draw.visibility)
            return;
        this.plotDrawPinTexts(draw, component, offset, transform);
        this.plotDrawPinSymbol(draw, component, offset, transform);
    }
    plotDrawPinTexts(draw, component, offset, transform) {
        let drawPinname = component.drawPinname;
        let drawPinnumber = component.drawPinnumber;
        if (draw.name === "" || draw.name === "~") {
            drawPinname = false;
        }
        if (draw.num === "") {
            drawPinnumber = false;
        }
        if (!drawPinname && !drawPinnumber)
            return;
        const pos = kicad_common_1.Point.add(transform.transformCoordinate({ x: draw.posx, y: draw.posy }), offset);
        const orientation = this.pinDrawOrientation(draw, transform);
        let x1 = pos.x, y1 = pos.y;
        if (orientation === kicad_common_1.PinOrientation.UP) {
            y1 -= draw.length;
        }
        else if (orientation === kicad_common_1.PinOrientation.DOWN) {
            y1 += draw.length;
        }
        else if (orientation === kicad_common_1.PinOrientation.LEFT) {
            x1 -= draw.length;
        }
        else if (orientation === kicad_common_1.PinOrientation.RIGHT) {
            x1 += draw.length;
        }
        const nameOffset = PIN_TXT_MARGIN + DEFAULT_LINE_WIDTH / 2;
        const numOffset = PIN_TXT_MARGIN + DEFAULT_LINE_WIDTH / 2;
        const textInside = component.textOffset;
        const isHorizontal = orientation === kicad_common_1.PinOrientation.LEFT || orientation === kicad_common_1.PinOrientation.RIGHT;
        if (textInside) {
            if (isHorizontal) {
                if (drawPinname) {
                    if (orientation === kicad_common_1.PinOrientation.RIGHT) {
                        this.text({ x: x1 + textInside, y: y1 }, SCH_COLORS.LAYER_PINNAM, draw.name, kicad_common_1.TextAngle.HORIZ, draw.nameTextSize, kicad_common_1.TextHjustify.LEFT, kicad_common_1.TextVjustify.CENTER, 0, false, false);
                    }
                    else {
                        this.text({ x: x1 - textInside, y: y1 }, SCH_COLORS.LAYER_PINNAM, draw.name, kicad_common_1.TextAngle.HORIZ, draw.nameTextSize, kicad_common_1.TextHjustify.RIGHT, kicad_common_1.TextVjustify.CENTER, 0, false, false);
                    }
                }
                if (drawPinnumber) {
                    this.text({ x: (x1 + pos.x) / 2, y: y1 + numOffset }, SCH_COLORS.LAYER_PINNUM, draw.num, kicad_common_1.TextAngle.HORIZ, draw.nameTextSize, kicad_common_1.TextHjustify.CENTER, kicad_common_1.TextVjustify.BOTTOM, 0, false, false);
                }
            }
            else {
                if (orientation === kicad_common_1.PinOrientation.DOWN) {
                    if (drawPinname) {
                        this.text({ x: x1, y: y1 + textInside }, SCH_COLORS.LAYER_PINNAM, draw.name, kicad_common_1.TextAngle.VERT, draw.nameTextSize, kicad_common_1.TextHjustify.RIGHT, kicad_common_1.TextVjustify.CENTER, 0, false, false);
                    }
                    if (drawPinnumber) {
                        this.text({ x: x1 - numOffset, y: (y1 + pos.y) / 2 }, SCH_COLORS.LAYER_PINNUM, draw.num, kicad_common_1.TextAngle.VERT, draw.nameTextSize, kicad_common_1.TextHjustify.CENTER, kicad_common_1.TextVjustify.BOTTOM, 0, false, false);
                    }
                }
                else {
                    if (drawPinname) {
                        this.text({ x: x1, y: y1 - textInside }, SCH_COLORS.LAYER_PINNAM, draw.name, kicad_common_1.TextAngle.VERT, draw.nameTextSize, kicad_common_1.TextHjustify.LEFT, kicad_common_1.TextVjustify.CENTER, 0, false, false);
                    }
                    if (drawPinnumber) {
                        this.text({ x: x1 - numOffset, y: (y1 + pos.y) / 2 }, SCH_COLORS.LAYER_PINNUM, draw.num, kicad_common_1.TextAngle.VERT, draw.nameTextSize, kicad_common_1.TextHjustify.CENTER, kicad_common_1.TextVjustify.BOTTOM, 0, false, false);
                    }
                }
            }
        }
        else {
            if (isHorizontal) {
                if (drawPinname) {
                    this.text({ x: (x1 + pos.x) / 2, y: y1 - nameOffset }, SCH_COLORS.LAYER_PINNAM, draw.name, kicad_common_1.TextAngle.HORIZ, draw.nameTextSize, kicad_common_1.TextHjustify.CENTER, kicad_common_1.TextVjustify.BOTTOM, 0, false, false);
                }
                if (drawPinnumber) {
                    this.text({ x: (x1 + pos.x) / 2, y: y1 + numOffset }, SCH_COLORS.LAYER_PINNUM, draw.num, kicad_common_1.TextAngle.HORIZ, draw.numTextSize, kicad_common_1.TextHjustify.CENTER, kicad_common_1.TextVjustify.TOP, 0, false, false);
                }
            }
            else {
                if (drawPinname) {
                    this.text({ x: x1 - nameOffset, y: (y1 + pos.y) / 2 }, SCH_COLORS.LAYER_PINNAM, draw.name, kicad_common_1.TextAngle.VERT, draw.nameTextSize, kicad_common_1.TextHjustify.CENTER, kicad_common_1.TextVjustify.BOTTOM, 0, false, false);
                }
                if (drawPinnumber) {
                    this.text({ x: x1 + numOffset, y: (y1 + pos.y) / 2 }, SCH_COLORS.LAYER_PINNUM, draw.num, kicad_common_1.TextAngle.VERT, draw.numTextSize, kicad_common_1.TextHjustify.CENTER, kicad_common_1.TextVjustify.TOP, 0, false, false);
                }
            }
        }
    }
    plotDrawPinSymbol(draw, component, offset, transform) {
        const pos = kicad_common_1.Point.add(transform.transformCoordinate({ x: draw.posx, y: draw.posy }), offset);
        const orientation = this.pinDrawOrientation(draw, transform);
        let x1 = pos.x, y1 = pos.y;
        let mapX1 = 0, mapY1 = 0;
        if (orientation === kicad_common_1.PinOrientation.UP) {
            y1 -= draw.length;
            mapY1 = 1;
        }
        else if (orientation === kicad_common_1.PinOrientation.DOWN) {
            y1 += draw.length;
            mapY1 = -1;
        }
        else if (orientation === kicad_common_1.PinOrientation.LEFT) {
            x1 -= draw.length;
            mapX1 = 1;
        }
        else if (orientation === kicad_common_1.PinOrientation.RIGHT) {
            x1 += draw.length;
            mapX1 = -1;
        }
        // TODO shape
        this.fill = kicad_common_1.Fill.NO_FILL;
        this.setCurrentLineWidth(DEFAULT_LINE_WIDTH);
        this.moveTo({ x: x1, y: y1 });
        this.finishTo({ x: pos.x, y: pos.y });
        // this.circle({ x: pos.x, y: pos.y}, 20, Fill.NO_FILL, 2);
    }
    pinDrawOrientation(draw, transform) {
        let end = { x: 0, y: 0 };
        if (draw.orientation === kicad_common_1.PinOrientation.UP) {
            end.y = 1;
        }
        else if (draw.orientation === kicad_common_1.PinOrientation.DOWN) {
            end.y = -1;
        }
        else if (draw.orientation === kicad_common_1.PinOrientation.LEFT) {
            end.x = -1;
        }
        else if (draw.orientation === kicad_common_1.PinOrientation.RIGHT) {
            end.x = 1;
        }
        end = transform.transformCoordinate(end);
        if (end.x === 0) {
            if (end.y > 0) {
                return kicad_common_1.PinOrientation.DOWN;
            }
            else {
                return kicad_common_1.PinOrientation.UP;
            }
        }
        else {
            if (end.x < 0) {
                return kicad_common_1.PinOrientation.LEFT;
            }
            else {
                return kicad_common_1.PinOrientation.RIGHT;
            }
        }
    }
    plotSchematic(sch, libs) {
        // default page layout
        const MARGIN = kicad_common_1.MM2MIL(10);
        this.rect({ x: MARGIN, y: MARGIN }, { x: sch.descr.width - MARGIN, y: sch.descr.height - MARGIN }, kicad_common_1.Fill.NO_FILL, DEFAULT_LINE_WIDTH);
        const OFFSET = kicad_common_1.MM2MIL(2);
        this.rect({ x: MARGIN + OFFSET, y: MARGIN + OFFSET }, { x: sch.descr.width - MARGIN - OFFSET, y: sch.descr.height - MARGIN - OFFSET }, kicad_common_1.Fill.NO_FILL, DEFAULT_LINE_WIDTH);
        // up
        this.moveTo(sch.descr.width / 2, MARGIN);
        this.finishTo(sch.descr.width / 2, MARGIN + OFFSET);
        // bottom
        this.moveTo(sch.descr.width / 2, sch.descr.height - MARGIN - OFFSET);
        this.finishTo(sch.descr.width / 2, sch.descr.height - MARGIN);
        // left
        this.moveTo(MARGIN, sch.descr.height / 2);
        this.finishTo(MARGIN + OFFSET, sch.descr.height / 2);
        // right
        this.moveTo(sch.descr.width - MARGIN - OFFSET, sch.descr.height / 2);
        this.finishTo(sch.descr.width - MARGIN, sch.descr.height / 2);
        for (let item of sch.items) {
            if (item instanceof kicad_sch_1.SchComponent) {
                let component;
                for (let lib of libs) {
                    if (!lib)
                        continue;
                    component = lib.findByName(item.name);
                    if (component)
                        break;
                }
                if (!component) {
                    console.warn("component " + item.name + " is not found in libraries");
                    continue;
                }
                this.plotLibComponent(component, item.unit, item.convert, { x: item.posx, y: item.posy }, item.transform, item.fields[0].text, item.fields[1].text);
            }
            else if (item instanceof kicad_sch_1.Sheet) {
                this.setColor(SCH_COLORS.LAYER_SHEET);
                this.setCurrentLineWidth(DEFAULT_LINE_WIDTH);
                this.fill = kicad_common_1.Fill.NO_FILL;
                this.moveTo(item.posx, item.posy);
                this.lineTo(item.posx, item.posy + item.sizey);
                this.lineTo(item.posx + item.sizex, item.posy + item.sizey);
                this.lineTo(item.posx + item.sizex, item.posy);
                this.finishTo(item.posx, item.posy);
                this.text({ x: item.posx, y: item.posy - 4 }, SCH_COLORS.LAYER_SHEETNAME, item.sheetName, 0, item.sheetNameSize, kicad_common_1.TextHjustify.LEFT, kicad_common_1.TextVjustify.BOTTOM, 0, false, false);
                this.text({ x: item.posx, y: item.posy + item.sizey + 4 }, SCH_COLORS.LAYER_SHEETFILENAME, item.fileName, 0, item.fileNameSize, kicad_common_1.TextHjustify.LEFT, kicad_common_1.TextVjustify.TOP, 0, false, false);
                this.setColor(SCH_COLORS.LAYER_SHEETLABEL);
                for (let pin of item.sheetPins) {
                    const tmp = pin.shape;
                    if (pin.shape === kicad_common_1.Net.INPUT) {
                        pin.shape = kicad_common_1.Net.OUTPUT;
                    }
                    else if (pin.shape === kicad_common_1.Net.OUTPUT) {
                        pin.shape = kicad_common_1.Net.INPUT;
                    }
                    this.plotSchTextHierarchicalLabel(pin);
                    pin.shape = tmp;
                }
            }
            else if (item instanceof kicad_sch_1.Bitmap) {
                item.parseIHDR();
                const PPI = 300;
                const PIXEL_SCALE = 1000 / PPI;
                this.image({ x: item.posx, y: item.posy }, item.scale * PIXEL_SCALE, item.width, item.height, item.data);
            }
            else if (item instanceof kicad_sch_1.Text) {
                if (item.name1 === 'GLabel') {
                    this.plotSchTextGlobalLabel(item);
                }
                else if (item.name1 === 'HLabel') {
                    this.plotSchTextHierarchicalLabel(item);
                }
                else {
                    this.plotSchText(item);
                }
            }
            else if (item instanceof kicad_sch_1.Entry) {
                this.setColor(item.isBus ? SCH_COLORS.LAYER_BUS : SCH_COLORS.LAYER_WIRE);
                this.setCurrentLineWidth(item.isBus ? DEFAULT_LINE_WIDTH_BUS : DEFAULT_LINE_WIDTH);
                this.moveTo(item.posx, item.posy);
                this.finishTo(item.posx + item.sizex, item.posy + item.sizey);
            }
            else if (item instanceof kicad_sch_1.Connection) {
                this.setColor(SCH_COLORS.LAYER_JUNCTION);
                this.circle({ x: item.posx, y: item.posy }, 40, kicad_common_1.Fill.FILLED_SHAPE, DEFAULT_LINE_WIDTH);
            }
            else if (item instanceof kicad_sch_1.NoConn) {
                this.fill = kicad_common_1.Fill.NO_FILL;
                const DRAWNOCONNECT_SIZE = 48;
                const delta = DRAWNOCONNECT_SIZE / 2;
                this.setColor(SCH_COLORS.LAYER_NOCONNECT);
                this.setCurrentLineWidth(DEFAULT_LINE_WIDTH);
                this.moveTo(item.posx - delta, item.posy - delta);
                this.finishTo(item.posx + delta, item.posy + delta);
                this.moveTo(item.posx + delta, item.posy - delta);
                this.finishTo(item.posx - delta, item.posy + delta);
            }
            else if (item instanceof kicad_sch_1.Wire) {
                this.setColor(item.isBus ? SCH_COLORS.LAYER_BUS : SCH_COLORS.LAYER_WIRE);
                this.setCurrentLineWidth(item.isBus ? DEFAULT_LINE_WIDTH_BUS : DEFAULT_LINE_WIDTH);
                this.fill = kicad_common_1.Fill.NO_FILL;
                this.moveTo(item.startx, item.starty);
                this.finishTo(item.endx, item.endy);
            }
            else {
                throw "unknown SchItem: " + item.constructor.name;
            }
        }
    }
    plotSchTextGlobalLabel(item) {
        {
            const halfSize = item.size / 2;
            const lineWidth = DEFAULT_LINE_WIDTH;
            const points = [];
            const symLen = item.text.length * item.size;
            const hasOverBar = /~[^~]/.test(item.text);
            const Y_CORRECTION = 1.40;
            const Y_OVERBAR_CORRECTION = 1.2;
            let x = symLen + lineWidth + 3;
            let y = halfSize * Y_CORRECTION;
            if (hasOverBar) {
                // TODO
            }
            y += lineWidth + lineWidth / 2;
            points.push(new kicad_common_1.Point(0, 0));
            points.push(new kicad_common_1.Point(0, -y)); // Up
            points.push(new kicad_common_1.Point(-x, -y)); // left
            points.push(new kicad_common_1.Point(-x, 0)); // Up left
            points.push(new kicad_common_1.Point(-x, y)); // left down
            points.push(new kicad_common_1.Point(0, y)); // down
            let xOffset = 0;
            if (item.shape === kicad_common_1.Net.INPUT) {
                xOffset -= halfSize;
                points[0].x += halfSize;
            }
            else if (item.shape === kicad_common_1.Net.OUTPUT) {
                points[3].x -= halfSize;
            }
            else if (item.shape === kicad_common_1.Net.BIDI ||
                item.shape === kicad_common_1.Net.TRISTATE) {
                xOffset = -halfSize;
                points[0].x += halfSize;
                points[3].x -= halfSize;
            }
            let angle = 0;
            if (item.orientationType === kicad_sch_1.TextOrientationType.HORIZ_LEFT) {
                angle = 0;
            }
            else if (item.orientationType === kicad_sch_1.TextOrientationType.UP) {
                angle = -900;
            }
            else if (item.orientationType === kicad_sch_1.TextOrientationType.HORIZ_RIGHT) {
                angle = 1800;
            }
            else if (item.orientationType === kicad_sch_1.TextOrientationType.BOTTOM) {
                angle = 900;
            }
            for (let p of points) {
                p.x += xOffset;
                if (angle) {
                    kicad_common_1.RotatePoint(p, angle);
                }
                p.x += item.posx;
                p.y += item.posy;
            }
            points.push(points[0]);
            this.setColor(SCH_COLORS.LAYER_GLOBLABEL);
            this.polyline(points, kicad_common_1.Fill.NO_FILL, DEFAULT_LINE_WIDTH);
        }
        {
            let p = new kicad_common_1.Point(item.posx, item.posy);
            const width = DEFAULT_LINE_WIDTH;
            const halfSize = item.text.length * item.size / 2 * 0.5;
            let offset = width;
            if (item.shape === kicad_common_1.Net.INPUT ||
                item.shape === kicad_common_1.Net.BIDI ||
                item.shape === kicad_common_1.Net.TRISTATE) {
                offset += halfSize;
            }
            else if (item.shape === kicad_common_1.Net.OUTPUT ||
                item.shape === kicad_common_1.Net.UNSPECIFIED) {
                offset += (item.size * 2);
            }
            if (item.orientationType === 0) {
                p.x -= offset;
            }
            else if (item.orientationType === 1) {
                p.y -= offset;
            }
            else if (item.orientationType === 2) {
                p.x += offset;
            }
            else if (item.orientationType === 3) {
                p.y += offset;
            }
            this.text(p, SCH_COLORS.LAYER_GLOBLABEL, item.text, item.orientation, item.size, item.hjustify, item.vjustify, 0, item.italic, item.bold);
        }
    }
    plotSchTextHierarchicalLabel(item) {
        {
            let p = new kicad_common_1.Point(item.posx, item.posy);
            const halfSize = item.size / 2;
            const template = TEMPLATE_SHAPES[item.shape][item.orientationType];
            const points = [];
            // first of template is number of corners
            for (let i = 1; i < template.length; i += 2) {
                const x = template[i] * halfSize;
                const y = template[i + 1] * halfSize;
                points.push(kicad_common_1.Point.add(new kicad_common_1.Point(x, y), p));
            }
            this.polyline(points, kicad_common_1.Fill.NO_FILL, DEFAULT_LINE_WIDTH);
        }
        ;
        {
            let p = new kicad_common_1.Point(item.posx, item.posy);
            const txtOffset = item.size * item.text.length + TXT_MARGIN + DEFAULT_LINE_WIDTH / 2;
            if (item.orientationType === 0) {
                p.x -= txtOffset;
            }
            else if (item.orientationType === 1) {
                p.y -= txtOffset;
            }
            else if (item.orientationType === 2) {
                p.x += txtOffset;
            }
            else if (item.orientationType === 3) {
                p.y += txtOffset;
            }
            this.text(p, SCH_COLORS.LAYER_HIERLABEL, item.text, item.orientation, item.size, item.hjustify, item.vjustify, 0, item.italic, item.bold);
        }
    }
    plotSchText(item) {
        let color = SCH_COLORS.LAYER_NOTES;
        if (item.name1 === 'Label') {
            color = SCH_COLORS.LAYER_LOCLABEL;
        }
        let p = new kicad_common_1.Point(item.posx, item.posy);
        const txtOffset = TXT_MARGIN + DEFAULT_LINE_WIDTH / 2;
        if (item.orientationType === 0) {
            p.y -= txtOffset;
        }
        else if (item.orientationType === 1) {
            p.x -= txtOffset;
        }
        else if (item.orientationType === 2) {
            p.y -= txtOffset;
        }
        else if (item.orientationType === 3) {
            p.x -= txtOffset;
        }
        this.text(p, color, item.text, item.orientation, item.size, item.hjustify, item.vjustify, 0, item.italic, item.bold);
    }
}
exports.Plotter = Plotter;
class CanvasPlotter extends Plotter {
    constructor(ctx) {
        super();
        this.ctx = ctx;
        this.penState = "Z";
        this.fill = kicad_common_1.Fill.NO_FILL;
        this.ctx.lineCap = "round";
        this.ctx.strokeStyle = "#000";
    }
    rect(p1, p2, fill, width) {
        this.setCurrentLineWidth(width);
        this.fill = fill;
        this.moveTo(p1.x, p1.y);
        this.lineTo(p1.x, p2.y);
        this.lineTo(p2.x, p2.y);
        this.lineTo(p2.x, p1.y);
        this.finishTo(p1.x, p1.y);
    }
    circle(p, dia, fill, width) {
        this.setCurrentLineWidth(width);
        this.fill = fill;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, dia / 2, 0, Math.PI * 2, false);
        if (fill === kicad_common_1.Fill.FILLED_SHAPE) {
            this.ctx.fill();
        }
        else {
            this.ctx.stroke();
        }
    }
    arc(p, startAngle, endAngle, radius, fill, width) {
        this.setCurrentLineWidth(width);
        this.fill = fill;
        this.ctx.beginPath();
        const anticlockwise = false;
        this.ctx.arc(p.x, p.y, radius, startAngle / 10 * Math.PI / 180, endAngle / 10 * Math.PI / 180, anticlockwise);
        if (fill === kicad_common_1.Fill.FILLED_SHAPE) {
            this.ctx.fill();
        }
        else {
            this.ctx.stroke();
        }
    }
    polyline(points, fill, width) {
        this.setCurrentLineWidth(width);
        this.fill = fill;
        this.moveTo(points[0]);
        for (var i = 1, len = points.length; i < len; i++) {
            this.lineTo(points[i]);
        }
        this.finishPen();
    }
    text(p, color, text, orientation, size, hjustfy, vjustify, width, italic, bold, multiline) {
        this.setColor(color);
        if (hjustfy === kicad_common_1.TextHjustify.LEFT) {
            this.ctx.textAlign = "left";
        }
        else if (hjustfy === kicad_common_1.TextHjustify.CENTER) {
            this.ctx.textAlign = "center";
        }
        else if (hjustfy === kicad_common_1.TextHjustify.RIGHT) {
            this.ctx.textAlign = "right";
        }
        if (vjustify === kicad_common_1.TextVjustify.TOP) {
            this.ctx.textBaseline = "top";
        }
        else if (vjustify === kicad_common_1.TextVjustify.CENTER) {
            this.ctx.textBaseline = "middle";
        }
        else if (vjustify === kicad_common_1.TextVjustify.BOTTOM) {
            this.ctx.textBaseline = "bottom";
        }
        this.ctx.fillStyle = this.color.toCSSColor();
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(-kicad_common_1.DECIDEG2RAD(orientation));
        this.ctx.font = (italic ? "italic " : "") + (bold ? "bold " : "") + size + "px monospace";
        // console.log('fillText', text, p.x, p.y, hjustfy, vjustify);
        this.ctx.fillText(text, 0, 0);
        this.ctx.restore();
    }
    /**
     * U = Pen is up
     * D = Pen is down
     * Z = Pen is outof canvas
     */
    penTo(p, s) {
        if (s === "Z") {
            if (this.fill === kicad_common_1.Fill.FILLED_SHAPE) {
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
    }
    setColor(c) {
        super.setColor(c);
        this.ctx.fillStyle = c.toCSSColor();
        this.ctx.strokeStyle = c.toCSSColor();
    }
    setCurrentLineWidth(w) {
        this.ctx.lineWidth = w;
    }
    image(p, scale, originalWidth, originalHeight, data) {
        const start = kicad_common_1.Point.sub(p, { x: originalWidth / 2, y: originalHeight / 2 });
        const end = kicad_common_1.Point.add(p, { x: originalWidth / 2, y: originalHeight / 2 });
        this.rect(start, end, kicad_common_1.Fill.NO_FILL, DEFAULT_LINE_WIDTH);
    }
}
exports.CanvasPlotter = CanvasPlotter;
class SVGPlotter extends Plotter {
    constructor() {
        super();
        this.penState = "Z";
        this.output = "";
        this.lineWidth = DEFAULT_LINE_WIDTH;
        this.color = kicad_common_1.Color.BLACK;
    }
    rect(p1, p2, fill, width) {
        this.setCurrentLineWidth(width);
        this.fill = fill;
        this.moveTo(p1.x, p1.y);
        this.lineTo(p1.x, p2.y);
        this.lineTo(p2.x, p2.y);
        this.lineTo(p2.x, p1.y);
        this.finishTo(p1.x, p1.y);
    }
    circle(p, dia, fill, width) {
        this.setCurrentLineWidth(width);
        this.fill = fill;
        this.output += this.xmlTag `<circle cx="${p.x}" cy="${p.y}" r="${dia / 2}" `;
        if (this.fill === kicad_common_1.Fill.NO_FILL) {
            this.output += this.xmlTag ` style="stroke: ${this.color.toCSSColor()}; fill: none; stroke-width: ${this.lineWidth}" stroke-linecap="round"/>\n`;
        }
        else {
            this.output += this.xmlTag ` style="stroke: ${this.color.toCSSColor()}; fill: ${this.color.toCSSColor()}; stroke-width: ${this.lineWidth}" stroke-linecap="round"/>\n`;
        }
    }
    arc(p, startAngle, endAngle, radius, fill, width) {
        if (radius <= 0)
            return;
        if (startAngle > endAngle) {
            [startAngle, endAngle] = [endAngle, startAngle];
        }
        this.setCurrentLineWidth(width);
        this.fill = fill;
        [startAngle, endAngle] = [-endAngle, -startAngle];
        let start = new kicad_common_1.Point(radius, 0);
        kicad_common_1.RotatePoint(start, startAngle);
        let end = new kicad_common_1.Point(radius, 0);
        kicad_common_1.RotatePoint(end, endAngle);
        start = kicad_common_1.Point.add(start, p);
        end = kicad_common_1.Point.add(end, p);
        let theta1 = kicad_common_1.DECIDEG2RAD(startAngle);
        if (theta1 < 0)
            theta1 += Math.PI * 2;
        let theta2 = kicad_common_1.DECIDEG2RAD(endAngle);
        if (theta2 < 0)
            theta2 += Math.PI * 2;
        if (theta2 < theta1)
            theta2 += Math.PI * 2;
        const isLargeArc = Math.abs(theta2 - theta1) > Math.PI;
        const isSweep = false;
        // console.log('ARC', startAngle, endAngle, radius, start, end, radius, isLargeArc, isSweep);
        const x = this.xmlTag;
        this.output += this.xmlTag `<path d="M${start.x} ${start.y} A${radius} ${radius} 0.0 ${isLargeArc ? 1 : 0} ${isSweep ? 1 : 0} ${end.x} ${end.y}"`;
        if (this.fill === kicad_common_1.Fill.NO_FILL) {
            this.output += this.xmlTag ` style="stroke: ${this.color.toCSSColor()}; fill: none; stroke-width: ${this.lineWidth}" stroke-linecap="round"/>\n`;
        }
        else {
            this.output += this.xmlTag ` style="stroke: ${this.color.toCSSColor()}; fill: ${this.color.toCSSColor()}; stroke-width: ${this.lineWidth}" stroke-linecap="round"/>\n`;
        }
    }
    polyline(points, fill, width) {
        this.setCurrentLineWidth(width);
        this.fill = fill;
        this.moveTo(points[0]);
        for (var i = 1, len = points.length; i < len; i++) {
            this.lineTo(points[i]);
        }
        this.finishPen();
    }
    text(p, color, text, orientation, size, hjustfy, vjustify, width, italic, bold, multiline) {
        this.setColor(color);
        let textAnchor;
        if (hjustfy === kicad_common_1.TextHjustify.LEFT) {
            textAnchor = "start";
        }
        else if (hjustfy === kicad_common_1.TextHjustify.CENTER) {
            textAnchor = "middle";
        }
        else if (hjustfy === kicad_common_1.TextHjustify.RIGHT) {
            textAnchor = "end";
        }
        let dominantBaseline;
        if (vjustify === kicad_common_1.TextVjustify.TOP) {
            dominantBaseline = "text-before-edge";
        }
        else if (vjustify === kicad_common_1.TextVjustify.CENTER) {
            dominantBaseline = "middle";
        }
        else if (vjustify === kicad_common_1.TextVjustify.BOTTOM) {
            dominantBaseline = "text-after-edge";
        }
        const fontWeight = bold ? "bold" : "normal";
        const fontStyle = italic ? "italic" : "normal";
        const rotate = -orientation / 10;
        const x = this.xmlTag;
        const lines = text.split(/\n/);
        for (var i = 0, len = lines.length; i < len; i++) {
            const y = p.y + (i * size * 1.2);
            this.output += this.xmlTag `<text x="${p.x}" y="${y}"
				text-anchor="${textAnchor}"
				dominant-baseline="${dominantBaseline}"
				font-family="monospace"
				font-size="${size}"
				font-weight="${fontWeight}"
				font-style="${fontStyle}"
				stroke="none"
				fill="${this.color.toCSSColor()}"
				transform="rotate(${rotate}, ${p.x}, ${p.y})">${lines[i]}</text>`;
        }
    }
    /**
     * U = Pen is up
     * D = Pen is down
     * Z = Pen is outof canvas
     */
    penTo(p, s) {
        const x = this.xmlTag;
        if (s === "Z") {
            if (this.penState !== "Z") {
                if (this.fill === kicad_common_1.Fill.NO_FILL) {
                    this.output += this.xmlTag `" style="stroke: ${this.color.toCSSColor()}; fill: none; stroke-width: ${this.lineWidth}" stroke-linecap="round"/>\n`;
                }
                else {
                    this.output += this.xmlTag `" style="stroke: ${this.color.toCSSColor()}; fill: ${this.color.toCSSColor()}; stroke-width: ${this.lineWidth}" stroke-linecap="round"/>\n`;
                }
            }
            else {
                throw "invalid pen state Z -> Z";
            }
            this.penState = "Z";
            return;
        }
        // s is U | D
        if (this.penState === "Z") {
            this.output += this.xmlTag `<path d="M${p.x} ${p.y}\n`;
        }
        else {
            if (s === "U") {
                this.output += this.xmlTag `M${p.x} ${p.y}\n`;
            }
            else {
                this.output += this.xmlTag `L${p.x} ${p.y}\n`;
            }
        }
        this.penState = s;
    }
    setCurrentLineWidth(w) {
        this.lineWidth = w;
    }
    image(p, scale, originalWidth, originalHeight, data) {
        const width = originalWidth * scale;
        const height = originalHeight * scale;
        const start = kicad_common_1.Point.sub(p, { x: width / 2, y: height / 2 });
        const url = 'data:image/png,' + data.reduce((r, i) => r + '%' + (0x100 + i).toString(16).slice(1), "");
        console.log(url);
        /*
        this.rect(start, end, Fill.NO_FILL, DEFAULT_LINE_WIDTH);
        */
        this.output += this.xmlTag `<image
			xlink:href="${url}"
			x="${start.x}"
			y="${start.y}"
			width="${width}"
			height="${height}"
			/>`;
    }
    plotSchematic(sch, libs) {
        const width = sch.descr.width;
        const height = sch.descr.height;
        this.output = this.xmlTag `<svg preserveAspectRatio="xMinYMin"
			width="${width}"
			height="${height}"
			viewBox="0 0 ${sch.descr.width} ${sch.descr.height}"
			xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink"
			version="1.1">`;
        super.plotSchematic(sch, libs);
        this.output += `</svg>`;
    }
    xmlTag(literals, ...placeholders) {
        let result = "";
        for (let i = 0; i < placeholders.length; i++) {
            result += literals[i];
            result += this.xmlentities(placeholders[i]);
        }
        result += literals[literals.length - 1];
        return result;
    }
    xmlentities(s) {
        if (typeof s === "number")
            return String(s);
        const map = {
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;',
        };
        return String(s).replace(/[<>&]/g, (_) => map[_]);
    }
}
exports.SVGPlotter = SVGPlotter;
//# sourceMappingURL=kicad_plotter.js.map