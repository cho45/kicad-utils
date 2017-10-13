/**
 *
 * IMPL is NOT COMPLETED!!
 */
import { Point, Fill, Size, Color } from "./kicad_common";
import { Pcb } from './kicad_pcb';
import { Plotter } from "./kicad_plotter";
export declare class PCBPlotter {
    plotter: Plotter;
    layerMask: Pcb.LSET;
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
    plotModule(mod: Pcb.Module): void;
    plotTextModule(mod: Pcb.Module, text: Pcb.TextModule, color: Color): void;
    plotAllTextModule(mod: Pcb.Module): void;
    plotEdgeModule(edge: Pcb.EdgeModule, mod: Pcb.Module): void;
    plotBoard(board: Pcb.Board): void;
    plotBoardLayer(board: Pcb.Board, layer: number): void;
    plotStandardLayer(board: Pcb.Board): void;
    plotSilkScreen(board: Pcb.Board): void;
    plotLayerOutline(board: Pcb.Board): void;
    plotSolderMaskLayer(board: Pcb.Board, minThickness: number): void;
    plotBoardLayers(board: Pcb.Board, layerMask: Pcb.LSET): void;
    plotOneBoardLayer(board: Pcb.Board, layerId: Pcb.PCB_LAYER_ID): void;
    plotFilledAreas(board: Pcb.Board, zone: Pcb.Zone): void;
    plotPad(board: Pcb.Board, pad: Pcb.Pad, color: Color, fill: Fill): void;
    plotDrillMarks(board: Pcb.Board): void;
    plotOneDrillMark(shape: Pcb.PadDrillShape, pos: Point, drillSize: Size, padSize: Size, orientation: number, smallDrill: number): void;
    plotBoardGraphicItems(board: Pcb.Board): void;
    plotBoardText(board: Pcb.Board, text: Pcb.Text): void;
    plotDrawSegment(board: Pcb.Board, seg: Pcb.DrawSegment): void;
    plotDimension(board: Pcb.Board, dim: Pcb.Dimension): void;
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
