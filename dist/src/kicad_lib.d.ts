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
import { Fill, TextHjustify, TextVjustify, PinOrientation, PinType, PinAttribute, Rect, Point } from "./kicad_common";
export declare namespace Lib {
    class ParseError extends Error {
        lines: Array<string>;
        lineNumber: number;
        constructor(message: string, lines: Array<string>);
    }
    class Library {
        version: number;
        components: Array<LibComponent>;
        static load(content: string): Library;
        constructor();
        parse(lines: Array<string>): void;
        findByName(name: string): LibComponent | null;
    }
    class LibComponent {
        draw: Draw;
        fplist: Array<string>;
        aliases: Array<string>;
        field: Field0;
        fields: Array<FieldN>;
        name: string;
        reference: string;
        textOffset: number;
        drawPinnumber: boolean;
        drawPinname: boolean;
        unitCount: number;
        unitsLocked: boolean;
        optionFlag: string;
        constructor(params: Array<string>);
        parse(lines: Array<string>): this;
    }
    class Field0 {
        reference: string;
        pos: Point;
        textSize: number;
        textOrientation: number;
        visibility: boolean;
        hjustify: TextHjustify;
        vjustify: TextVjustify;
        italic: boolean;
        bold: boolean;
        constructor(params: Array<string>);
    }
    class FieldN {
        name: string;
        pos: Point;
        textSize: number;
        textOrientation: number;
        visibility: boolean;
        hjustify: TextHjustify;
        vjustify: TextVjustify;
        fieldname: string;
        italic: boolean;
        bold: boolean;
        constructor(params: Array<string>);
    }
    class Draw {
        objects: Array<DrawObject>;
        constructor();
        parse(lines: Array<string>): this;
        getBoundingRect(): Rect | undefined;
    }
    abstract class DrawObject {
        /**
         * Unit identification for multiple parts per package.  Set to 0 if the
         * item is common to all units.
         */
        unit: number;
        /**
         * Shape identification for alternate body styles.  Set 0 if the item
         * is common to all body styles.  This is commonly referred to as
         * DeMorgan style and this is typically how it is used in KiCad.
         */
        convert: number;
        fill: Fill;
        abstract getBoundingBox(): Rect;
    }
    class DrawArc extends DrawObject {
        pos: Point;
        radius: number;
        startAngle: number;
        endAngle: number;
        lineWidth: number;
        start: Point;
        end: Point;
        constructor(params: Array<string>);
        getBoundingBox(): Rect;
    }
    class DrawCircle extends DrawObject {
        pos: Point;
        radius: number;
        lineWidth: number;
        constructor(params: Array<string>);
        getBoundingBox(): Rect;
    }
    class DrawPolyline extends DrawObject {
        pointCount: number;
        lineWidth: number;
        points: Array<Point>;
        constructor(params: Array<string>);
        getBoundingBox(): Rect;
    }
    class DrawSquare extends DrawObject {
        start: Point;
        end: Point;
        lineWidth: number;
        constructor(params: Array<string>);
        getBoundingBox(): Rect;
    }
    class DrawText extends DrawObject {
        angle: number;
        pos: Point;
        textSize: number;
        textType: number;
        text: string;
        italic: boolean;
        bold: boolean;
        hjustify: TextHjustify;
        vjustify: TextVjustify;
        constructor(params: Array<string>);
        getBoundingBox(): Rect;
    }
    class DrawPin extends DrawObject {
        name: string;
        num: string;
        pos: Point;
        length: number;
        orientation: PinOrientation;
        nameTextSize: number;
        numTextSize: number;
        pinType: PinType;
        visibility: boolean;
        attributes: Array<PinAttribute>;
        constructor(params: Array<string>);
        getBoundingBox(): Rect;
    }
}
