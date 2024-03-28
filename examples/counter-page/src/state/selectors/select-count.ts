import {createSelector} from "../store";
import {MyState} from "../types";

export const countSelector = ({count}: MyState) => count;

export const selectCount = createSelector(countSelector);
