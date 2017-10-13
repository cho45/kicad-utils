import { Point, Rect, TextHjustify, TextVjustify } from "./kicad_common";
import { Plotter } from "./kicad_plotter";
export declare class Glyph {
    lines: Array<Array<Point>>;
    startX: number;
    endX: number;
    boundingBox: Rect;
    constructor();
    computeBoundingBox(): void;
}
export declare class StrokeFont {
    glyphs: Array<Glyph>;
    private static _instance;
    static readonly instance: StrokeFont;
    private constructor();
    getInterline(size: number, lineWidth: number): number;
    computeTextLineSize(line: string, size: number, lineWidth: number, italic?: boolean): number;
    computeStringBoundaryLimits(line: string, size: number, lineWidth: number, italic?: boolean): {
        width: number;
        height: number;
        topLimit: number;
        bottomLimit: number;
    };
    drawGlyph(plotter: Plotter, p: Point, glyph: Glyph, size: number, italic: boolean): void;
    drawLineText(plotter: Plotter, p: Point, line: string, size: number, lineWidth: number, hjustify: TextHjustify, vjustify: TextVjustify, italic: boolean): void;
    drawText(plotter: Plotter, p: Point, text: string, size: number, lineWidth: number, angle: number, hjustify: TextHjustify, vjustify: TextVjustify, italic: boolean, bold: boolean): void;
    clampTextPenSize(lineWidth: number, size: number, bold: boolean): number;
}
