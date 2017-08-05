//#!npm run test-one

import * as assert from "assert";
import * as mocha from 'mocha';

import {
	Glyph,
	StrokeFont,
} from "../src/kicad_strokefont";


/*
describe("", () => {
	it("", () => {
	});
});
*/

describe("Glyph", () => {
	const glyph_f = {
		"lines": [
			[
				{
					"x": 0.23809523809523808,
					"y": -0.7142857142857142
				},
				{
					"x": 0.23809523809523808,
					"y": 0.14285714285714285
				},
				{
					"x": 0.19047619047619047,
					"y": 0.23809523809523808
				},
				{
					"x": 0.09523809523809523,
					"y": 0.2857142857142857
				},
				{
					"x": 0.047619047619047616,
					"y": 0.2857142857142857
				}
			],
			[
				{
					"x": 0.23809523809523808,
					"y": -1.0476190476190474
				},
				{
					"x": 0.19047619047619047,
					"y": -1
				},
				{
					"x": 0.23809523809523808,
					"y": -0.9523809523809523
				},
				{
					"x": 0.2857142857142857,
					"y": -1
				},
				{
					"x": 0.23809523809523808,
					"y": -1.0476190476190474
				},
				{
					"x": 0.23809523809523808,
					"y": -0.9523809523809523
				}
			]
		],
		"startX": -0.23809523809523808,
		"endX": 0.23809523809523808
	};

	it("can computeBoundingBox", () => {
		const glyph = new Glyph();
		Object.assign(glyph, glyph_f);

		glyph.computeBoundingBox();
		assert.deepEqual(glyph.boundingBox.pos1, {
			x: 0,
			y: -1.0476190476190474,
		});
		assert.deepEqual(glyph.boundingBox.pos2, {
			x: 0.47619047619047616,
			y: 0.2857142857142857,
		});
	});
});
