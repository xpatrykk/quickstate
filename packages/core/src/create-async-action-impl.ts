import {
	AsyncActionCreator,
	AsyncActionFulfilledMeta,
	AsyncActionPendingMeta,
	AsyncActionRejectedMeta,
	AsyncActionWithPayload,
	Store,
	TransformState,
} from "./types";

export const createAsyncActionImpl =
	<State extends object, Transform extends TransformState<State>>(
		transformState: Transform
	): Store<State>["createAsyncAction"] =>
	<Creator extends AsyncActionCreator>(action: AsyncActionWithPayload<State, Creator>) => {
		return async function (this: any, ...args: Parameters<Creator>) {
			const {creator, onRejected, onFulfilled, onPending} = action;

			const pendingMeta: AsyncActionPendingMeta<Creator> = {
				parameters: args,
			};

			transformState((draft) => onPending(draft, pendingMeta));

			try {
				const resolvedValue = await creator(...args);

				const fulfilledMeta: AsyncActionFulfilledMeta<Creator> = {
					parameters: args,
					result: resolvedValue as Awaited<ReturnType<Creator>>,
				};

				transformState((draft) => onFulfilled(draft, fulfilledMeta));

				return fulfilledMeta;
			} catch (e) {
				const rejectedMeta: AsyncActionRejectedMeta<Creator> = {
					parameters: args,
					reason: e,
				};

				transformState((draft) => onRejected(draft, rejectedMeta));

				return rejectedMeta;
			}
		};
	};
