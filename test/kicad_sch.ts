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
	SheetSide,
	Net,
} from "../src/kicad_common";

import {
	Schematic,
	SchComponent,
	Sheet,
	Text,
	Bitmap,
	Wire,
	Connection,
	NoConn,
	Entry,
	TextOrientationType,
} from "../src/kicad_sch";

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

describe("Schematic.load", () => {
	it("has version check", () => {
		assert.doesNotThrow( () => {
			Schematic.load(indent `
				EESchema Schematic File Version 2
			`);
		});
		assert.doesNotThrow( () => {
			Schematic.load(indent `
				EESchema Schematic File Version 1
			`);
		});
		assert.throws( () => {
			Schematic.load(indent `
				EESchema Schematic File Version 3
			`);
		}, 'schematic format version is greater than supported version: 3 > 2');
	});

	it("can parse basic format", () => {
		const sch = Schematic.load(indent `
			EESchema Schematic File Version 2
			LIBS:power
			LIBS:device
			EELAYER 25 0
			EELAYER END
			$Descr A4 11693 8268
			encoding utf-8
			Sheet 1 4
			Title "keyboard-proto"
			Date ""
			Rev ""
			Comp ""
			Comment1 ""
			Comment2 ""
			Comment3 ""
			Comment4 ""
			$EndDescr
			$Comp
			L VDD #PWR011
			U 1 1 5782C5AC
			P 1000 1850
			AR Path="/5782E0AD/5782C5AC" Ref="#PWR011"  Part="1" 
			AR Path="/5783096D/5782C5AC" Ref="#PWR05"  Part="1" 
			AR Path="/578B2796/5782C5AC" Ref="#PWR017"  Part="1" 
			F 0 "#PWR05" H 1000 1700 50  0001 C CNN
			F 1 "VDD" H 1000 2000 50  0000 C CIB
			F 2 "" H 1000 1850 50  0000 C CNN
			F 3 "" H 1000 1850 50  0000 C CNN
				1    1000 1850
				1    0    0    -1  
			$EndComp
			$Sheet
			S 4050 3650 2250 1100
			U 5783096D
			F0 "KeyModule-L" 60
			F1 "_keymodule_l.sch" 60
			F2 "sheetppp" I L 8250 5400 60 
			F3 "sheetpr" I R 10050 5450 60 
			$EndSheet
			Wire Wire Line
				2900 2950 2900 3300
			Wire Bus Bus
				2750 2950 2900 2950
			Connection ~ 1150 2050
			NoConn ~ 2750 2200
			Text Notes 2300 3200 0    60   ~ 0
			fooabar foobar
			Entry Wire Line
				2901 2650 3000 2750
			Entry Bus Bus
				3500 3500 3600 3600
			$Bitmap
			Pos 3500 4800
			Scale 1.000000
			Data
			89 50 4E 47 0D 0A 1A 0A 00 00 00 0D 49 48 44 52 00 00 00 10 00 00 00 10 08 03 00 00 00 28 2D 0F 
			53 00 00 00 03 73 42 49 54 08 08 08 DB E1 4F E0 00 00 01 6B 50 4C 54 45 FF FF FF F1 D4 E2 E4 AC 
			C8 DE 9A BC E0 A0 C0 EA BD D4 F9 EA F1 DA DA DA 82 82 82 FC F5 F9 DF 9D BE C0 40 80 B2 17 64 AE 
			0B 5C AE 09 5B B0 0F 5F B7 26 6E CD 66 9A F0 CF DF FA FA FA FB FB FB BD 38 7B AC 04 58 AE 08 5A 
			B1 11 60 B1 10 60 AF 0D 5D AC 03 57 D6 80 AB FF FE FE F9 FA F9 87 87 87 7A 7A 7A AD 0A 5C AE 0A 
			5C AE 08 5B AF 0C 5D B1 12 61 B0 0E 5F AB 00 55 CB 60 95 FF FD FE EC ED EC 27 27 27 B0 12 61 AF 
			0B 5D B2 15 63 BC 34 78 C3 47 85 C1 41 81 B7 25 6E AD 05 59 B0 10 60 D3 77 A5 D8 D8 D8 AB 03 57 
			B8 28 70 DB 90 B5 F7 DD EA FF F6 FC EB BD D4 CA 5D 93 AD 08 5B EC C1 D6 CC 65 99 FB EB F3 F4 F9 
			F6 BF C0 C0 A5 A6 A5 AD AE AD D7 DA D8 E6 B1 CC B5 1D 69 AD 06 59 C5 4E 8A 8A 8A 8A 1F 1F 1F 00 
			00 00 05 05 05 4A 4A 4A CD CE CD EF CC DE B3 19 66 F2 D4 E3 F9 FA FA 57 57 57 0C 0C 0C B5 B5 B5 
			E2 A5 C4 AD 06 5A AD 07 5A DD 98 BB 67 67 67 0F 0F 0F DE DF DE C2 44 83 AA 01 54 D1 71 A1 65 65 
			65 DF 9B BD A9 00 51 CD 66 99 19 19 19 F6 F9 F8 F5 D6 E6 AC 05 59 D1 73 A2 04 04 04 DD E1 DF FF 
			F2 F9 B2 14 63 DE 99 BB DE E1 DF FF EF F8 F3 D7 E4 1B 1B 1B F0 C7 DC C8 59 91 03 03 03 64 64 64 
			E9 BB D2 B5 14 BD DA 00 00 00 CE 49 44 41 54 18 95 63 60 60 60 60 64 62 66 61 65 63 00 01 76 0E 
			06 4E 2E 6E 1E 5E 3E 3E 7E 01 41 21 06 06 61 11 06 06 51 31 71 7E 09 09 09 49 29 69 7E 19 59 39 
			79 05 06 45 09 09 7E 25 71 65 15 49 55 35 75 0D 4D 2D 6D 06 1D 5D 31 3D 7D 03 43 23 25 63 13 09 
			75 53 06 33 06 73 0B 4B 2B A0 69 D6 36 B6 4A BA 26 76 F6 0C 0C 0E 8E 0C 4E CE 2E AE 6E 0C 0C EE 
			1E 4A 9E 5E 20 AB BC 7D 7C 7D 7D FD FC 03 18 02 83 78 F5 82 19 42 42 7D 21 20 2C 9C 21 22 32 2A 
			9A 21 C6 17 06 62 E3 18 E2 13 12 19 7C 11 20 89 21 39 25 15 59 20 2D 3D 23 33 0B 59 20 3B 27 37 
			2F 1F 45 A0 A0 D0 A8 08 59 A0 38 BD A4 94 81 A1 0C 21 50 CE C0 5C C1 00 00 62 1F 38 7D 11 C4 5E 
			6C 00 00 00 00 49 45 4E 44 AE 42 60 82 FF 
			EndData
			$EndBitmap
			Kmarq B 1600 1100 "Warning Pin power_in not driven (Net 5)" F=1
			$EndSCHEMATC
		`);
		assert(sch);

		assert.deepEqual(sch.libs, ['power', 'device']);
		assert(sch.descr.pageInfo.pageType === 'A4');
		assert(sch.descr.width === 11693);
		assert(sch.descr.height === 8268);

		assert(sch.items[0] instanceof SchComponent);
		{
			const item = sch.items[0] as SchComponent;
			assert( item.fields[0].text === '#PWR05' );
			assert( item.fields[0].visibility === false);
			assert( item.fields[0].hjustify === TextHjustify.CENTER);
			assert( item.fields[0].vjustify === TextVjustify.CENTER);
			assert( item.fields[0].italic == false);
			assert( item.fields[0].bold === false);

			assert( item.fields[1].text === 'VDD' );
			assert( item.fields[1].visibility === true);
			assert( item.fields[1].hjustify === TextHjustify.CENTER);
			assert( item.fields[1].vjustify === TextVjustify.CENTER);
			assert( item.fields[1].italic == true);
			assert( item.fields[1].bold === true);
		}
		assert(sch.items[1] instanceof Sheet);
		{
			const item = sch.items[1] as Sheet;
			assert( item.sheetPins[0].text === "sheetppp" );
			assert( item.sheetPins[0].shape === Net.INPUT);
			assert( item.sheetPins[0].sheetSide === SheetSide.LEFT );
			assert( item.sheetPins[0].posx == 8250);
			assert( item.sheetPins[0].posy === 5400);
			assert( item.sheetPins[0].size === 60);
			assert( item.sheetPins[0].orientationType === 2);
			assert( item.sheetPins[0].orientation === TextAngle.HORIZ);
			assert( item.sheetPins[0].hjustify === TextHjustify.LEFT);
			assert( item.sheetPins[0].vjustify === TextVjustify.CENTER);

			assert( item.sheetPins[1].text === "sheetpr" );
			assert( item.sheetPins[1].shape === Net.INPUT);
			assert( item.sheetPins[1].sheetSide === SheetSide.RIGHT );
			assert( item.sheetPins[1].posx === 10050);
			assert( item.sheetPins[1].posy === 5450);
			assert( item.sheetPins[1].size === 60);
			assert( item.sheetPins[1].orientationType === 0);
			assert( item.sheetPins[1].orientation === TextAngle.HORIZ);
			assert( item.sheetPins[1].hjustify === TextHjustify.RIGHT);
			assert( item.sheetPins[1].vjustify === TextVjustify.CENTER);
		}

		assert(sch.items[2] instanceof Wire);
		assert(sch.items[3] instanceof Wire);
		assert(sch.items[4] instanceof Connection);
		assert(sch.items[5] instanceof NoConn);
		assert(sch.items[6] instanceof Text);
		assert(sch.items[7] instanceof Entry);
		assert(sch.items[8] instanceof Entry);
		assert(sch.items[9] instanceof Bitmap);
		{
			const item = sch.items[9] as Bitmap;
			assert(item.data.slice(-1)[0] === 0xff);
			assert(item.isValidPNG);
			assert.doesNotThrow( () => {
				item.parseIHDR();
				assert(item.width === 16);
				assert(item.height === 16);
			});
		}
	});
});
