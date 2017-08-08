//#!tsc && NODE_PATH=dist/src node dist/sketch3.js 

// based on:
// pcbnew/pcb_parser.cpp 
/*
 * This program source code file is part of KiCad, a free EDA CAD application.
 *
 * Copyright (C) 2012 CERN
 * Copyright (C) 2012-2017 KiCad Developers, see AUTHORS.txt for contributors.
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


import {
	MIL2MM,
	MM2MIL,
	Point,
	Size,
	TextHjustify,
	TextVjustify,
	RotatePoint,
} from "./kicad_common";

import { Token } from "./kicad_pcb_token";

const SEXPR_BOARD_FILE_VERSION = 20170123;

export class PCB {
	tokens: Array<Token>;
	pos: number;
	layerIndices: { [key: string]: number } = {};
	layerMasks: { [key: string]: LSET } = {};
	netCodes: { [key: number]: NetClass } = {};
	tooRecent = false;
	requiredVersion = 0;

	board: Board;

	static load(content: string): Board | Module {
		const lines = content.split(/\r?\n/);
		const tokens = [];
		// lexer
		for (let i = 0, len = lines.length; i < len; i++) {
			// remove comment
			const line = lines[i].replace(/#.*$/, '');
			tokens.push(...line.split(/([()]|"(?:\\"|[^"])*")|\s+/).filter( (t) => !!t ).map( (t) => new Token(t, i + 1)));
		}
		const pcb = new this();
		pcb.pos = 0;
		pcb.tokens = tokens;
		return pcb.parse();
	}

	constructor() {
		this.pos = 0;
		this.tokens = [];
		for (let layer = 0; layer < PCB_LAYER_ID.PCB_LAYER_ID_COUNT; layer++) {
			const name = LSET.Name(layer as PCB_LAYER_ID);
			this.layerIndices[name] = layer;
			this.layerMasks[name] = new LSET(layer);
		}

		this.layerMasks[ "*.Cu" ]      = LSET.AllCuMask();
		this.layerMasks[ "F&B.Cu" ]    = new LSET(PCB_LAYER_ID.F_Cu, PCB_LAYER_ID.B_Cu );
		this.layerMasks[ "*.Adhes" ]   = new LSET(PCB_LAYER_ID.B_Adhes, PCB_LAYER_ID.F_Adhes );
		this.layerMasks[ "*.Paste" ]   = new LSET(PCB_LAYER_ID.B_Paste, PCB_LAYER_ID.F_Paste );
		this.layerMasks[ "*.Mask" ]    = new LSET(PCB_LAYER_ID.B_Mask, PCB_LAYER_ID.F_Mask );
		this.layerMasks[ "*.SilkS" ]   = new LSET(PCB_LAYER_ID.B_SilkS, PCB_LAYER_ID.F_SilkS );
		this.layerMasks[ "*.Fab" ]     = new LSET(PCB_LAYER_ID.B_Fab, PCB_LAYER_ID.F_Fab );
		this.layerMasks[ "*.CrtYd" ]   = new LSET(PCB_LAYER_ID.B_CrtYd, PCB_LAYER_ID.F_CrtYd );


		for (let i = 1; i <= 14; i++) {
			const key = `Inner${i}.Cu`;
			this.layerMasks[ key ] = new LSET( PCB_LAYER_ID.In15_Cu - i );
		}
	}

	curTok(): Token {
		return this.tokens[this.pos];
	}

	curText(): string {
		const str = this.tokens[this.pos].token;
		if (str.startsWith('"') && str.endsWith('"')) {
			return str.slice(1, -1);
		}
		return str;
	}

	nextTok(): Token {
		return this.tokens[++this.pos];
	}

	needLEFT() {
		if (!this.nextTok().is(Token.LEFT)) {
			const token = this.curTok();
			throw "expect ( but found" + token.token + ' at line ' + token.line; 
		}
	}

	needRIGHT() {
		if (!this.nextTok().is(Token.RIGHT)) {
			const token = this.curTok();
			throw "expect ) but found" + token.token + ' at line ' + token.line; 
		}
	}

	needNUMBER(expected: string = 'number') {
		if (!this.nextTok().isNUMBER()) {
			const token = this.curTok();
			throw "expect " + expected + " but found " + token.token + ' at line ' + token.line; 
		}
		return this.curTok();
	}

	needSYMBOL(expected: string = 'symbol') {
		if (!this.nextTok().isSYMBOL()) {
			const token = this.curTok();
			throw "expect " + expected + " but found " + token.token + ' at line ' + token.line; 
		}
		return this.curTok();
	}

	needSYMBOLorNUMBER(expected: string = "symbol|number") {
		const token = this.nextTok();
		if (!token.isNUMBER() && !token.isSYMBOL()) {
			throw "expect " + expected + " but found " + token.token + ' at line ' + token.line; 
		}
		return token;
	}

	expecting(got: Token, ...expected: Token[]) {
		if (!expected.some( (e) => e.is(got) )) {
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
	parseInt(expected?: string) {
		if (expected) {
			this.needNUMBER(expected);
		}
		return parseInt(this.curText(), 10);
	}

	parseFloat(expected?: string) {
		if (expected) {
			this.needNUMBER(expected);
		}
		const ret = parseFloat(this.curText());
		if (isNaN(ret)) {
			throw "expecting floating value but got " + this.curText();
		}
		return ret;
	}

	parseBoardUnits(expected?: string) {
		return MM2MIL(this.parseFloat(expected));
	}

	// unify interface to parseInt
	parseHex(expected: string) {
		if (expected) {
			// XXX
			this.nextTok();
		}
		return parseInt(this.curText(), 16);
	}

	// unify interface to parseInt
	parseBool(expected: string) {
		if (expected) {
			this.nextTok();
		}
		const token = this.curTok();
		if (token.is(Token.yes)) {
			return true;
		} else
		if (token.is(Token.no)) {
			return false;
		} else {
			this.expecting(token, Token.yes, Token.no);
		}
	}

	parseXY(expected: string) {
		if (!this.curTok().is(Token.LEFT)) {
			this.needLEFT();
		}

		let token = this.nextTok();
		this.expecting(token, Token.xy);
		const x = this.parseBoardUnits(expected + '->x');
		const y = this.parseBoardUnits(expected + '->y');
		this.needRIGHT();
		return new Point(x, y);
	}

	parseBoardItemLayer(expected: string) {
		this.nextTok();
		return this.layerIndices[this.curText()];
	}

	parseBoardItemLayersAsMask(expected: string) {
		const layerMask = new LSET();
		for (let token = this.nextTok(); !Token.RIGHT.is(token); token = this.nextTok()) {
			const mask = this.layerMasks[this.curText()];
			layerMask.union(mask);
		}
		return layerMask;
	}

	parse(): Board | Module {
		let token = this.curTok();
		this.expecting(token, Token.LEFT);

		token = this.nextTok();
		if (token.is(Token.kicad_pcb)) {
			this.board = new Board();
			this.parseBoard();
			return this.board;
		} else
		if (token.is(Token.module)) {
			return this.parseModuleSection();
		} else {
			throw 'unknown token ' + token;
		}
	}

	parseBoard(): void {
		console.log('parseBoard');
		this.parseHeader();

		for (let token = this.nextTok(); Token.RIGHT.is(token); token = this.nextTok()) {
			this.expecting(token, Token.LEFT);

			token = this.nextTok();

			if (token.is(Token.general)) {
				this.parseGeneralSection();
			} else
			if (token.is(Token.page)) {
				this.parsePageSection();
			} else
			if (token.is(Token.title_block)) {
				this.skipSection();
			} else
			if (token.is(Token.layers)) {
				this.parseLayersSection();
			} else
			if (token.is(Token.setup)) {
				this.parseSetupSection();
			} else
			if (token.is(Token.net)) {
				this.parseNetSection();
			} else
			if (token.is(Token.net_class)) {
				this.parseNetClassSection();
			} else
			if (token.is(Token.gr_arc) ||
				token.is(Token.gr_circle) ||
				token.is(Token.gr_curve) ||
				token.is(Token.gr_line) ||
				token.is(Token.gr_poly)) {
				this.parseDrawSegmentSection();
			} else
			if (token.is(Token.gr_text)) {
				this.board.texts.push(this.parseTextSection());
			} else
			if (token.is(Token.dimension)) {
				this.board.dimensions.push(this.parseDimensionSection());
			} else
			if (token.is(Token.module)) {
				this.parseModuleSection();
			} else
			if (token.is(Token.segment)) {
				this.parseSegmentSection();
			} else
			if (token.is(Token.via)) {
				this.parseViaSection();
			} else
			if (token.is(Token.zone)) {
				this.parseZoneSection();
			} else
			if (token.is(Token.target)) {
				this.parseTargetSection();
			} else {
				throw "unknown token " + token + ' at line ' + token.line;
			}
		}
	}

	parseHeader(): void {
		this.needLEFT();
		let token = this.nextTok();
		if (token.is(Token.version)) {
			const version = this.parseInt("version");
			console.log('version', version);
			this.needRIGHT();

			// (host pcbnew 4.0.2-stable)
			this.needLEFT();
			this.needSYMBOL();
			this.needSYMBOL();
			this.needSYMBOL();
			this.needRIGHT();
		} else {
			this.needSYMBOL();
			this.needSYMBOL();
			this.needRIGHT();
		}
	}

	parseGeneralSection(): void {
		for (let token = this.nextTok(); token && !token.is(Token.RIGHT); token = this.nextTok()) {
			this.expecting(token, Token.LEFT);
			if (token.is(Token.thickness)) {
				this.board.boardDesignSetting.boardThickness = this.parseInt("board thickness");
				this.needRIGHT();
			} else
			if (token.is(Token.nets)) {
				this.parseInt("nets count");
				this.needRIGHT();
			} else {
				this.skipSection();
			}
		}
	}

	parsePageSection(): void {
		const pageType = this.needSYMBOL().toString();
		if (pageType === 'User') {
			const width = this.parseFloat("width"); // unit=mm
			const height = this.parseFloat("height"); // unit=mm
			this.board.pageInfo.setPageType('User');
			this.board.pageInfo.width = width;
			this.board.pageInfo.height = height;
		} else {
			this.board.pageInfo.setPageType('User');
		}

		let token = this.nextTok();
		if (token.is(Token.portrait)) {
			// set portrate mode
			this.board.pageInfo.setPortrait(true);
		} else
		if (token.is(Token.RIGHT)) {
			// done
		} else {
			this.expecting(token, Token.portrait, Token.RIGHT);
		}
	}

	parseLayersSection(): void {
		const cuLayers = [];
		let layer, token;
		for (token = this.nextTok(); token && !token.is(Token.RIGHT); token = this.nextTok()) {
			layer = this.parseLayer();
			if (layer.type === LayerType.UNDEFINED) break;
			cuLayers.push(layer);
		}

		if (cuLayers.length) {
			cuLayers[cuLayers.length-1].number = PCB_LAYER_ID.B_Cu;
			for (let i = 0; i < cuLayers.length -1; i++) {
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

		if (!layer) throw "layers is invalid";

		while (!token.is(Token.RIGHT)) {
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
			if (!token.is(Token.LEFT)) break;

			layer = this.parseLayer();
		}
	}

	parseLayer(): Layer {
		this.expecting(this.curTok(), Token.LEFT);
		const num  = this.parseInt("layer number");

		this.needSYMBOLorNUMBER();
		const name = this.curText();

		this.needSYMBOL();
		const type = this.curText();

		let visible = true;
		let token = this.nextTok();
		if (token.is(Token.hide)) {
			visible = false;
		} else
		if (token.is(Token.RIGHT)) {
			// done
		} else {
			this.expecting(token, Token.hide, Token.RIGHT);
		}
		return new Layer(name, type as LayerType, num, visible);
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

		for (let token = this.nextTok(); token && !token.is(Token.RIGHT); token = this.nextTok()) {
			this.expecting(token, Token.LEFT);

			token = this.nextTok();
			if (token.is(Token.clearance)) {
				nc.clearance = this.parseBoardUnits(Token.clearance.toString());
			} else
			if (token.is(Token.trace_width)) {
				nc.trackWidth = this.parseBoardUnits(Token.trace_width.toString());
			} else
			if (token.is(Token.via_dia)) {
				nc.viaDia = this.parseBoardUnits(Token.via_dia.toString());
			} else
			if (token.is(Token.via_drill)) {
				nc.viaDrill = this.parseBoardUnits(Token.via_drill.toString());
			} else
			if (token.is(Token.uvia_dia)) {
				nc.microViaDia = this.parseBoardUnits(Token.uvia_dia.toString());
			} else
			if (token.is(Token.uvia_drill)) {
				nc.microViaDrill = this.parseBoardUnits(Token.uvia_drill.toString());
			} else
			if (token.is(Token.diff_pair_width)) {
				nc.diffPairWidth = this.parseBoardUnits(Token.diff_pair_width.toString());
			} else
			if (token.is(Token.diff_pair_gap)) {
				nc.diffPairGap = this.parseBoardUnits(Token.diff_pair_gap.toString());
			} else
			if (token.is(Token.add_net)) {
				this.needSYMBOLorNUMBER();
				nc.members.push( this.curText());
			} else {
				this.expecting(token, Token.clearance, Token.trace_width, Token.via_dia, Token.via_drill, Token.uvia_dia, Token.uvia_drill, Token.diff_pair_width, Token.diff_pair_gap, Token.add_net);
			}
			this.needRIGHT();
		}

		this.board.boardDesignSetting.netClasses.add(nc);
	}

	parseDrawSegmentSection() {
		let token = this.curTok();
		const segment = new DrawSegment();
		if (token.is(Token.gr_arc)) {
			segment.shape = Shape.ARC;
			{
				this.needLEFT();
				token = this.nextTok();
				this.expecting(token, Token.start, Token.center);
				const x = this.parseBoardUnits("x");
				const y = this.parseBoardUnits("y");
				segment.start = new Point(x, y);
				this.needRIGHT();
			}
			{
				this.needLEFT();
				token = this.nextTok();
				this.expecting(token, Token.end);
				const x = this.parseBoardUnits("x");
				const y = this.parseBoardUnits("y");
				segment.end = new Point(x, y);
				this.needRIGHT();
			};

		} else
		if (token.is(Token.gr_circle)) {
			segment.shape = Shape.CIRCLE;
			{
				this.needLEFT();
				token = this.nextTok();
				this.expecting(token, Token.center);
				const x = this.parseBoardUnits("x");
				const y = this.parseBoardUnits("y");
				segment.start = new Point(x, y);
				this.needRIGHT();
			}
			{
				this.needLEFT();
				token = this.nextTok();
				this.expecting(token, Token.end);
				const x = this.parseBoardUnits("x");
				const y = this.parseBoardUnits("y");
				segment.end = new Point(x, y);
				this.needRIGHT();
			};
		} else
		if (token.is(Token.gr_curve)) {
			segment.shape = Shape.CURVE;
			this.needLEFT();
			token = this.nextTok();
			this.expecting(token, Token.pts);

			segment.start = this.parseXY("start");
			segment.bezierC1 = this.parseXY("bezierC1");
			segment.bezierC2 = this.parseXY("bezierC2");
			segment.end = this.parseXY("end");
			this.needRIGHT();
		} else
		if (token.is(Token.gr_line)) {
			segment.shape = Shape.SEGMENT;
			{
				this.needLEFT();
				token = this.nextTok();
				this.expecting(token, Token.start);
				const x = this.parseBoardUnits("x");
				const y = this.parseBoardUnits("y");
				segment.start = new Point(x, y);
				this.needRIGHT();
			}
			{
				this.needLEFT();
				token = this.nextTok();
				this.expecting(token, Token.end);
				const x = this.parseBoardUnits("x");
				const y = this.parseBoardUnits("y");
				segment.end = new Point(x, y);
				this.needRIGHT();
			};

		} else
		if (token.is(Token.gr_poly)) {
			segment.shape = Shape.POLYGON;
			this.needLEFT();
			token = this.nextTok();
			this.expecting(token, Token.pts);
			while ( !Token.RIGHT.is(token = this.nextTok()) ) {
				segment.polyPoints.push(this.parseXY("polypoint"));
			}
		} else {
			this.expecting(token, Token.gr_arc, Token.gr_circle, Token.gr_curve, Token.gr_line, Token.gr_poly);
		}

		for (let token = this.nextTok(); token && !token.is(Token.RIGHT); token = this.nextTok()) {
			this.expecting(token, Token.LEFT);

			token = this.nextTok();
			if (token.is(Token.angle)) {
				segment.angle = this.parseFloat("angle") * 10;
			} else
			if (token.is(Token.layer)) {
				segment.layer = this.parseBoardItemLayer("layer");
			} else
			if (token.is(Token.width)) {
				segment.lineWidth = this.parseBoardUnits(Token.width.toString());
			} else
			if (token.is(Token.tstamp)) {
				segment.tstamp = this.parseHex("tstamp");
			} else
			if (token.is(Token.status)) {
				segment.status = this.parseHex("status");
			} else {
				this.expecting(token, Token.angle, Token.layer, Token.width, Token.tstamp, Token.status);
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
		this.expecting(token, Token.at);

		let x = this.parseBoardUnits('x');
		let y = this.parseBoardUnits('y');
		text.pos = new Point(x, y);

		token = this.nextTok();
		if ( token.isNUMBER()) {
			text.angle = this.parseFloat() * 10;
			this.needRIGHT();
		} else {
			this.expecting(token, Token.RIGHT);
		}

		for (let token = this.nextTok(); !Token.RIGHT.is(token); token = this.nextTok()) {
			this.expecting(token, Token.LEFT);
			token = this.nextTok();
			if (token.is(Token.layer)) {
				text.layer = this.parseBoardItemLayer("layer");
				this.needRIGHT();
			} else
			if (token.is(Token.tstamp)) {
				text.tstamp = this.parseHex("tstamp");
				this.needRIGHT();
			} else
			if (token.is(Token.effects)) {
				this.parseEDATEXT(text);
			} else {
				this.expecting(token, Token.layer, Token.tstamp, Token.effects);
			}
		}
		return text;
	}

	parseTextModule() {
		const text = new TextModule();
		let token = this.nextTok();

		this.expecting(token, Token.reference, Token.value, Token.user);
		text.type = token.toString() as TextModuleType;

		this.needSYMBOLorNUMBER();
		text.text = this.curText();
		this.needLEFT();
		token = this.nextTok();
		this.expecting(token, Token.at);

		let x = this.parseBoardUnits('x');
		let y = this.parseBoardUnits('y');
		text.pos = new Point(x, y);

		token = this.nextTok();
		if ( token.isNUMBER()) {
			text.angle = this.parseFloat() * 10;
			this.needRIGHT();
		} else {
			this.expecting(token, Token.RIGHT);
		}

		for (let token = this.nextTok(); !Token.RIGHT.is(token); token = this.nextTok()) {
			if (token.is(Token.LEFT)) token = this.nextTok();

			if (token.is(Token.layer)) {
				text.layer = this.parseBoardItemLayer("layer");
				this.needRIGHT();
			} else
			if (token.is(Token.tstamp)) {
				text.tstamp = this.parseHex("tstamp");
				this.needRIGHT();
			} else
			if (token.is(Token.effects)) {
				this.parseEDATEXT(text);
			} else {
				this.expecting(token, Token.layer, Token.tstamp, Token.effects);
			}
		}
		return text;
	}

	parseEdgeModule() {
		const segment = new EdgeModule();
		let token = this.curTok();
		if (token.is(Token.fp_arc)) {
			segment.shape = Shape.ARC;

			{
				this.needLEFT();
				token = this.nextTok();
				this.expecting(token, Token.start, Token.center);
				let x = this.parseBoardUnits("x");
				let y = this.parseBoardUnits("y");
				segment.start = new Point(x, y);
				this.needRIGHT();
			}

			{
				this.needLEFT();
				token = this.nextTok();
				this.expecting(token, Token.end);
				let x = this.parseBoardUnits("x");
				let y = this.parseBoardUnits("y");
				segment.end = new Point(x, y);
				this.needRIGHT();
			}

			{
				this.needLEFT();
				token = this.nextTok();
				this.expecting(token, Token.angle);
				segment.angle = this.parseFloat("segment angle") * 10;
				this.needRIGHT();
			}
		} else
		if (token.is(Token.fp_circle)) {
			segment.shape = Shape.CIRCLE;
			{
				this.needLEFT();
				token = this.nextTok();
				this.expecting(token, Token.center);
				let x = this.parseBoardUnits("x");
				let y = this.parseBoardUnits("y");
				segment.start = new Point(x, y);
				this.needRIGHT();
			}

			{
				this.needLEFT();
				token = this.nextTok();
				this.expecting(token, Token.end);
				let x = this.parseBoardUnits("x");
				let y = this.parseBoardUnits("y");
				segment.end = new Point(x, y);
				this.needRIGHT();
			}
		} else
		if (token.is(Token.fp_curve)) {
			segment.shape = Shape.CURVE;
			this.needLEFT();
			token = this.nextTok();
			this.expecting(token, Token.pts);

			segment.start = this.parseXY("start");
			segment.bezierC1 = this.parseXY("bezierC1");
			segment.bezierC2 = this.parseXY("bezierC2");
			segment.end = this.parseXY("end");
			this.needRIGHT();
		} else
		if (token.is(Token.fp_line)) {
			segment.shape = Shape.SEGMENT;
			{
				this.needLEFT();
				token = this.nextTok();
				this.expecting(token, Token.start);
				const x = this.parseBoardUnits("x");
				const y = this.parseBoardUnits("y");
				segment.start = new Point(x, y);
				this.needRIGHT();
			}
			{
				this.needLEFT();
				token = this.nextTok();
				this.expecting(token, Token.end);
				const x = this.parseBoardUnits("x");
				const y = this.parseBoardUnits("y");
				segment.end = new Point(x, y);
				this.needRIGHT();
			};
		} else
		if (token.is(Token.fp_poly)) {
			segment.shape = Shape.POLYGON;
			this.needLEFT();
			token = this.nextTok();
			this.expecting(token, Token.pts);
			while ( !Token.RIGHT.is(token = this.nextTok()) ) {
				segment.polyPoints.push(this.parseXY("polypoint"));
			}
		} else {
			this.expecting(token, Token.fp_arc, Token.fp_circle, Token.fp_curve, Token.fp_line, Token.fp_poly);
		}

		for (let token = this.nextTok(); token && !token.is(Token.RIGHT); token = this.nextTok()) {
			this.expecting(token, Token.LEFT);

			token = this.nextTok();
			if (token.is(Token.layer)) {
				segment.layer = this.parseBoardItemLayer("layer");
			} else
			if (token.is(Token.width)) {
				segment.lineWidth = this.parseBoardUnits(Token.width.toString());
			} else
			if (token.is(Token.tstamp)) {
				segment.tstamp = this.parseHex("tstamp");
			} else
			if (token.is(Token.status)) {
				segment.status = this.parseHex("status");
			} else {
				this.expecting(token, Token.layer, Token.width, Token.tstamp, Token.status);
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
		if (token.is(Token.thru_hole)) {
			pad.attribute = PadAttr.STANDARD;
		} else
		if (token.is(Token.smd)) {
			pad.attribute = PadAttr.SMD;
			pad.drillSize = new Size(0, 0);
		} else
		if (token.is(Token.connect)) {
			pad.attribute = PadAttr.CONN;
			pad.drillSize = new Size(0, 0);
		} else
		if (token.is(Token.np_thru_hole)) {
			pad.attribute = PadAttr.HOLE_NOT_PLATED;
		} else{
			this.expecting(token, Token.thru_hole, Token.smd, Token.connect, Token.np_thru_hole);
		}

		token = this.nextTok();

		if (token.is(Token.circle)) {
			pad.shape = PadShape.CIRCLE;
		} else
		if (token.is(Token.rect)) {
			pad.shape = PadShape.RECT;
		} else
		if (token.is(Token.oval)) {
			pad.shape = PadShape.OVAL;
		} else
		if (token.is(Token.trapezoid)) {
			pad.shape = PadShape.TRAPEZOID;
		} else
		if (token.is(Token.roundrect)) {
			pad.shape = PadShape.ROUNDRECT;
		} else {
			this.expecting(token, Token.circle, Token.rect, Token.oval, Token.trapezoid, Token.roundrect);
		}

		for (let token = this.nextTok(); !Token.RIGHT.is(token); token = this.nextTok()) {
			this.expecting(token, Token.LEFT);

			token = this.nextTok();
			if (token.is(Token.size)) {
				let width = this.parseBoardUnits("width");
				let height = this.parseBoardUnits("height");
				pad.size = new Size(width, height);
				this.needRIGHT();
			} else
			if (token.is(Token.at)) {
				// console.log('at', this.tokens.slice(this.pos,this.pos+10));
				let x = this.parseBoardUnits("x");
				let y = this.parseBoardUnits("y");
				pad.pos = new Point(x, y);
				token = this.nextTok();
				if (token.isNUMBER()) {
					pad.orientation = this.parseFloat() * 10;
				} else {
					this.expecting(token, Token.RIGHT);
				}
			} else
			if (token.is(Token.rect_delta)) {
				let width = this.parseBoardUnits("width");
				let height = this.parseBoardUnits("height");
				pad.delta = new Size(width, height);
				this.needRIGHT();
			} else
			if (token.is(Token.drill)) {
				const drillSize = pad.drillSize;
				let haveWidth = false;

				for (let token = this.nextTok(); !Token.RIGHT.is(token); token = this.nextTok()) {
					if (token.is(Token.LEFT)) token = this.nextTok();
					if (token.is(Token.oval)) {
						pad.drillShape = PadDrillShape.OBLONG;
					} else
					if (token.isNUMBER()) {
						if (!haveWidth) {
							haveWidth = true;
							drillSize.width = this.parseBoardUnits();
							drillSize.height = this.parseBoardUnits();
						} else {
							drillSize.height = this.parseBoardUnits();
						}
					} else
					if (token.is(Token.offset)) {
						let x = this.parseBoardUnits("x");
						let y = this.parseBoardUnits("y");
						pad.offset = new Point(x, y);
						this.needRIGHT();
					} else {
						this.expecting(token, Token.oval, Token.offset);
					}

					if (pad.attribute === PadAttr.SMD || pad.attribute === PadAttr.CONN) {
						drillSize.width = 0;
						drillSize.height = 0;
					}
				}
			} else
			if (token.is(Token.layers)) {
				pad.layers =  this.parseBoardItemLayersAsMask("layers");
			} else
			if (token.is(Token.net)) {
				const net = this.parseInt("net");
				pad.netCode = this.netCodes[net];
				this.needSYMBOLorNUMBER();
				const name = this.curText();
				if (pad.netCode.name !== name) {
					throw "invalid net name";
				}
				this.needRIGHT();
			} else
			if (token.is(Token.die_length)) {
				pad.padToDieLength = this.parseBoardUnits(Token.die_length.toString());
				this.needRIGHT();
			} else
			if (token.is(Token.solder_mask_margin)) {
				pad.solderMaskMargin = this.parseBoardUnits("solder mask margin");
				this.needRIGHT();
			} else
			if (token.is(Token.solder_paste_margin)) {
				pad.solderPasteMargin = this.parseBoardUnits("solder paste margin");
				this.needRIGHT();
			} else
			if (token.is(Token.solder_paste_margin_ratio)) {
				pad.solderPasteRatio = this.parseFloat("solder paste ratio");
				this.needRIGHT();
			} else
			if (token.is(Token.clearance)) {
				pad.clearance = this.parseBoardUnits("clearance");
				this.needRIGHT();
			} else
			if (token.is(Token.zone_connect)) {
				pad.zoneConnection = this.parseInt("zone connect");
				this.needRIGHT();
			} else
			if (token.is(Token.thermal_width)) {
				pad.thermalWidth = this.parseBoardUnits("thermal width");
				this.needRIGHT();
			} else
			if (token.is(Token.thermal_gap)) {
				pad.thermalGap = this.parseBoardUnits("thermal gap");
				this.needRIGHT();
			} else
			if (token.is(Token.roundrect_rratio)) {
				pad.roundRectRatio = this.parseFloat("roundrect ratio");
				this.needRIGHT();
			} else {
				this.expecting(token,
					Token.size,
					Token.at,
					Token.rect_delta,
					Token.drill,
					Token.layers,
					Token.net,
					Token.die_length,
					Token.solder_mask_margin,
					Token.solder_paste_margin,
					Token.solder_paste_margin_ratio,
					Token.clearance,
					Token.zone_connect,
					Token.thermal_width,
					Token.thermal_gap,
					Token.roundrect_rratio,
				);
			}
		}

		return pad;
	}

	parseEDATEXT(text: Text) {
		for (let token = this.nextTok(); !Token.RIGHT.is(token); token = this.nextTok()) {
			if (token.is(Token.LEFT)) {
				token = this.nextTok();
			}
			if (token.is(Token.font)) {
				for (let token = this.nextTok(); !Token.RIGHT.is(token); token = this.nextTok()) {
					if (token.is(Token.LEFT)) continue;

					if (token.is(Token.size)) {
						const textHeight = this.parseBoardUnits("text height");
						const textWidth = this.parseBoardUnits("text width");
						text.size = textHeight;
						this.needRIGHT();
					} else
					if (token.is(Token.thickness)) {
						const lineWidth = this.parseBoardUnits("text thickness");
						text.lineWidth = lineWidth;
						this.needRIGHT();
					} else
					if (token.is(Token.bold)) {
						text.bold = true;
					} else
					if (token.is(Token.italic)) {
						text.italic = true;
					} else {
						this.expecting(token, Token.size, Token.thickness, Token.bold, Token.italic);
					}
				}
			} else
			if (token.is(Token.justify)) {
				for (let token = this.nextTok(); !Token.RIGHT.is(token); token = this.nextTok()) {
					if (token.is(Token.LEFT)) continue;
					if (token.is(Token.left)) {
						text.hjustify = TextHjustify.LEFT;
					} else
					if (token.is(Token.right)) {
						text.hjustify = TextHjustify.RIGHT;
					} else
					if (token.is(Token.top)) {
						text.vjustify = TextVjustify.TOP;
					} else
					if (token.is(Token.bottom)) {
						text.vjustify = TextVjustify.BOTTOM;
					} else
					if (token.is(Token.mirror)) {
						text.mirror = true;
					} else {
						this.expecting(token, Token.left, Token.right, Token.top, Token.bottom, Token.mirror);
					}
				}
			} else
			if (token.is(Token.hide)) {
				text.visibility = false;
			} else {
				this.expecting(Token.font, Token.justify, Token.hide);
			}
		}
	}

	parseDimensionSection() {
		const dimension = new Dimension();
		dimension.value = this.parseBoardUnits('dimension value');
		this.needLEFT();
		let token = this.nextTok();
		this.expecting(token, Token.width);
		dimension.lineWidth = this.parseBoardUnits("dimension width");
		this.needRIGHT();
		for (let token = this.nextTok(); Token.RIGHT.is(token); token = this.nextTok()) {
			this.expecting(token, Token.LEFT);
			token = this.nextTok();
			if (token.is(Token.layer)) {
				dimension.layer = this.parseBoardItemLayer("dimension layer");
				this.needRIGHT();
			} else
			if (token.is(Token.tstamp)) {
				dimension.tstamp = this.parseHex("tstamp");
				this.needRIGHT();
			} else
			if (token.is(Token.gr_text)) {
				dimension.text = this.parseTextSection();
				dimension.pos = dimension.text.pos;
			} else
			if (token.is(Token.feature1)) {
				this.needLEFT();
				token = this.nextTok();
				this.expecting(token, Token.pts);
				dimension.featureLineDO = this.parseXY("featureLineDO");
				dimension.featureLineDF = this.parseXY("featureLineDF");
				this.needRIGHT();
				this.needRIGHT();
			} else
			if (token.is(Token.feature2)) {
				this.needLEFT();
				token = this.nextTok();
				this.expecting(token, Token.pts);
				dimension.featureLineGO = this.parseXY("featureLineGO");
				dimension.featureLineGF = this.parseXY("featureLineGF");
				this.needRIGHT();
				this.needRIGHT();
			} else
			if (token.is(Token.crossbar)) {
				this.needLEFT();
				token = this.nextTok();
				this.expecting(token, Token.pts);
				dimension.crossBarO = this.parseXY("crossBarO");
				dimension.crossBarF = this.parseXY("crossBarF");
				this.needRIGHT();
				this.needRIGHT();
			} else
			if (token.is(Token.arrow1a)) {
				this.needLEFT();
				token = this.nextTok();
				this.expecting(token, Token.pts);
				dimension.crossBarF = this.parseXY("crossBarF");
				dimension.arrowD1F = this.parseXY("arrowD1F");
				this.needRIGHT();
				this.needRIGHT();
			} else
			if (token.is(Token.arrow1b)) {
				this.needLEFT();
				token = this.nextTok();
				this.expecting(token, Token.pts);
				dimension.crossBarF = this.parseXY("crossBarF");
				dimension.arrowD2F = this.parseXY("arrowD2F");
				this.needRIGHT();
				this.needRIGHT();
			} else
			if (token.is(Token.arrow2a)) {
				this.needLEFT();
				token = this.nextTok();
				this.expecting(token, Token.pts);
				dimension.crossBarO = this.parseXY("crossBarO");
				dimension.arrowG1F = this.parseXY("arrowG1F");
				this.needRIGHT();
				this.needRIGHT();
			} else
			if (token.is(Token.arrow2b)) {
				this.needLEFT();
				token = this.nextTok();
				this.expecting(token, Token.pts);
				dimension.crossBarO = this.parseXY("crossBarO");
				dimension.arrowG2F = this.parseXY("arrowG2F");
				this.needRIGHT();
				this.needRIGHT();
			} else {
				this.expecting(token,
					Token.layer,
					Token.tstamp,
					Token.gr_text,
					Token.feature1,
					Token.feature2,
					Token.crossbar,
					Token.arrow1a,
					Token.arrow1b,
					Token.arrow2a,
					Token.arrow2b,
				);
			}
		}
		return dimension;
	}

	parseModuleSection(): Module {
		console.log('parseModuleSection');
		const mod = new Module();

		this.needSYMBOLorNUMBER();
		const name = this.curText();
		const fpid = LibId.parse(name);

		for (let token = this.nextTok(); !Token.RIGHT.is(token); token = this.nextTok()) {
			console.log(token);
			if (token.is(Token.LEFT)) {
				token = this.nextTok();
			}
			if (token.is(Token.version)) {
				const version = this.parseInt("version");
				this.needRIGHT();
				this.requiredVersion = Math.max(version, this.requiredVersion);
				this.tooRecent = this.requiredVersion > SEXPR_BOARD_FILE_VERSION;
			} else
			if (token.is(Token.locked)) {
				mod.locked = true;
			} else
			if (token.is(Token.placed)) {
				mod.placed = true;
			} else
			if (token.is(Token.layer)) {
				mod.layer = this.parseBoardItemLayer("module layer");
				this.needRIGHT();
			} else
			if (token.is(Token.tedit)) {
				mod.lastEditTime = this.parseHex("tedit");
				this.needRIGHT();
			} else
			if (token.is(Token.tstamp)) {
				mod.tstamp = this.parseHex("tstamp");
			} else
			if (token.is(Token.at)) {
				const x = this.parseBoardUnits('at x');
				const y = this.parseBoardUnits('at y');
				mod.pos = new Point(x, y);

				token = this.nextTok();
				if (token.isNUMBER()) {
					mod.orientation = this.parseFloat() * 10.0;
					this.needRIGHT();
				} else  {
					this.expecting(token, Token.RIGHT);
				}
			} else
			if (token.is(Token.descr)) {
				this.needSYMBOLorNUMBER();
				mod.description = this.curText();
				this.needRIGHT();
			} else
			if (token.is(Token.tags)) {
				this.needSYMBOLorNUMBER();
				mod.keywords = this.curText();
				this.needRIGHT();
			} else
			if (token.is(Token.path)) {
				this.needSYMBOLorNUMBER();
				mod.path = this.curText();
				this.needRIGHT();
			} else
			if (token.is(Token.autoplace_cost90)) {
				mod.placementCost90 = this.parseInt("place cost 90");
				this.needRIGHT();
			} else
			if (token.is(Token.autoplace_cost180)) {
				mod.placementCost90 = this.parseInt("place cost 180");
				this.needRIGHT();
			} else
			if (token.is(Token.solder_mask_margin)) {
				mod.solderMaskMargin = this.parseBoardUnits("solder mask margin");
				this.needRIGHT();
			} else
			if (token.is(Token.solder_paste_margin)) {
				mod.solderPasteMargin = this.parseBoardUnits("solder paste margin");
				this.needRIGHT();
			} else
			if (token.is(Token.solder_paste_ratio)) {
				mod.solderPasteRatio = this.parseFloat("solder paste ratio");
				this.needRIGHT();
			} else
			if (token.is(Token.clearance)) {
				mod.clearance = this.parseBoardUnits("clearance");
				this.needRIGHT();
			} else
			if (token.is(Token.zone_connect)) {
				mod.zoneConnection = this.parseInt("zone connect");
				this.needRIGHT();
			} else
			if (token.is(Token.thermal_width)) {
				mod.thermalWidth = this.parseBoardUnits("thermal width");
				this.needRIGHT();
			} else
			if (token.is(Token.thermal_gap)) {
				mod.thermalGap = this.parseBoardUnits("thermal gap");
				this.needRIGHT();
			} else
			if (token.is(Token.attr)) {
				for (let token = this.nextTok(); Token.RIGHT.is(token); token = this.nextTok()) {
					if (token.is(Token.smd)) {
						mod.attributes |= MODULE_ATTR.MOD_CMS;
					} else
					if (token.is(Token.virtual)) {
						mod.attributes |= MODULE_ATTR.MOD_VIRTUAL;
					} else {
						this.expecting(token, Token.smd, Token.virtual);
					}
				}
			} else
			if (token.is(Token.fp_text)) {
				const text = this.parseTextModule();
				text.angle = text.angle - mod.orientation;
				if (text.type === TextModuleType.reference) {
					mod.reference = text;
				} else
				if (text.type === TextModuleType.value) {
					mod.value = text;
				} else {
					mod.graphics.push(text);
				}
			} else
			if (token.is(Token.fp_arc) ||
				token.is(Token.fp_circle) ||
				token.is(Token.fp_curve) ||
				token.is(Token.fp_line) ||
				token.is(Token.fp_poly)) {

				const edge = this.parseEdgeModule();
				mod.graphics.push(edge);
			} else
			if (token.is(Token.pad)) {
				const pad = this.parsePad();
				const pos = pad.pos;
				RotatePoint(pos, mod.orientation);
				pad.pos = Point.add(pos, mod.pos);
				mod.pads.push(pad);
			} else
			if (token.is(Token.model)) {
				this.skipSection();
			} else {
				this.expecting(token,
					Token.version,
					Token.locked,
					Token.placed,
					Token.layer,
					Token.tedit,
					Token.tstamp,
					Token.at,
					Token.descr,
					Token.tags,
					Token.path,
					Token.autoplace_cost90,
					Token.autoplace_cost180,
					Token.solder_mask_margin,
					Token.solder_paste_margin,
					Token.solder_paste_ratio,
					Token.clearance,
					Token.zone_connect,
					Token.thermal_width,
					Token.thermal_gap,
					Token.attr,
					Token.fp_text,
					Token.fp_arc,
					Token.fp_circle,
					Token.fp_curve,
					Token.fp_line,
					Token.fp_poly,
					Token.pad,
					Token.model,
				);
			}
		}

		return mod;
	}

	parseSegmentSection() {
		const track = new Track();

		for (let token = this.nextTok(); !Token.RIGHT.is(token); token = this.nextTok()) {
			this.expecting(token, Token.LEFT);
			token = this.nextTok();

			if (token.is(Token.start)) {
				const x = this.parseBoardUnits("x");
				const y = this.parseBoardUnits("y");
				track.start = new Point(x, y);
			} else
			if (token.is(Token.end)) {
				const x = this.parseBoardUnits("x");
				const y = this.parseBoardUnits("y");
				track.end = new Point(x, y);
			} else
			if (token.is(Token.width)) {
				track.width = this.parseBoardUnits("width");
			} else
			if (token.is(Token.layer)) {
				track.layer = this.parseBoardItemLayer("layer");
			} else
			if (token.is(Token.net)) {
				const net = this.parseInt("net");
				track.net = this.netCodes[net];
			} else
			if (token.is(Token.tstamp)) {
				track.tstamp = this.parseHex("tstamp");
			} else
			if (token.is(Token.status)) {
				track.status = this.parseHex("status");
			} else {
				this.expecting(token, Token.start, Token.end, Token.width, Token.layer, Token.net, Token.tstamp, Token.status);
			}
			this.needRIGHT();
		}

		return track;
	}

	parseViaSection() {
		const via = new Via();
		for (let token = this.nextTok(); !Token.RIGHT.is(token); token = this.nextTok()) {
			if (token.is(Token.LEFT)) continue;
			token = this.nextTok();

			if (token.is(Token.blind)) {
				via.viaType = ViaType.BLIND_BURIED;
			} else
			if (token.is(Token.micro)) {
				via.viaType = ViaType.MICROVIA;
			} else
			if (token.is(Token.at)) {
				let x = this.parseBoardUnits('x');
				let y = this.parseBoardUnits('y');
				const pos = new Point(x, y);
				via.start = pos;
				via.end = pos;
				this.needRIGHT();
			} else
			if (token.is(Token.size)) {
				via.width = this.parseBoardUnits("via width");
				this.needRIGHT();
			} else
			if (token.is(Token.drill)) {
				via.drill = this.parseBoardUnits("via drill");
				this.needRIGHT();
			} else
			if (token.is(Token.layers)) {
				this.nextTok();
				via.layer1 = this.layerIndices[this.curText()];
				via.layer2 = this.layerIndices[this.curText()];
				this.needRIGHT();
			} else
			if (token.is(Token.net)) {
				const net = this.parseInt("net");
				via.net = this.netCodes[net];
				this.needRIGHT();
			} else
			if (token.is(Token.tstamp)) {
				via.tstamp = this.parseHex("tstamp");
				this.needRIGHT();
			} else
			if (token.is(Token.status)) {
				via.status = this.parseHex("status");
				this.needRIGHT();
			} else {
				this.expecting(
					token,
					Token.blind,
					Token.micro,
					Token.at,
					Token.size,
					Token.drill,
					Token.layers,
					Token.net,
					Token.tstamp,
					Token.status
				);
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

	skipSection(): void {
		let token;
		for (let depth = 1; depth > 0;) {
			token = this.nextTok();
			if (token.is(Token.LEFT)) {
				depth++;
			} else
			if (token.is(Token.RIGHT)) {
				depth--;
			} else {
				// skip
			}
		}
	}
}

export enum LayerType {
	SIGNAL = "signal",
	POWER = "power",
	MIXED = "mixed",
	JUMPER = "jumper",
	UNDEFINED = "undefined",
}

export class Layer {
	constructor(public name: string, public type: LayerType, public number: number, public visible: boolean) {
		if (type !== LayerType.SIGNAL &&
			type !== LayerType.POWER &&
			type !== LayerType.MIXED &&
			type !== LayerType.JUMPER) {
			this.type = LayerType.UNDEFINED;
		}
	}
}

export class Board {
	filename: string = "";
	layers: Array<Layer> = [];

	boardDesignSetting: BoardDesignSetting = new BoardDesignSetting();
	pageInfo: PageInfo = PageInfo.A3;

	netInfos: Array<NetInfoItem> = [];
	drawSegments: Array<DrawSegment> = [];
	texts: Array<Text> = [];
	dimensions: Array<Dimension> = [];

	copperLayerCount: number = 0;
	enabledLayers: Array<number> = [];
	visibleLayers: Array<number> = [];
	layerDescr: { [key: number]: Layer } = {};
}

class PageInfo {
	pageType: string;
	width: number;
	height: number;
	portrait: boolean = false;

	static A4       = new PageInfo("A4"       , false , MM2MIL(297)  , MM2MIL(210));
	static A3       = new PageInfo("A3"       , false , MM2MIL(420)  , MM2MIL(297));
	static A2       = new PageInfo("A2"       , false , MM2MIL(594)  , MM2MIL(420));
	static A1       = new PageInfo("A1"       , false , MM2MIL(841)  , MM2MIL(594));
	static A0       = new PageInfo("A0"       , false , MM2MIL(1189) , MM2MIL(841));
	static A        = new PageInfo("A"        , false , 11000        , 8500);
	static B        = new PageInfo("B"        , false , 17000        , 11000);
	static C        = new PageInfo("C"        , false , 22000        , 17000);
	static D        = new PageInfo("D"        , false , 34000        , 22000);
	static E        = new PageInfo("E"        , false , 44000        , 34000);
	static GERBER   = new PageInfo("GERBER"   , false , 32000        , 32000);
	static User     = new PageInfo("User"     , false , 17000        , 11000);
	static USLetter = new PageInfo("USLetter" , false , 11000        , 8500);
	static USLegal  = new PageInfo("USLegal"  , false , 14000        , 8500);
	static USLedger = new PageInfo("USLedger" , false , 17000        , 11000);
	static PAGE_TYPES = [
		PageInfo.A4      ,
		PageInfo.A3      ,
		PageInfo.A2      ,
		PageInfo.A1      ,
		PageInfo.A0      ,
		PageInfo.A       ,
		PageInfo.B       ,
		PageInfo.C       ,
		PageInfo.D       ,
		PageInfo.E       ,
		PageInfo.GERBER  ,
		PageInfo.User    ,
		PageInfo.USLetter,
		PageInfo.USLegal ,
		PageInfo.USLedger,
	];

	constructor(pageType: string, portrait: boolean = false, width?: number, height?: number) {
		this.width = width || 0;
		this.height = height || 0;
		if (!width && !height) {
			this.setPageType(pageType);
		}
		this.setPortrait(portrait);
	}

	setPageType(pageType: string) {
		const page = PageInfo.PAGE_TYPES.find((i) => i.pageType === pageType);
		Object.assign(this, page);
	}

	setPortrait(portrait: boolean) {
		if (this.portrait != portrait) {
			[this.width, this.height] = [this.height, this.width];
		}
	}
}

export enum PCB_LAYER_ID {
	UNDEFINED_LAYER = -1,
	UNSELECTED_LAYER = -2,

	F_Cu = 0,           // 0
	In1_Cu,
	In2_Cu,
	In3_Cu,
	In4_Cu,
	In5_Cu,
	In6_Cu,
	In7_Cu,
	In8_Cu,
	In9_Cu,
	In10_Cu,
	In11_Cu,
	In12_Cu,
	In13_Cu,
	In14_Cu,
	In15_Cu,
	In16_Cu,
	In17_Cu,
	In18_Cu,
	In19_Cu,
	In20_Cu,
	In21_Cu,
	In22_Cu,
	In23_Cu,
	In24_Cu,
	In25_Cu,
	In26_Cu,
	In27_Cu,
	In28_Cu,
	In29_Cu,
	In30_Cu,
	B_Cu,           // 31

	B_Adhes,
	F_Adhes,

	B_Paste,
	F_Paste,

	B_SilkS,
	F_SilkS,

	B_Mask,
	F_Mask,

	Dwgs_User,
	Cmts_User,
	Eco1_User,
	Eco2_User,
	Edge_Cuts,
	Margin,

	B_CrtYd,
	F_CrtYd,

	B_Fab,
	F_Fab,

	PCB_LAYER_ID_COUNT
};

export class LSET {
	static AllCuMask(count?: number) {
		return new LSET(
			PCB_LAYER_ID.In1_Cu,
			PCB_LAYER_ID.In2_Cu,
			PCB_LAYER_ID.In3_Cu,
			PCB_LAYER_ID.In4_Cu,
			PCB_LAYER_ID.In5_Cu,
			PCB_LAYER_ID.In6_Cu,
			PCB_LAYER_ID.In7_Cu,
			PCB_LAYER_ID.In8_Cu,
			PCB_LAYER_ID.In9_Cu,
			PCB_LAYER_ID.In10_Cu,
			PCB_LAYER_ID.In11_Cu,
			PCB_LAYER_ID.In12_Cu,
			PCB_LAYER_ID.In13_Cu,
			PCB_LAYER_ID.In14_Cu,
			PCB_LAYER_ID.In15_Cu,
			PCB_LAYER_ID.In16_Cu,
			PCB_LAYER_ID.In17_Cu,
			PCB_LAYER_ID.In18_Cu,
			PCB_LAYER_ID.In19_Cu,
			PCB_LAYER_ID.In20_Cu,
			PCB_LAYER_ID.In21_Cu,
			PCB_LAYER_ID.In22_Cu,
			PCB_LAYER_ID.In23_Cu,
			PCB_LAYER_ID.In24_Cu,
			PCB_LAYER_ID.In25_Cu,
			PCB_LAYER_ID.In26_Cu,
			PCB_LAYER_ID.In27_Cu,
			PCB_LAYER_ID.In28_Cu,
			PCB_LAYER_ID.In29_Cu,
			PCB_LAYER_ID.In30_Cu,
		);
	}

	static Name(layerId: PCB_LAYER_ID) {
		switch (layerId) {
			case PCB_LAYER_ID.F_Cu:              return ( "F.Cu" );            
			case PCB_LAYER_ID.In1_Cu:            return ( "In1.Cu" );          
			case PCB_LAYER_ID.In2_Cu:            return ( "In2.Cu" );          
			case PCB_LAYER_ID.In3_Cu:            return ( "In3.Cu" );          
			case PCB_LAYER_ID.In4_Cu:            return ( "In4.Cu" );          
			case PCB_LAYER_ID.In5_Cu:            return ( "In5.Cu" );          
			case PCB_LAYER_ID.In6_Cu:            return ( "In6.Cu" );          
			case PCB_LAYER_ID.In7_Cu:            return ( "In7.Cu" );          
			case PCB_LAYER_ID.In8_Cu:            return ( "In8.Cu" );          
			case PCB_LAYER_ID.In9_Cu:            return ( "In9.Cu" );          
			case PCB_LAYER_ID.In10_Cu:           return ( "In10.Cu" );         
			case PCB_LAYER_ID.In11_Cu:           return ( "In11.Cu" );         
			case PCB_LAYER_ID.In12_Cu:           return ( "In12.Cu" );         
			case PCB_LAYER_ID.In13_Cu:           return ( "In13.Cu" );         
			case PCB_LAYER_ID.In14_Cu:           return ( "In14.Cu" );         
			case PCB_LAYER_ID.In15_Cu:           return ( "In15.Cu" );         
			case PCB_LAYER_ID.In16_Cu:           return ( "In16.Cu" );         
			case PCB_LAYER_ID.In17_Cu:           return ( "In17.Cu" );         
			case PCB_LAYER_ID.In18_Cu:           return ( "In18.Cu" );         
			case PCB_LAYER_ID.In19_Cu:           return ( "In19.Cu" );         
			case PCB_LAYER_ID.In20_Cu:           return ( "In20.Cu" );         
			case PCB_LAYER_ID.In21_Cu:           return ( "In21.Cu" );         
			case PCB_LAYER_ID.In22_Cu:           return ( "In22.Cu" );         
			case PCB_LAYER_ID.In23_Cu:           return ( "In23.Cu" );         
			case PCB_LAYER_ID.In24_Cu:           return ( "In24.Cu" );         
			case PCB_LAYER_ID.In25_Cu:           return ( "In25.Cu" );         
			case PCB_LAYER_ID.In26_Cu:           return ( "In26.Cu" );         
			case PCB_LAYER_ID.In27_Cu:           return ( "In27.Cu" );         
			case PCB_LAYER_ID.In28_Cu:           return ( "In28.Cu" );         
			case PCB_LAYER_ID.In29_Cu:           return ( "In29.Cu" );         
			case PCB_LAYER_ID.In30_Cu:           return ( "In30.Cu" );         
			case PCB_LAYER_ID.B_Cu:              return ( "B.Cu" );            

				// Technicals
			case PCB_LAYER_ID.B_Adhes:           return ( "B.Adhes" );         
			case PCB_LAYER_ID.F_Adhes:           return ( "F.Adhes" );         
			case PCB_LAYER_ID.B_Paste:           return ( "B.Paste" );         
			case PCB_LAYER_ID.F_Paste:           return ( "F.Paste" );         
			case PCB_LAYER_ID.B_SilkS:           return ( "B.SilkS" );         
			case PCB_LAYER_ID.F_SilkS:           return ( "F.SilkS" );         
			case PCB_LAYER_ID.B_Mask:            return ( "B.Mask" );          
			case PCB_LAYER_ID.F_Mask:            return ( "F.Mask" );          

				// Users
			case PCB_LAYER_ID.Dwgs_User:         return ( "Dwgs.User" );       
			case PCB_LAYER_ID.Cmts_User:         return ( "Cmts.User" );       
			case PCB_LAYER_ID.Eco1_User:         return ( "Eco1.User" );       
			case PCB_LAYER_ID.Eco2_User:         return ( "Eco2.User" );       
			case PCB_LAYER_ID.Edge_Cuts:         return ( "Edge.Cuts" );       
			case PCB_LAYER_ID.Margin:            return ( "Margin" );          

				// Footprint
			case PCB_LAYER_ID.F_CrtYd:           return ( "F.CrtYd" );         
			case PCB_LAYER_ID.B_CrtYd:           return ( "B.CrtYd" );         
			case PCB_LAYER_ID.F_Fab:             return ( "F.Fab" );           
			case PCB_LAYER_ID.B_Fab:             return ( "B.Fab" );           

			default:
				throw "layerId is out of range";
		}
	}

	private _layerIds: Array<PCB_LAYER_ID> = [];

	constructor(...layerIds: Array<PCB_LAYER_ID>) {
		this._layerIds = layerIds;
	}

	add(...layerIds: Array<PCB_LAYER_ID>): this {
		for (let id of layerIds) {
			if (this._layerIds.indexOf(id) === -1) {
				this._layerIds.push(id);
			}
		}
		return this;
	}

	delete(id: PCB_LAYER_ID): this {
		const pos = this._layerIds.indexOf(id);
		if (pos === -1) return this;
		this._layerIds.splice(pos, 1);
		return this;
	}

	union(o: LSET): this {
		this.add(... o._layerIds);
		return this;
	}

	intersect(o: LSET): this {
		// TODO
		return this;
	}

	except(o: LSET): this {
		// TODO
		return this;
	}
}

class ViaDimension {
	constructor(public diameter: number, public drill: number) {
	}

	is(o: ViaDimension): boolean {
		return this.diameter === o.diameter && this.drill === o.diameter;
	}

	lessThan(o: ViaDimension): boolean {
		if (this.diameter != o.diameter) {
			return this.diameter < o.diameter;
		}
		return this.drill < o.drill;
	}
}

class BoardDesignSetting {
	viasDimenstionsList: Array<ViaDimension> = [];
	trackWidthList: Array<number> = [];
	netClasses: NetClasses = new NetClasses();

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
	VIA_BLIND_BURIED, 
	VIA_THROUGH,
	VIA_MICROVIA   
}

class NetClasses {
	default: NetClass;
	netClasses: { [key: string]: NetClass } = {};

	add(nc: NetClass) {
		if (nc.name === 'Default') {
			this.default = nc;
		} else {
			this.netClasses[nc.name] = nc;
		}
	}
}

class NetClass {
	name: string;
	description: string;
	members: Array<string> = [];

	clearance: number;
	trackWidth: number;
	viaDia: number;
	viaDrill: number;
	microViaDia: number;
	microViaDrill: number;
	diffPairWidth: number;
	diffPairGap: number;

	constructor(name: string="") {
	}
}

abstract class BoardItem {
	pos: Point = new Point(0, 0);
	layer: number = 0;
	tstamp: number = 0;
	status: number = 0;
	attributes: number = 0;
}

class NetInfoItem extends BoardItem {
	netCode: number;
	name: string;
	shortName: string;
	netClassName: string;
	netClass: NetClass;
	board: Board;
	constructor(parent: Board, name: string, netCode: number = -1) {
		super();
		this.board = parent;
		this.name = name;
		this.netCode = netCode;
	}
}

// T_STROKE
enum Shape {
	SEGMENT = 0,  ///< usual segment : line with rounded ends
	RECT,         ///< segment with non rounded ends
	ARC,          ///< Arcs (with rounded ends)
	CIRCLE,       ///< ring
	POLYGON,      ///< polygon (not yet used for tracks, but could be in microwave apps)
	CURVE,        ///< Bezier Curve
	LAST          ///< last value for this list
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

	bezierPoints: Array<Point> = [];
	polyPoints: Array<Point> = [];
}

class EdgeModule extends DrawSegment {
}

class Text extends BoardItem {
	text: string;
	angle: number;
	size: number;
	lineWidth: number;
	bold: boolean = false;
	italic: boolean = false;
	mirror: boolean = false;
	hjustify: TextHjustify = TextHjustify.CENTER;
	vjustify: TextVjustify = TextVjustify.CENTER;
	visibility: boolean = true;
}

enum Unit {
	MM = "mm",
	INCH = "inch",
}

class Dimension extends BoardItem {
	lineWidth: number;
	shape: number = 0;
	unit: Unit = Unit.MM;
	value: number;
	height: number;
	text: Text;

	crossBarO: Point;
	crossBarF: Point;
	featureLineGO : Point;
	featureLineGF: Point;
	featureLineDO : Point;
	featureLineDF: Point;
	arrowD1F : Point;
	arrowD2F: Point;
	arrowG1F : Point;
	arrowG2F: Point;
}

export class Module extends BoardItem {
	fpid: LibId;
	locked: boolean;
	placed: boolean;
	lastEditTime: number;
	orientation: number = 0;
	description: string;
	keywords: string;
	path: string;
	placementCost90: number = 0;
	placementCost180: number = 0;
	solderMaskMargin: number = 0;
	solderPasteMargin: number = 0;
	solderPasteRatio: number = 0;
	clearance: number = 0;
	zoneConnection: number = 0;
	thermalWidth: number = 0;
	thermalGap: number = 0;

	graphics: Array<BoardItem> = [];
	reference: TextModule;
	value: TextModule;

	pads: Array<Pad> = [];
	model3D: any;
}


class LibId {
	static parse(id: string) {
		const [name, rev] = id.split(/\//);
		const [nickname, itemname] = name.split(/:/);
		return new this(nickname, itemname, rev);
	}

	constructor(public nickname: string, itemname: string, revision: string) {
	}
}

class Pad {
	pos: Point;
	name: string;
	shape: PadShape;
	drillShape: PadDrillShape;
	attribute: PadAttr;
	drillSize: Size;
	size: Size;
	orientation: number = 0;
	delta: Size;
	offset: Point;
	layers: LSET;
	netCode: NetClass;
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
	CIRCLE,
	RECT,
	OVAL,
	TRAPEZOID,
	ROUNDRECT,
};

enum PadDrillShape {
	CIRCLE,
	OBLONG,
};


enum PadAttr {
	STANDARD = "STANDARD",
	SMD = "SMD",
	CONN = "CONN",
	HOLE_NOT_PLATED = "HOLE_NOT_PLATED",
};


class TextModule extends Text {
	type: TextModuleType = TextModuleType.user;
}

enum TextModuleType {
	reference = "reference",
	value = "value",
	user = "user",
}

enum MODULE_ATTR {
	MOD_DEFAULT = 0,    ///< default
	MOD_CMS     = 1,    ///< Set for modules listed in the automatic insertion list
						///< (usually SMD footprints)
	MOD_VIRTUAL = 2     ///< Virtual component: when created by copper shapes on
						///<  board (Like edge card connectors, mounting hole...)
};

class Track extends BoardItem {
	start: Point;
	end: Point;
	net: NetClass;
	width: number;
}

enum ViaType {
	THROUGH      = 3,      /* Always a through hole via */
	BLIND_BURIED = 2,      /* this via can be on internal layers */
	MICROVIA     = 1,      /* this via which connect from an external layer
							* to the near neighbor internal layer */
	NOT_DEFINED  = 0       /* not yet used */
}

class Via extends BoardItem {
	viaType: ViaType = ViaType.THROUGH;
	start: Point;
	end: Point;
	width: number;
	drill: number;
	layer1: PCB_LAYER_ID;
	layer2: PCB_LAYER_ID;
	net: NetClass;
}
