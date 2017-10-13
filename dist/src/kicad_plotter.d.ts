import { Fill, TextHjustify, TextVjustify, Transform, Point, Color, PageInfo } from "./kicad_common";
import { StrokeFont } from "./kicad_strokefont";
/**
 * similar to KiCAD Plotter
 *
 */
export declare abstract class Plotter {
    fill: Fill;
    color: Color;
    transform: Transform;
    stateHistory: Array<{
        fill: Fill;
        color: Color;
        transform: Transform;
    }>;
    font: StrokeFont;
    errors: Array<string>;
    pageInfo: PageInfo;
    constructor();
    abstract circle(p: Point, dia: number, fill: Fill, width: number): void;
    abstract arc(p: Point, startAngle: number, endAngle: number, radius: number, fill: Fill, width: number): void;
    abstract penTo(p: Point, s: "U" | "D" | "Z"): void;
    abstract image(p: Point, scale: number, originalWidth: number, originalHeight: number, data: Uint8Array): void;
    abstract setCurrentLineWidth(w: number): void;
    abstract getCurrentLineWidth(): number;
    setFill(fill: Fill): void;
    startPlot(): void;
    endPlot(): void;
    rect(p1: Point, p2: Point, fill: Fill, width: number): void;
    polyline(points: Array<Point>, fill: Fill, width: number): void;
    text(p: Point, color: Color, text: string, orientation: number, size: number, hjustfy: TextHjustify, vjustify: TextVjustify, width: number, italic: boolean, bold: boolean, multiline?: boolean): void;
    save(): void;
    translate(tx: number, ty: number): void;
    scale(sx: number, sy: number): void;
    rotate(radian: number): void;
    restore(): void;
    setColor(c: Color): void;
    moveTo(p: Point): void;
    moveTo(x: number, y: number): void;
    lineTo(p: Point): void;
    lineTo(x: number, y: number): void;
    finishTo(p: Point): void;
    finishTo(x: number, y: number): void;
    finishPen(): void;
    plotPageInfo(page: PageInfo): void;
}
export declare class CanvasPlotter extends Plotter {
    ctx: any;
    penState: "U" | "D" | "Z";
    constructor(ctx: any);
    circle(p: Point, dia: number, fill: Fill, width: number): void;
    arc(p: Point, startAngle: number, endAngle: number, radius: number, fill: Fill, width: number): void;
    /**
     * U = Pen is up
     * D = Pen is down
     * Z = Pen is outof canvas
     */
    penTo(p: Point, s: "U" | "D" | "Z"): void;
    setColor(c: Color): void;
    setCurrentLineWidth(w: number): void;
    getCurrentLineWidth(): number;
    image(p: Point, scale: number, originalWidth: number, originalHeight: number, data: Uint8Array): void;
}
export declare class SVGPlotter extends Plotter {
    penState: "U" | "D" | "Z";
    lineWidth: number;
    output: string;
    static font: {
        family: string;
        widthRatio: number;
    };
    constructor();
    circle(p: Point, dia: number, fill: Fill, width: number): void;
    arc(p: Point, startAngle: number, endAngle: number, radius: number, fill: Fill, width: number): void;
    text(p: Point, color: Color, text: string, orientation: number, size: number, hjustfy: TextHjustify, vjustify: TextVjustify, width: number, italic: boolean, bold: boolean, multiline?: boolean): void;
    /**
     * U = Pen is up
     * D = Pen is down
     * Z = Pen is outof canvas
     */
    penTo(p: Point, s: "U" | "D" | "Z"): void;
    setCurrentLineWidth(w: number): void;
    getCurrentLineWidth(): number;
    image(p: Point, scale: number, originalWidth: number, originalHeight: number, data: Uint8Array): void;
    startPlot(): void;
    endPlot(): void;
    xmlTag(literals: TemplateStringsArray, ...placeholders: Array<any>): string;
    xmlentities(s: any): string;
}
