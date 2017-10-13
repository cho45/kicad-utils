//#!npm run test-one

import * as assert from "assert";
import * as mocha from 'mocha';

import {
	TextHjustify,
	TextVjustify,
	TextAngle,
	Fill,
	PinOrientation,
	PinType,
} from "../src/kicad_common";

import { Lib } from "../src/kicad_lib";

function indent (literals: TemplateStringsArray, ...placeholders: Array<any>):string {
	let result = "";

	for (let i = 0; i < placeholders.length; i++) {
		result += literals[i];
		result += String(placeholders[i]);
	}

	result += literals[literals.length - 1];

	result = result.replace(/^\n|\s+$/g, '');
	const indent = result.match(/^\s+/);
	if (indent) {
		result = result.replace(new RegExp("^" + indent[0], "gm"), "");
	}

	return result;
}

/*
describe("", () => {
	it("", () => {
	});
});
*/


describe("Library.load", () => {
	it("has version check", () => {
		assert.doesNotThrow( () => {
			Lib.Library.load(indent `
				EESchema-LIBRARY Version 2.3
			`);
		});
		assert.doesNotThrow( () => {
			Lib.Library.load(indent `
				EESchema-LIBRARY Version 2.2
			`);
		});
		assert.throws( () => {
			Lib.Library.load(indent `
				EESchema-LIBRARY Version 2.4
			`);
		}, 'library format version is greater than supported version: 2.4 > 2.3');

		assert.throws( () => {
			Lib.Library.load(indent `
			invalid format
			`);
		}, 'unknown library format');
	});

	it("can load basic definition", () => {
		const lib = Lib.Library.load(indent `
			EESchema-LIBRARY Version 2.3
			#
			# CONN_01X01
			#
			DEF CONN_01X01 P 0 40 Y N 1 F N
			F0 "P" 0 100 50 H V C CNN
			F1 "CONN_01X01" 100 0 50 V V C CNN
			F2 "" 0 0 50 H V C CNN
			F3 "" 0 0 50 H V C CNN
			$FPLIST
			 Pin_Header_Straight_1X01
			 Pin_Header_Angled_1X01
			 Socket_Strip_Straight_1X01
			 Socket_Strip_Angled_1X01
			$ENDFPLIST
			DRAW
			S -50 5 10 -5 0 1 0 N
			S -50 50 50 -50 0 1 0 N
			X P1 1 -200 0 150 R 50 50 1 1 P
			P 2 0 1 0 -50 70 -50 110 N
			A 0 -150 128 1287 513 0 1 20 N -80 -50 80 -50
			C -100 0 35 0 1 0 N
			T 0 -75 -250 50 0 0 0 B Normal 0 C C
			ENDDRAW
			ENDDEF
			#
			#End Library
		`);
		assert(lib.components.length === 1);
		assert(lib.findByName('CONN_01X01') instanceof Lib.LibComponent);

		const c = lib.findByName('CONN_01X01');
		if (!c) throw "component is not found";
		assert(c.name === 'CONN_01X01');
		assert(c.reference === 'P');
		assert(c.textOffset === 40);
		assert(c.drawPinname === false);
		assert(c.drawPinnumber === true);
		assert(c.unitCount === 1);
		assert(c.unitsLocked === false);
		assert(c.optionFlag === 'N');

		assert(c.field.reference === 'P');
		assert(c.field.pos.x === 0);
		assert(c.field.pos.y === 100);
		assert(c.field.textSize === 50);
		assert(c.field.textOrientation === TextAngle.HORIZ);
		assert(c.field.visibility === true);
		assert(c.field.hjustify === TextHjustify.CENTER);
		assert(c.field.vjustify === TextVjustify.CENTER);
		assert(c.field.italic === false);
		assert(c.field.bold === false);

		assert(c.fields[0].name === 'CONN_01X01');
		assert(c.fields[0].pos.x === 100);
		assert(c.fields[0].pos.y === 0);
		assert(c.fields[0].textSize === 50);
		assert(c.fields[0].textOrientation === TextAngle.VERT);
		assert(c.fields[0].visibility === true);
		assert(c.fields[0].hjustify === TextHjustify.CENTER);
		assert(c.fields[0].vjustify === TextVjustify.CENTER);
		assert(c.fields[0].italic === false);
		assert(c.fields[0].bold === false);

		assert(c.fplist.length === 4);
		assert(c.draw.objects.length === 7);

		// S -50 5 10 -5 0 1 0 N
		assert(c.draw.objects[0] instanceof Lib.DrawSquare);
		assert((c.draw.objects[0] as Lib.DrawSquare).start.x === -50);
		assert((c.draw.objects[0] as Lib.DrawSquare).start.y === 5);
		assert((c.draw.objects[0] as Lib.DrawSquare).end.x === 10);
		assert((c.draw.objects[0] as Lib.DrawSquare).end.y === -5);
		assert((c.draw.objects[0] as Lib.DrawSquare).unit === 0);
		assert((c.draw.objects[0] as Lib.DrawSquare).convert === 1);
		assert((c.draw.objects[0] as Lib.DrawSquare).lineWidth === 0);
		assert((c.draw.objects[0] as Lib.DrawSquare).fill === Fill.NO_FILL);

		// S -50 50 50 -50 0 1 0 N
		assert(c.draw.objects[1] instanceof Lib.DrawSquare);
		assert((c.draw.objects[1] as Lib.DrawSquare).start.x === -50);
		assert((c.draw.objects[1] as Lib.DrawSquare).start.y === 50);
		assert((c.draw.objects[1] as Lib.DrawSquare).end.x === 50);
		assert((c.draw.objects[1] as Lib.DrawSquare).end.y === -50);
		assert((c.draw.objects[1] as Lib.DrawSquare).unit === 0);
		assert((c.draw.objects[1] as Lib.DrawSquare).convert === 1);
		assert((c.draw.objects[1] as Lib.DrawSquare).lineWidth === 0);
		assert((c.draw.objects[1] as Lib.DrawSquare).fill === Fill.NO_FILL);

		// X P1 1 -200 0 150 R 50 50 1 1 P
		assert(c.draw.objects[2] instanceof Lib.DrawPin);
		assert((c.draw.objects[2] as Lib.DrawPin).name === "P1");
		assert((c.draw.objects[2] as Lib.DrawPin).num === "1");
		assert((c.draw.objects[2] as Lib.DrawPin).pos.x === -200);
		assert((c.draw.objects[2] as Lib.DrawPin).pos.x === -200);
		assert((c.draw.objects[2] as Lib.DrawPin).length === 150);
		assert((c.draw.objects[2] as Lib.DrawPin).orientation === PinOrientation.RIGHT);
		assert((c.draw.objects[2] as Lib.DrawPin).nameTextSize === 50);
		assert((c.draw.objects[2] as Lib.DrawPin).numTextSize === 50);
		assert((c.draw.objects[2] as Lib.DrawPin).unit === 1);
		assert((c.draw.objects[2] as Lib.DrawPin).convert === 1);
		assert((c.draw.objects[2] as Lib.DrawPin).pinType === PinType.PASSIVE);
		assert.deepEqual((c.draw.objects[2] as Lib.DrawPin).attributes, []);
		assert((c.draw.objects[2] as Lib.DrawPin).visibility === true);

		// P 2 0 1 0 -50 70 -50 110 N
		assert(c.draw.objects[3] instanceof Lib.DrawPolyline);
		assert((c.draw.objects[3] as Lib.DrawPolyline).pointCount === 2);
		assert((c.draw.objects[3] as Lib.DrawPolyline).unit === 0);
		assert((c.draw.objects[3] as Lib.DrawPolyline).convert === 1);
		assert((c.draw.objects[3] as Lib.DrawPolyline).lineWidth === 0);
		assert.deepEqual((c.draw.objects[3] as Lib.DrawPolyline).points, [{ x: -50, y: 70 }, {x: -50, y: 110 }]);
		assert((c.draw.objects[3] as Lib.DrawPolyline).fill === Fill.NO_FILL);

		// A 0 -150 128 1287 513 0 1 20 N -80 -50 80 -50
		assert(c.draw.objects[4] instanceof Lib.DrawArc);
		assert((c.draw.objects[4] as Lib.DrawArc).pos.x === 0);
		assert((c.draw.objects[4] as Lib.DrawArc).pos.y === -150);
		assert((c.draw.objects[4] as Lib.DrawArc).radius === 128);
		assert((c.draw.objects[4] as Lib.DrawArc).startAngle === 1287);
		assert((c.draw.objects[4] as Lib.DrawArc).endAngle === 513);
		assert((c.draw.objects[4] as Lib.DrawArc).unit === 0);
		assert((c.draw.objects[4] as Lib.DrawArc).convert === 1);
		assert((c.draw.objects[4] as Lib.DrawArc).lineWidth === 20);
		assert((c.draw.objects[4] as Lib.DrawArc).fill === Fill.NO_FILL);
		assert((c.draw.objects[4] as Lib.DrawArc).start.x === -80);
		assert((c.draw.objects[4] as Lib.DrawArc).start.y === -50);
		assert((c.draw.objects[4] as Lib.DrawArc).end.x === 80);
		assert((c.draw.objects[4] as Lib.DrawArc).end.y === -50);

		// C -100 0 35 0 1 0 N
		assert(c.draw.objects[5] instanceof Lib.DrawCircle);
		assert((c.draw.objects[5] as Lib.DrawCircle).pos.x === -100);
		assert((c.draw.objects[5] as Lib.DrawCircle).pos.y === 0);
		assert((c.draw.objects[5] as Lib.DrawCircle).radius === 35);
		assert((c.draw.objects[5] as Lib.DrawCircle).unit === 0);
		assert((c.draw.objects[5] as Lib.DrawCircle).convert === 1);
		assert((c.draw.objects[5] as Lib.DrawCircle).lineWidth === 0);
		assert((c.draw.objects[5] as Lib.DrawCircle).fill === Fill.NO_FILL);

		// T 0 -75 -250 50 0 0 0 B Normal 0 C C
		assert(c.draw.objects[6] instanceof Lib.DrawText);
		assert((c.draw.objects[6] as Lib.DrawText).angle === 0);
		assert((c.draw.objects[6] as Lib.DrawText).pos.x === -75);
		assert((c.draw.objects[6] as Lib.DrawText).pos.y === -250);
		assert((c.draw.objects[6] as Lib.DrawText).textSize === 50);
		assert((c.draw.objects[6] as Lib.DrawText).textType === 0);
		assert((c.draw.objects[6] as Lib.DrawText).unit === 0);
		assert((c.draw.objects[6] as Lib.DrawText).convert === 0);
		assert((c.draw.objects[6] as Lib.DrawText).text === "B");
		assert((c.draw.objects[6] as Lib.DrawText).italic === false);
		assert((c.draw.objects[6] as Lib.DrawText).bold === false);
		assert((c.draw.objects[6] as Lib.DrawText).hjustify === TextHjustify.CENTER);
		assert((c.draw.objects[6] as Lib.DrawText).vjustify === TextVjustify.CENTER);
	});

	it("can treat Pin (X) correctly", () => {
		const lib = Lib.Library.load(indent `
			EESchema-LIBRARY Version 2.3
			DEF TEST T 0 40 Y N 1 F N
			F0 "T" 0 100 50 H V C CNN
			F1 "TEST" 100 0 50 V V C CNN
			F2 "" 0 0 50 H V C CNN
			F3 "" 0 0 50 H V C CNN
			DRAW
			X P1 1 -200 0 150 R 50 50 1 1 P N
			ENDDRAW
			ENDDEF
			#
			#End Library
		`);
		assert(lib.components.length === 1);
		assert(lib.findByName('TEST') instanceof Lib.LibComponent);

		const c = lib.findByName('TEST');
		if (!c) throw "component is not found";
		// X P1 1 -200 0 150 R 50 50 1 1 P N
		assert(c.draw.objects[0] instanceof Lib.DrawPin);
		assert((c.draw.objects[0] as Lib.DrawPin).name === "P1");
		assert((c.draw.objects[0] as Lib.DrawPin).num === "1");
		assert((c.draw.objects[0] as Lib.DrawPin).pos.x === -200);
		assert((c.draw.objects[0] as Lib.DrawPin).pos.x === -200);
		assert((c.draw.objects[0] as Lib.DrawPin).length === 150);
		assert((c.draw.objects[0] as Lib.DrawPin).orientation === PinOrientation.RIGHT);
		assert((c.draw.objects[0] as Lib.DrawPin).nameTextSize === 50);
		assert((c.draw.objects[0] as Lib.DrawPin).numTextSize === 50);
		assert((c.draw.objects[0] as Lib.DrawPin).unit === 1);
		assert((c.draw.objects[0] as Lib.DrawPin).convert === 1);
		assert((c.draw.objects[0] as Lib.DrawPin).pinType === PinType.PASSIVE);
		assert.deepEqual((c.draw.objects[0] as Lib.DrawPin).attributes, ["N"]);
		assert((c.draw.objects[0] as Lib.DrawPin).visibility === false);
	});

	it("can treat Text (T) correctly", () => {
		const lib = Lib.Library.load(indent `
			EESchema-LIBRARY Version 2.3
			DEF TEST T 0 40 Y N 1 F N
			F0 "T" 0 100 50 H V C CNN
			F1 "TEST" 100 0 50 V V C CNN
			F2 "" 0 0 50 H V C CNN
			F3 "" 0 0 50 H V C CNN
			DRAW
			T 900 -75 -250 50 0 2 3 Foo~Bar Italic 1 R B
			T 900 -75 -250 50 0 2 3 "Foo''Bar''" Italic 1 R B
			T 900 -75 -250 50 0 2 3 "Foo~Bar''" Italic 1 R B
			ENDDRAW
			ENDDEF
			#
			#End Library
		`);
		assert(lib.components.length === 1);
		assert(lib.findByName('TEST') instanceof Lib.LibComponent);

		const c = lib.findByName('TEST');
		if (!c) throw "component is not found";
		assert(c.draw.objects[0] instanceof Lib.DrawText);
		assert((c.draw.objects[0] as Lib.DrawText).angle === 900);
		assert((c.draw.objects[0] as Lib.DrawText).pos.x === -75);
		assert((c.draw.objects[0] as Lib.DrawText).pos.y === -250);
		assert((c.draw.objects[0] as Lib.DrawText).textSize === 50);
		assert((c.draw.objects[0] as Lib.DrawText).textType === 0);
		assert((c.draw.objects[0] as Lib.DrawText).unit === 2);
		assert((c.draw.objects[0] as Lib.DrawText).convert === 3);
		assert((c.draw.objects[0] as Lib.DrawText).text === "Foo Bar");
		assert((c.draw.objects[0] as Lib.DrawText).italic === true);
		assert((c.draw.objects[0] as Lib.DrawText).bold === true);
		assert((c.draw.objects[0] as Lib.DrawText).hjustify === TextHjustify.RIGHT);
		assert((c.draw.objects[0] as Lib.DrawText).vjustify === TextVjustify.BOTTOM);

		assert((c.draw.objects[1] as Lib.DrawText).text === 'Foo"Bar"');
		assert((c.draw.objects[2] as Lib.DrawText).text === 'Foo~Bar"');
	});

	it("can treat Polyline (P) correctly", () => {
		const lib = Lib.Library.load(indent `
			EESchema-LIBRARY Version 2.3
			DEF TEST T 0 40 Y N 1 F N
			F0 "T" 0 100 50 H V C CNN
			F1 "TEST" 100 0 50 V V C CNN
			F2 "" 0 0 50 H V C CNN
			F3 "" 0 0 50 H V C CNN
			DRAW
			P 2 0 1 0 -50 70 -50 110 F
			P 2 2 3 4 -50 70 -50 110
			ENDDRAW
			ENDDEF
			#
			#End Library
		`);
		assert(lib.components.length === 1);
		assert(lib.findByName('TEST') instanceof Lib.LibComponent);

		const c = lib.findByName('TEST');
		if (!c) throw "component is not found";
		assert(c.draw.objects[0] instanceof Lib.DrawPolyline);
		assert((c.draw.objects[0] as Lib.DrawPolyline).pointCount === 2);
		assert((c.draw.objects[0] as Lib.DrawPolyline).unit === 0);
		assert((c.draw.objects[0] as Lib.DrawPolyline).convert === 1);
		assert((c.draw.objects[0] as Lib.DrawPolyline).lineWidth === 0);
		assert.deepEqual((c.draw.objects[0] as Lib.DrawPolyline).points, [{x: -50, y: 70}, {x:-50, y:110}]);
		assert((c.draw.objects[0] as Lib.DrawPolyline).fill === Fill.FILLED_SHAPE);

		assert(c.draw.objects[1] instanceof Lib.DrawPolyline);
		assert((c.draw.objects[1] as Lib.DrawPolyline).pointCount === 2);
		assert((c.draw.objects[1] as Lib.DrawPolyline).unit === 2);
		assert((c.draw.objects[1] as Lib.DrawPolyline).convert === 3);
		assert((c.draw.objects[1] as Lib.DrawPolyline).lineWidth === 4);
		assert.deepEqual((c.draw.objects[1] as Lib.DrawPolyline).points, [{x: -50, y: 70}, {x:-50, y:110}]);
		assert((c.draw.objects[1] as Lib.DrawPolyline).fill === Fill.NO_FILL);
	});

	it("can treat field correctly", () => {
		const lib = Lib.Library.load(indent `
			EESchema-LIBRARY Version 2.3
			DEF Battery BT 0 0 N Y 1 F N
			F0 "BT" 100 50 50 H V L CNN
			F1 "Battery" 100 -50 50 H V L CNN
			F2 "" 0 40 50 V V C CNN
			F3 "" 0 40 50 V V C CNN
			DRAW
			S -90 -7 90 -17 0 1 0 F
			S -90 50 90 40 0 1 0 F
			S -62 -30 58 -50 0 1 0 F
			S -62 27 58 7 0 1 0 F
			P 2 0 1 10  20 95  60 95 N
			P 2 0 1 10  40 115  40 75 N
			X ~ 1 0 150 100 D 50 50 1 1 P
			X ~ 2 0 -150 100 U 50 50 1 1 P
			ENDDRAW
			ENDDEF
			#
			#End Library
		`);
		assert(lib.components.length === 1);
		assert(lib.findByName('Battery') instanceof Lib.LibComponent);

		const c = lib.findByName('Battery');
		if (!c) throw "component is not found";
		assert(c.field.reference === 'BT');
		assert(c.field.pos.x === 100);
		assert(c.field.pos.y === 50);
		assert(c.field.textSize === 50);
		assert(c.field.textOrientation === 0);
		assert(c.field.visibility === true);
		assert(c.field.hjustify === TextHjustify.LEFT);
		assert(c.field.vjustify === TextVjustify.CENTER);
		assert(c.field.italic === false);
		assert(c.field.bold === false);
	});
});
