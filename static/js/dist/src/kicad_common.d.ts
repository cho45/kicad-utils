/**
 * KiCAD internal unit:
 *	length: mil (1/1000 inch)
 *	angles: decidegree (1/10 degrees)
 */
export declare function DECIDEG2RAD(deg: number): number;
export declare function RAD2DECIDEG(rad: number): number;
export declare function NORMALIZE_ANGLE_POS(angle: number): number;
export declare function AddAngles(angle1: number, angle2: number): number;
export declare function ArcTangente(dy: number, dx: number): number;
export declare function EuclideanNorm(v: Size | Point): number;
export declare function GetLineLength(p1: Point, p2: Point): number;
export declare function RotatePoint(p: Point, angle: number): Point;
export declare function RotatePointWithCenter(p: Point, center: Point, angle: number): Point;
export declare function MM2MIL(mm: number): number;
export declare function MIL2MM(mil: number): number;
export declare function ReadDelimitedText(s: string): string;
export declare function Clamp(lower: number, value: number, upper: number): number;
export declare class Transform {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
    tx: number;
    ty: number;
    constructor(x1?: number, x2?: number, y1?: number, y2?: number, tx?: number, ty?: number);
    static default(): Transform;
    static identify(): Transform;
    static translate(tx: number, ty: number): Transform;
    static scale(sx: number, sy: number): Transform;
    static rotate(radian: number): Transform;
    clone(): Transform;
    translate(tx: number, ty: number): Transform;
    scale(sx: number, sy: number): Transform;
    rotate(radian: number): Transform;
    multiply(b: Transform): Transform;
    transformCoordinate(p: Point): Point;
    transformScalar(n: number): number;
    mapAngles(angle1: number, angle2: number): Array<number>;
}
export declare class Point {
    x: number;
    y: number;
    constructor(x?: number, y?: number);
    static from(p: Point): Point;
    static add(p1: Point, p2: Point): Point;
    static sub(p1: Point, p2: Point): Point;
    static isZero(p: Point): boolean;
}
export declare class Rect {
    pos1: Point;
    pos2: Point;
    constructor(pos1x: number, pos1y: number, pos2x: number, pos2y: number);
    readonly width: number;
    readonly height: number;
    getWidth(): number;
    getHeight(): number;
    normalize(): this;
    merge(o: Rect): Rect;
    inflate(n: number): this;
}
export declare class Color {
    r: number;
    g: number;
    b: number;
    a: number;
    static BLACK: Color;
    static DARKDARKGRAY: Color;
    static DARKGRAY: Color;
    static LIGHTGRAY: Color;
    static WHITE: Color;
    static LIGHTYELLOW: Color;
    static DARKBLUE: Color;
    static DARKGREEN: Color;
    static DARKCYAN: Color;
    static DARKRED: Color;
    static DARKMAGENTA: Color;
    static DARKBROWN: Color;
    static BLUE: Color;
    static GREEN: Color;
    static CYAN: Color;
    static RED: Color;
    static MAGENTA: Color;
    static BROWN: Color;
    static LIGHTBLUE: Color;
    static LIGHTGREEN: Color;
    static LIGHTCYAN: Color;
    static LIGHTRED: Color;
    static LIGHTMAGENTA: Color;
    static YELLOW: Color;
    static PUREBLUE: Color;
    static PUREGREEN: Color;
    static PURECYAN: Color;
    static PURERED: Color;
    static PUREMAGENTA: Color;
    static PUREYELLOW: Color;
    constructor(r: number, g: number, b: number, a?: number);
    is(c: Color): boolean;
    toCSSColor(): string;
    mix(c: Color): Color;
}
export declare class ColorDefinition extends Color {
    static BLACK: ColorDefinition;
    static DARKDARKGRAY: ColorDefinition;
    static DARKGRAY: ColorDefinition;
    static LIGHTGRAY: ColorDefinition;
    static WHITE: ColorDefinition;
    static LIGHTYELLOW: ColorDefinition;
    static DARKBLUE: ColorDefinition;
    static DARKGREEN: ColorDefinition;
    static DARKCYAN: ColorDefinition;
    static DARKRED: ColorDefinition;
    static DARKMAGENTA: ColorDefinition;
    static DARKBROWN: ColorDefinition;
    static BLUE: ColorDefinition;
    static GREEN: ColorDefinition;
    static CYAN: ColorDefinition;
    static RED: ColorDefinition;
    static MAGENTA: ColorDefinition;
    static BROWN: ColorDefinition;
    static LIGHTBLUE: ColorDefinition;
    static LIGHTGREEN: ColorDefinition;
    static LIGHTCYAN: ColorDefinition;
    static LIGHTRED: ColorDefinition;
    static LIGHTMAGENTA: ColorDefinition;
    static YELLOW: ColorDefinition;
    static PUREBLUE: ColorDefinition;
    static PUREGREEN: ColorDefinition;
    static PURECYAN: ColorDefinition;
    static PURERED: ColorDefinition;
    static PUREMAGENTA: ColorDefinition;
    static PUREYELLOW: ColorDefinition;
    name: string;
    light: Color;
    constructor(c: Color, name: string, light: Color);
}
export declare enum Fill {
    NO_FILL = "N",
    FILLED_SHAPE = "F",
    FILLED_WITH_BG_BODYCOLOR = "f",
}
export declare enum TextHjustify {
    LEFT = "L",
    CENTER = "C",
    RIGHT = "R",
}
export declare enum TextVjustify {
    TOP = "T",
    CENTER = "C",
    BOTTOM = "B",
}
export declare enum PinOrientation {
    RIGHT = "R",
    LEFT = "L",
    UP = "U",
    DOWN = "D",
}
export declare enum TextAngle {
    HORIZ = 0,
    VERT = 900,
}
export declare enum PinType {
    INPUT = "I",
    OUTPUT = "O",
    BIDI = "B",
    TRISTATE = "T",
    PASSIVE = "P",
    UNSPECIFIED = "U",
    POWER_IN = "W",
    POWER_OUT = "w",
    OPENCOLLECTOR = "C",
    OPENEMITTER = "E",
    NC = "N",
}
export declare enum PinAttribute {
    NONE = "~",
    INVERTED = "I",
    CLOCK = "C",
    LOWLEVEL_IN = "L",
    LOWLEVEL_OUT = "V",
    FALLING_EDGE = "F",
    NONLOGIC = "X",
    INVISIBLE = "N",
}
export declare enum SheetSide {
    RIGHT = "R",
    TOP = "T",
    BOTTOM = "B",
    LEFT = "L",
}
export declare enum Net {
    INPUT = "I",
    OUTPUT = "O",
    BIDI = "B",
    TRISTATE = "T",
    UNSPECIFIED = "U",
}
export declare class Size {
    width: number;
    height: number;
    static from(s: Size): Size;
    constructor(width: number, height: number);
}
export declare class PageInfo {
    pageType: string;
    width: number;
    height: number;
    portrait: boolean;
    static A4: PageInfo;
    static A3: PageInfo;
    static A2: PageInfo;
    static A1: PageInfo;
    static A0: PageInfo;
    static A: PageInfo;
    static B: PageInfo;
    static C: PageInfo;
    static D: PageInfo;
    static E: PageInfo;
    static GERBER: PageInfo;
    static User: PageInfo;
    static USLetter: PageInfo;
    static USLegal: PageInfo;
    static USLedger: PageInfo;
    static PAGE_TYPES: PageInfo[];
    constructor(pageType: string, portrait?: boolean, width?: number, height?: number);
    setPageType(pageType: string): void;
    setPortrait(portrait: boolean): void;
}
