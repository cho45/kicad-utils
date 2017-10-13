import { PinOrientation, Transform, Rect } from "./kicad_common";
import { Lib } from './kicad_lib';
import { Sch } from "./kicad_sch";
import { Plotter } from "./kicad_plotter";
export declare class SchPlotter {
    plotter: Plotter;
    errors: Array<string>;
    constructor(plotter: Plotter);
    /**
     * kicad-js implements plot methods to plotter instead of each library items for simplify parsing dependencies.
     */
    plotLibComponent(component: Lib.LibComponent, unit: number, convert: number, transform: Transform): void;
    plotLibComponentField(component: Lib.LibComponent, unit: number, convert: number, transform: Transform): void;
    plotDrawArc(draw: Lib.DrawArc, component: Lib.LibComponent, transform: Transform): void;
    plotDrawCircle(draw: Lib.DrawCircle, component: Lib.LibComponent, transform: Transform): void;
    plotDrawPolyline(draw: Lib.DrawPolyline, component: Lib.LibComponent, transform: Transform): void;
    plotDrawSquare(draw: Lib.DrawSquare, component: Lib.LibComponent, transform: Transform): void;
    plotDrawText(draw: Lib.DrawText, component: Lib.LibComponent, transform: Transform): void;
    plotDrawPin(draw: Lib.DrawPin, component: Lib.LibComponent, transform: Transform): void;
    plotDrawPinTexts(draw: Lib.DrawPin, component: Lib.LibComponent, transform: Transform): void;
    plotDrawPinSymbol(draw: Lib.DrawPin, component: Lib.LibComponent, transform: Transform): void;
    pinDrawOrientation(draw: Lib.DrawPin, transform: Transform): PinOrientation;
    plotSchematic(sch: Sch.Schematic, libs: Array<Lib.Library>): void;
    plotSchTextGlobalLabel(item: Sch.Text): void;
    plotSchTextHierarchicalLabel(item: Sch.Text): void;
    plotSchText(item: Sch.Text): void;
    getTextBox(text: Sch.Field, size: number, lineWidth: number, invertY?: boolean): Rect;
}
