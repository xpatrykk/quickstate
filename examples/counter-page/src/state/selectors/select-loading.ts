import {createSelector} from "../store";
import {MyState} from "../types";

export const countLoadingSelector = ({countLoading}: MyState) => countLoading;

export const selectLoading = createSelector(countLoadingSelector);
