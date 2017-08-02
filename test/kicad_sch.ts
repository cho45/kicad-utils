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
	Schematic,
	SchComponent,
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
			$EndSheet
			Wire Wire Line
				2900 2950 2900 3300
			Wire Wire Line
				2750 2950 2900 2950
			Connection ~ 1150 2050
			NoConn ~ 2750 2200
			Text Notes 2300 3200 0    60   ~ 0
			foobar foobar
			$EndSCHEMATC
		`);
		assert(sch);

		assert.deepEqual(sch.libs, ['power', 'device']);
		assert(sch.descr.pageType === 'A4');
		assert(sch.descr.width === 11693);
		assert(sch.descr.height === 8268);

		assert(sch.items[0] instanceof SchComponent);
		assert( (sch.items[0] as SchComponent).fields[0].text === '#PWR05' );
		assert( (sch.items[0] as SchComponent).fields[0].visibility === true);
		assert( (sch.items[0] as SchComponent).fields[0].hjustify === TextHjustify.CENTER);
		assert( (sch.items[0] as SchComponent).fields[0].vjustify === TextVjustify.CENTER);
		assert( (sch.items[0] as SchComponent).fields[0].italic == false);
		assert( (sch.items[0] as SchComponent).fields[0].bold === false);

		assert( (sch.items[0] as SchComponent).fields[1].text === 'VDD' );
		assert( (sch.items[0] as SchComponent).fields[1].visibility === false);
		assert( (sch.items[0] as SchComponent).fields[1].hjustify === TextHjustify.CENTER);
		assert( (sch.items[0] as SchComponent).fields[1].vjustify === TextVjustify.CENTER);
		assert( (sch.items[0] as SchComponent).fields[1].italic == true);
		assert( (sch.items[0] as SchComponent).fields[1].bold === true);

	});
});
