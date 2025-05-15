import type {SelectorMemoizationOptions, Store, StoreBase} from "./types";
import React, { useContext, useSyncExternalStore } from "react";
import {shallowEqual} from "./utils";


export const createSelectorImpl =
	<State extends object>(
		StoreContext: React.Context<StoreBase<State> | null>
	): Store<State>["createSelector"] =>
		<Selected>(
			selector: (state: State) => Selected,
			options: SelectorMemoizationOptions<State> = {useMemoization: true, isEqual: shallowEqual}
		) =>
			(): Selected => {
				const contextStore = useContext(StoreContext) as Store<State>;

				if (!contextStore) {
					throw new Error("Selector must be used within a Provider.");
				}

				const useMemoization = options?.useMemoization ?? false;
				const isEqual = options?.isEqual ?? ((a: State, b: State) => a === b);

				let lastInput: State | null = null;
				let lastResult: Selected;

				const selectValue = (): Selected => {
					const currentState = contextStore.getState();

					if (useMemoization) {
						if (lastInput !== null && isEqual(lastInput, currentState)) {
							return lastResult!;
						}
						lastInput = currentState;
						lastResult = selector(currentState);
						return lastResult;
					}

					return selector(currentState);
				};

				return useSyncExternalStore(contextStore.subscribe, selectValue, selectValue);
			};
