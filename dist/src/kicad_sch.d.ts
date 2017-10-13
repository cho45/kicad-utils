import { Transform, TextAngle, TextHjustify, TextVjustify, SheetSide, Net, PageInfo, Point, Size } from "./kicad_common";
export declare namespace Sch {
    enum TextOrientationType {
        HORIZ_LEFT = 0,
        UP = 1,
        HORIZ_RIGHT = 2,
        BOTTOM = 3,
    }
    class Schematic {
        libs: Array<string>;
        descr: Descr;
        items: Array<SchItem>;
        parsed: boolean;
        version: number;
        static load(content: string): Schematic;
        constructor();
        parse(lines: Array<string>): void;
    }
    abstract class SchItem {
    }
    class Sheet extends SchItem {
        pos: Point;
        size: Size;
        timestamp: number;
        sheetName: string;
        sheetNameSize: number;
        fileName: string;
        fileNameSize: number;
        sheetPins: Array<SheetPin>;
        constructor();
        parse(lines: Array<string>): this;
    }
    class SchComponent extends SchItem {
        reference: string;
        name: string;
        unit: number;
        convert: number;
        timestamp: number;
        pos: Point;
        ar: {
            [key: string]: string;
        };
        fields: Array<Field>;
        transform: Transform;
        constructor();
        parse(lines: Array<string>): this;
    }
    class Field extends SchItem {
        number: number;
        text: string;
        name: string;
        angle: TextAngle;
        pos: Point;
        size: number;
        visibility: boolean;
        hjustify: TextHjustify;
        vjustify: TextVjustify;
        italic: boolean;
        bold: boolean;
        constructor(tokens: Array<string>);
    }
    class Descr {
        pageInfo: PageInfo;
        screenNumber: number;
        numberOfScreens: number;
        title: string;
        date: string;
        rev: string;
        comp: string;
        comment1: string;
        comment2: string;
        comment3: string;
        comment4: string;
        constructor(tokens: Array<string>);
        readonly width: number;
        readonly height: number;
        parse(lines: Array<string>): this;
    }
    class Bitmap extends SchItem {
        pos: Point;
        size: Size;
        scale: number;
        data: Uint8Array;
        static PNG_SIGNATURE: string;
        constructor();
        parse(lines: Array<string>): this;
        readonly isValidPNG: boolean;
        parseIHDR(): void;
    }
    class Text extends SchItem {
        name1: string;
        pos: Point;
        orientationType: TextOrientationType;
        orientation: number;
        size: number;
        bold: boolean;
        italic: boolean;
        text: string;
        shape: Net;
        hjustify: TextHjustify;
        vjustify: TextVjustify;
        constructor(tokens?: Array<string>);
        setOrientationType(orientationType: TextOrientationType): void;
        parse(lines: Array<string>): this;
    }
    class Wire extends SchItem {
        name1: string;
        name2: string;
        start: Point;
        end: Point;
        constructor(tokens: Array<string>);
        readonly isBus: boolean;
        parse(lines: Array<string>): this;
    }
    class Entry extends SchItem {
        name1: string;
        name2: string;
        pos: Point;
        size: Size;
        constructor(tokens: Array<string>);
        readonly isBus: boolean;
        parse(lines: Array<string>): this;
    }
    class Connection extends SchItem {
        name1: string;
        pos: Point;
        constructor(tokens: Array<string>);
        parse(lines: Array<string>): this;
    }
    class NoConn extends SchItem {
        name1: string;
        pos: Point;
        constructor(tokens: Array<string>);
        parse(lines: Array<string>): this;
    }
    class SheetPin extends Text {
        number: number;
        sheetSide: SheetSide;
        constructor(n: number, tokens: Array<string>);
        parse(lines: Array<string>): this;
    }
}
