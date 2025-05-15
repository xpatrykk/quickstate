import type {Draft} from "immer";
import React from "react";
import {getWithStateProviderHoc} from "./with-state-provider";
import type {StateUpdateVariants} from "./dev-tools";

export interface MakeStoreConfig<State extends object> {
	initialState: State;
}

export type ActionReturn<State extends object> = State | void | undefined;

export type TransformState<State extends object> = (
	producer: StateTransformer<State>,
	actionDetails: StateUpdateVariants
) => void;

export type StateTransformer<State extends object> = (state: Draft<State>) => any;

export type Action<State extends object> = (state: Draft<State>) => ActionReturn<Draft<State>>;

export type ActionWithPayload<State extends object, Payload> = (
	state: Draft<State>,
	payload: Payload
) => ActionReturn<Draft<State>>;

export type AsyncActionCreator = (...args: any[]) => Promise<any>;

export type AsyncActionShouldExecuteResult<State extends object, Creator extends AsyncActionCreator> = {
	shouldExecute: boolean;
	stateModifier?: AsyncActionBeforeExecuteWithStateModify<State, Creator>;
};

export type AsyncActionBeforeExecuteMeta<Creator extends AsyncActionCreator> = {
	parameters: Parameters<Creator>;
} & {
	shouldExecute: boolean;
};

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
	| AsyncActionBeforeExecuteMeta<Creator>
	| AsyncActionFulfilledMeta<Creator>
	| AsyncActionRejectedMeta<Creator>;

export type AsyncActionBeforeExecuteWithStateModify<State extends object, Creator extends AsyncActionCreator> = (
	state: Draft<State>,
	meta: AsyncActionBeforeExecuteMeta<Creator>
) => ActionReturn<Draft<State>>;

export type AsyncActionWithPayload<State extends object, Creator extends AsyncActionCreator> = {
	creator: Creator;
	beforeExecute?: (
		state: State,
		meta: AsyncActionBeforeExecuteMeta<Creator>
	) => AsyncActionShouldExecuteResult<State, Creator>;
	onPending: (state: Draft<State>, meta: AsyncActionPendingMeta<Creator>) => ActionReturn<Draft<State>>;
	onFulfilled: (state: Draft<State>, meta: AsyncActionFulfilledMeta<Creator>) => ActionReturn<Draft<State>>;
	onRejected: (state: Draft<State>, meta: AsyncActionRejectedMeta<Creator>) => ActionReturn<Draft<State>>;
};

export type GetState<State extends object> = () => State;

export interface StoreBase<State extends object> {
	getState: GetState<State>;
	setState(state: State, actionName?: string): void;
	resetState(): void;
	setKeyValue<Key extends keyof State, KeyValue extends State[Key] extends object ? Partial<State[Key]> : State[Key]>(
		key: Key,
		value: KeyValue,
		actionName?: string
	): void;
	createAction(action: Action<State>, actionName?: string): () => void;
	createAction<Payload>(action: ActionWithPayload<State, Payload>, actionName?: string): (payload: Payload) => void;
	createAsyncAction<Creator extends AsyncActionCreator>(
		action: AsyncActionWithPayload<State, Creator>,
		actionName?: string
	): (...args: Parameters<Creator>) => Promise<AsyncActionMeta<Creator>>;
	subscribe: (listener: () => void) => () => void;
}

export type ResetTrigger = any | (() => any);

export type Selector<State extends object> = (state: State) => any;

export type WithStateProviderHoc = ReturnType<typeof getWithStateProviderHoc>;

export type SelectorMemoizationOptions<State> = {
	useMemoization?: boolean;
	isEqual?: (prevState: State, nextState: State) => boolean;
};

export interface Store<State extends object> extends StoreBase<State> {
	createSelector: <Selected extends Selector<State>>(selector: Selected, options?: SelectorMemoizationOptions<State>) => () => ReturnType<Selected>;
	useSelectValue: <Key extends keyof State>(key: Key) => State[Key];
	Provider: ({children}: {children: React.ReactNode; resetTrigger?: ResetTrigger}) => React.JSX.Element;
	withStateProvider: WithStateProviderHoc;
}
