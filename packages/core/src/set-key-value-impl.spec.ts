import {setKeyValueImpl} from "./set-key-value-impl";

describe("setKeyValueImpl function", () => {
	let mockTransformState: jest.Mock;
	let setKeyValue;

	beforeEach(() => {
		mockTransformState = jest.fn();
		setKeyValue = setKeyValueImpl(mockTransformState);
	});

	test("updates primitive value correctly", () => {
		const key = "key";
		const value = "newValue";

		setKeyValue(key, value);

		expect(mockTransformState).toHaveBeenCalledWith(expect.any(Function));
		mockTransformState.mock.calls[0][0]((state) => {
			expect(state[key]).toBe(value);
		});
	});

	test("merges objects correctly", () => {
		const key = "objectKey";
		const existingValue = {existingProp: "existing"};
		const newValue = {newProp: "new"};

		setKeyValue(key, newValue);

		expect(mockTransformState).toHaveBeenCalledWith(expect.any(Function));
		mockTransformState.mock.calls[0][0]((state) => {
			expect(state[key]).toEqual({...existingValue, ...newValue});
		});
	});

	test("adds a new key if it does not exist", () => {
		const key = "newKey";
		const value = "value";

		setKeyValue(key, value);

		expect(mockTransformState).toHaveBeenCalledWith(expect.any(Function));
		mockTransformState.mock.calls[0][0]((state) => {
			expect(state[key]).toBe(value);
		});
	});

	test("sets value to null correctly", () => {
		const key = "nullableKey";
		const value = null;

		setKeyValue(key, value);

		expect(mockTransformState).toHaveBeenCalledWith(expect.any(Function));
		mockTransformState.mock.calls[0][0]((state) => {
			expect(state[key]).toBeNull();
		});
	});
});
