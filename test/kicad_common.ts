//#!npm run test-one

import * as assert from "assert";
import * as mocha from 'mocha';

import {
	DECIDEG2RAD,
	RAD2DECIDEG,
	NORMALIZE_ANGLE_POS,
	MM2MIL,
	MIL2MM,
	ReadDelimitedText,

	RotatePoint,
	Point,
	Rect,
	Transform,
} from "../src/kicad_common";

describe("DECIDEG2RAD", () => {
	it("converts deci degrees to radian", () => {
		assert( DECIDEG2RAD(0) === 0);
		assert( DECIDEG2RAD(900) === Math.PI / 2 * 1);
		assert( DECIDEG2RAD(1800) === Math.PI / 2 * 2);
		assert( DECIDEG2RAD(2700) === Math.PI / 2 * 3);
		assert( DECIDEG2RAD(3600) === Math.PI / 2 * 4);
	});
});

describe("RAD2DECIDEG", () => {
	it("converts radian to deci degree", () => {
		assert( ~~RAD2DECIDEG(0) === 0 );
		assert( ~~RAD2DECIDEG(Math.PI / 2 * 1) === 900 );
		assert( ~~RAD2DECIDEG(Math.PI / 2 * 2) === 1800 );
		assert( ~~RAD2DECIDEG(Math.PI / 2 * 3) === 2700 );
		assert( ~~RAD2DECIDEG(Math.PI / 2 * 4) === 3600 );
	});
});

describe("NORMALIZE_ANGLE_POS", () => {
	it("normalize angle to 0..3600", () => {
		assert( NORMALIZE_ANGLE_POS(0) === 0 );
		assert( NORMALIZE_ANGLE_POS(-1) === 3599 );
		assert( NORMALIZE_ANGLE_POS(3599) === 3599 );
		assert( NORMALIZE_ANGLE_POS(3600) === 0 );
	});
});

describe("RotatePoint", () => {
	it("rotate a point with angle", () => {
		// edge cases
		assert.deepEqual(RotatePoint(new Point(1, 2), 0), new Point(1, 2));
		assert.deepEqual(RotatePoint(new Point(1, 2), 900), new Point(2, -1));
		assert.deepEqual(RotatePoint(new Point(1, 2), 1800), new Point(-1, -2));
		assert.deepEqual(RotatePoint(new Point(1, 2), 2700), new Point(-2, 1));
		assert.deepEqual(RotatePoint(new Point(1, 2), 3600), new Point(1, 2));

		// fallback
		const p = new Point(1, 2);
		RotatePoint(p, 450);
		assert(2.121 < p.x && p.x < 2.122);
		assert(0.707 < p.y && p.y < 0.708);
	});
});

describe("MM2MIL", () => {
	it("convert unit mm to mil (1/1000 inches)", () => {
		assert(~~MM2MIL(100) === 3937);
	});
});

describe("MIL2MM", () => {
	it("convert unit  mil (1/1000 inches) to mm", () => {
		assert(~~MIL2MM(100000) === 2540);
	});
});

describe("ReadDelimitedText", () => {
	it("convert parsed string to original value", () => {
		assert(ReadDelimitedText(`foo`) === "");
		assert(ReadDelimitedText(`"foo"`) === "foo");
		assert(ReadDelimitedText(`foo"bar"`) === "bar");
		assert(ReadDelimitedText(`"foo\\"bar"`) === `foo"bar`);
		assert(ReadDelimitedText(`"foo\\\\bar"`) === `foo\\bar`);
		assert(ReadDelimitedText(`"foo\\bar"`) === `foo\\bar`);
	});
});

describe("Transform", () => {
	it("has default transform value", () => {
		// y-inverted transform by default (from KiCAD)
		const t = new Transform();
		assert(t.x1 === 1);
		assert(t.y1 === 0);
		assert(t.x2 === 0);
		assert(t.y2 === -1);
	});

	it("has transformCoordinate method", () => {
		const t = new Transform();
		const p = t.transformCoordinate(new Point(1, 1));
		assert( p.x ===  1);
		assert( p.y === -1);
	});

	it("has mapAngles method", () => {
		const t = new Transform();
		assert.deepEqual( t.mapAngles(0, 1800), [2, 1798, 0]);
		assert.deepEqual( t.mapAngles(900, 1800), [1800, 2700, 1]);
	});
});

describe("Point", () => {
	it("has default value", () => {
		assert.deepEqual( new Point(), new Point(0, 0) );
	});

	it("has static add function", () => {
		assert.deepEqual( Point.add(new Point(1, 2), new Point(3, 4)) , new Point(4, 6) );
	});

	it("has static sub function", () => {
		assert.deepEqual( Point.sub(new Point(1, 2), new Point(3, 4)) , new Point(-2, -2) );
	});

	it("has static isZero function", () => {
		assert(Point.isZero(new Point()));
		assert(!Point.isZero(new Point(1, 0)));
		assert(!Point.isZero(new Point(0, 1)));
		assert(!Point.isZero(new Point(-1, 0)));
		assert(!Point.isZero(new Point(0, -1)));
	});
});

describe("Rect", () => {
	it("has merge function", () => {
		const rect1 = new Rect(1, 2, 3, 4);

		assert.deepEqual(rect1.merge(new Rect(3, 4, 5, 6)), new Rect(1, 2, 5, 6));
		assert.deepEqual(rect1.merge(new Rect(-3, -4, -5, -6)), new Rect(-3, -4, 3, 4));
	});

	it("has inflate function", () => {
		assert.deepEqual( new Rect(0, 0, 0, 0).inflate(1), new Rect(-1, -1, 1, 1));
	});
});

