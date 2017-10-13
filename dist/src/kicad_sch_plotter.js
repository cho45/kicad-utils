"use strict";
/*
 * This program source code file is part of kicad-utils.
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
const DEFAULT_SIZE_TEXT = 60;
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
        [kicad_sch_1.Sch.TextOrientationType.HORIZ_LEFT]: [6, 0, 0, -1, -1, -2, -1, -2, 1, -1, 1, 0, 0],
        [kicad_sch_1.Sch.TextOrientationType.UP]: [6, 0, 0, 1, -1, 1, -2, -1, -2, -1, -1, 0, 0],
        [kicad_sch_1.Sch.TextOrientationType.HORIZ_RIGHT]: [6, 0, 0, 1, 1, 2, 1, 2, -1, 1, -1, 0, 0],
        [kicad_sch_1.Sch.TextOrientationType.BOTTOM]: [6, 0, 0, 1, 1, 1, 2, -1, 2, -1, 1, 0, 0],
    },
    [kicad_common_1.Net.OUTPUT]: {
        [kicad_sch_1.Sch.TextOrientationType.HORIZ_LEFT]: [6, -2, 0, -1, 1, 0, 1, 0, -1, -1, -1, -2, 0],
        [kicad_sch_1.Sch.TextOrientationType.HORIZ_RIGHT]: [6, 2, 0, 1, -1, 0, -1, 0, 1, 1, 1, 2, 0],
        [kicad_sch_1.Sch.TextOrientationType.UP]: [6, 0, -2, 1, -1, 1, 0, -1, 0, -1, -1, 0, -2],
        [kicad_sch_1.Sch.TextOrientationType.BOTTOM]: [6, 0, 2, 1, 1, 1, 0, -1, 0, -1, 1, 0, 2],
    },
    [kicad_common_1.Net.UNSPECIFIED]: {
        [kicad_sch_1.Sch.TextOrientationType.HORIZ_LEFT]: [5, 0, -1, -2, -1, -2, 1, 0, 1, 0, -1],
        [kicad_sch_1.Sch.TextOrientationType.HORIZ_RIGHT]: [5, 0, -1, 2, -1, 2, 1, 0, 1, 0, -1],
        [kicad_sch_1.Sch.TextOrientationType.UP]: [5, 1, 0, 1, -2, -1, -2, -1, 0, 1, 0],
        [kicad_sch_1.Sch.TextOrientationType.BOTTOM]: [5, 1, 0, 1, 2, -1, 2, -1, 0, 1, 0],
    },
    [kicad_common_1.Net.BIDI]: {
        [kicad_sch_1.Sch.TextOrientationType.HORIZ_LEFT]: [5, 0, 0, -1, -1, -2, 0, -1, 1, 0, 0],
        [kicad_sch_1.Sch.TextOrientationType.HORIZ_RIGHT]: [5, 0, 0, 1, -1, 2, 0, 1, 1, 0, 0],
        [kicad_sch_1.Sch.TextOrientationType.UP]: [5, 0, 0, -1, -1, 0, -2, 1, -1, 0, 0],
        [kicad_sch_1.Sch.TextOrientationType.BOTTOM]: [5, 0, 0, -1, 1, 0, 2, 1, 1, 0, 0],
    },
    [kicad_common_1.Net.TRISTATE]: {
        [kicad_sch_1.Sch.TextOrientationType.HORIZ_LEFT]: [5, 0, 0, -1, -1, -2, 0, -1, 1, 0, 0],
        [kicad_sch_1.Sch.TextOrientationType.HORIZ_RIGHT]: [5, 0, 0, 1, -1, 2, 0, 1, 1, 0, 0],
        [kicad_sch_1.Sch.TextOrientationType.UP]: [5, 0, 0, -1, -1, 0, -2, 1, -1, 0, 0],
        [kicad_sch_1.Sch.TextOrientationType.BOTTOM]: [5, 0, 0, -1, 1, 0, 2, 1, 1, 0, 0],
    }
};
class SchPlotter {
    constructor(plotter) {
        this.plotter = plotter;
        this.errors = [];
    }
    /**
     * kicad-js implements plot methods to plotter instead of each library items for simplify parsing dependencies.
     */
    plotLibComponent(component, unit, convert, transform) {
        this.plotter.setColor(SCH_COLORS.LAYER_DEVICE);
        for (let draw of component.draw.objects) {
            if (draw.unit !== 0 && unit !== draw.unit) {
                continue;
            }
            ;
            if (draw.convert !== 0 && convert !== draw.convert) {
                continue;
            }
            if (draw instanceof kicad_lib_1.Lib.DrawArc) {
                this.plotDrawArc(draw, component, transform);
            }
            else if (draw instanceof kicad_lib_1.Lib.DrawCircle) {
                this.plotDrawCircle(draw, component, transform);
            }
            else if (draw instanceof kicad_lib_1.Lib.DrawPolyline) {
                this.plotDrawPolyline(draw, component, transform);
            }
            else if (draw instanceof kicad_lib_1.Lib.DrawSquare) {
                this.plotDrawSquare(draw, component, transform);
            }
            else if (draw instanceof kicad_lib_1.Lib.DrawText) {
                this.plotDrawText(draw, component, transform);
            }
            else if (draw instanceof kicad_lib_1.Lib.DrawPin) {
                this.plotDrawPin(draw, component, transform);
            }
            else {
                throw 'unknown draw object type: ' + draw.constructor.name;
            }
        }
    }
    plotLibComponentField(component, unit, convert, transform) {
        if (component.field && component.field.visibility) {
            const pos = transform.transformCoordinate(component.field.pos);
            let orientation = component.field.textOrientation;
            if (transform.y1) {
                if (orientation === kicad_common_1.TextAngle.HORIZ) {
                    orientation = kicad_common_1.TextAngle.VERT;
                }
                else {
                    orientation = kicad_common_1.TextAngle.HORIZ;
                }
            }
            let text = component.field.reference;
            const width = 0; //this.plotter.font.computeTextLineSize(text, component.field.textSize, DEFAULT_LINE_WIDTH);
            const height = 0; //this.plotter.font.getInterline(component.field.textSize, DEFAULT_LINE_WIDTH);
            this.plotter.text(kicad_common_1.Point.add({ x: width / 2, y: height / 2 }, pos), SCH_COLORS.LAYER_REFERENCEPART, text, orientation, component.field.textSize, kicad_common_1.TextHjustify.CENTER, kicad_common_1.TextVjustify.CENTER, DEFAULT_LINE_WIDTH, component.field.italic, component.field.bold);
        }
        if (component.fields[0] && component.fields[0].visibility) {
            const pos = transform.transformCoordinate(component.fields[0].pos);
            let orientation = component.fields[0].textOrientation;
            if (transform.y1) {
                if (orientation === kicad_common_1.TextAngle.HORIZ) {
                    orientation = kicad_common_1.TextAngle.VERT;
                }
                else {
                    orientation = kicad_common_1.TextAngle.HORIZ;
                }
            }
            let text = component.fields[0].name;
            const width = 0; // this.plotter.font.computeTextLineSize(text, component.fields[0].textSize, DEFAULT_LINE_WIDTH);
            const height = 0; // this.plotter.font.getInterline(component.fields[0].textSize, DEFAULT_LINE_WIDTH);
            this.plotter.text(kicad_common_1.Point.add({ x: width / 2, y: height / 2 }, pos), SCH_COLORS.LAYER_VALUEPART, text, orientation, component.fields[0].textSize, kicad_common_1.TextHjustify.CENTER, kicad_common_1.TextVjustify.CENTER, DEFAULT_LINE_WIDTH, component.fields[0].italic, component.fields[0].bold);
        }
    }
    plotDrawArc(draw, component, transform) {
        const pos = transform.transformCoordinate(draw.pos);
        const [startAngle, endAngle] = transform.mapAngles(draw.startAngle, draw.endAngle);
        this.plotter.arc(pos, startAngle, endAngle, draw.radius, draw.fill, draw.lineWidth || DEFAULT_LINE_WIDTH);
    }
    plotDrawCircle(draw, component, transform) {
        const pos = transform.transformCoordinate(draw.pos);
        this.plotter.circle(pos, draw.radius * 2, draw.fill, draw.lineWidth || DEFAULT_LINE_WIDTH);
    }
    plotDrawPolyline(draw, component, transform) {
        const points = draw.points.map((point) => transform.transformCoordinate(point));
        this.plotter.polyline(points, draw.fill, draw.lineWidth || DEFAULT_LINE_WIDTH);
    }
    plotDrawSquare(draw, component, transform) {
        const pos1 = transform.transformCoordinate(draw.start);
        const pos2 = transform.transformCoordinate(draw.end);
        this.plotter.rect(pos1, pos2, draw.fill, draw.lineWidth || DEFAULT_LINE_WIDTH);
    }
    plotDrawText(draw, component, transform) {
        const pos = transform.transformCoordinate(draw.pos);
        this.plotter.text(pos, this.plotter.color, draw.text, component.field.textOrientation, draw.textSize, kicad_common_1.TextHjustify.CENTER, kicad_common_1.TextVjustify.CENTER, DEFAULT_LINE_WIDTH, draw.italic, draw.bold);
    }
    plotDrawPin(draw, component, transform) {
        if (!draw.visibility)
            return;
        this.plotDrawPinTexts(draw, component, transform);
        this.plotDrawPinSymbol(draw, component, transform);
    }
    plotDrawPinTexts(draw, component, transform) {
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
        const pos = transform.transformCoordinate(draw.pos);
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
        const nameLineWidth = this.plotter.font.clampTextPenSize(DEFAULT_LINE_WIDTH, draw.nameTextSize, false);
        const numLineWidth = this.plotter.font.clampTextPenSize(DEFAULT_LINE_WIDTH, draw.numTextSize, false);
        const nameOffset = PIN_TXT_MARGIN + (nameLineWidth + DEFAULT_LINE_WIDTH) / 2;
        const numOffset = PIN_TXT_MARGIN + (numLineWidth + DEFAULT_LINE_WIDTH) / 2;
        const textInside = component.textOffset;
        const isHorizontal = orientation === kicad_common_1.PinOrientation.LEFT || orientation === kicad_common_1.PinOrientation.RIGHT;
        if (textInside) {
            if (isHorizontal) {
                if (drawPinname) {
                    if (orientation === kicad_common_1.PinOrientation.RIGHT) {
                        this.plotter.text({ x: x1 + textInside, y: y1 }, SCH_COLORS.LAYER_PINNAM, draw.name, kicad_common_1.TextAngle.HORIZ, draw.nameTextSize, kicad_common_1.TextHjustify.LEFT, kicad_common_1.TextVjustify.CENTER, nameLineWidth, false, false);
                    }
                    else {
                        this.plotter.text({ x: x1 - textInside, y: y1 }, SCH_COLORS.LAYER_PINNAM, draw.name, kicad_common_1.TextAngle.HORIZ, draw.nameTextSize, kicad_common_1.TextHjustify.RIGHT, kicad_common_1.TextVjustify.CENTER, nameLineWidth, false, false);
                    }
                }
                if (drawPinnumber) {
                    this.plotter.text({ x: (x1 + pos.x) / 2, y: y1 - numOffset }, SCH_COLORS.LAYER_PINNUM, draw.num, kicad_common_1.TextAngle.HORIZ, draw.nameTextSize, kicad_common_1.TextHjustify.CENTER, kicad_common_1.TextVjustify.BOTTOM, numLineWidth, false, false);
                }
            }
            else {
                if (orientation === kicad_common_1.PinOrientation.DOWN) {
                    if (drawPinname) {
                        this.plotter.text({ x: x1, y: y1 + textInside }, SCH_COLORS.LAYER_PINNAM, draw.name, kicad_common_1.TextAngle.VERT, draw.nameTextSize, kicad_common_1.TextHjustify.RIGHT, kicad_common_1.TextVjustify.CENTER, nameLineWidth, false, false);
                    }
                    if (drawPinnumber) {
                        this.plotter.text({ x: x1 - numOffset, y: (y1 + pos.y) / 2 }, SCH_COLORS.LAYER_PINNUM, draw.num, kicad_common_1.TextAngle.VERT, draw.nameTextSize, kicad_common_1.TextHjustify.CENTER, kicad_common_1.TextVjustify.BOTTOM, numLineWidth, false, false);
                    }
                }
                else {
                    if (drawPinname) {
                        this.plotter.text({ x: x1, y: y1 - textInside }, SCH_COLORS.LAYER_PINNAM, draw.name, kicad_common_1.TextAngle.VERT, draw.nameTextSize, kicad_common_1.TextHjustify.LEFT, kicad_common_1.TextVjustify.CENTER, nameLineWidth, false, false);
                    }
                    if (drawPinnumber) {
                        this.plotter.text({ x: x1 - numOffset, y: (y1 + pos.y) / 2 }, SCH_COLORS.LAYER_PINNUM, draw.num, kicad_common_1.TextAngle.VERT, draw.nameTextSize, kicad_common_1.TextHjustify.CENTER, kicad_common_1.TextVjustify.BOTTOM, numLineWidth, false, false);
                    }
                }
            }
        }
        else {
            if (isHorizontal) {
                if (drawPinname) {
                    this.plotter.text({ x: (x1 + pos.x) / 2, y: y1 - nameOffset }, SCH_COLORS.LAYER_PINNAM, draw.name, kicad_common_1.TextAngle.HORIZ, draw.nameTextSize, kicad_common_1.TextHjustify.CENTER, kicad_common_1.TextVjustify.BOTTOM, nameLineWidth, false, false);
                }
                if (drawPinnumber) {
                    this.plotter.text({ x: (x1 + pos.x) / 2, y: y1 + numOffset }, SCH_COLORS.LAYER_PINNUM, draw.num, kicad_common_1.TextAngle.HORIZ, draw.numTextSize, kicad_common_1.TextHjustify.CENTER, kicad_common_1.TextVjustify.TOP, numLineWidth, false, false);
                }
            }
            else {
                if (drawPinname) {
                    this.plotter.text({ x: x1 - nameOffset, y: (y1 + pos.y) / 2 }, SCH_COLORS.LAYER_PINNAM, draw.name, kicad_common_1.TextAngle.VERT, draw.nameTextSize, kicad_common_1.TextHjustify.CENTER, kicad_common_1.TextVjustify.BOTTOM, nameLineWidth, false, false);
                }
                if (drawPinnumber) {
                    this.plotter.text({ x: x1 + numOffset, y: (y1 + pos.y) / 2 }, SCH_COLORS.LAYER_PINNUM, draw.num, kicad_common_1.TextAngle.VERT, draw.numTextSize, kicad_common_1.TextHjustify.CENTER, kicad_common_1.TextVjustify.TOP, numLineWidth, false, false);
                }
            }
        }
    }
    plotDrawPinSymbol(draw, component, transform) {
        const pos = transform.transformCoordinate(draw.pos);
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
        this.plotter.fill = kicad_common_1.Fill.NO_FILL;
        this.plotter.setCurrentLineWidth(DEFAULT_LINE_WIDTH);
        this.plotter.moveTo({ x: x1, y: y1 });
        this.plotter.finishTo({ x: pos.x, y: pos.y });
        // this.plotter.circle({ x: pos.x, y: pos.y}, 20, Fill.NO_FILL, 2);
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
        const t = transform.clone();
        t.tx = 0;
        t.ty = 0;
        end = t.transformCoordinate(end);
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
        this.plotter.plotPageInfo(sch.descr.pageInfo);
        for (let item of sch.items) {
            if (item instanceof kicad_sch_1.Sch.SchComponent) {
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
                    this.errors.push("component " + item.name + " is not found in libraries");
                    continue;
                }
                this.plotLibComponent(component, item.unit, item.convert, item.transform);
                for (let field of item.fields) {
                    if (!field.text)
                        continue;
                    if (!field.visibility)
                        continue;
                    if (field.number >= 2)
                        continue;
                    let orientation = field.angle;
                    if (item.transform.y1) {
                        if (orientation === kicad_common_1.TextAngle.HORIZ) {
                            orientation = kicad_common_1.TextAngle.VERT;
                        }
                        else {
                            orientation = kicad_common_1.TextAngle.HORIZ;
                        }
                    }
                    const size = field.size || DEFAULT_SIZE_TEXT;
                    const textBox = this.getTextBox(field, size, DEFAULT_LINE_WIDTH);
                    const origin = { x: item.pos.x, y: item.pos.y };
                    textBox.pos1 = kicad_common_1.Point.sub(textBox.pos1, origin);
                    textBox.pos2 = kicad_common_1.Point.sub(textBox.pos2, origin);
                    let textpos = item.transform.transformCoordinate({
                        x: textBox.pos1.x + textBox.width / 2,
                        y: textBox.pos1.y + textBox.height / 2,
                    });
                    this.plotter.text(textpos, SCH_COLORS.LAYER_REFERENCEPART, field.text, orientation, size, kicad_common_1.TextHjustify.CENTER, kicad_common_1.TextVjustify.CENTER, DEFAULT_LINE_WIDTH, field.italic, field.bold);
                }
            }
            else if (item instanceof kicad_sch_1.Sch.Sheet) {
                this.plotter.setColor(SCH_COLORS.LAYER_SHEET);
                this.plotter.setCurrentLineWidth(DEFAULT_LINE_WIDTH);
                this.plotter.fill = kicad_common_1.Fill.NO_FILL;
                this.plotter.moveTo(item.pos.x, item.pos.y);
                this.plotter.lineTo(item.pos.x, item.pos.y + item.size.height);
                this.plotter.lineTo(item.pos.x + item.size.width, item.pos.y + item.size.height);
                this.plotter.lineTo(item.pos.x + item.size.width, item.pos.y);
                this.plotter.finishTo(item.pos.x, item.pos.y);
                this.plotter.text({ x: item.pos.x, y: item.pos.y - 4 }, SCH_COLORS.LAYER_SHEETNAME, item.sheetName, 0, item.sheetNameSize, kicad_common_1.TextHjustify.LEFT, kicad_common_1.TextVjustify.BOTTOM, DEFAULT_LINE_WIDTH, false, false);
                this.plotter.text({ x: item.pos.x, y: item.pos.y + item.size.height + 4 }, SCH_COLORS.LAYER_SHEETFILENAME, item.fileName, 0, item.fileNameSize, kicad_common_1.TextHjustify.LEFT, kicad_common_1.TextVjustify.TOP, DEFAULT_LINE_WIDTH, false, false);
                this.plotter.setColor(SCH_COLORS.LAYER_SHEETLABEL);
                for (let pin of item.sheetPins) {
                    const tmp = pin.shape;
                    const pos = new kicad_common_1.Point(pin.pos.x, pin.pos.y);
                    if (pin.shape === kicad_common_1.Net.INPUT) {
                        pin.shape = kicad_common_1.Net.OUTPUT;
                    }
                    else if (pin.shape === kicad_common_1.Net.OUTPUT) {
                        pin.shape = kicad_common_1.Net.INPUT;
                    }
                    if (pin.sheetSide === kicad_common_1.SheetSide.LEFT) {
                        pin.pos.x = item.pos.x;
                    }
                    else if (pin.sheetSide === kicad_common_1.SheetSide.RIGHT) {
                        pin.pos.x = item.pos.x + item.size.width;
                    }
                    else if (pin.sheetSide === kicad_common_1.SheetSide.TOP) {
                        pin.pos.y = item.pos.y;
                    }
                    else if (pin.sheetSide === kicad_common_1.SheetSide.BOTTOM) {
                        pin.pos.y = item.pos.y + item.size.height;
                    }
                    this.plotSchTextHierarchicalLabel(pin);
                    pin.shape = tmp;
                    pin.pos.x = pos.x;
                    pin.pos.y = pos.y;
                }
            }
            else if (item instanceof kicad_sch_1.Sch.Bitmap) {
                item.parseIHDR();
                const PPI = 300;
                const PIXEL_SCALE = 1000 / PPI;
                this.plotter.image({ x: item.pos.x, y: item.pos.y }, item.scale * PIXEL_SCALE, item.size.width, item.size.height, item.data);
            }
            else if (item instanceof kicad_sch_1.Sch.Text) {
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
            else if (item instanceof kicad_sch_1.Sch.Entry) {
                this.plotter.setColor(item.isBus ? SCH_COLORS.LAYER_BUS : SCH_COLORS.LAYER_WIRE);
                this.plotter.setCurrentLineWidth(item.isBus ? DEFAULT_LINE_WIDTH_BUS : DEFAULT_LINE_WIDTH);
                this.plotter.moveTo(item.pos.x, item.pos.y);
                this.plotter.finishTo(item.pos.x + item.size.width, item.pos.y + item.size.height);
            }
            else if (item instanceof kicad_sch_1.Sch.Connection) {
                this.plotter.setColor(SCH_COLORS.LAYER_JUNCTION);
                this.plotter.circle({ x: item.pos.x, y: item.pos.y }, 40, kicad_common_1.Fill.FILLED_SHAPE, DEFAULT_LINE_WIDTH);
            }
            else if (item instanceof kicad_sch_1.Sch.NoConn) {
                this.plotter.fill = kicad_common_1.Fill.NO_FILL;
                const DRAWNOCONNECT_SIZE = 48;
                const delta = DRAWNOCONNECT_SIZE / 2;
                this.plotter.setColor(SCH_COLORS.LAYER_NOCONNECT);
                this.plotter.setCurrentLineWidth(DEFAULT_LINE_WIDTH);
                this.plotter.moveTo(item.pos.x - delta, item.pos.y - delta);
                this.plotter.finishTo(item.pos.x + delta, item.pos.y + delta);
                this.plotter.moveTo(item.pos.x + delta, item.pos.y - delta);
                this.plotter.finishTo(item.pos.x - delta, item.pos.y + delta);
            }
            else if (item instanceof kicad_sch_1.Sch.Wire) {
                this.plotter.setColor(item.isBus ? SCH_COLORS.LAYER_BUS : SCH_COLORS.LAYER_WIRE);
                this.plotter.setCurrentLineWidth(item.isBus ? DEFAULT_LINE_WIDTH_BUS : DEFAULT_LINE_WIDTH);
                this.plotter.fill = kicad_common_1.Fill.NO_FILL;
                this.plotter.moveTo(item.start.x, item.start.y);
                this.plotter.finishTo(item.end.x, item.end.y);
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
            const symLen = this.plotter.font.computeTextLineSize(item.text, item.size, lineWidth);
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
            if (item.orientationType === kicad_sch_1.Sch.TextOrientationType.HORIZ_LEFT) {
                angle = 0;
            }
            else if (item.orientationType === kicad_sch_1.Sch.TextOrientationType.UP) {
                angle = -900;
            }
            else if (item.orientationType === kicad_sch_1.Sch.TextOrientationType.HORIZ_RIGHT) {
                angle = 1800;
            }
            else if (item.orientationType === kicad_sch_1.Sch.TextOrientationType.BOTTOM) {
                angle = 900;
            }
            for (let p of points) {
                p.x += xOffset;
                if (angle) {
                    kicad_common_1.RotatePoint(p, angle);
                }
                p.x += item.pos.x;
                p.y += item.pos.y;
            }
            points.push(points[0]);
            this.plotter.setColor(SCH_COLORS.LAYER_GLOBLABEL);
            this.plotter.polyline(points, kicad_common_1.Fill.NO_FILL, DEFAULT_LINE_WIDTH);
        }
        {
            let p = new kicad_common_1.Point(item.pos.x, item.pos.y);
            const width = DEFAULT_LINE_WIDTH;
            const halfSize = this.plotter.font.computeTextLineSize(' ', item.size, width) / 2;
            let offset = width;
            if (item.shape === kicad_common_1.Net.INPUT ||
                item.shape === kicad_common_1.Net.BIDI ||
                item.shape === kicad_common_1.Net.TRISTATE) {
                offset += halfSize;
            }
            else if (item.shape === kicad_common_1.Net.OUTPUT ||
                item.shape === kicad_common_1.Net.UNSPECIFIED) {
                offset += TXT_MARGIN;
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
            this.plotter.text(p, SCH_COLORS.LAYER_GLOBLABEL, item.text, item.orientation, item.size, item.hjustify, item.vjustify, width, item.italic, item.bold);
        }
    }
    plotSchTextHierarchicalLabel(item) {
        this.plotter.setColor(SCH_COLORS.LAYER_HIERLABEL);
        {
            let p = new kicad_common_1.Point(item.pos.x, item.pos.y);
            const halfSize = item.size / 2;
            const template = TEMPLATE_SHAPES[item.shape][item.orientationType];
            const points = [];
            // first of template is number of corners
            for (let i = 1; i < template.length; i += 2) {
                const x = template[i] * halfSize;
                const y = template[i + 1] * halfSize;
                points.push(kicad_common_1.Point.add(new kicad_common_1.Point(x, y), p));
            }
            this.plotter.polyline(points, kicad_common_1.Fill.NO_FILL, DEFAULT_LINE_WIDTH);
        }
        ;
        {
            let p = new kicad_common_1.Point(item.pos.x, item.pos.y);
            const txtOffset = item.size + TXT_MARGIN + DEFAULT_LINE_WIDTH;
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
            this.plotter.text(p, SCH_COLORS.LAYER_HIERLABEL, item.text, item.orientation, item.size, item.hjustify, item.vjustify, DEFAULT_LINE_WIDTH, item.italic, item.bold);
        }
    }
    plotSchText(item) {
        let color = SCH_COLORS.LAYER_NOTES;
        if (item.name1 === 'Label') {
            color = SCH_COLORS.LAYER_LOCLABEL;
        }
        let p = new kicad_common_1.Point(item.pos.x, item.pos.y);
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
        this.plotter.text(p, color, item.text, item.orientation, item.size, item.hjustify, item.vjustify, DEFAULT_LINE_WIDTH, item.italic, item.bold);
    }
    getTextBox(text, size, lineWidth, invertY = false) {
        let lines = text.text.split(/\n/).map((line) => this.plotter.font.computeTextLineSize(text.text, size, lineWidth));
        let dx = Math.max(...lines);
        let dy = this.plotter.font.getInterline(size, lineWidth) * lines.length;
        let pos = { x: text.pos.x, y: text.pos.y };
        if (invertY) {
            pos.y = -pos.y;
        }
        let rect = new kicad_common_1.Rect(pos.x, pos.y, pos.x + dx, pos.y + dy);
        if (text.hjustify === kicad_common_1.TextHjustify.LEFT) {
        }
        else if (text.hjustify === kicad_common_1.TextHjustify.CENTER) {
            rect.pos1.x -= dx / 2;
            rect.pos2.x -= dx / 2;
        }
        else if (text.hjustify === kicad_common_1.TextHjustify.RIGHT) {
            rect.pos1.x -= dx;
            rect.pos2.x -= dx;
        }
        if (text.vjustify === kicad_common_1.TextVjustify.TOP) {
        }
        else if (text.vjustify === kicad_common_1.TextVjustify.CENTER) {
            rect.pos1.y -= dy / 2;
            rect.pos2.y -= dy / 2;
        }
        else if (text.vjustify === kicad_common_1.TextVjustify.BOTTOM) {
            rect.pos1.y -= dy;
            rect.pos2.y -= dy;
        }
        return rect.normalize();
    }
}
exports.SchPlotter = SchPlotter;
//# sourceMappingURL=kicad_sch_plotter.js.map