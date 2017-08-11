import { TypeaheadMultiselectModel } from '../../../shared/job-search/typeahead-multiselect/typeahead-multiselect-model';
import { Job } from '../../../entities/job/job.model';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface JobSearchState {
    jobSearchError: boolean;
    searchQuery: JobSearchQuery;
    searchFilter: JobSearchFilter;
    jobList: Array<Job>;
    totalJobCount: number;
    initialState: boolean;
}

export interface JobSearchQuery {
    baseQuery: Array<TypeaheadMultiselectModel>;
    locationQuery: Array<TypeaheadMultiselectModel>;
    page: number;
}

export interface JobSearchFilter {

}

export const initialState: JobSearchState = {
    jobSearchError: false,
    searchQuery: {
        baseQuery: [],
        locationQuery: [],
        page: 0
    },
    searchFilter: {},
    totalJobCount: 0,
    jobList: [],
    initialState: true,
};

export const getJobSearchState = createFeatureSelector<JobSearchState>('jobSearch');
export const getTotalJobCount = createSelector(getJobSearchState, (state: JobSearchState) => state.totalJobCount);
export const getJobList = createSelector(getJobSearchState, (state: JobSearchState) => state.jobList);
export const getSearchQuery = createSelector(getJobSearchState, (state: JobSearchState) => state.searchQuery);
export const getBaseQuery = createSelector(getJobSearchState, (state: JobSearchState) => state.searchQuery.baseQuery);
export const getLocationQuery = createSelector(getJobSearchState, (state: JobSearchState) => state.searchQuery.locationQuery);
export const getJobSearchError = createSelector(getJobSearchState, (state: JobSearchState) => state.jobSearchError);
export const getSearchFilter = createSelector(getJobSearchState, (state: JobSearchState) => state.searchFilter);
