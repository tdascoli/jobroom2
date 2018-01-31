import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface CoreState {
    language: string
}

export const initialState: CoreState = {
    language: null
};

export const getCoreState = createFeatureSelector<CoreState>('coreReducer');
export const getLanguage = createSelector(getCoreState, (state: CoreState) => state.language);
