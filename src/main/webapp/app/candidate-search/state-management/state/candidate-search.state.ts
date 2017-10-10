import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
    Availability,
    Canton,
    DrivingLicenceCategory,
    Experience,
    Graduation,
    ISCED_1997,
    WorkForm
} from '../../services/candidate-search-request';
import { OccupationSuggestion } from '../../../shared/reference-service/occupation-autocomplete';
import { LanguageSkill } from '../../../shared/model/shared-types';

export interface CandidateSearchState {
    searchFilter: CandidateSearchFilter;
    loading: boolean;
    totalCandidatesCount: number;
}

// todo: move OccupationSuggestion to a reference-service module

export interface CandidateSearchFilter {
    occupation?: OccupationSuggestion,
    skills: Array<string>,
    experience?: Experience,
    workplace?: string,
    residence?: Canton,
    availability?: Availability,
    workload: [number, number];
    workForm?: WorkForm,
    educationLevel?: ISCED_1997,
    graduation?: Graduation,
    drivingLicenceCategory?: DrivingLicenceCategory
    languageSkills: Array<LanguageSkill>
}

export const initialState: CandidateSearchState = {
    searchFilter: {
        skills: [],
        languageSkills: [],
        workload: [0, 100]
    },
    loading: false,
    totalCandidatesCount: 0
};

export const getCandidateSearchState = createFeatureSelector<CandidateSearchState>('candidateSearch');
export const getSearchFilter = createSelector(getCandidateSearchState, (state: CandidateSearchState) => state.searchFilter);
export const getLoading = createSelector(getCandidateSearchState, (state: CandidateSearchState) => state.loading);
export const getTotalCandidatesCount = createSelector(getCandidateSearchState, (state: CandidateSearchState) => state.totalCandidatesCount);
