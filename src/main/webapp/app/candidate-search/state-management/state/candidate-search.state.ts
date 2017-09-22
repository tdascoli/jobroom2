import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Graduation, GreaterRegion } from '../../services/candidate-search-request';

export interface CandidateSearchState {
    searchFilter: CandidateSearchFilter
}

export interface CandidateSearchFilter {
    occupation?: string,
    residence?: GreaterRegion,
    graduation?: Graduation
}

export const initialState: CandidateSearchState = {
    searchFilter: {}
};

export const getCandidateSearchState = createFeatureSelector<CandidateSearchState>('candidateSearch');
export const getSearchFilter = createSelector(getCandidateSearchState, (state: CandidateSearchState) => state.searchFilter);
