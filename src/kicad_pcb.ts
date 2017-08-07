//#!tsc && NODE_PATH=dist/src node dist/sketch3.js 

import {
	MIL2MM,
	MM2MIL,
	Point,
} from "./kicad_common";

import { Token } from "./kicad_pcb_token";

// pcbnew/pcb_parser.cpp 
export class PCB {
	tokens: Array<Token>;
	pos: number;
	layerIndices: { [key: string]: number } = {};
	layerMasks: { [key: string]: LSET } = {};
	netCodes: { [key: number]: NetClass } = {};

	board: Board;

	static load(content: string): PCB {
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
		pcb.parse();
		return pcb;
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
		return parseFloat(this.curText());
	}

	parseBoardUnits(expected?: string) {
		return MM2MIL(this.parseFloat(expected));
	}

	// unify interface to parseInt
	parseHex(expected?: string) {
		if (expected) {
			// XXX
			this.nextTok();
		}
		return parseInt(this.curText(), 16);
	}

	// unify interface to parseInt
	parseBool(expected?: string) {
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

	parse(): void {
		let token = this.curTok();
		this.expecting(token, Token.LEFT);

		token = this.nextTok();
		if (token.is(Token.kicad_pcb)) {
			this.board = new Board();
			this.parseBoard();
		} else
		if (token.is(Token.module)) {
			this.parseModule();
		} else {
			throw 'unknown token ' + token;
		}
	}

	parseBoard(): void {
		console.log('parseBoard');
		this.parseHeader();

		for (let token = this.nextTok(); token && !token.is(Token.RIGHT); token = this.nextTok()) {
			this.expecting(token, Token.LEFT);

			token = this.nextTok();
			console.log(token);

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
				this.parseTextSection();
			} else
			if (token.is(Token.dimension)) {
				this.parseDimensionSection();
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

	parseModule(): void {
		console.log('parseModule');
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
			const width = this.parseFloat(); // unit=mm
			const height = this.parseFloat(); // unit=mm
			console.log('custom', width, height);
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
		this.skipSection();
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
		console.log(PageInfo.PAGE_TYPES);
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

	layerIds: Array<PCB_LAYER_ID> = [];

	constructor(...layerIds: Array<PCB_LAYER_ID>) {
		this.layerIds = layerIds;
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
