import {useSelectedValueImpl} from "./use-selected-value-impl";

describe("useSelectedValueImpl", () => {
	it("should return the selected value from state", () => {
		const mockState = {
			count: 42,
			name: "Test",
		};

		type State = typeof mockState;

		const mockCreateSelector = jest.fn((selector) => () => selector(mockState));
		const useSelectValue = useSelectedValueImpl<State>(mockCreateSelector);

		const selectedCount = useSelectValue("count");
		const selectedName = useSelectValue("name");

		expect(mockCreateSelector).toHaveBeenCalledTimes(2);
		expect(selectedCount).toEqual(42);
		expect(selectedName).toEqual("Test");
	});
});
