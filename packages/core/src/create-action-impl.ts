import {Action, ActionWithPayload, Store, TransformState} from "./types";
import {isActionWithPayload} from "./utils";

export const createActionImpl =
	<State extends object>(transformState: TransformState<State>): Store<State>["createAction"] =>
	<Payload>(action: Action<State> | ActionWithPayload<State, Payload>) => {
		return function (this: any, ...args: unknown[]) {
			if (isActionWithPayload(action)) {
				const payload = args[0] as Payload;
				return void transformState((state) => action(state, payload));
			}

			transformState(action);
		} as any;
	};
