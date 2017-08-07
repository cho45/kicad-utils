"use strict";
//#!tsc && NODE_PATH=dist/src node dist/sketch3.js 
Object.defineProperty(exports, "__esModule", { value: true });
const kicad_common_1 = require("./kicad_common");
const kicad_pcb_token_1 = require("./kicad_pcb_token");
// pcbnew/pcb_parser.cpp 
class PCB {
    constructor() {
        this.layerIndices = {};
        this.layerMasks = {};
        this.netCodes = {};
        this.pos = 0;
        this.tokens = [];
        for (let layer = 0; layer < PCB_LAYER_ID.PCB_LAYER_ID_COUNT; layer++) {
            const name = LSET.Name(layer);
            this.layerIndices[name] = layer;
            this.layerMasks[name] = new LSET(layer);
        }
        this.layerMasks["*.Cu"] = LSET.AllCuMask();
        this.layerMasks["F&B.Cu"] = new LSET(PCB_LAYER_ID.F_Cu, PCB_LAYER_ID.B_Cu);
        this.layerMasks["*.Adhes"] = new LSET(PCB_LAYER_ID.B_Adhes, PCB_LAYER_ID.F_Adhes);
        this.layerMasks["*.Paste"] = new LSET(PCB_LAYER_ID.B_Paste, PCB_LAYER_ID.F_Paste);
        this.layerMasks["*.Mask"] = new LSET(PCB_LAYER_ID.B_Mask, PCB_LAYER_ID.F_Mask);
        this.layerMasks["*.SilkS"] = new LSET(PCB_LAYER_ID.B_SilkS, PCB_LAYER_ID.F_SilkS);
        this.layerMasks["*.Fab"] = new LSET(PCB_LAYER_ID.B_Fab, PCB_LAYER_ID.F_Fab);
        this.layerMasks["*.CrtYd"] = new LSET(PCB_LAYER_ID.B_CrtYd, PCB_LAYER_ID.F_CrtYd);
        for (let i = 1; i <= 14; i++) {
            const key = `Inner${i}.Cu`;
            this.layerMasks[key] = new LSET(PCB_LAYER_ID.In15_Cu - i);
        }
    }
    static load(content) {
        const lines = content.split(/\r?\n/);
        const tokens = [];
        // lexer
        for (let i = 0, len = lines.length; i < len; i++) {
            // remove comment
            const line = lines[i].replace(/#.*$/, '');
            tokens.push(...line.split(/([()]|"(?:\\"|[^"])*")|\s+/).filter((t) => !!t).map((t) => new kicad_pcb_token_1.Token(t, i + 1)));
        }
        const pcb = new this();
        pcb.pos = 0;
        pcb.tokens = tokens;
        pcb.parse();
        return pcb;
    }
    curTok() {
        return this.tokens[this.pos];
    }
    curText() {
        const str = this.tokens[this.pos].token;
        if (str.startsWith('"') && str.endsWith('"')) {
            return str.slice(1, -1);
        }
        return str;
    }
    nextTok() {
        return this.tokens[++this.pos];
    }
    needLEFT() {
        if (!this.nextTok().is(kicad_pcb_token_1.Token.LEFT)) {
            const token = this.curTok();
            throw "expect ( but found" + token.token + ' at line ' + token.line;
        }
    }
    needRIGHT() {
        if (!this.nextTok().is(kicad_pcb_token_1.Token.RIGHT)) {
            const token = this.curTok();
            throw "expect ) but found" + token.token + ' at line ' + token.line;
        }
    }
    needNUMBER(expected = 'number') {
        if (!this.nextTok().isNUMBER()) {
            const token = this.curTok();
            throw "expect " + expected + " but found " + token.token + ' at line ' + token.line;
        }
        return this.curTok();
    }
    needSYMBOL(expected = 'symbol') {
        if (!this.nextTok().isSYMBOL()) {
            const token = this.curTok();
            throw "expect " + expected + " but found " + token.token + ' at line ' + token.line;
        }
        return this.curTok();
    }
    needSYMBOLorNUMBER(expected = "symbol|number") {
        const token = this.nextTok();
        if (!token.isNUMBER() && !token.isSYMBOL()) {
            throw "expect " + expected + " but found " + token.token + ' at line ' + token.line;
        }
        return token;
    }
    expecting(got, ...expected) {
        if (!expected.some((e) => e.is(got))) {
            throw "expecting " + expected + ' but ' + got + " at line " + got.line;
        }
    }
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
    parseInt(expected) {
        if (expected) {
            this.needNUMBER(expected);
        }
        return parseInt(this.curText(), 10);
    }
    parseFloat(expected) {
        if (expected) {
            this.needNUMBER(expected);
        }
        return parseFloat(this.curText());
    }
    parseBoardUnits(expected) {
        return kicad_common_1.MM2MIL(this.parseFloat(expected));
    }
    // unify interface to parseInt
    parseHex(expected) {
        if (expected) {
            // XXX
            this.nextTok();
        }
        return parseInt(this.curText(), 16);
    }
    // unify interface to parseInt
    parseBool(expected) {
        if (expected) {
            this.nextTok();
        }
        const token = this.curTok();
        if (token.is(kicad_pcb_token_1.Token.yes)) {
            return true;
        }
        else if (token.is(kicad_pcb_token_1.Token.no)) {
            return false;
        }
        else {
            this.expecting(token, kicad_pcb_token_1.Token.yes, kicad_pcb_token_1.Token.no);
        }
    }
    parseXY(expected) {
        if (!this.curTok().is(kicad_pcb_token_1.Token.LEFT)) {
            this.needLEFT();
        }
        let token = this.nextTok();
        this.expecting(token, kicad_pcb_token_1.Token.xy);
        const x = this.parseBoardUnits(expected + '->x');
        const y = this.parseBoardUnits(expected + '->y');
        this.needRIGHT();
        return new kicad_common_1.Point(x, y);
    }
    parseBoardItemLayer(expected) {
        this.nextTok();
        return this.layerIndices[this.curText()];
    }
    parse() {
        let token = this.curTok();
        this.expecting(token, kicad_pcb_token_1.Token.LEFT);
        token = this.nextTok();
        if (token.is(kicad_pcb_token_1.Token.kicad_pcb)) {
            this.board = new Board();
            this.parseBoard();
        }
        else if (token.is(kicad_pcb_token_1.Token.module)) {
            this.parseModule();
        }
        else {
            throw 'unknown token ' + token;
        }
    }
    parseBoard() {
        console.log('parseBoard');
        this.parseHeader();
        for (let token = this.nextTok(); token && !token.is(kicad_pcb_token_1.Token.RIGHT); token = this.nextTok()) {
            this.expecting(token, kicad_pcb_token_1.Token.LEFT);
            token = this.nextTok();
            console.log(token);
            if (token.is(kicad_pcb_token_1.Token.general)) {
                this.parseGeneralSection();
            }
            else if (token.is(kicad_pcb_token_1.Token.page)) {
                this.parsePageSection();
            }
            else if (token.is(kicad_pcb_token_1.Token.title_block)) {
                this.skipSection();
            }
            else if (token.is(kicad_pcb_token_1.Token.layers)) {
                this.parseLayersSection();
            }
            else if (token.is(kicad_pcb_token_1.Token.setup)) {
                this.parseSetupSection();
            }
            else if (token.is(kicad_pcb_token_1.Token.net)) {
                this.parseNetSection();
            }
            else if (token.is(kicad_pcb_token_1.Token.net_class)) {
                this.parseNetClassSection();
            }
            else if (token.is(kicad_pcb_token_1.Token.gr_arc) ||
                token.is(kicad_pcb_token_1.Token.gr_circle) ||
                token.is(kicad_pcb_token_1.Token.gr_curve) ||
                token.is(kicad_pcb_token_1.Token.gr_line) ||
                token.is(kicad_pcb_token_1.Token.gr_poly)) {
                this.parseDrawSegmentSection();
            }
            else if (token.is(kicad_pcb_token_1.Token.gr_text)) {
                this.parseTextSection();
            }
            else if (token.is(kicad_pcb_token_1.Token.dimension)) {
                this.parseDimensionSection();
            }
            else if (token.is(kicad_pcb_token_1.Token.module)) {
                this.parseModuleSection();
            }
            else if (token.is(kicad_pcb_token_1.Token.segment)) {
                this.parseSegmentSection();
            }
            else if (token.is(kicad_pcb_token_1.Token.via)) {
                this.parseViaSection();
            }
            else if (token.is(kicad_pcb_token_1.Token.zone)) {
                this.parseZoneSection();
            }
            else if (token.is(kicad_pcb_token_1.Token.target)) {
                this.parseTargetSection();
            }
            else {
                throw "unknown token " + token + ' at line ' + token.line;
            }
        }
    }
    parseHeader() {
        this.needLEFT();
        let token = this.nextTok();
        if (token.is(kicad_pcb_token_1.Token.version)) {
            const version = this.parseInt("version");
            console.log('version', version);
            this.needRIGHT();
            // (host pcbnew 4.0.2-stable)
            this.needLEFT();
            this.needSYMBOL();
            this.needSYMBOL();
            this.needSYMBOL();
            this.needRIGHT();
        }
        else {
            this.needSYMBOL();
            this.needSYMBOL();
            this.needRIGHT();
        }
    }
    parseModule() {
        console.log('parseModule');
    }
    parseGeneralSection() {
        for (let token = this.nextTok(); token && !token.is(kicad_pcb_token_1.Token.RIGHT); token = this.nextTok()) {
            this.expecting(token, kicad_pcb_token_1.Token.LEFT);
            if (token.is(kicad_pcb_token_1.Token.thickness)) {
                this.board.boardDesignSetting.boardThickness = this.parseInt("board thickness");
                this.needRIGHT();
            }
            else if (token.is(kicad_pcb_token_1.Token.nets)) {
                this.parseInt("nets count");
                this.needRIGHT();
            }
            else {
                this.skipSection();
            }
        }
    }
    parsePageSection() {
        const pageType = this.needSYMBOL().toString();
        if (pageType === 'User') {
            const width = this.parseFloat(); // unit=mm
            const height = this.parseFloat(); // unit=mm
            console.log('custom', width, height);
            this.board.pageInfo.setPageType('User');
            this.board.pageInfo.width = width;
            this.board.pageInfo.height = height;
        }
        else {
            this.board.pageInfo.setPageType('User');
        }
        let token = this.nextTok();
        if (token.is(kicad_pcb_token_1.Token.portrait)) {
            // set portrate mode
            this.board.pageInfo.setPortrait(true);
        }
        else if (token.is(kicad_pcb_token_1.Token.RIGHT)) {
            // done
        }
        else {
            this.expecting(token, kicad_pcb_token_1.Token.portrait, kicad_pcb_token_1.Token.RIGHT);
        }
    }
    parseLayersSection() {
        const cuLayers = [];
        let layer, token;
        for (token = this.nextTok(); token && !token.is(kicad_pcb_token_1.Token.RIGHT); token = this.nextTok()) {
            layer = this.parseLayer();
            if (layer.type === LayerType.UNDEFINED)
                break;
            cuLayers.push(layer);
        }
        if (cuLayers.length) {
            cuLayers[cuLayers.length - 1].number = PCB_LAYER_ID.B_Cu;
            for (let i = 0; i < cuLayers.length - 1; i++) {
                cuLayers[i].number = i;
            }
            for (let layer of cuLayers) {
                this.board.enabledLayers.push(layer.number);
                if (layer.visible) {
                    this.board.visibleLayers.push(layer.number);
                }
                this.board.layerDescr[layer.number] = layer;
                this.layerIndices[layer.name] = layer.number;
                this.layerMasks[layer.name] = new LSET(layer.number);
            }
            this.board.copperLayerCount = cuLayers.length;
        }
        if (!layer)
            throw "layers is invalid";
        while (!token.is(kicad_pcb_token_1.Token.RIGHT)) {
            layer.number = this.layerIndices[layer.name];
            if (layer.number === undefined) {
                throw "layer is not in fixed layer hash";
            }
            this.board.enabledLayers.push(layer.number);
            if (layer.visible) {
                this.board.visibleLayers.push(layer.number);
            }
            this.board.layerDescr[layer.number] = layer;
            let token = this.nextTok();
            if (!token.is(kicad_pcb_token_1.Token.LEFT))
                break;
            layer = this.parseLayer();
        }
    }
    parseLayer() {
        this.expecting(this.curTok(), kicad_pcb_token_1.Token.LEFT);
        const num = this.parseInt("layer number");
        this.needSYMBOLorNUMBER();
        const name = this.curText();
        this.needSYMBOL();
        const type = this.curText();
        let visible = true;
        let token = this.nextTok();
        if (token.is(kicad_pcb_token_1.Token.hide)) {
            visible = false;
        }
        else if (token.is(kicad_pcb_token_1.Token.RIGHT)) {
            // done
        }
        else {
            this.expecting(token, kicad_pcb_token_1.Token.hide, kicad_pcb_token_1.Token.RIGHT);
        }
        return new Layer(name, type, num, visible);
    }
    parseSetupSection() {
        // TODO baordDesignSetting
        this.skipSection();
    }
    parseNetSection() {
        const netCode = this.parseInt("net number");
        this.needSYMBOLorNUMBER();
        const name = this.curText();
        this.needRIGHT();
        const net = new NetInfoItem(this.board, name, netCode);
        this.board.netInfos.push(net);
        this.netCodes[netCode] = net.netClass;
    }
    parseNetClassSection() {
        const nc = new NetClass();
        this.needSYMBOLorNUMBER();
        nc.name = this.curText();
        this.needSYMBOL();
        nc.description = this.curText();
        for (let token = this.nextTok(); token && !token.is(kicad_pcb_token_1.Token.RIGHT); token = this.nextTok()) {
            this.expecting(token, kicad_pcb_token_1.Token.LEFT);
            token = this.nextTok();
            if (token.is(kicad_pcb_token_1.Token.clearance)) {
                nc.clearance = this.parseBoardUnits(kicad_pcb_token_1.Token.clearance.toString());
            }
            else if (token.is(kicad_pcb_token_1.Token.trace_width)) {
                nc.trackWidth = this.parseBoardUnits(kicad_pcb_token_1.Token.trace_width.toString());
            }
            else if (token.is(kicad_pcb_token_1.Token.via_dia)) {
                nc.viaDia = this.parseBoardUnits(kicad_pcb_token_1.Token.via_dia.toString());
            }
            else if (token.is(kicad_pcb_token_1.Token.via_drill)) {
                nc.viaDrill = this.parseBoardUnits(kicad_pcb_token_1.Token.via_drill.toString());
            }
            else if (token.is(kicad_pcb_token_1.Token.uvia_dia)) {
                nc.microViaDia = this.parseBoardUnits(kicad_pcb_token_1.Token.uvia_dia.toString());
            }
            else if (token.is(kicad_pcb_token_1.Token.uvia_drill)) {
                nc.microViaDrill = this.parseBoardUnits(kicad_pcb_token_1.Token.uvia_drill.toString());
            }
            else if (token.is(kicad_pcb_token_1.Token.diff_pair_width)) {
                nc.diffPairWidth = this.parseBoardUnits(kicad_pcb_token_1.Token.diff_pair_width.toString());
            }
            else if (token.is(kicad_pcb_token_1.Token.diff_pair_gap)) {
                nc.diffPairGap = this.parseBoardUnits(kicad_pcb_token_1.Token.diff_pair_gap.toString());
            }
            else if (token.is(kicad_pcb_token_1.Token.add_net)) {
                this.needSYMBOLorNUMBER();
                nc.members.push(this.curText());
            }
            else {
                this.expecting(token, kicad_pcb_token_1.Token.clearance, kicad_pcb_token_1.Token.trace_width, kicad_pcb_token_1.Token.via_dia, kicad_pcb_token_1.Token.via_drill, kicad_pcb_token_1.Token.uvia_dia, kicad_pcb_token_1.Token.uvia_drill, kicad_pcb_token_1.Token.diff_pair_width, kicad_pcb_token_1.Token.diff_pair_gap, kicad_pcb_token_1.Token.add_net);
            }
            this.needRIGHT();
        }
        this.board.boardDesignSetting.netClasses.add(nc);
    }
    parseDrawSegmentSection() {
        let token = this.curTok();
        const segment = new DrawSegment();
        if (token.is(kicad_pcb_token_1.Token.gr_arc)) {
            segment.shape = Shape.ARC;
            this.needLEFT();
            {
                token = this.nextTok();
                this.expecting(token, kicad_pcb_token_1.Token.start, kicad_pcb_token_1.Token.center);
                const x = this.parseBoardUnits("x");
                const y = this.parseBoardUnits("y");
                segment.start = new kicad_common_1.Point(x, y);
                this.needRIGHT();
                this.needLEFT();
            }
            {
                token = this.nextTok();
                this.expecting(token, kicad_pcb_token_1.Token.end);
                const x = this.parseBoardUnits("x");
                const y = this.parseBoardUnits("y");
                segment.end = new kicad_common_1.Point(x, y);
                this.needRIGHT();
            }
            ;
        }
        else if (token.is(kicad_pcb_token_1.Token.gr_circle)) {
            segment.shape = Shape.CIRCLE;
            this.needLEFT();
            {
                token = this.nextTok();
                this.expecting(token, kicad_pcb_token_1.Token.center);
                const x = this.parseBoardUnits("x");
                const y = this.parseBoardUnits("y");
                segment.start = new kicad_common_1.Point(x, y);
                this.needRIGHT();
                this.needLEFT();
            }
            {
                token = this.nextTok();
                this.expecting(token, kicad_pcb_token_1.Token.end);
                const x = this.parseBoardUnits("x");
                const y = this.parseBoardUnits("y");
                segment.end = new kicad_common_1.Point(x, y);
                this.needRIGHT();
            }
            ;
        }
        else if (token.is(kicad_pcb_token_1.Token.gr_curve)) {
            segment.shape = Shape.CURVE;
            this.needLEFT();
            token = this.nextTok();
            this.expecting(token, kicad_pcb_token_1.Token.pts);
            segment.start = this.parseXY("start");
            segment.bezierC1 = this.parseXY("bezierC1");
            segment.bezierC2 = this.parseXY("bezierC2");
            segment.end = this.parseXY("end");
            this.needRIGHT();
        }
        else if (token.is(kicad_pcb_token_1.Token.gr_line)) {
            segment.shape = Shape.SEGMENT;
            this.needLEFT();
            {
                token = this.nextTok();
                this.expecting(token, kicad_pcb_token_1.Token.start);
                const x = this.parseBoardUnits("x");
                const y = this.parseBoardUnits("y");
                segment.start = new kicad_common_1.Point(x, y);
                this.needRIGHT();
                this.needLEFT();
            }
            {
                token = this.nextTok();
                this.expecting(token, kicad_pcb_token_1.Token.end);
                const x = this.parseBoardUnits("x");
                const y = this.parseBoardUnits("y");
                segment.end = new kicad_common_1.Point(x, y);
                this.needRIGHT();
            }
            ;
        }
        else if (token.is(kicad_pcb_token_1.Token.gr_poly)) {
            segment.shape = Shape.POLYGON;
            this.needLEFT();
            token = this.nextTok();
            this.expecting(token, kicad_pcb_token_1.Token.pts);
            while (!kicad_pcb_token_1.Token.RIGHT.is(token = this.nextTok())) {
                segment.polyPoints.push(this.parseXY("polypoint"));
            }
        }
        else {
            this.expecting(token, kicad_pcb_token_1.Token.gr_arc, kicad_pcb_token_1.Token.gr_circle, kicad_pcb_token_1.Token.gr_curve, kicad_pcb_token_1.Token.gr_line, kicad_pcb_token_1.Token.gr_poly);
        }
        for (let token = this.nextTok(); token && !token.is(kicad_pcb_token_1.Token.RIGHT); token = this.nextTok()) {
            this.expecting(token, kicad_pcb_token_1.Token.LEFT);
            token = this.nextTok();
            if (token.is(kicad_pcb_token_1.Token.angle)) {
                segment.angle = this.parseFloat("angle") * 10;
            }
            else if (token.is(kicad_pcb_token_1.Token.layer)) {
                segment.layer = this.parseBoardItemLayer("layer");
            }
            else if (token.is(kicad_pcb_token_1.Token.width)) {
                segment.lineWidth = this.parseBoardUnits(kicad_pcb_token_1.Token.width.toString());
            }
            else if (token.is(kicad_pcb_token_1.Token.tstamp)) {
                segment.tstamp = this.parseHex("tstamp");
            }
            else if (token.is(kicad_pcb_token_1.Token.status)) {
                segment.status = this.parseHex("status");
            }
            else {
                this.expecting(token, kicad_pcb_token_1.Token.angle, kicad_pcb_token_1.Token.layer, kicad_pcb_token_1.Token.width, kicad_pcb_token_1.Token.tstamp, kicad_pcb_token_1.Token.status);
            }
            this.needRIGHT();
        }
        this.board.drawSegments.push(segment);
    }
    parseTextSection() {
        this.skipSection();
    }
    parseDimensionSection() {
        this.skipSection();
    }
    parseModuleSection() {
        this.skipSection();
    }
    parseSegmentSection() {
        this.skipSection();
    }
    parseViaSection() {
        this.skipSection();
    }
    parseZoneSection() {
        this.skipSection();
    }
    parseTargetSection() {
        this.skipSection();
    }
    skipSection() {
        let token;
        for (let depth = 1; depth > 0;) {
            token = this.nextTok();
            if (token.is(kicad_pcb_token_1.Token.LEFT)) {
                depth++;
            }
            else if (token.is(kicad_pcb_token_1.Token.RIGHT)) {
                depth--;
            }
            else {
                // skip
            }
        }
    }
}
exports.PCB = PCB;
var LayerType;
(function (LayerType) {
    LayerType["SIGNAL"] = "signal";
    LayerType["POWER"] = "power";
    LayerType["MIXED"] = "mixed";
    LayerType["JUMPER"] = "jumper";
    LayerType["UNDEFINED"] = "undefined";
})(LayerType = exports.LayerType || (exports.LayerType = {}));
class Layer {
    constructor(name, type, number, visible) {
        this.name = name;
        this.type = type;
        this.number = number;
        this.visible = visible;
        if (type !== LayerType.SIGNAL &&
            type !== LayerType.POWER &&
            type !== LayerType.MIXED &&
            type !== LayerType.JUMPER) {
            this.type = LayerType.UNDEFINED;
        }
    }
}
exports.Layer = Layer;
class Board {
    constructor() {
        this.filename = "";
        this.layers = [];
        this.boardDesignSetting = new BoardDesignSetting();
        this.pageInfo = PageInfo.A3;
        this.netInfos = [];
        this.drawSegments = [];
        this.copperLayerCount = 0;
        this.enabledLayers = [];
        this.visibleLayers = [];
        this.layerDescr = {};
    }
}
exports.Board = Board;
class PageInfo {
    constructor(pageType, portrait = false, width, height) {
        this.portrait = false;
        this.width = width || 0;
        this.height = height || 0;
        if (!width && !height) {
            this.setPageType(pageType);
        }
        this.setPortrait(portrait);
    }
    setPageType(pageType) {
        console.log(PageInfo.PAGE_TYPES);
        const page = PageInfo.PAGE_TYPES.find((i) => i.pageType === pageType);
        Object.assign(this, page);
    }
    setPortrait(portrait) {
        if (this.portrait != portrait) {
            [this.width, this.height] = [this.height, this.width];
        }
    }
}
PageInfo.A4 = new PageInfo("A4", false, kicad_common_1.MM2MIL(297), kicad_common_1.MM2MIL(210));
PageInfo.A3 = new PageInfo("A3", false, kicad_common_1.MM2MIL(420), kicad_common_1.MM2MIL(297));
PageInfo.A2 = new PageInfo("A2", false, kicad_common_1.MM2MIL(594), kicad_common_1.MM2MIL(420));
PageInfo.A1 = new PageInfo("A1", false, kicad_common_1.MM2MIL(841), kicad_common_1.MM2MIL(594));
PageInfo.A0 = new PageInfo("A0", false, kicad_common_1.MM2MIL(1189), kicad_common_1.MM2MIL(841));
PageInfo.A = new PageInfo("A", false, 11000, 8500);
PageInfo.B = new PageInfo("B", false, 17000, 11000);
PageInfo.C = new PageInfo("C", false, 22000, 17000);
PageInfo.D = new PageInfo("D", false, 34000, 22000);
PageInfo.E = new PageInfo("E", false, 44000, 34000);
PageInfo.GERBER = new PageInfo("GERBER", false, 32000, 32000);
PageInfo.User = new PageInfo("User", false, 17000, 11000);
PageInfo.USLetter = new PageInfo("USLetter", false, 11000, 8500);
PageInfo.USLegal = new PageInfo("USLegal", false, 14000, 8500);
PageInfo.USLedger = new PageInfo("USLedger", false, 17000, 11000);
PageInfo.PAGE_TYPES = [
    PageInfo.A4,
    PageInfo.A3,
    PageInfo.A2,
    PageInfo.A1,
    PageInfo.A0,
    PageInfo.A,
    PageInfo.B,
    PageInfo.C,
    PageInfo.D,
    PageInfo.E,
    PageInfo.GERBER,
    PageInfo.User,
    PageInfo.USLetter,
    PageInfo.USLegal,
    PageInfo.USLedger,
];
var PCB_LAYER_ID;
(function (PCB_LAYER_ID) {
    PCB_LAYER_ID[PCB_LAYER_ID["UNDEFINED_LAYER"] = -1] = "UNDEFINED_LAYER";
    PCB_LAYER_ID[PCB_LAYER_ID["UNSELECTED_LAYER"] = -2] = "UNSELECTED_LAYER";
    PCB_LAYER_ID[PCB_LAYER_ID["F_Cu"] = 0] = "F_Cu";
    PCB_LAYER_ID[PCB_LAYER_ID["In1_Cu"] = 1] = "In1_Cu";
    PCB_LAYER_ID[PCB_LAYER_ID["In2_Cu"] = 2] = "In2_Cu";
    PCB_LAYER_ID[PCB_LAYER_ID["In3_Cu"] = 3] = "In3_Cu";
    PCB_LAYER_ID[PCB_LAYER_ID["In4_Cu"] = 4] = "In4_Cu";
    PCB_LAYER_ID[PCB_LAYER_ID["In5_Cu"] = 5] = "In5_Cu";
    PCB_LAYER_ID[PCB_LAYER_ID["In6_Cu"] = 6] = "In6_Cu";
    PCB_LAYER_ID[PCB_LAYER_ID["In7_Cu"] = 7] = "In7_Cu";
    PCB_LAYER_ID[PCB_LAYER_ID["In8_Cu"] = 8] = "In8_Cu";
    PCB_LAYER_ID[PCB_LAYER_ID["In9_Cu"] = 9] = "In9_Cu";
    PCB_LAYER_ID[PCB_LAYER_ID["In10_Cu"] = 10] = "In10_Cu";
    PCB_LAYER_ID[PCB_LAYER_ID["In11_Cu"] = 11] = "In11_Cu";
    PCB_LAYER_ID[PCB_LAYER_ID["In12_Cu"] = 12] = "In12_Cu";
    PCB_LAYER_ID[PCB_LAYER_ID["In13_Cu"] = 13] = "In13_Cu";
    PCB_LAYER_ID[PCB_LAYER_ID["In14_Cu"] = 14] = "In14_Cu";
    PCB_LAYER_ID[PCB_LAYER_ID["In15_Cu"] = 15] = "In15_Cu";
    PCB_LAYER_ID[PCB_LAYER_ID["In16_Cu"] = 16] = "In16_Cu";
    PCB_LAYER_ID[PCB_LAYER_ID["In17_Cu"] = 17] = "In17_Cu";
    PCB_LAYER_ID[PCB_LAYER_ID["In18_Cu"] = 18] = "In18_Cu";
    PCB_LAYER_ID[PCB_LAYER_ID["In19_Cu"] = 19] = "In19_Cu";
    PCB_LAYER_ID[PCB_LAYER_ID["In20_Cu"] = 20] = "In20_Cu";
    PCB_LAYER_ID[PCB_LAYER_ID["In21_Cu"] = 21] = "In21_Cu";
    PCB_LAYER_ID[PCB_LAYER_ID["In22_Cu"] = 22] = "In22_Cu";
    PCB_LAYER_ID[PCB_LAYER_ID["In23_Cu"] = 23] = "In23_Cu";
    PCB_LAYER_ID[PCB_LAYER_ID["In24_Cu"] = 24] = "In24_Cu";
    PCB_LAYER_ID[PCB_LAYER_ID["In25_Cu"] = 25] = "In25_Cu";
    PCB_LAYER_ID[PCB_LAYER_ID["In26_Cu"] = 26] = "In26_Cu";
    PCB_LAYER_ID[PCB_LAYER_ID["In27_Cu"] = 27] = "In27_Cu";
    PCB_LAYER_ID[PCB_LAYER_ID["In28_Cu"] = 28] = "In28_Cu";
    PCB_LAYER_ID[PCB_LAYER_ID["In29_Cu"] = 29] = "In29_Cu";
    PCB_LAYER_ID[PCB_LAYER_ID["In30_Cu"] = 30] = "In30_Cu";
    PCB_LAYER_ID[PCB_LAYER_ID["B_Cu"] = 31] = "B_Cu";
    PCB_LAYER_ID[PCB_LAYER_ID["B_Adhes"] = 32] = "B_Adhes";
    PCB_LAYER_ID[PCB_LAYER_ID["F_Adhes"] = 33] = "F_Adhes";
    PCB_LAYER_ID[PCB_LAYER_ID["B_Paste"] = 34] = "B_Paste";
    PCB_LAYER_ID[PCB_LAYER_ID["F_Paste"] = 35] = "F_Paste";
    PCB_LAYER_ID[PCB_LAYER_ID["B_SilkS"] = 36] = "B_SilkS";
    PCB_LAYER_ID[PCB_LAYER_ID["F_SilkS"] = 37] = "F_SilkS";
    PCB_LAYER_ID[PCB_LAYER_ID["B_Mask"] = 38] = "B_Mask";
    PCB_LAYER_ID[PCB_LAYER_ID["F_Mask"] = 39] = "F_Mask";
    PCB_LAYER_ID[PCB_LAYER_ID["Dwgs_User"] = 40] = "Dwgs_User";
    PCB_LAYER_ID[PCB_LAYER_ID["Cmts_User"] = 41] = "Cmts_User";
    PCB_LAYER_ID[PCB_LAYER_ID["Eco1_User"] = 42] = "Eco1_User";
    PCB_LAYER_ID[PCB_LAYER_ID["Eco2_User"] = 43] = "Eco2_User";
    PCB_LAYER_ID[PCB_LAYER_ID["Edge_Cuts"] = 44] = "Edge_Cuts";
    PCB_LAYER_ID[PCB_LAYER_ID["Margin"] = 45] = "Margin";
    PCB_LAYER_ID[PCB_LAYER_ID["B_CrtYd"] = 46] = "B_CrtYd";
    PCB_LAYER_ID[PCB_LAYER_ID["F_CrtYd"] = 47] = "F_CrtYd";
    PCB_LAYER_ID[PCB_LAYER_ID["B_Fab"] = 48] = "B_Fab";
    PCB_LAYER_ID[PCB_LAYER_ID["F_Fab"] = 49] = "F_Fab";
    PCB_LAYER_ID[PCB_LAYER_ID["PCB_LAYER_ID_COUNT"] = 50] = "PCB_LAYER_ID_COUNT";
})(PCB_LAYER_ID = exports.PCB_LAYER_ID || (exports.PCB_LAYER_ID = {}));
;
class LSET {
    constructor(...layerIds) {
        this.layerIds = [];
        this.layerIds = layerIds;
    }
    static AllCuMask(count) {
        return new LSET(PCB_LAYER_ID.In1_Cu, PCB_LAYER_ID.In2_Cu, PCB_LAYER_ID.In3_Cu, PCB_LAYER_ID.In4_Cu, PCB_LAYER_ID.In5_Cu, PCB_LAYER_ID.In6_Cu, PCB_LAYER_ID.In7_Cu, PCB_LAYER_ID.In8_Cu, PCB_LAYER_ID.In9_Cu, PCB_LAYER_ID.In10_Cu, PCB_LAYER_ID.In11_Cu, PCB_LAYER_ID.In12_Cu, PCB_LAYER_ID.In13_Cu, PCB_LAYER_ID.In14_Cu, PCB_LAYER_ID.In15_Cu, PCB_LAYER_ID.In16_Cu, PCB_LAYER_ID.In17_Cu, PCB_LAYER_ID.In18_Cu, PCB_LAYER_ID.In19_Cu, PCB_LAYER_ID.In20_Cu, PCB_LAYER_ID.In21_Cu, PCB_LAYER_ID.In22_Cu, PCB_LAYER_ID.In23_Cu, PCB_LAYER_ID.In24_Cu, PCB_LAYER_ID.In25_Cu, PCB_LAYER_ID.In26_Cu, PCB_LAYER_ID.In27_Cu, PCB_LAYER_ID.In28_Cu, PCB_LAYER_ID.In29_Cu, PCB_LAYER_ID.In30_Cu);
    }
    static Name(layerId) {
        switch (layerId) {
            case PCB_LAYER_ID.F_Cu: return ("F.Cu");
            case PCB_LAYER_ID.In1_Cu: return ("In1.Cu");
            case PCB_LAYER_ID.In2_Cu: return ("In2.Cu");
            case PCB_LAYER_ID.In3_Cu: return ("In3.Cu");
            case PCB_LAYER_ID.In4_Cu: return ("In4.Cu");
            case PCB_LAYER_ID.In5_Cu: return ("In5.Cu");
            case PCB_LAYER_ID.In6_Cu: return ("In6.Cu");
            case PCB_LAYER_ID.In7_Cu: return ("In7.Cu");
            case PCB_LAYER_ID.In8_Cu: return ("In8.Cu");
            case PCB_LAYER_ID.In9_Cu: return ("In9.Cu");
            case PCB_LAYER_ID.In10_Cu: return ("In10.Cu");
            case PCB_LAYER_ID.In11_Cu: return ("In11.Cu");
            case PCB_LAYER_ID.In12_Cu: return ("In12.Cu");
            case PCB_LAYER_ID.In13_Cu: return ("In13.Cu");
            case PCB_LAYER_ID.In14_Cu: return ("In14.Cu");
            case PCB_LAYER_ID.In15_Cu: return ("In15.Cu");
            case PCB_LAYER_ID.In16_Cu: return ("In16.Cu");
            case PCB_LAYER_ID.In17_Cu: return ("In17.Cu");
            case PCB_LAYER_ID.In18_Cu: return ("In18.Cu");
            case PCB_LAYER_ID.In19_Cu: return ("In19.Cu");
            case PCB_LAYER_ID.In20_Cu: return ("In20.Cu");
            case PCB_LAYER_ID.In21_Cu: return ("In21.Cu");
            case PCB_LAYER_ID.In22_Cu: return ("In22.Cu");
            case PCB_LAYER_ID.In23_Cu: return ("In23.Cu");
            case PCB_LAYER_ID.In24_Cu: return ("In24.Cu");
            case PCB_LAYER_ID.In25_Cu: return ("In25.Cu");
            case PCB_LAYER_ID.In26_Cu: return ("In26.Cu");
            case PCB_LAYER_ID.In27_Cu: return ("In27.Cu");
            case PCB_LAYER_ID.In28_Cu: return ("In28.Cu");
            case PCB_LAYER_ID.In29_Cu: return ("In29.Cu");
            case PCB_LAYER_ID.In30_Cu: return ("In30.Cu");
            case PCB_LAYER_ID.B_Cu: return ("B.Cu");
            // Technicals
            case PCB_LAYER_ID.B_Adhes: return ("B.Adhes");
            case PCB_LAYER_ID.F_Adhes: return ("F.Adhes");
            case PCB_LAYER_ID.B_Paste: return ("B.Paste");
            case PCB_LAYER_ID.F_Paste: return ("F.Paste");
            case PCB_LAYER_ID.B_SilkS: return ("B.SilkS");
            case PCB_LAYER_ID.F_SilkS: return ("F.SilkS");
            case PCB_LAYER_ID.B_Mask: return ("B.Mask");
            case PCB_LAYER_ID.F_Mask: return ("F.Mask");
            // Users
            case PCB_LAYER_ID.Dwgs_User: return ("Dwgs.User");
            case PCB_LAYER_ID.Cmts_User: return ("Cmts.User");
            case PCB_LAYER_ID.Eco1_User: return ("Eco1.User");
            case PCB_LAYER_ID.Eco2_User: return ("Eco2.User");
            case PCB_LAYER_ID.Edge_Cuts: return ("Edge.Cuts");
            case PCB_LAYER_ID.Margin: return ("Margin");
            // Footprint
            case PCB_LAYER_ID.F_CrtYd: return ("F.CrtYd");
            case PCB_LAYER_ID.B_CrtYd: return ("B.CrtYd");
            case PCB_LAYER_ID.F_Fab: return ("F.Fab");
            case PCB_LAYER_ID.B_Fab: return ("B.Fab");
            default:
                throw "layerId is out of range";
        }
    }
}
exports.LSET = LSET;
class ViaDimension {
    constructor(diameter, drill) {
        this.diameter = diameter;
        this.drill = drill;
    }
    is(o) {
        return this.diameter === o.diameter && this.drill === o.diameter;
    }
    lessThan(o) {
        if (this.diameter != o.diameter) {
            return this.diameter < o.diameter;
        }
        return this.drill < o.drill;
    }
}
class BoardDesignSetting {
    constructor() {
        this.viasDimenstionsList = [];
        this.trackWidthList = [];
        this.netClasses = new NetClasses();
    }
}
var ViaType;
(function (ViaType) {
    ViaType[ViaType["VIA_BLIND_BURIED"] = 0] = "VIA_BLIND_BURIED";
    ViaType[ViaType["VIA_THROUGH"] = 1] = "VIA_THROUGH";
    ViaType[ViaType["VIA_MICROVIA"] = 2] = "VIA_MICROVIA";
})(ViaType || (ViaType = {}));
class NetClasses {
    constructor() {
        this.netClasses = {};
    }
    add(nc) {
        if (nc.name === 'Default') {
            this.default = nc;
        }
        else {
            this.netClasses[nc.name] = nc;
        }
    }
}
class NetClass {
    constructor(name = "") {
        this.members = [];
    }
}
class BoardItem {
}
class NetInfoItem extends BoardItem {
    constructor(parent, name, netCode = -1) {
        super();
        this.board = parent;
        this.name = name;
        this.netCode = netCode;
    }
}
// T_STROKE
var Shape;
(function (Shape) {
    Shape[Shape["SEGMENT"] = 0] = "SEGMENT";
    Shape[Shape["RECT"] = 1] = "RECT";
    Shape[Shape["ARC"] = 2] = "ARC";
    Shape[Shape["CIRCLE"] = 3] = "CIRCLE";
    Shape[Shape["POLYGON"] = 4] = "POLYGON";
    Shape[Shape["CURVE"] = 5] = "CURVE";
    Shape[Shape["LAST"] = 6] = "LAST"; ///< last value for this list
})(Shape || (Shape = {}));
class DrawSegment extends BoardItem {
    constructor() {
        super(...arguments);
        this.bezierPoints = [];
        this.polyPoints = [];
    }
}
//# sourceMappingURL=kicad_pcb.js.map