"use strict";
//#!tsc && NODE_PATH=dist/src node dist/sketch3.js 
Object.defineProperty(exports, "__esModule", { value: true });
// based on:
// pcbnew/pcb_parser.cpp 
/*
 * This program source code file is part of kicad-utils
 * Copyright (C) 2017 cho45 <cho45@lowreal.net>.
 *
 * And this program source code file is imported from KiCad, a free EDA CAD application.
 *
 * Original Author Copyright:
 *
 * Copyright (C) 2015 Jean-Pierre Charras, jaen-pierre.charras@gipsa-lab.inpg.com
 * Copyright (C) 1992-2017 KiCad Developers, see KiCAD AUTHORS.txt for contributors.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, you may find one here:
 * http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 * or you may search the http://www.gnu.org website for the version 2 license,
 * or you may write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA
 */
/**
 *
 * IMPL is NOT COMPLETED!!
 */
const kicad_common_1 = require("./kicad_common");
const kicad_pcb_token_1 = require("./kicad_pcb_token");
const SEXPR_BOARD_FILE_VERSION = 20170123;
class PCB {
    constructor() {
        this.layerIndices = {};
        this.layerMasks = {};
        this.netCodes = {};
        this.tooRecent = false;
        this.requiredVersion = 0;
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
        return pcb.parse();
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
        const ret = parseFloat(this.curText());
        if (isNaN(ret)) {
            throw "expecting floating value but got " + this.curText();
        }
        return ret;
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
    parseBoardItemLayersAsMask(expected) {
        const layerMask = new LSET();
        for (let token = this.nextTok(); !kicad_pcb_token_1.Token.RIGHT.is(token); token = this.nextTok()) {
            const mask = this.layerMasks[this.curText()];
            layerMask.union(mask);
        }
        return layerMask;
    }
    parse() {
        let token = this.curTok();
        this.expecting(token, kicad_pcb_token_1.Token.LEFT);
        token = this.nextTok();
        if (token.is(kicad_pcb_token_1.Token.kicad_pcb)) {
            this.board = new Board();
            this.parseBoard();
            return this.board;
        }
        else if (token.is(kicad_pcb_token_1.Token.module)) {
            return this.parseModuleSection();
        }
        else {
            throw 'unknown token ' + token;
        }
    }
    parseBoard() {
        console.log('parseBoard');
        this.parseHeader();
        for (let token = this.nextTok(); kicad_pcb_token_1.Token.RIGHT.is(token); token = this.nextTok()) {
            this.expecting(token, kicad_pcb_token_1.Token.LEFT);
            token = this.nextTok();
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
                this.board.texts.push(this.parseTextSection());
            }
            else if (token.is(kicad_pcb_token_1.Token.dimension)) {
                this.board.dimensions.push(this.parseDimensionSection());
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
            const width = this.parseFloat("width"); // unit=mm
            const height = this.parseFloat("height"); // unit=mm
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
            {
                this.needLEFT();
                token = this.nextTok();
                this.expecting(token, kicad_pcb_token_1.Token.start, kicad_pcb_token_1.Token.center);
                const x = this.parseBoardUnits("x");
                const y = this.parseBoardUnits("y");
                segment.start = new kicad_common_1.Point(x, y);
                this.needRIGHT();
            }
            {
                this.needLEFT();
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
            {
                this.needLEFT();
                token = this.nextTok();
                this.expecting(token, kicad_pcb_token_1.Token.center);
                const x = this.parseBoardUnits("x");
                const y = this.parseBoardUnits("y");
                segment.start = new kicad_common_1.Point(x, y);
                this.needRIGHT();
            }
            {
                this.needLEFT();
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
            {
                this.needLEFT();
                token = this.nextTok();
                this.expecting(token, kicad_pcb_token_1.Token.start);
                const x = this.parseBoardUnits("x");
                const y = this.parseBoardUnits("y");
                segment.start = new kicad_common_1.Point(x, y);
                this.needRIGHT();
            }
            {
                this.needLEFT();
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
        const text = new Text();
        this.needSYMBOLorNUMBER();
        text.text = this.curText();
        this.needLEFT();
        let token = this.nextTok();
        this.expecting(token, kicad_pcb_token_1.Token.at);
        let x = this.parseBoardUnits('x');
        let y = this.parseBoardUnits('y');
        text.pos = new kicad_common_1.Point(x, y);
        token = this.nextTok();
        if (token.isNUMBER()) {
            text.angle = this.parseFloat() * 10;
            this.needRIGHT();
        }
        else {
            this.expecting(token, kicad_pcb_token_1.Token.RIGHT);
        }
        for (let token = this.nextTok(); !kicad_pcb_token_1.Token.RIGHT.is(token); token = this.nextTok()) {
            this.expecting(token, kicad_pcb_token_1.Token.LEFT);
            token = this.nextTok();
            if (token.is(kicad_pcb_token_1.Token.layer)) {
                text.layer = this.parseBoardItemLayer("layer");
                this.needRIGHT();
            }
            else if (token.is(kicad_pcb_token_1.Token.tstamp)) {
                text.tstamp = this.parseHex("tstamp");
                this.needRIGHT();
            }
            else if (token.is(kicad_pcb_token_1.Token.effects)) {
                this.parseEDATEXT(text);
            }
            else {
                this.expecting(token, kicad_pcb_token_1.Token.layer, kicad_pcb_token_1.Token.tstamp, kicad_pcb_token_1.Token.effects);
            }
        }
        return text;
    }
    parseTextModule() {
        const text = new TextModule();
        let token = this.nextTok();
        this.expecting(token, kicad_pcb_token_1.Token.reference, kicad_pcb_token_1.Token.value, kicad_pcb_token_1.Token.user);
        text.type = token.toString();
        this.needSYMBOLorNUMBER();
        text.text = this.curText();
        this.needLEFT();
        token = this.nextTok();
        this.expecting(token, kicad_pcb_token_1.Token.at);
        let x = this.parseBoardUnits('x');
        let y = this.parseBoardUnits('y');
        text.pos = new kicad_common_1.Point(x, y);
        token = this.nextTok();
        if (token.isNUMBER()) {
            text.angle = this.parseFloat() * 10;
            this.needRIGHT();
        }
        else {
            this.expecting(token, kicad_pcb_token_1.Token.RIGHT);
        }
        for (let token = this.nextTok(); !kicad_pcb_token_1.Token.RIGHT.is(token); token = this.nextTok()) {
            if (token.is(kicad_pcb_token_1.Token.LEFT))
                token = this.nextTok();
            if (token.is(kicad_pcb_token_1.Token.layer)) {
                text.layer = this.parseBoardItemLayer("layer");
                this.needRIGHT();
            }
            else if (token.is(kicad_pcb_token_1.Token.tstamp)) {
                text.tstamp = this.parseHex("tstamp");
                this.needRIGHT();
            }
            else if (token.is(kicad_pcb_token_1.Token.effects)) {
                this.parseEDATEXT(text);
            }
            else {
                this.expecting(token, kicad_pcb_token_1.Token.layer, kicad_pcb_token_1.Token.tstamp, kicad_pcb_token_1.Token.effects);
            }
        }
        return text;
    }
    parseEdgeModule() {
        const segment = new EdgeModule();
        let token = this.curTok();
        if (token.is(kicad_pcb_token_1.Token.fp_arc)) {
            segment.shape = Shape.ARC;
            {
                this.needLEFT();
                token = this.nextTok();
                this.expecting(token, kicad_pcb_token_1.Token.start, kicad_pcb_token_1.Token.center);
                let x = this.parseBoardUnits("x");
                let y = this.parseBoardUnits("y");
                segment.start = new kicad_common_1.Point(x, y);
                this.needRIGHT();
            }
            {
                this.needLEFT();
                token = this.nextTok();
                this.expecting(token, kicad_pcb_token_1.Token.end);
                let x = this.parseBoardUnits("x");
                let y = this.parseBoardUnits("y");
                segment.end = new kicad_common_1.Point(x, y);
                this.needRIGHT();
            }
            {
                this.needLEFT();
                token = this.nextTok();
                this.expecting(token, kicad_pcb_token_1.Token.angle);
                segment.angle = this.parseFloat("segment angle") * 10;
                this.needRIGHT();
            }
        }
        else if (token.is(kicad_pcb_token_1.Token.fp_circle)) {
            segment.shape = Shape.CIRCLE;
            {
                this.needLEFT();
                token = this.nextTok();
                this.expecting(token, kicad_pcb_token_1.Token.center);
                let x = this.parseBoardUnits("x");
                let y = this.parseBoardUnits("y");
                segment.start = new kicad_common_1.Point(x, y);
                this.needRIGHT();
            }
            {
                this.needLEFT();
                token = this.nextTok();
                this.expecting(token, kicad_pcb_token_1.Token.end);
                let x = this.parseBoardUnits("x");
                let y = this.parseBoardUnits("y");
                segment.end = new kicad_common_1.Point(x, y);
                this.needRIGHT();
            }
        }
        else if (token.is(kicad_pcb_token_1.Token.fp_curve)) {
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
        else if (token.is(kicad_pcb_token_1.Token.fp_line)) {
            segment.shape = Shape.SEGMENT;
            {
                this.needLEFT();
                token = this.nextTok();
                this.expecting(token, kicad_pcb_token_1.Token.start);
                const x = this.parseBoardUnits("x");
                const y = this.parseBoardUnits("y");
                segment.start = new kicad_common_1.Point(x, y);
                this.needRIGHT();
            }
            {
                this.needLEFT();
                token = this.nextTok();
                this.expecting(token, kicad_pcb_token_1.Token.end);
                const x = this.parseBoardUnits("x");
                const y = this.parseBoardUnits("y");
                segment.end = new kicad_common_1.Point(x, y);
                this.needRIGHT();
            }
            ;
        }
        else if (token.is(kicad_pcb_token_1.Token.fp_poly)) {
            segment.shape = Shape.POLYGON;
            this.needLEFT();
            token = this.nextTok();
            this.expecting(token, kicad_pcb_token_1.Token.pts);
            while (!kicad_pcb_token_1.Token.RIGHT.is(token = this.nextTok())) {
                segment.polyPoints.push(this.parseXY("polypoint"));
            }
        }
        else {
            this.expecting(token, kicad_pcb_token_1.Token.fp_arc, kicad_pcb_token_1.Token.fp_circle, kicad_pcb_token_1.Token.fp_curve, kicad_pcb_token_1.Token.fp_line, kicad_pcb_token_1.Token.fp_poly);
        }
        for (let token = this.nextTok(); token && !token.is(kicad_pcb_token_1.Token.RIGHT); token = this.nextTok()) {
            this.expecting(token, kicad_pcb_token_1.Token.LEFT);
            token = this.nextTok();
            if (token.is(kicad_pcb_token_1.Token.layer)) {
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
                this.expecting(token, kicad_pcb_token_1.Token.layer, kicad_pcb_token_1.Token.width, kicad_pcb_token_1.Token.tstamp, kicad_pcb_token_1.Token.status);
            }
            this.needRIGHT();
        }
        return segment;
    }
    parsePad() {
        const pad = new Pad();
        this.needSYMBOLorNUMBER();
        pad.name = this.curText();
        let token = this.nextTok();
        if (token.is(kicad_pcb_token_1.Token.thru_hole)) {
            pad.attribute = PadAttr.STANDARD;
        }
        else if (token.is(kicad_pcb_token_1.Token.smd)) {
            pad.attribute = PadAttr.SMD;
            pad.drillSize = new kicad_common_1.Size(0, 0);
        }
        else if (token.is(kicad_pcb_token_1.Token.connect)) {
            pad.attribute = PadAttr.CONN;
            pad.drillSize = new kicad_common_1.Size(0, 0);
        }
        else if (token.is(kicad_pcb_token_1.Token.np_thru_hole)) {
            pad.attribute = PadAttr.HOLE_NOT_PLATED;
        }
        else {
            this.expecting(token, kicad_pcb_token_1.Token.thru_hole, kicad_pcb_token_1.Token.smd, kicad_pcb_token_1.Token.connect, kicad_pcb_token_1.Token.np_thru_hole);
        }
        token = this.nextTok();
        if (token.is(kicad_pcb_token_1.Token.circle)) {
            pad.shape = PadShape.CIRCLE;
        }
        else if (token.is(kicad_pcb_token_1.Token.rect)) {
            pad.shape = PadShape.RECT;
        }
        else if (token.is(kicad_pcb_token_1.Token.oval)) {
            pad.shape = PadShape.OVAL;
        }
        else if (token.is(kicad_pcb_token_1.Token.trapezoid)) {
            pad.shape = PadShape.TRAPEZOID;
        }
        else if (token.is(kicad_pcb_token_1.Token.roundrect)) {
            pad.shape = PadShape.ROUNDRECT;
        }
        else {
            this.expecting(token, kicad_pcb_token_1.Token.circle, kicad_pcb_token_1.Token.rect, kicad_pcb_token_1.Token.oval, kicad_pcb_token_1.Token.trapezoid, kicad_pcb_token_1.Token.roundrect);
        }
        for (let token = this.nextTok(); !kicad_pcb_token_1.Token.RIGHT.is(token); token = this.nextTok()) {
            this.expecting(token, kicad_pcb_token_1.Token.LEFT);
            token = this.nextTok();
            if (token.is(kicad_pcb_token_1.Token.size)) {
                let width = this.parseBoardUnits("width");
                let height = this.parseBoardUnits("height");
                pad.size = new kicad_common_1.Size(width, height);
                this.needRIGHT();
            }
            else if (token.is(kicad_pcb_token_1.Token.at)) {
                // console.log('at', this.tokens.slice(this.pos,this.pos+10));
                let x = this.parseBoardUnits("x");
                let y = this.parseBoardUnits("y");
                pad.pos = new kicad_common_1.Point(x, y);
                token = this.nextTok();
                if (token.isNUMBER()) {
                    pad.orientation = this.parseFloat() * 10;
                }
                else {
                    this.expecting(token, kicad_pcb_token_1.Token.RIGHT);
                }
            }
            else if (token.is(kicad_pcb_token_1.Token.rect_delta)) {
                let width = this.parseBoardUnits("width");
                let height = this.parseBoardUnits("height");
                pad.delta = new kicad_common_1.Size(width, height);
                this.needRIGHT();
            }
            else if (token.is(kicad_pcb_token_1.Token.drill)) {
                const drillSize = pad.drillSize;
                let haveWidth = false;
                for (let token = this.nextTok(); !kicad_pcb_token_1.Token.RIGHT.is(token); token = this.nextTok()) {
                    if (token.is(kicad_pcb_token_1.Token.LEFT))
                        token = this.nextTok();
                    if (token.is(kicad_pcb_token_1.Token.oval)) {
                        pad.drillShape = PadDrillShape.OBLONG;
                    }
                    else if (token.isNUMBER()) {
                        if (!haveWidth) {
                            haveWidth = true;
                            drillSize.width = this.parseBoardUnits();
                            drillSize.height = this.parseBoardUnits();
                        }
                        else {
                            drillSize.height = this.parseBoardUnits();
                        }
                    }
                    else if (token.is(kicad_pcb_token_1.Token.offset)) {
                        let x = this.parseBoardUnits("x");
                        let y = this.parseBoardUnits("y");
                        pad.offset = new kicad_common_1.Point(x, y);
                        this.needRIGHT();
                    }
                    else {
                        this.expecting(token, kicad_pcb_token_1.Token.oval, kicad_pcb_token_1.Token.offset);
                    }
                    if (pad.attribute === PadAttr.SMD || pad.attribute === PadAttr.CONN) {
                        drillSize.width = 0;
                        drillSize.height = 0;
                    }
                }
            }
            else if (token.is(kicad_pcb_token_1.Token.layers)) {
                pad.layers = this.parseBoardItemLayersAsMask("layers");
            }
            else if (token.is(kicad_pcb_token_1.Token.net)) {
                const net = this.parseInt("net");
                pad.netCode = this.netCodes[net];
                this.needSYMBOLorNUMBER();
                const name = this.curText();
                if (pad.netCode.name !== name) {
                    throw "invalid net name";
                }
                this.needRIGHT();
            }
            else if (token.is(kicad_pcb_token_1.Token.die_length)) {
                pad.padToDieLength = this.parseBoardUnits(kicad_pcb_token_1.Token.die_length.toString());
                this.needRIGHT();
            }
            else if (token.is(kicad_pcb_token_1.Token.solder_mask_margin)) {
                pad.solderMaskMargin = this.parseBoardUnits("solder mask margin");
                this.needRIGHT();
            }
            else if (token.is(kicad_pcb_token_1.Token.solder_paste_margin)) {
                pad.solderPasteMargin = this.parseBoardUnits("solder paste margin");
                this.needRIGHT();
            }
            else if (token.is(kicad_pcb_token_1.Token.solder_paste_margin_ratio)) {
                pad.solderPasteRatio = this.parseFloat("solder paste ratio");
                this.needRIGHT();
            }
            else if (token.is(kicad_pcb_token_1.Token.clearance)) {
                pad.clearance = this.parseBoardUnits("clearance");
                this.needRIGHT();
            }
            else if (token.is(kicad_pcb_token_1.Token.zone_connect)) {
                pad.zoneConnection = this.parseInt("zone connect");
                this.needRIGHT();
            }
            else if (token.is(kicad_pcb_token_1.Token.thermal_width)) {
                pad.thermalWidth = this.parseBoardUnits("thermal width");
                this.needRIGHT();
            }
            else if (token.is(kicad_pcb_token_1.Token.thermal_gap)) {
                pad.thermalGap = this.parseBoardUnits("thermal gap");
                this.needRIGHT();
            }
            else if (token.is(kicad_pcb_token_1.Token.roundrect_rratio)) {
                pad.roundRectRatio = this.parseFloat("roundrect ratio");
                this.needRIGHT();
            }
            else {
                this.expecting(token, kicad_pcb_token_1.Token.size, kicad_pcb_token_1.Token.at, kicad_pcb_token_1.Token.rect_delta, kicad_pcb_token_1.Token.drill, kicad_pcb_token_1.Token.layers, kicad_pcb_token_1.Token.net, kicad_pcb_token_1.Token.die_length, kicad_pcb_token_1.Token.solder_mask_margin, kicad_pcb_token_1.Token.solder_paste_margin, kicad_pcb_token_1.Token.solder_paste_margin_ratio, kicad_pcb_token_1.Token.clearance, kicad_pcb_token_1.Token.zone_connect, kicad_pcb_token_1.Token.thermal_width, kicad_pcb_token_1.Token.thermal_gap, kicad_pcb_token_1.Token.roundrect_rratio);
            }
        }
        return pad;
    }
    parseEDATEXT(text) {
        for (let token = this.nextTok(); !kicad_pcb_token_1.Token.RIGHT.is(token); token = this.nextTok()) {
            if (token.is(kicad_pcb_token_1.Token.LEFT)) {
                token = this.nextTok();
            }
            if (token.is(kicad_pcb_token_1.Token.font)) {
                for (let token = this.nextTok(); !kicad_pcb_token_1.Token.RIGHT.is(token); token = this.nextTok()) {
                    if (token.is(kicad_pcb_token_1.Token.LEFT))
                        continue;
                    if (token.is(kicad_pcb_token_1.Token.size)) {
                        const textHeight = this.parseBoardUnits("text height");
                        const textWidth = this.parseBoardUnits("text width");
                        text.size = textHeight;
                        this.needRIGHT();
                    }
                    else if (token.is(kicad_pcb_token_1.Token.thickness)) {
                        const lineWidth = this.parseBoardUnits("text thickness");
                        text.lineWidth = lineWidth;
                        this.needRIGHT();
                    }
                    else if (token.is(kicad_pcb_token_1.Token.bold)) {
                        text.bold = true;
                    }
                    else if (token.is(kicad_pcb_token_1.Token.italic)) {
                        text.italic = true;
                    }
                    else {
                        this.expecting(token, kicad_pcb_token_1.Token.size, kicad_pcb_token_1.Token.thickness, kicad_pcb_token_1.Token.bold, kicad_pcb_token_1.Token.italic);
                    }
                }
            }
            else if (token.is(kicad_pcb_token_1.Token.justify)) {
                for (let token = this.nextTok(); !kicad_pcb_token_1.Token.RIGHT.is(token); token = this.nextTok()) {
                    if (token.is(kicad_pcb_token_1.Token.LEFT))
                        continue;
                    if (token.is(kicad_pcb_token_1.Token.left)) {
                        text.hjustify = kicad_common_1.TextHjustify.LEFT;
                    }
                    else if (token.is(kicad_pcb_token_1.Token.right)) {
                        text.hjustify = kicad_common_1.TextHjustify.RIGHT;
                    }
                    else if (token.is(kicad_pcb_token_1.Token.top)) {
                        text.vjustify = kicad_common_1.TextVjustify.TOP;
                    }
                    else if (token.is(kicad_pcb_token_1.Token.bottom)) {
                        text.vjustify = kicad_common_1.TextVjustify.BOTTOM;
                    }
                    else if (token.is(kicad_pcb_token_1.Token.mirror)) {
                        text.mirror = true;
                    }
                    else {
                        this.expecting(token, kicad_pcb_token_1.Token.left, kicad_pcb_token_1.Token.right, kicad_pcb_token_1.Token.top, kicad_pcb_token_1.Token.bottom, kicad_pcb_token_1.Token.mirror);
                    }
                }
            }
            else if (token.is(kicad_pcb_token_1.Token.hide)) {
                text.visibility = false;
            }
            else {
                this.expecting(kicad_pcb_token_1.Token.font, kicad_pcb_token_1.Token.justify, kicad_pcb_token_1.Token.hide);
            }
        }
    }
    parseDimensionSection() {
        const dimension = new Dimension();
        dimension.value = this.parseBoardUnits('dimension value');
        this.needLEFT();
        let token = this.nextTok();
        this.expecting(token, kicad_pcb_token_1.Token.width);
        dimension.lineWidth = this.parseBoardUnits("dimension width");
        this.needRIGHT();
        for (let token = this.nextTok(); kicad_pcb_token_1.Token.RIGHT.is(token); token = this.nextTok()) {
            this.expecting(token, kicad_pcb_token_1.Token.LEFT);
            token = this.nextTok();
            if (token.is(kicad_pcb_token_1.Token.layer)) {
                dimension.layer = this.parseBoardItemLayer("dimension layer");
                this.needRIGHT();
            }
            else if (token.is(kicad_pcb_token_1.Token.tstamp)) {
                dimension.tstamp = this.parseHex("tstamp");
                this.needRIGHT();
            }
            else if (token.is(kicad_pcb_token_1.Token.gr_text)) {
                dimension.text = this.parseTextSection();
                dimension.pos = dimension.text.pos;
            }
            else if (token.is(kicad_pcb_token_1.Token.feature1)) {
                this.needLEFT();
                token = this.nextTok();
                this.expecting(token, kicad_pcb_token_1.Token.pts);
                dimension.featureLineDO = this.parseXY("featureLineDO");
                dimension.featureLineDF = this.parseXY("featureLineDF");
                this.needRIGHT();
                this.needRIGHT();
            }
            else if (token.is(kicad_pcb_token_1.Token.feature2)) {
                this.needLEFT();
                token = this.nextTok();
                this.expecting(token, kicad_pcb_token_1.Token.pts);
                dimension.featureLineGO = this.parseXY("featureLineGO");
                dimension.featureLineGF = this.parseXY("featureLineGF");
                this.needRIGHT();
                this.needRIGHT();
            }
            else if (token.is(kicad_pcb_token_1.Token.crossbar)) {
                this.needLEFT();
                token = this.nextTok();
                this.expecting(token, kicad_pcb_token_1.Token.pts);
                dimension.crossBarO = this.parseXY("crossBarO");
                dimension.crossBarF = this.parseXY("crossBarF");
                this.needRIGHT();
                this.needRIGHT();
            }
            else if (token.is(kicad_pcb_token_1.Token.arrow1a)) {
                this.needLEFT();
                token = this.nextTok();
                this.expecting(token, kicad_pcb_token_1.Token.pts);
                dimension.crossBarF = this.parseXY("crossBarF");
                dimension.arrowD1F = this.parseXY("arrowD1F");
                this.needRIGHT();
                this.needRIGHT();
            }
            else if (token.is(kicad_pcb_token_1.Token.arrow1b)) {
                this.needLEFT();
                token = this.nextTok();
                this.expecting(token, kicad_pcb_token_1.Token.pts);
                dimension.crossBarF = this.parseXY("crossBarF");
                dimension.arrowD2F = this.parseXY("arrowD2F");
                this.needRIGHT();
                this.needRIGHT();
            }
            else if (token.is(kicad_pcb_token_1.Token.arrow2a)) {
                this.needLEFT();
                token = this.nextTok();
                this.expecting(token, kicad_pcb_token_1.Token.pts);
                dimension.crossBarO = this.parseXY("crossBarO");
                dimension.arrowG1F = this.parseXY("arrowG1F");
                this.needRIGHT();
                this.needRIGHT();
            }
            else if (token.is(kicad_pcb_token_1.Token.arrow2b)) {
                this.needLEFT();
                token = this.nextTok();
                this.expecting(token, kicad_pcb_token_1.Token.pts);
                dimension.crossBarO = this.parseXY("crossBarO");
                dimension.arrowG2F = this.parseXY("arrowG2F");
                this.needRIGHT();
                this.needRIGHT();
            }
            else {
                this.expecting(token, kicad_pcb_token_1.Token.layer, kicad_pcb_token_1.Token.tstamp, kicad_pcb_token_1.Token.gr_text, kicad_pcb_token_1.Token.feature1, kicad_pcb_token_1.Token.feature2, kicad_pcb_token_1.Token.crossbar, kicad_pcb_token_1.Token.arrow1a, kicad_pcb_token_1.Token.arrow1b, kicad_pcb_token_1.Token.arrow2a, kicad_pcb_token_1.Token.arrow2b);
            }
        }
        return dimension;
    }
    parseModuleSection() {
        console.log('parseModuleSection');
        const mod = new Module();
        this.needSYMBOLorNUMBER();
        const name = this.curText();
        const fpid = LibId.parse(name);
        for (let token = this.nextTok(); !kicad_pcb_token_1.Token.RIGHT.is(token); token = this.nextTok()) {
            console.log(token);
            if (token.is(kicad_pcb_token_1.Token.LEFT)) {
                token = this.nextTok();
            }
            if (token.is(kicad_pcb_token_1.Token.version)) {
                const version = this.parseInt("version");
                this.needRIGHT();
                this.requiredVersion = Math.max(version, this.requiredVersion);
                this.tooRecent = this.requiredVersion > SEXPR_BOARD_FILE_VERSION;
            }
            else if (token.is(kicad_pcb_token_1.Token.locked)) {
                mod.locked = true;
            }
            else if (token.is(kicad_pcb_token_1.Token.placed)) {
                mod.placed = true;
            }
            else if (token.is(kicad_pcb_token_1.Token.layer)) {
                mod.layer = this.parseBoardItemLayer("module layer");
                this.needRIGHT();
            }
            else if (token.is(kicad_pcb_token_1.Token.tedit)) {
                mod.lastEditTime = this.parseHex("tedit");
                this.needRIGHT();
            }
            else if (token.is(kicad_pcb_token_1.Token.tstamp)) {
                mod.tstamp = this.parseHex("tstamp");
            }
            else if (token.is(kicad_pcb_token_1.Token.at)) {
                const x = this.parseBoardUnits('at x');
                const y = this.parseBoardUnits('at y');
                mod.pos = new kicad_common_1.Point(x, y);
                token = this.nextTok();
                if (token.isNUMBER()) {
                    mod.orientation = this.parseFloat() * 10.0;
                    this.needRIGHT();
                }
                else {
                    this.expecting(token, kicad_pcb_token_1.Token.RIGHT);
                }
            }
            else if (token.is(kicad_pcb_token_1.Token.descr)) {
                this.needSYMBOLorNUMBER();
                mod.description = this.curText();
                this.needRIGHT();
            }
            else if (token.is(kicad_pcb_token_1.Token.tags)) {
                this.needSYMBOLorNUMBER();
                mod.keywords = this.curText();
                this.needRIGHT();
            }
            else if (token.is(kicad_pcb_token_1.Token.path)) {
                this.needSYMBOLorNUMBER();
                mod.path = this.curText();
                this.needRIGHT();
            }
            else if (token.is(kicad_pcb_token_1.Token.autoplace_cost90)) {
                mod.placementCost90 = this.parseInt("place cost 90");
                this.needRIGHT();
            }
            else if (token.is(kicad_pcb_token_1.Token.autoplace_cost180)) {
                mod.placementCost90 = this.parseInt("place cost 180");
                this.needRIGHT();
            }
            else if (token.is(kicad_pcb_token_1.Token.solder_mask_margin)) {
                mod.solderMaskMargin = this.parseBoardUnits("solder mask margin");
                this.needRIGHT();
            }
            else if (token.is(kicad_pcb_token_1.Token.solder_paste_margin)) {
                mod.solderPasteMargin = this.parseBoardUnits("solder paste margin");
                this.needRIGHT();
            }
            else if (token.is(kicad_pcb_token_1.Token.solder_paste_ratio)) {
                mod.solderPasteRatio = this.parseFloat("solder paste ratio");
                this.needRIGHT();
            }
            else if (token.is(kicad_pcb_token_1.Token.clearance)) {
                mod.clearance = this.parseBoardUnits("clearance");
                this.needRIGHT();
            }
            else if (token.is(kicad_pcb_token_1.Token.zone_connect)) {
                mod.zoneConnection = this.parseInt("zone connect");
                this.needRIGHT();
            }
            else if (token.is(kicad_pcb_token_1.Token.thermal_width)) {
                mod.thermalWidth = this.parseBoardUnits("thermal width");
                this.needRIGHT();
            }
            else if (token.is(kicad_pcb_token_1.Token.thermal_gap)) {
                mod.thermalGap = this.parseBoardUnits("thermal gap");
                this.needRIGHT();
            }
            else if (token.is(kicad_pcb_token_1.Token.attr)) {
                for (let token = this.nextTok(); kicad_pcb_token_1.Token.RIGHT.is(token); token = this.nextTok()) {
                    if (token.is(kicad_pcb_token_1.Token.smd)) {
                        mod.attributes |= MODULE_ATTR.MOD_CMS;
                    }
                    else if (token.is(kicad_pcb_token_1.Token.virtual)) {
                        mod.attributes |= MODULE_ATTR.MOD_VIRTUAL;
                    }
                    else {
                        this.expecting(token, kicad_pcb_token_1.Token.smd, kicad_pcb_token_1.Token.virtual);
                    }
                }
            }
            else if (token.is(kicad_pcb_token_1.Token.fp_text)) {
                const text = this.parseTextModule();
                text.angle = text.angle - mod.orientation;
                if (text.type === TextModuleType.reference) {
                    mod.reference = text;
                }
                else if (text.type === TextModuleType.value) {
                    mod.value = text;
                }
                else {
                    mod.graphics.push(text);
                }
            }
            else if (token.is(kicad_pcb_token_1.Token.fp_arc) ||
                token.is(kicad_pcb_token_1.Token.fp_circle) ||
                token.is(kicad_pcb_token_1.Token.fp_curve) ||
                token.is(kicad_pcb_token_1.Token.fp_line) ||
                token.is(kicad_pcb_token_1.Token.fp_poly)) {
                const edge = this.parseEdgeModule();
                mod.graphics.push(edge);
            }
            else if (token.is(kicad_pcb_token_1.Token.pad)) {
                const pad = this.parsePad();
                const pos = pad.pos;
                kicad_common_1.RotatePoint(pos, mod.orientation);
                pad.pos = kicad_common_1.Point.add(pos, mod.pos);
                mod.pads.push(pad);
            }
            else if (token.is(kicad_pcb_token_1.Token.model)) {
                this.skipSection();
            }
            else {
                this.expecting(token, kicad_pcb_token_1.Token.version, kicad_pcb_token_1.Token.locked, kicad_pcb_token_1.Token.placed, kicad_pcb_token_1.Token.layer, kicad_pcb_token_1.Token.tedit, kicad_pcb_token_1.Token.tstamp, kicad_pcb_token_1.Token.at, kicad_pcb_token_1.Token.descr, kicad_pcb_token_1.Token.tags, kicad_pcb_token_1.Token.path, kicad_pcb_token_1.Token.autoplace_cost90, kicad_pcb_token_1.Token.autoplace_cost180, kicad_pcb_token_1.Token.solder_mask_margin, kicad_pcb_token_1.Token.solder_paste_margin, kicad_pcb_token_1.Token.solder_paste_ratio, kicad_pcb_token_1.Token.clearance, kicad_pcb_token_1.Token.zone_connect, kicad_pcb_token_1.Token.thermal_width, kicad_pcb_token_1.Token.thermal_gap, kicad_pcb_token_1.Token.attr, kicad_pcb_token_1.Token.fp_text, kicad_pcb_token_1.Token.fp_arc, kicad_pcb_token_1.Token.fp_circle, kicad_pcb_token_1.Token.fp_curve, kicad_pcb_token_1.Token.fp_line, kicad_pcb_token_1.Token.fp_poly, kicad_pcb_token_1.Token.pad, kicad_pcb_token_1.Token.model);
            }
        }
        return mod;
    }
    parseSegmentSection() {
        const track = new Track();
        for (let token = this.nextTok(); !kicad_pcb_token_1.Token.RIGHT.is(token); token = this.nextTok()) {
            this.expecting(token, kicad_pcb_token_1.Token.LEFT);
            token = this.nextTok();
            if (token.is(kicad_pcb_token_1.Token.start)) {
                const x = this.parseBoardUnits("x");
                const y = this.parseBoardUnits("y");
                track.start = new kicad_common_1.Point(x, y);
            }
            else if (token.is(kicad_pcb_token_1.Token.end)) {
                const x = this.parseBoardUnits("x");
                const y = this.parseBoardUnits("y");
                track.end = new kicad_common_1.Point(x, y);
            }
            else if (token.is(kicad_pcb_token_1.Token.width)) {
                track.width = this.parseBoardUnits("width");
            }
            else if (token.is(kicad_pcb_token_1.Token.layer)) {
                track.layer = this.parseBoardItemLayer("layer");
            }
            else if (token.is(kicad_pcb_token_1.Token.net)) {
                const net = this.parseInt("net");
                track.net = this.netCodes[net];
            }
            else if (token.is(kicad_pcb_token_1.Token.tstamp)) {
                track.tstamp = this.parseHex("tstamp");
            }
            else if (token.is(kicad_pcb_token_1.Token.status)) {
                track.status = this.parseHex("status");
            }
            else {
                this.expecting(token, kicad_pcb_token_1.Token.start, kicad_pcb_token_1.Token.end, kicad_pcb_token_1.Token.width, kicad_pcb_token_1.Token.layer, kicad_pcb_token_1.Token.net, kicad_pcb_token_1.Token.tstamp, kicad_pcb_token_1.Token.status);
            }
            this.needRIGHT();
        }
        return track;
    }
    parseViaSection() {
        const via = new Via();
        for (let token = this.nextTok(); !kicad_pcb_token_1.Token.RIGHT.is(token); token = this.nextTok()) {
            if (token.is(kicad_pcb_token_1.Token.LEFT))
                continue;
            token = this.nextTok();
            if (token.is(kicad_pcb_token_1.Token.blind)) {
                via.viaType = ViaType.BLIND_BURIED;
            }
            else if (token.is(kicad_pcb_token_1.Token.micro)) {
                via.viaType = ViaType.MICROVIA;
            }
            else if (token.is(kicad_pcb_token_1.Token.at)) {
                let x = this.parseBoardUnits('x');
                let y = this.parseBoardUnits('y');
                const pos = new kicad_common_1.Point(x, y);
                via.start = pos;
                via.end = pos;
                this.needRIGHT();
            }
            else if (token.is(kicad_pcb_token_1.Token.size)) {
                via.width = this.parseBoardUnits("via width");
                this.needRIGHT();
            }
            else if (token.is(kicad_pcb_token_1.Token.drill)) {
                via.drill = this.parseBoardUnits("via drill");
                this.needRIGHT();
            }
            else if (token.is(kicad_pcb_token_1.Token.layers)) {
                this.nextTok();
                via.layer1 = this.layerIndices[this.curText()];
                via.layer2 = this.layerIndices[this.curText()];
                this.needRIGHT();
            }
            else if (token.is(kicad_pcb_token_1.Token.net)) {
                const net = this.parseInt("net");
                via.net = this.netCodes[net];
                this.needRIGHT();
            }
            else if (token.is(kicad_pcb_token_1.Token.tstamp)) {
                via.tstamp = this.parseHex("tstamp");
                this.needRIGHT();
            }
            else if (token.is(kicad_pcb_token_1.Token.status)) {
                via.status = this.parseHex("status");
                this.needRIGHT();
            }
            else {
                this.expecting(token, kicad_pcb_token_1.Token.blind, kicad_pcb_token_1.Token.micro, kicad_pcb_token_1.Token.at, kicad_pcb_token_1.Token.size, kicad_pcb_token_1.Token.drill, kicad_pcb_token_1.Token.layers, kicad_pcb_token_1.Token.net, kicad_pcb_token_1.Token.tstamp, kicad_pcb_token_1.Token.status);
            }
        }
        return via;
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
        this.pageInfo = kicad_common_1.PageInfo.A3;
        this.netInfos = [];
        this.drawSegments = [];
        this.texts = [];
        this.dimensions = [];
        this.copperLayerCount = 0;
        this.enabledLayers = [];
        this.visibleLayers = [];
        this.layerDescr = {};
    }
}
exports.Board = Board;
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
        this._layerIds = [];
        this._layerIds = layerIds;
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
    add(...layerIds) {
        for (let id of layerIds) {
            if (this._layerIds.indexOf(id) === -1) {
                this._layerIds.push(id);
            }
        }
        return this;
    }
    delete(id) {
        const pos = this._layerIds.indexOf(id);
        if (pos === -1)
            return this;
        this._layerIds.splice(pos, 1);
        return this;
    }
    union(o) {
        this.add(...o._layerIds);
        return this;
    }
    intersect(o) {
        // TODO
        return this;
    }
    except(o) {
        // TODO
        return this;
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
    constructor() {
        this.pos = new kicad_common_1.Point(0, 0);
        this.layer = 0;
        this.tstamp = 0;
        this.status = 0;
        this.attributes = 0;
    }
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
class EdgeModule extends DrawSegment {
}
class Text extends BoardItem {
    constructor() {
        super(...arguments);
        this.bold = false;
        this.italic = false;
        this.mirror = false;
        this.hjustify = kicad_common_1.TextHjustify.CENTER;
        this.vjustify = kicad_common_1.TextVjustify.CENTER;
        this.visibility = true;
    }
}
var Unit;
(function (Unit) {
    Unit["MM"] = "mm";
    Unit["INCH"] = "inch";
})(Unit || (Unit = {}));
class Dimension extends BoardItem {
    constructor() {
        super(...arguments);
        this.shape = 0;
        this.unit = Unit.MM;
    }
}
class Module extends BoardItem {
    constructor() {
        super(...arguments);
        this.orientation = 0;
        this.placementCost90 = 0;
        this.placementCost180 = 0;
        this.solderMaskMargin = 0;
        this.solderPasteMargin = 0;
        this.solderPasteRatio = 0;
        this.clearance = 0;
        this.zoneConnection = 0;
        this.thermalWidth = 0;
        this.thermalGap = 0;
        this.graphics = [];
        this.pads = [];
    }
}
exports.Module = Module;
class LibId {
    constructor(nickname, itemname, revision) {
        this.nickname = nickname;
    }
    static parse(id) {
        const [name, rev] = id.split(/\//);
        const [nickname, itemname] = name.split(/:/);
        return new this(nickname, itemname, rev);
    }
}
class Pad {
    constructor() {
        this.orientation = 0;
    }
}
var PadShape;
(function (PadShape) {
    PadShape[PadShape["CIRCLE"] = 0] = "CIRCLE";
    PadShape[PadShape["RECT"] = 1] = "RECT";
    PadShape[PadShape["OVAL"] = 2] = "OVAL";
    PadShape[PadShape["TRAPEZOID"] = 3] = "TRAPEZOID";
    PadShape[PadShape["ROUNDRECT"] = 4] = "ROUNDRECT";
})(PadShape = exports.PadShape || (exports.PadShape = {}));
;
var PadDrillShape;
(function (PadDrillShape) {
    PadDrillShape[PadDrillShape["CIRCLE"] = 0] = "CIRCLE";
    PadDrillShape[PadDrillShape["OBLONG"] = 1] = "OBLONG";
})(PadDrillShape = exports.PadDrillShape || (exports.PadDrillShape = {}));
;
var PadAttr;
(function (PadAttr) {
    PadAttr["STANDARD"] = "STANDARD";
    PadAttr["SMD"] = "SMD";
    PadAttr["CONN"] = "CONN";
    PadAttr["HOLE_NOT_PLATED"] = "HOLE_NOT_PLATED";
})(PadAttr || (PadAttr = {}));
;
class TextModule extends Text {
    constructor() {
        super(...arguments);
        this.type = TextModuleType.user;
    }
}
var TextModuleType;
(function (TextModuleType) {
    TextModuleType["reference"] = "reference";
    TextModuleType["value"] = "value";
    TextModuleType["user"] = "user";
})(TextModuleType || (TextModuleType = {}));
var MODULE_ATTR;
(function (MODULE_ATTR) {
    MODULE_ATTR[MODULE_ATTR["MOD_DEFAULT"] = 0] = "MOD_DEFAULT";
    MODULE_ATTR[MODULE_ATTR["MOD_CMS"] = 1] = "MOD_CMS";
    ///< (usually SMD footprints)
    MODULE_ATTR[MODULE_ATTR["MOD_VIRTUAL"] = 2] = "MOD_VIRTUAL"; ///< Virtual component: when created by copper shapes on
    ///<  board (Like edge card connectors, mounting hole...)
})(MODULE_ATTR || (MODULE_ATTR = {}));
;
class Track extends BoardItem {
}
(function (ViaType) {
    ViaType[ViaType["THROUGH"] = 3] = "THROUGH";
    ViaType[ViaType["BLIND_BURIED"] = 2] = "BLIND_BURIED";
    ViaType[ViaType["MICROVIA"] = 1] = "MICROVIA";
    ViaType[ViaType["NOT_DEFINED"] = 0] = "NOT_DEFINED"; /* not yet used */
})(ViaType || (ViaType = {}));
class Via extends BoardItem {
    constructor() {
        super(...arguments);
        this.viaType = ViaType.THROUGH;
    }
}
//# sourceMappingURL=kicad_pcb.js.map