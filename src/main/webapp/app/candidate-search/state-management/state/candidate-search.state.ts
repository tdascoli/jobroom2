import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
    Availability,
    Canton,
    DrivingLicenceCategory,
    Experience,
    Graduation,
    ISCED_1997,
    LanguageSkill,
    WorkForm
} from '../../../shared';
import { CandidateProfile } from '../../services/candidate';
import { TypeaheadItemDisplayModel } from '../../../shared/input-components';
import { TypeaheadMultiselectModel } from '../../../shared/input-components/typeahead/typeahead-multiselect-model';
import { Degree } from '../../../shared/job-publication/job-publication.model';

export interface CandidateSearchState {
    searchFilter: CandidateSearchFilter;
    searchError: boolean;
    loading: boolean;
    page: number;
    totalCandidateCount: number;
    candidateProfileList: Array<CandidateProfile>;
    selectedCandidateProfile: CandidateProfile;
    candidateListScrollY: number;
    resetTime: number;
}

export interface CandidateSearchFilter {
    occupations?: Array<TypeaheadMultiselectModel>,
    skills?: Array<string>,
    experience?: Experience,
    workplace?: TypeaheadItemDisplayModel,
    residence?: Array<Canton | string>,
    availability?: Availability,
    workload?: [number, number];
    workForm?: WorkForm,
    degree?: Degree,
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
    selectedCandidateProfile: null,
    searchError: false,
    candidateListScrollY: 0,
    resetTime: null
};

export const getCandidateSearchState = createFeatureSelector<CandidateSearchState>('candidateSearch');
export const getCandidateProfileList = createSelector(getCandidateSearchState, (state: CandidateSearchState) => state.candidateProfileList);
export const getSearchFilter = createSelector(getCandidateSearchState, (state: CandidateSearchState) => state.searchFilter);
export const getSelectedOccupationCodes = createSelector(getSearchFilter, (candidateSearchFilter: CandidateSearchFilter) =>
    (candidateSearchFilter.occupations || []).map((typeaheadMultiselectModel: TypeaheadMultiselectModel) => typeaheadMultiselectModel.code));
export const getSelectedOccupationNames = createSelector(getSearchFilter, (candidateSearchFilter: CandidateSearchFilter) =>
    (candidateSearchFilter.occupations || []).map((typeaheadMultiselectModel: TypeaheadMultiselectModel) => typeaheadMultiselectModel.label));
export const getLoading = createSelector(getCandidateSearchState, (state: CandidateSearchState) => state.loading);
export const getSearchError = createSelector(getCandidateSearchState, (state: CandidateSearchState) => state.searchError);
export const getTotalCandidateCount = createSelector(getCandidateSearchState, (state: CandidateSearchState) => state.totalCandidateCount);
export const getCandidateListScrollY = createSelector(getCandidateSearchState, (state: CandidateSearchState) => state.candidateListScrollY);
export const getSelectedCandidateProfile = createSelector(getCandidateSearchState, (state: CandidateSearchState) => state.selectedCandidateProfile);
export const getResetTime = createSelector(getCandidateSearchState, (state: CandidateSearchState) => state.resetTime);
