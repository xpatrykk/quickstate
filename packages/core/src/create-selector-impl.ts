import {Store, StoreBase} from "./types";
import React, {useContext, useEffect, useState} from "react";
import {shallowEqual} from "./utils";

export const createSelectorImpl =
	<State extends object>(StoreContext: React.Context<StoreBase<State> | null>): Store<State>["createSelector"] =>
	(selector) =>
	() => {
		const useEnhancedSelector = () => {
			const contextStore = useContext(StoreContext) as Store<State>;

			if (!contextStore) {
				throw new Error("Selector must be used within a Provider.");
			}

			const [selectedState, setSelectedState] = useState(() => selector(contextStore.getState()));

			useEffect(() => {
				const updateSelectedState = () => {
					const selectedValue = selector(contextStore.getState());
					setSelectedState((prev) => (shallowEqual(selectedValue, prev) ? prev : selectedValue));
				};

				const unsubscribe = contextStore.subscribe(updateSelectedState);
				updateSelectedState();

				return unsubscribe;
			}, []);

			return selectedState;
		};

		return useEnhancedSelector();
	};
