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
import { CandidateProfile } from '../../services/candidate';
import { TypeaheadItemDisplayModel } from '../../../shared/input-components/typeahead/typeahead-item-display-model';

export interface CandidateSearchState {
    searchFilter: CandidateSearchFilter;
    searchError: boolean;
    loading: boolean;
    page: number;
    totalCandidateCount: number;
    candidateProfileList: Array<CandidateProfile>;
    initialState: boolean;
    candidateListScrollY: number;
}

export interface CandidateSearchFilter {
    occupation?: OccupationSuggestion,
    skills?: Array<string>,
    experience?: Experience,
    workplace?: TypeaheadItemDisplayModel,
    residence?: Array<Canton>,
    availability?: Availability,
    workload?: [number, number];
    workForm?: WorkForm,
    educationLevel?: ISCED_1997,
    graduation?: Graduation,
    drivingLicenceCategory?: DrivingLicenceCategory
    languageSkills?: Array<LanguageSkill>
}

export const initialState: CandidateSearchState = {
    searchFilter: {
        skills: [],
        languageSkills: [],
        workload: [0, 100]
    },
    loading: false,
    totalCandidateCount: 0,
    page: 0,
    candidateProfileList: [],
    initialState: true,
    searchError: false,
    candidateListScrollY: 0
};

export const getCandidateSearchState = createFeatureSelector<CandidateSearchState>('candidateSearch');
export const getCandidateProfileList = createSelector(getCandidateSearchState, (state: CandidateSearchState) => state.candidateProfileList);
export const getSearchFilter = createSelector(getCandidateSearchState, (state: CandidateSearchState) => state.searchFilter);
export const getLoading = createSelector(getCandidateSearchState, (state: CandidateSearchState) => state.loading);
export const getSearchError = createSelector(getCandidateSearchState, (state: CandidateSearchState) => state.searchError);
export const getTotalCandidateCount = createSelector(getCandidateSearchState, (state: CandidateSearchState) => state.totalCandidateCount);
export const getCandidateListScrollY = createSelector(getCandidateSearchState, (state: CandidateSearchState) => state.candidateListScrollY);
