/**
 *
 * IMPL is NOT COMPLETED!!
 */
import { Point, Fill, Size, Color } from "./kicad_common";
import { Module, Pad, Board, EdgeModule, LSET, PadDrillShape, Text, Dimension, DrawSegment, PCB_LAYER_ID, TextModule, Zone } from "./kicad_pcb";
import { Plotter } from "./kicad_plotter";
export declare class PCBPlotter {
    plotter: Plotter;
    layerMask: LSET;
    plotOpt: PCBPlotOptions;
    constructor(plotter: Plotter);
    flashPadCircle(pos: Point, dia: number, fill: Fill): void;
    flashPadRect(pos: Point, size: Size, orientation: number, fill: Fill): void;
    flashPadRoundRect(pos: Point, size: Size, cornerRadius: number, orientation: number, fill: Fill): void;
    flashPadTrapezoid(pos: Point, coords: Array<Point>, orientation: number, fill: Fill): void;
    flashPadOval(center: Point, size: Size, orientation: number, fill: Fill): void;
    sketchOval(pos: Point, size: Size, orientation: number, lineWidth: number): void;
    segmentAsOval(start: Point, end: Point, lineWidth: number, fill: Fill): void;
    thickSegment(start: Point, end: Point, lineWidth: number, fill: Fill): void;
    thickArc(center: Point, startAngle: number, endAngle: number, radius: number, lineWidth: number, fill: Fill): void;
    thickRect(p1: Point, p2: Point, lineWidth: number, fill: Fill): void;
    thickCircle(pos: Point, diameter: number, lineWidth: number, fill: Fill): void;
    plotModule(mod: Module): void;
    plotTextModule(mod: Module, text: TextModule, color: Color): void;
    plotAllTextModule(mod: Module): void;
    plotEdgeModule(edge: EdgeModule, mod: Module): void;
    plotBoard(board: Board): void;
    plotBoardLayer(board: Board, layer: number): void;
    plotStandardLayer(board: Board): void;
    plotSilkScreen(board: Board): void;
    plotLayerOutline(board: Board): void;
    plotSolderMaskLayer(board: Board, minThickness: number): void;
    plotBoardLayers(board: Board, layerMask: LSET): void;
    plotOneBoardLayer(board: Board, layerId: PCB_LAYER_ID): void;
    plotFilledAreas(board: Board, zone: Zone): void;
    plotPad(board: Board, pad: Pad, color: Color, fill: Fill): void;
    plotDrillMarks(board: Board): void;
    plotOneDrillMark(shape: PadDrillShape, pos: Point, drillSize: Size, padSize: Size, orientation: number, smallDrill: number): void;
    plotBoardGraphicItems(board: Board): void;
    plotBoardText(board: Board, text: Text): void;
    plotDrawSegment(board: Board, seg: DrawSegment): void;
    plotDimension(board: Board, dim: Dimension): void;
    getColor(layer: number): Color;
    getPlotMode(): Fill;
}
export declare enum DrillMarksType {
    NO_DRILL_SHAPE = 0,
    SMALL_DRILL_SHAPE = 1,
    FULL_DRILL_SHAPE = 2,
}
export declare class PCBPlotOptions {
    drillMarks: DrillMarksType;
    skipNPTH_Pads: boolean;
}
