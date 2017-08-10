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
	LSET,
	PCB_LAYER_ID,
} from "../src/kicad_pcb";

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


describe("LSET", () => {
	const L = PCB_LAYER_ID;

	it("can insitanciate with multiple values", () => {
		const lset = new LSET(L.F_Cu, L.B_Cu);
		assert( lset.length === 2 );
	});

	it("can be used with for-of", () => {
		const lset = new LSET(L.F_Cu, L.B_Cu);
		{
			const ret = [];
			for (let l of lset) {
				ret.push(l);
			}
			assert( ret[0] === L.F_Cu );
			assert( ret[1] === L.B_Cu );
		}
		{
			const ret = [];
			for (let l of lset) {
				ret.push(l);
			}
			assert( ret[0] === L.F_Cu );
			assert( ret[1] === L.B_Cu );
		}
	});

	it("has intersect method", () => {
		{
			const lset1 = new LSET(L.F_Cu, L.B_Cu);
			const lset2 = new LSET(L.In1_Cu, L.In2_Cu);
			lset1.intersect(lset2);
			assert( lset1.length === 0);
		}
		{
			const lset1 = new LSET(L.F_Cu, L.B_Cu, L.In1_Cu);
			const lset2 = new LSET(L.In1_Cu, L.In2_Cu);
			lset1.intersect(lset2);
			assert.deepEqual( lset1.entries(), [ L.In1_Cu ]);
		}
	});

	it("has except method", () => {
		{
			const lset1 = new LSET(L.F_Cu, L.B_Cu);
			const lset2 = new LSET(L.F_Cu, L.B_Cu);
			lset1.except(lset2);
			assert( lset1.length === 0);
		}
		{
			const lset1 = new LSET(L.F_Cu, L.B_Cu, L.In1_Cu);
			const lset2 = new LSET(L.In1_Cu, L.In2_Cu);
			lset1.except(lset2);
			assert.deepEqual( lset1.entries(), [ L.F_Cu, L.B_Cu ]);
		}
	});

	it("has union method", () => {
		{
			const lset1 = new LSET(L.F_Cu, L.B_Cu);
			const lset2 = new LSET(L.In1_Cu, L.In2_Cu);
			lset1.union(lset2);
			assert.deepEqual( lset1.entries(), [ L.F_Cu, L.B_Cu, L.In1_Cu, L.In2_Cu]);
		}
	});
});
