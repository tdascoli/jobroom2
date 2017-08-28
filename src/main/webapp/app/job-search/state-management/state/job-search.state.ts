import { TypeaheadMultiselectModel } from '../../../shared/job-search/typeahead-multiselect/typeahead-multiselect-model';
import { Job } from '../../../entities/job/job.model';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export enum ContractType {
    All,
    Temporary,
    Permanent,
}

export enum Order {
    Asc,
    Desc
}

export interface JobSearchState {
    loading: boolean;
    searchError: boolean;
    searchQuery: JobSearchQuery;
    searchFilter: JobSearchFilter;
    jobList: Array<Job>;
    totalJobCount: number;
    initialState: boolean;
    page: number;
}

export interface Sort {
    field?: string;
    order?: Order;
}

export interface JobSearchQuery {
    baseQuery: Array<TypeaheadMultiselectModel>;
    localityQuery: Array<TypeaheadMultiselectModel>;
}

export interface JobSearchFilter {
    sort: Sort;
    contractType: ContractType;
    workingTime: [number, number];
}

export const initialState: JobSearchState = {
    loading: false,
    searchError: false,
    searchQuery: {
        baseQuery: [],
        localityQuery: []
    },
    searchFilter: {
        sort: {},
        contractType: ContractType.All,
        workingTime: [0, 100]
    },
    totalJobCount: 0,
    page: 0,
    jobList: [],
    initialState: true,
};

export const getJobSearchState = createFeatureSelector<JobSearchState>('jobSearch');
export const getTotalJobCount = createSelector(getJobSearchState, (state: JobSearchState) => state.totalJobCount);
export const getJobList = createSelector(getJobSearchState, (state: JobSearchState) => state.jobList);
export const getSearchQuery = createSelector(getJobSearchState, (state: JobSearchState) => state.searchQuery);
export const getBaseQuery = createSelector(getSearchQuery, (searchQuery: JobSearchQuery) => searchQuery.baseQuery);
export const getLocalityQuery = createSelector(getSearchQuery, (searchQuery: JobSearchQuery) => searchQuery.localityQuery);
export const getSearchError = createSelector(getJobSearchState, (state: JobSearchState) => state.searchError);
export const getSearchFilter = createSelector(getJobSearchState, (state: JobSearchState) => state.searchFilter);
export const getContractType = createSelector(getSearchFilter, (filter: JobSearchFilter) => filter.contractType);
export const getFilterWorkingTime = createSelector(getSearchFilter, (filter: JobSearchFilter) => filter.workingTime);
export const getLoading = createSelector(getJobSearchState, (state: JobSearchState) => state.loading);
