/**
 *
 * IMPL is NOT COMPLETED!!
 */
import { Point, Size, TextHjustify, TextVjustify, PageInfo } from "./kicad_common";
import { Token } from "./kicad_pcb_token";
export declare namespace Pcb {
    enum PCB_LAYER_ID {
        UNDEFINED_LAYER = -1,
        UNSELECTED_LAYER = -2,
        F_Cu = 0,
        In1_Cu = 1,
        In2_Cu = 2,
        In3_Cu = 3,
        In4_Cu = 4,
        In5_Cu = 5,
        In6_Cu = 6,
        In7_Cu = 7,
        In8_Cu = 8,
        In9_Cu = 9,
        In10_Cu = 10,
        In11_Cu = 11,
        In12_Cu = 12,
        In13_Cu = 13,
        In14_Cu = 14,
        In15_Cu = 15,
        In16_Cu = 16,
        In17_Cu = 17,
        In18_Cu = 18,
        In19_Cu = 19,
        In20_Cu = 20,
        In21_Cu = 21,
        In22_Cu = 22,
        In23_Cu = 23,
        In24_Cu = 24,
        In25_Cu = 25,
        In26_Cu = 26,
        In27_Cu = 27,
        In28_Cu = 28,
        In29_Cu = 29,
        In30_Cu = 30,
        B_Cu = 31,
        B_Adhes = 32,
        F_Adhes = 33,
        B_Paste = 34,
        F_Paste = 35,
        B_SilkS = 36,
        F_SilkS = 37,
        B_Mask = 38,
        F_Mask = 39,
        Dwgs_User = 40,
        Cmts_User = 41,
        Eco1_User = 42,
        Eco2_User = 43,
        Edge_Cuts = 44,
        Margin = 45,
        B_CrtYd = 46,
        F_CrtYd = 47,
        B_Fab = 48,
        F_Fab = 49,
        PCB_LAYER_ID_COUNT = 50,
    }
    enum PadDrillShape {
        CIRCLE = 0,
        OBLONG = 1,
    }
    function IsCopperLayer(layerId: PCB_LAYER_ID): boolean;
    class PCB {
        tokens: Array<Token>;
        pos: number;
        layerIndices: {
            [key: string]: number;
        };
        layerMasks: {
            [key: string]: LSET;
        };
        netCodes: {
            [key: number]: NetInfoItem;
        };
        tooRecent: boolean;
        requiredVersion: number;
        board: Board;
        static load(content: string): Board | Module;
        constructor();
        curTok(): Token;
        curText(): string;
        nextTok(): Token;
        needLEFT(): void;
        needRIGHT(): void;
        needNUMBER(expected?: string): Token;
        needSYMBOL(expected?: string): Token;
        needSYMBOLorNUMBER(expected?: string): Token;
        expecting(got: Token, ...expected: Token[]): void;
        /**
         * KiCAD's odd behaviour:
         *   pareseInt/parseDouble/parseBoardUnit is
         *     with expected:     call nextTok() and parse it (returning number is next token)
         *     without expected:  parse curToke() (returning number is current token)
         *
         *   parseHex
         *   parseBool
         *     always:   parse curToke() (returning number is current token)
         */
        parseInt(expected?: string): number;
        parseFloat(expected?: string): number;
        parseBoardUnits(expected?: string): number;
        parseHex(expected: string): number;
        parseBool(expected: string): boolean | undefined;
        parseXY(expected: string): Point;
        parseBoardItemLayer(expected: string): number;
        parseBoardItemLayersAsMask(expected: string): LSET;
        parse(): Board | Module;
        parseBoard(): void;
        parseHeader(): void;
        parseGeneralSection(): void;
        parsePageSection(): void;
        parseLayersSection(): void;
        parseLayer(): Layer;
        parseSetupSection(): void;
        parseNetSection(): void;
        parseNetClassSection(): void;
        parseDrawSegmentSection(): void;
        parseTextSection(): Text;
        parseTextModule(): TextModule;
        parseEdgeModule(): EdgeModule;
        parsePad(): Pad;
        parseEDATEXT(text: Text): void;
        parseDimensionSection(): Dimension;
        parseModuleSection(): Module;
        parseSegmentSection(): Track;
        parseViaSection(): Via;
        parseZoneSection(): Zone;
        parseTargetSection(): Target;
        skipSection(): void;
    }
    enum LayerType {
        SIGNAL = "signal",
        POWER = "power",
        MIXED = "mixed",
        JUMPER = "jumper",
        UNDEFINED = "undefined",
    }
    class Layer {
        name: string;
        type: LayerType;
        number: number;
        visible: boolean;
        constructor(name: string, type: LayerType, number: number, visible: boolean);
    }
    class Board {
        filename: string;
        layers: Array<Layer>;
        boardDesignSetting: BoardDesignSetting;
        pageInfo: PageInfo;
        netInfos: Array<NetInfoItem>;
        drawSegments: Array<DrawSegment>;
        texts: Array<Text>;
        dimensions: Array<Dimension>;
        modules: Array<Module>;
        tracks: Array<Track>;
        vias: Array<Via>;
        zones: Array<Zone>;
        targets: Array<Target>;
        copperLayerCount: number;
        enabledLayers: Array<number>;
        visibleLayers: Array<number>;
        layerDescr: {
            [key: number]: Layer;
        };
    }
    class LSET {
        static AllCuMask(count?: number): LSET;
        static Name(layerId: PCB_LAYER_ID): "F.Cu" | "In1.Cu" | "In2.Cu" | "In3.Cu" | "In4.Cu" | "In5.Cu" | "In6.Cu" | "In7.Cu" | "In8.Cu" | "In9.Cu" | "In10.Cu" | "In11.Cu" | "In12.Cu" | "In13.Cu" | "In14.Cu" | "In15.Cu" | "In16.Cu" | "In17.Cu" | "In18.Cu" | "In19.Cu" | "In20.Cu" | "In21.Cu" | "In22.Cu" | "In23.Cu" | "In24.Cu" | "In25.Cu" | "In26.Cu" | "In27.Cu" | "In28.Cu" | "In29.Cu" | "In30.Cu" | "B.Cu" | "B.Adhes" | "F.Adhes" | "B.Paste" | "F.Paste" | "B.SilkS" | "F.SilkS" | "B.Mask" | "F.Mask" | "Dwgs.User" | "Cmts.User" | "Eco1.User" | "Eco2.User" | "Edge.Cuts" | "Margin" | "F.CrtYd" | "B.CrtYd" | "F.Fab" | "B.Fab";
        private _layerIds;
        static intersect(a: LSET, b: LSET): LSET;
        static union(a: LSET, b: LSET): LSET;
        constructor(...layerIds: Array<PCB_LAYER_ID>);
        [Symbol.iterator](): IterableIterator<PCB_LAYER_ID>;
        readonly length: number;
        add(...layerIds: Array<PCB_LAYER_ID>): this;
        has(id: PCB_LAYER_ID): boolean;
        delete(id: PCB_LAYER_ID): this;
        is(o: LSET): boolean;
        entries(): PCB_LAYER_ID[];
        union(o: LSET): this;
        intersect(o: LSET): this;
        except(o: LSET): this;
    }
    class ViaDimension {
        diameter: number;
        drill: number;
        constructor(diameter: number, drill: number);
        is(o: ViaDimension): boolean;
        lessThan(o: ViaDimension): boolean;
    }
    class BoardDesignSetting {
        viasDimenstionsList: Array<ViaDimension>;
        trackWidthList: Array<number>;
        netClasses: NetClasses;
        microViaAllowed: boolean;
        blindBuriedViaAllowed: boolean;
        currentViaType: ViaType;
        useConnectedTrackWidth: boolean;
        drawSegmentWidth: number;
        edgeSegmentWidth: number;
        pcbTextWidth: number;
        pcbTextSize: number;
        trackMinWidth: number;
        viasMinSize: number;
        viasMinDrill: number;
        microViasMinSize: number;
        microViasMinDrill: number;
        solderMaskMargin: number;
        solderMaskMinWidth: number;
        solderPasteMargin: number;
        solderPasteMarginRatio: number;
        moduleSegmentWidth: number;
        moduleTextSize: number;
        moduleTextWidth: number;
        refDefaultText: string;
        refDefaultVisibility: boolean;
        refDefaultlayer: boolean;
        valueDefaultText: string;
        valueDefaultVisibility: string;
        valueDefaultlayer: number;
        auxOrigin: Point;
        gridOrigin: Point;
        viaSizeIndex: number;
        trackWidthIndex: number;
        useCustomTrackVia: boolean;
        customTrackWidth: number;
        customViaSize: ViaDimension;
        copperLayerCount: number;
        enabledLayers: LSET;
        visibleLayers: LSET;
        visibleElements: number;
        boardThickness: number;
        currentNetClassName: string;
    }
    enum ViaType {
        VIA_BLIND_BURIED = 0,
        VIA_THROUGH = 1,
        VIA_MICROVIA = 2,
    }
    class NetClasses {
        default: NetClass;
        netClasses: {
            [key: string]: NetClass;
        };
        add(nc: NetClass): void;
    }
    class NetClass {
        name: string;
        description: string;
        members: Array<string>;
        clearance: number;
        trackWidth: number;
        viaDia: number;
        viaDrill: number;
        microViaDia: number;
        microViaDrill: number;
        diffPairWidth: number;
        diffPairGap: number;
        constructor(name?: string);
    }
    abstract class BoardItem {
        pos: Point;
        layer: number;
        tstamp: number;
        status: number;
        attributes: number;
    }
    class NetInfoItem extends BoardItem {
        netCode: number;
        name: string;
        shortName: string;
        netClassName: string;
        netClass: NetClass;
        board: Board;
        constructor(parent: Board, name: string, netCode?: number);
    }
    enum Shape {
        SEGMENT = 0,
        RECT = 1,
        ARC = 2,
        CIRCLE = 3,
        POLYGON = 4,
        CURVE = 5,
        LAST = 6,
    }
    class DrawSegment extends BoardItem {
        lineWidth: number;
        start: Point;
        end: Point;
        shape: Shape;
        type: number;
        angle: number;
        bezierC1: Point;
        bezierC2: Point;
        bezierPoints: Array<Point>;
        polyPoints: Array<Point>;
    }
    class EdgeModule extends DrawSegment {
    }
    class Text extends BoardItem {
        text: string;
        angle: number;
        size: number;
        lineWidth: number;
        bold: boolean;
        italic: boolean;
        mirror: boolean;
        hjustify: TextHjustify;
        vjustify: TextVjustify;
        visibility: boolean;
    }
    enum Unit {
        MM = "mm",
        INCH = "inch",
    }
    class Dimension extends BoardItem {
        lineWidth: number;
        shape: number;
        unit: Unit;
        value: number;
        height: number;
        text: Text;
        crossBarO: Point;
        crossBarF: Point;
        featureLineGO: Point;
        featureLineGF: Point;
        featureLineDO: Point;
        featureLineDF: Point;
        arrowD1F: Point;
        arrowD2F: Point;
        arrowG1F: Point;
        arrowG2F: Point;
    }
    class Module extends BoardItem {
        fpid: LibId;
        locked: boolean;
        placed: boolean;
        lastEditTime: number;
        orientation: number;
        description: string;
        keywords: string;
        path: string;
        placementCost90: number;
        placementCost180: number;
        solderMaskMargin: number;
        solderPasteMargin: number;
        solderPasteRatio: number;
        clearance: number;
        zoneConnection: number;
        thermalWidth: number;
        thermalGap: number;
        graphics: Array<BoardItem>;
        reference: TextModule;
        value: TextModule;
        pads: Array<Pad>;
        model3D: any;
    }
    class LibId {
        nickname: string;
        static parse(id: string): LibId;
        constructor(nickname: string, itemname: string, revision: string);
    }
    class Pad {
        pos: Point;
        name: string;
        shape: PadShape;
        drillShape: PadDrillShape;
        attribute: PadAttr;
        drillSize: Size;
        size: Size;
        orientation: number;
        delta: Size;
        offset: Point;
        layers: LSET;
        netCode: NetInfoItem;
        padToDieLength: number;
        solderMaskMargin: number;
        solderPasteMargin: number;
        solderPasteRatio: number;
        clearance: number;
        zoneConnection: number;
        thermalWidth: number;
        thermalGap: number;
        roundRectRatio: number;
    }
    enum PadShape {
        CIRCLE = 0,
        RECT = 1,
        OVAL = 2,
        TRAPEZOID = 3,
        ROUNDRECT = 4,
    }
    enum PadAttr {
        STANDARD = "STANDARD",
        SMD = "SMD",
        CONN = "CONN",
        HOLE_NOT_PLATED = "HOLE_NOT_PLATED",
    }
    class TextModule extends Text {
        type: TextModuleType;
    }
    enum TextModuleType {
        reference = "reference",
        value = "value",
        user = "user",
    }
    enum MODULE_ATTR {
        MOD_DEFAULT = 0,
        MOD_CMS = 1,
        MOD_VIRTUAL = 2,
    }
    class Track extends BoardItem {
        start: Point;
        end: Point;
        net: NetInfoItem;
        width: number;
    }
    enum ViaType {
        THROUGH = 3,
        BLIND_BURIED = 2,
        MICROVIA = 1,
        NOT_DEFINED = 0,
    }
    class Via extends BoardItem {
        viaType: ViaType;
        start: Point;
        end: Point;
        width: number;
        drill: number;
        layer1: PCB_LAYER_ID;
        layer2: PCB_LAYER_ID;
        net: NetInfoItem;
    }
    class Zone extends BoardItem {
        priority: number;
        netCode: NetInfoItem;
        hatchStyle: HatchStyle;
        hatchPitch: number;
        padConnection: PadConnection;
        zoneClearance: number;
        minThickness: number;
        filled: boolean;
        fillMode: 0 | 1;
        arcSegumentCount: number;
        thermalReliefGap: number;
        thermalReliefCopperBridge: number;
        cornerSmoothingType: CornerSmoothingType;
        cornerRadius: number;
        keepout: boolean;
        doNotAllowTracks: boolean;
        doNotAllowVias: boolean;
        doNotAllowCopperPour: boolean;
        polygons: Array<Array<Point>>;
        filledPolygons: Array<Array<Point>>;
        fillSegments: Array<Array<Segment>>;
        setHatch(hashStyle: HatchStyle, hatchPitch: number): void;
    }
    enum HatchStyle {
        NO_HATCH = 0,
        DIAGONAL_EDGE = 1,
        DIAGONAL_FULL = 2,
    }
    enum PadConnection {
        CONN_FULL = 0,
        CONN_NONE = 1,
        CONN_THT_THERMAL = 2,
    }
    enum CornerSmoothingType {
        NONE = 0,
        CHAMFER = 1,
        FILLET = 2,
    }
    class Segment {
        start: Point;
        end: Point;
        constructor(start: Point, end: Point);
    }
    class Target extends BoardItem {
        shape: 0 | 1;
        size: number;
        lineWidth: number;
    }
}
