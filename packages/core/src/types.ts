import type {Draft} from "immer";
import React from "react";
import {getWithStateProviderHoc} from "./with-state-provider";

export interface MakeStoreConfig<State extends object> {
	initialState: State;
}

export type CreateActionReturn<State extends object> = State | void | undefined;

export type TransformState<State extends object> = (producer: StateTransformer<State>) => void;

export type StateTransformer<State extends object> = (state: Draft<State>) => any;

export type Action<State extends object> = (state: Draft<State>) => CreateActionReturn<Draft<State>>;

export type ActionWithPayload<State extends object, Payload> = (
	state: Draft<State>,
	payload: Payload
) => CreateActionReturn<Draft<State>>;

export type AsyncActionCreator = (...args: any[]) => Promise<any>;

export type AsyncActionPendingMeta<Creator extends AsyncActionCreator> = {
	parameters: Parameters<Creator>;
};

export type AsyncActionFulfilledMeta<Creator extends AsyncActionCreator> = {
	parameters: Parameters<Creator>;
	result: Awaited<ReturnType<Creator>>;
};

export type AsyncActionRejectedMeta<Creator extends AsyncActionCreator> = {
	parameters: Parameters<Creator>;
	reason: any;
};

export type AsyncActionMeta<Creator extends AsyncActionCreator> =
	| AsyncActionFulfilledMeta<Creator>
	| AsyncActionRejectedMeta<Creator>;

export type AsyncActionWithPayload<State extends object, Creator extends AsyncActionCreator> = {
	creator: Creator;
	onPending: (state: Draft<State>, meta: AsyncActionPendingMeta<Creator>) => CreateActionReturn<Draft<State>>;
	onFulfilled: (state: Draft<State>, meta: AsyncActionFulfilledMeta<Creator>) => CreateActionReturn<Draft<State>>;
	onRejected: (state: Draft<State>, meta: AsyncActionRejectedMeta<Creator>) => CreateActionReturn<Draft<State>>;
};

export interface StoreBase<State extends object> {
	getState: () => State;
	setState(state: State): void;
	setKeyValue<Key extends keyof State, KeyValue extends State[Key] extends object ? Partial<State[Key]> : State[Key]>(
		key: Key,
		value: KeyValue
	): void;
	createAction(action: Action<State>): () => void;
	createAction<Payload>(action: ActionWithPayload<State, Payload>): (payload: Payload) => void;
	createAsyncAction<Creator extends AsyncActionCreator>(
		action: AsyncActionWithPayload<State, Creator>
	): (...args: Parameters<Creator>) => Promise<AsyncActionMeta<Creator>>;
	subscribe: (listener: () => void) => () => void;
}

export type Selector<State extends object> = (state: State) => any;

export type WithStateProviderHoc = ReturnType<typeof getWithStateProviderHoc>;

export interface Store<State extends object> extends StoreBase<State> {
	createSelector: <Selected extends Selector<State>>(selector: Selected) => () => ReturnType<Selected>;
	useSelectValue: <Key extends keyof State>(key: Key) => State[Key];
	Provider: ({children}: {children: React.ReactNode}) => React.JSX.Element;
	withStateProvider: WithStateProviderHoc;
}
