import {isAsyncActionFulfilled} from "./is-async-action-fulfilled";
import {AsyncActionCreator, AsyncActionMeta, AsyncActionFulfilledMeta} from "../types";

describe("isAsyncActionFulfilled function", () => {
	test("returns true for fulfilled async action meta objects", () => {
		const fulfilledMeta: AsyncActionFulfilledMeta<AsyncActionCreator> = {
			parameters: [],
			result: "Success",
		};
		expect(isAsyncActionFulfilled(fulfilledMeta)).toBe(true);
	});

	test("returns false for rejected async action meta objects without result", () => {
		const rejectedMeta: AsyncActionMeta<AsyncActionCreator> = {
			parameters: [],
			reason: "Error",
		};
		expect(isAsyncActionFulfilled(rejectedMeta)).toBe(false);
	});

	test("returns false for objects without parameters or result", () => {
		const randomObject = {a: 1, b: 2};
		expect(isAsyncActionFulfilled(randomObject as any)).toBe(false);
	});

	test("returns false for primitive values", () => {
		expect(isAsyncActionFulfilled("string" as any)).toBe(false);
		expect(isAsyncActionFulfilled(123 as any)).toBe(false);
		expect(isAsyncActionFulfilled(true as any)).toBe(false);
	});

	test("returns false for null", () => {
		expect(isAsyncActionFulfilled(null as any)).toBe(false);
	});
});
