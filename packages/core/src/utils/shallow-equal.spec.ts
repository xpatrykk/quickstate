import {shallowEqual} from "./shallow-equal";

describe("shallowEqual function", () => {
	test("returns true for identical primitive values", () => {
		expect(shallowEqual(5, 5)).toBe(true);
		expect(shallowEqual("abc", "abc")).toBe(true);
		expect(shallowEqual(true, true)).toBe(true);
	});

	test("returns false for different primitive values", () => {
		expect(shallowEqual(5, 10)).toBe(false);
		expect(shallowEqual("abc", "def")).toBe(false);
		expect(shallowEqual(true, false)).toBe(false);
	});

	test("returns true for the same object reference", () => {
		const obj = {a: 1};
		expect(shallowEqual(obj, obj)).toBe(true);
	});

	test("returns true for different objects with the same values", () => {
		const obj1 = {a: 1, b: 2};
		const obj2 = {a: 1, b: 2};
		expect(shallowEqual(obj1, obj2)).toBe(true);
	});

	test("returns false for objects with different values", () => {
		const obj1 = {a: 1, b: 2};
		const obj2 = {a: 3, b: 4};
		expect(shallowEqual(obj1, obj2)).toBe(false);
	});

	test("returns false for objects with different numbers of properties", () => {
		const obj1 = {a: 1};
		const obj2 = {a: 1, b: 2};
		expect(shallowEqual(obj1, obj2)).toBe(false);
	});

	test("returns false for an object and an array", () => {
		const obj = {a: 1};
		const arr = [1];
		expect(shallowEqual(obj, arr)).toBe(false);
	});

	test("returns true for identical arrays", () => {
		const arr1 = [1, 2, 3];
		const arr2 = [1, 2, 3];
		expect(shallowEqual(arr1, arr2)).toBe(true);
	});

	test("returns false for arrays with different values", () => {
		const arr1 = [1, 2, 3];
		const arr2 = [4, 5, 6];
		expect(shallowEqual(arr1, arr2)).toBe(false);
	});

	test("returns false for arrays of different lengths", () => {
		const arr1 = [1, 2, 3];
		const arr2 = [1, 2];
		expect(shallowEqual(arr1, arr2)).toBe(false);
	});

	test("returns false when comparing an object to null or non-object", () => {
		const obj = {a: 1};
		expect(shallowEqual(obj, null)).toBe(false);
		expect(shallowEqual(null, obj)).toBe(false);
		expect(shallowEqual(obj, 5)).toBe(false);
	});

	test("returns true for null compared to null", () => {
		expect(shallowEqual(null, null)).toBe(true);
	});
});
