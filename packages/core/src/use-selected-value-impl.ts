import {Store} from "./types";

export const useSelectedValueImpl =
	<State extends object>(createSelector: Store<State>["createSelector"]): Store<State>["useSelectValue"] =>
	(key) => {
		const selector = createSelector((state) => state[key]);
		return selector();
	};
