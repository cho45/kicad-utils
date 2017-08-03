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

import {
	Library,
	LibComponent,
	DrawArc,
	DrawPin,
	DrawPolyline,
	DrawCircle,
	DrawSquare,
	DrawText,
} from "../src/kicad_lib";

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
			Library.load(indent `
				EESchema-LIBRARY Version 2.3
			`);
		});
		assert.doesNotThrow( () => {
			Library.load(indent `
				EESchema-LIBRARY Version 2.2
			`);
		});
		assert.throws( () => {
			Library.load(indent `
				EESchema-LIBRARY Version 2.4
			`);
		}, 'library format version is greater than supported version: 2.4 > 2.3');

		assert.throws( () => {
			Library.load(indent `
			invalid format
			`);
		}, 'unknown library format');
	});

	it("can load basic definition", () => {
		const lib = Library.load(indent `
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
		assert(lib.findByName('CONN_01X01') instanceof LibComponent);

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
		assert(c.field.posx === 0);
		assert(c.field.posy === 100);
		assert(c.field.textSize === 50);
		assert(c.field.textOrientation === TextAngle.HORIZ);
		assert(c.field.visibility === true);
		assert(c.field.hjustify === TextHjustify.CENTER);
		assert(c.field.vjustify === TextVjustify.CENTER);
		assert(c.field.italic === false);
		assert(c.field.bold === false);

		assert(c.fields[0].name === 'CONN_01X01');
		assert(c.fields[0].posx === 100);
		assert(c.fields[0].posy === 0);
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
		assert(c.draw.objects[0] instanceof DrawSquare);
		assert((c.draw.objects[0] as DrawSquare).startx === -50);
		assert((c.draw.objects[0] as DrawSquare).starty === 5);
		assert((c.draw.objects[0] as DrawSquare).endx === 10);
		assert((c.draw.objects[0] as DrawSquare).endy === -5);
		assert((c.draw.objects[0] as DrawSquare).unit === 0);
		assert((c.draw.objects[0] as DrawSquare).convert === 1);
		assert((c.draw.objects[0] as DrawSquare).lineWidth === 0);
		assert((c.draw.objects[0] as DrawSquare).fill === Fill.NO_FILL);

		// S -50 50 50 -50 0 1 0 N
		assert(c.draw.objects[1] instanceof DrawSquare);
		assert((c.draw.objects[1] as DrawSquare).startx === -50);
		assert((c.draw.objects[1] as DrawSquare).starty === 50);
		assert((c.draw.objects[1] as DrawSquare).endx === 50);
		assert((c.draw.objects[1] as DrawSquare).endy === -50);
		assert((c.draw.objects[1] as DrawSquare).unit === 0);
		assert((c.draw.objects[1] as DrawSquare).convert === 1);
		assert((c.draw.objects[1] as DrawSquare).lineWidth === 0);
		assert((c.draw.objects[1] as DrawSquare).fill === Fill.NO_FILL);

		// X P1 1 -200 0 150 R 50 50 1 1 P
		assert(c.draw.objects[2] instanceof DrawPin);
		assert((c.draw.objects[2] as DrawPin).name === "P1");
		assert((c.draw.objects[2] as DrawPin).num === "1");
		assert((c.draw.objects[2] as DrawPin).posx === -200);
		assert((c.draw.objects[2] as DrawPin).posx === -200);
		assert((c.draw.objects[2] as DrawPin).length === 150);
		assert((c.draw.objects[2] as DrawPin).orientation === PinOrientation.RIGHT);
		assert((c.draw.objects[2] as DrawPin).nameTextSize === 50);
		assert((c.draw.objects[2] as DrawPin).numTextSize === 50);
		assert((c.draw.objects[2] as DrawPin).unit === 1);
		assert((c.draw.objects[2] as DrawPin).convert === 1);
		assert((c.draw.objects[2] as DrawPin).pinType === PinType.PASSIVE);
		assert.deepEqual((c.draw.objects[2] as DrawPin).attributes, []);
		assert((c.draw.objects[2] as DrawPin).visibility === true);

		// P 2 0 1 0 -50 70 -50 110 N
		assert(c.draw.objects[3] instanceof DrawPolyline);
		assert((c.draw.objects[3] as DrawPolyline).pointCount === 2);
		assert((c.draw.objects[3] as DrawPolyline).unit === 0);
		assert((c.draw.objects[3] as DrawPolyline).convert === 1);
		assert((c.draw.objects[3] as DrawPolyline).lineWidth === 0);
		assert.deepEqual((c.draw.objects[3] as DrawPolyline).points, [-50, 70, -50, 110]);
		assert((c.draw.objects[3] as DrawPolyline).fill === Fill.NO_FILL);

		// A 0 -150 128 1287 513 0 1 20 N -80 -50 80 -50
		assert(c.draw.objects[4] instanceof DrawArc);
		assert((c.draw.objects[4] as DrawArc).posx === 0);
		assert((c.draw.objects[4] as DrawArc).posy === -150);
		assert((c.draw.objects[4] as DrawArc).radius === 128);
		assert((c.draw.objects[4] as DrawArc).startAngle === 1287);
		assert((c.draw.objects[4] as DrawArc).endAngle === 513);
		assert((c.draw.objects[4] as DrawArc).unit === 0);
		assert((c.draw.objects[4] as DrawArc).convert === 1);
		assert((c.draw.objects[4] as DrawArc).lineWidth === 20);
		assert((c.draw.objects[4] as DrawArc).fill === Fill.NO_FILL);
		assert((c.draw.objects[4] as DrawArc).startx === -80);
		assert((c.draw.objects[4] as DrawArc).starty === -50);
		assert((c.draw.objects[4] as DrawArc).endx === 80);
		assert((c.draw.objects[4] as DrawArc).endy === -50);

		// C -100 0 35 0 1 0 N
		assert(c.draw.objects[5] instanceof DrawCircle);
		assert((c.draw.objects[5] as DrawCircle).posx === -100);
		assert((c.draw.objects[5] as DrawCircle).posy === 0);
		assert((c.draw.objects[5] as DrawCircle).radius === 35);
		assert((c.draw.objects[5] as DrawCircle).unit === 0);
		assert((c.draw.objects[5] as DrawCircle).convert === 1);
		assert((c.draw.objects[5] as DrawCircle).lineWidth === 0);
		assert((c.draw.objects[5] as DrawCircle).fill === Fill.NO_FILL);

		// T 0 -75 -250 50 0 0 0 B Normal 0 C C
		assert(c.draw.objects[6] instanceof DrawText);
		assert((c.draw.objects[6] as DrawText).angle === 0);
		assert((c.draw.objects[6] as DrawText).posx === -75);
		assert((c.draw.objects[6] as DrawText).posy === -250);
		assert((c.draw.objects[6] as DrawText).textSize === 50);
		assert((c.draw.objects[6] as DrawText).textType === 0);
		assert((c.draw.objects[6] as DrawText).unit === 0);
		assert((c.draw.objects[6] as DrawText).convert === 0);
		assert((c.draw.objects[6] as DrawText).text === "B");
		assert((c.draw.objects[6] as DrawText).italic === false);
		assert((c.draw.objects[6] as DrawText).bold === false);
		assert((c.draw.objects[6] as DrawText).hjustify === TextHjustify.CENTER);
		assert((c.draw.objects[6] as DrawText).vjustify === TextVjustify.CENTER);
	});

	it("can treat Pin (X) correctly", () => {
		const lib = Library.load(indent `
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
		assert(lib.findByName('TEST') instanceof LibComponent);

		const c = lib.findByName('TEST');
		if (!c) throw "component is not found";
		// X P1 1 -200 0 150 R 50 50 1 1 P N
		assert(c.draw.objects[0] instanceof DrawPin);
		assert((c.draw.objects[0] as DrawPin).name === "P1");
		assert((c.draw.objects[0] as DrawPin).num === "1");
		assert((c.draw.objects[0] as DrawPin).posx === -200);
		assert((c.draw.objects[0] as DrawPin).posx === -200);
		assert((c.draw.objects[0] as DrawPin).length === 150);
		assert((c.draw.objects[0] as DrawPin).orientation === PinOrientation.RIGHT);
		assert((c.draw.objects[0] as DrawPin).nameTextSize === 50);
		assert((c.draw.objects[0] as DrawPin).numTextSize === 50);
		assert((c.draw.objects[0] as DrawPin).unit === 1);
		assert((c.draw.objects[0] as DrawPin).convert === 1);
		assert((c.draw.objects[0] as DrawPin).pinType === PinType.PASSIVE);
		assert.deepEqual((c.draw.objects[0] as DrawPin).attributes, ["N"]);
		assert((c.draw.objects[0] as DrawPin).visibility === false);
	});

	it("can treat Text (T) correctly", () => {
		const lib = Library.load(indent `
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
		assert(lib.findByName('TEST') instanceof LibComponent);

		const c = lib.findByName('TEST');
		if (!c) throw "component is not found";
		assert(c.draw.objects[0] instanceof DrawText);
		assert((c.draw.objects[0] as DrawText).angle === 900);
		assert((c.draw.objects[0] as DrawText).posx === -75);
		assert((c.draw.objects[0] as DrawText).posy === -250);
		assert((c.draw.objects[0] as DrawText).textSize === 50);
		assert((c.draw.objects[0] as DrawText).textType === 0);
		assert((c.draw.objects[0] as DrawText).unit === 2);
		assert((c.draw.objects[0] as DrawText).convert === 3);
		assert((c.draw.objects[0] as DrawText).text === "Foo Bar");
		assert((c.draw.objects[0] as DrawText).italic === true);
		assert((c.draw.objects[0] as DrawText).bold === true);
		assert((c.draw.objects[0] as DrawText).hjustify === TextHjustify.RIGHT);
		assert((c.draw.objects[0] as DrawText).vjustify === TextVjustify.BOTTOM);

		assert((c.draw.objects[1] as DrawText).text === 'Foo"Bar"');
		assert((c.draw.objects[2] as DrawText).text === 'Foo~Bar"');
	});

	it("can treat Polyline (P) correctly", () => {
		const lib = Library.load(indent `
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
		assert(lib.findByName('TEST') instanceof LibComponent);

		const c = lib.findByName('TEST');
		if (!c) throw "component is not found";
		assert(c.draw.objects[0] instanceof DrawPolyline);
		assert((c.draw.objects[0] as DrawPolyline).pointCount === 2);
		assert((c.draw.objects[0] as DrawPolyline).unit === 0);
		assert((c.draw.objects[0] as DrawPolyline).convert === 1);
		assert((c.draw.objects[0] as DrawPolyline).lineWidth === 0);
		assert.deepEqual((c.draw.objects[0] as DrawPolyline).points, [-50, 70, -50, 110]);
		assert((c.draw.objects[0] as DrawPolyline).fill === Fill.FILLED_SHAPE);

		assert(c.draw.objects[1] instanceof DrawPolyline);
		assert((c.draw.objects[1] as DrawPolyline).pointCount === 2);
		assert((c.draw.objects[1] as DrawPolyline).unit === 2);
		assert((c.draw.objects[1] as DrawPolyline).convert === 3);
		assert((c.draw.objects[1] as DrawPolyline).lineWidth === 4);
		assert.deepEqual((c.draw.objects[1] as DrawPolyline).points, [-50, 70, -50, 110]);
		assert((c.draw.objects[1] as DrawPolyline).fill === Fill.NO_FILL);
	});

	it("can treat field correctly", () => {
		const lib = Library.load(indent `
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
		assert(lib.findByName('Battery') instanceof LibComponent);

		const c = lib.findByName('Battery');
		if (!c) throw "component is not found";
		assert(c.field.reference === 'BT');
		assert(c.field.posx === 100);
		assert(c.field.posy === 50);
		assert(c.field.textSize === 50);
		assert(c.field.textOrientation === 0);
		assert(c.field.visibility === true);
		assert(c.field.hjustify === TextHjustify.LEFT);
		assert(c.field.vjustify === TextVjustify.CENTER);
		assert(c.field.italic === false);
		assert(c.field.bold === false);
	});
});
