import {createAsyncActionImpl} from "./create-async-action-impl";
import {AsyncActionWithPayload, TransformState} from "./types";
import {jest} from "@jest/globals";

describe("createAsyncActionImpl", () => {
	it("handles fulfilled async action", async () => {
		const mockState = {count: 0};
		type FulfilledState = typeof mockState;

		type FulfilledAsyncActionWithPayload = AsyncActionWithPayload<FulfilledState, () => Promise<number>>;

		const incrementAction: FulfilledAsyncActionWithPayload = {
			creator: () => Promise.resolve(1),
			onPending: jest.fn<FulfilledAsyncActionWithPayload["onPending"]>(),
			onFulfilled: jest.fn<FulfilledAsyncActionWithPayload["onFulfilled"]>((state, meta) => {
				state.count += meta.result;
			}),
			onRejected: jest.fn<FulfilledAsyncActionWithPayload["onRejected"]>(),
		};

		const mockTransformState = jest.fn<TransformState<FulfilledState>>((producer) => {
			producer(mockState);
		});
		const createAsyncAction = createAsyncActionImpl<FulfilledState, TransformState<FulfilledState>>(
			mockTransformState
		);
		const asyncAction = createAsyncAction(incrementAction);

		await asyncAction();

		expect(mockTransformState).toHaveBeenCalled();
		expect(incrementAction.onFulfilled).toHaveBeenCalled();
		expect(mockState.count).toBe(1);
	});

	it("handles rejected async action", async () => {
		const mockState = {count: 0, error: ""};
		type RejectedState = typeof mockState;
		type RejectedAsyncActionWithPayload = AsyncActionWithPayload<RejectedState, () => Promise<number>>;

		const errorMessage = "Error";
		const decrementAction: RejectedAsyncActionWithPayload = {
			creator: () => Promise.reject(errorMessage),
			onPending: jest.fn<RejectedAsyncActionWithPayload["onPending"]>(),
			onFulfilled: jest.fn<RejectedAsyncActionWithPayload["onFulfilled"]>(),
			onRejected: jest.fn<RejectedAsyncActionWithPayload["onRejected"]>((state, meta) => {
				state.error = meta.reason;
			}),
		};

		const mockTransformState = jest.fn<TransformState<RejectedState>>((producer) => {
			producer(mockState);
		});
		const createAsyncAction = createAsyncActionImpl<RejectedState, TransformState<RejectedState>>(
			mockTransformState
		);
		const asyncAction = createAsyncAction(decrementAction);

		await asyncAction();

		expect(mockTransformState).toHaveBeenCalled();
		expect(decrementAction.onRejected).toHaveBeenCalled();
		expect(mockState.error).toBe(errorMessage);
	});

	it("handles pending async action", async () => {
		const mockState = {count: 0, loading: false};
		type PendingState = typeof mockState;
		type PendingAsyncActionWithPayload = AsyncActionWithPayload<PendingState, () => Promise<number>>;

		const asyncOperation = new Promise<number>((resolve) => setTimeout(() => resolve(1), 100));
		const pendingAction: PendingAsyncActionWithPayload = {
			creator: () => asyncOperation,
			onPending: jest.fn<PendingAsyncActionWithPayload["onPending"]>((state) => {
				state.loading = true;
			}),
			onFulfilled: jest.fn<PendingAsyncActionWithPayload["onFulfilled"]>(),
			onRejected: jest.fn<PendingAsyncActionWithPayload["onRejected"]>(),
		};

		const mockTransformState = jest.fn<TransformState<PendingState>>((producer) => {
			producer(mockState);
		});
		const createAsyncAction = createAsyncActionImpl<PendingState, TransformState<PendingState>>(mockTransformState);
		const asyncAction = createAsyncAction(pendingAction);

		const promise = asyncAction();

		expect(mockState.loading).toBe(true);

		await promise;

		expect(pendingAction.onPending).toHaveBeenCalled();
		expect(mockTransformState).toHaveBeenCalledTimes(2); // Once for pending, once for fulfilled
	});
});
