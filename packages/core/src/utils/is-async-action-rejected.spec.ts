import {isAsyncActionRejected} from "./is-async-action-rejected";
import {AsyncActionCreator, AsyncActionMeta, AsyncActionRejectedMeta} from "../types";

describe("isAsyncActionRejected function", () => {
	test("returns true for rejected async action meta objects", () => {
		const rejectedMeta: AsyncActionRejectedMeta<AsyncActionCreator> = {
			parameters: [],
			reason: "Error",
		};
		expect(isAsyncActionRejected(rejectedMeta)).toBe(true);
	});

	test("returns false for fulfilled async action meta objects without reason", () => {
		const fulfilledMeta: AsyncActionMeta<AsyncActionCreator> = {
			parameters: [],
			result: "Success",
		};
		expect(isAsyncActionRejected(fulfilledMeta)).toBe(false);
	});

	test("returns false for objects without parameters or reason", () => {
		const randomObject = {a: 1, b: 2};
		expect(isAsyncActionRejected(randomObject as any)).toBe(false);
	});

	test("returns false for primitive values", () => {
		expect(isAsyncActionRejected("string" as any)).toBe(false);
		expect(isAsyncActionRejected(123 as any)).toBe(false);
		expect(isAsyncActionRejected(true as any)).toBe(false);
	});

	test("returns false for null", () => {
		expect(isAsyncActionRejected(null as any)).toBe(false);
	});
});
