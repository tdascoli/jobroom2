import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface CoreState {
    reset: number
}

export const initialState: CoreState = {
    reset: null
};

export const getCoreState = createFeatureSelector<CoreState>('coreReducer');
export const getReset = createSelector(getCoreState, (state: CoreState) => state.reset);
