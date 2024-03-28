import {Store, TransformState} from "./types";

export const setKeyValueImpl =
	<State extends object>(transformState: TransformState<State>): Store<State>["setKeyValue"] =>
	(key, value) =>
		transformState((state) => {
			const keyName = key as string;
			const existingValue = state[keyName];
			if (
				typeof existingValue === "object" &&
				existingValue !== null &&
				typeof value === "object" &&
				value !== null
			) {
				state[keyName] = Object.assign({}, existingValue, value);
			} else {
				state[keyName] = value;
			}
		});
