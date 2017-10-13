import { PinOrientation, Transform, Rect } from "./kicad_common";
import { LibComponent, Library, DrawPin, DrawArc, DrawCircle, DrawPolyline, DrawSquare, DrawText } from "./kicad_lib";
import { Schematic, Field, Text } from "./kicad_sch";
import { Plotter } from "./kicad_plotter";
export declare class SchPlotter {
    plotter: Plotter;
    errors: Array<string>;
    constructor(plotter: Plotter);
    /**
     * kicad-js implements plot methods to plotter instead of each library items for simplify parsing dependencies.
     */
    plotLibComponent(component: LibComponent, unit: number, convert: number, transform: Transform): void;
    plotLibComponentField(component: LibComponent, unit: number, convert: number, transform: Transform): void;
    plotDrawArc(draw: DrawArc, component: LibComponent, transform: Transform): void;
    plotDrawCircle(draw: DrawCircle, component: LibComponent, transform: Transform): void;
    plotDrawPolyline(draw: DrawPolyline, component: LibComponent, transform: Transform): void;
    plotDrawSquare(draw: DrawSquare, component: LibComponent, transform: Transform): void;
    plotDrawText(draw: DrawText, component: LibComponent, transform: Transform): void;
    plotDrawPin(draw: DrawPin, component: LibComponent, transform: Transform): void;
    plotDrawPinTexts(draw: DrawPin, component: LibComponent, transform: Transform): void;
    plotDrawPinSymbol(draw: DrawPin, component: LibComponent, transform: Transform): void;
    pinDrawOrientation(draw: DrawPin, transform: Transform): PinOrientation;
    plotSchematic(sch: Schematic, libs: Array<Library>): void;
    plotSchTextGlobalLabel(item: Text): void;
    plotSchTextHierarchicalLabel(item: Text): void;
    plotSchText(item: Text): void;
    getTextBox(text: Field, size: number, lineWidth: number, invertY?: boolean): Rect;
}
