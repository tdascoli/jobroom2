import { TypeaheadMultiselectModel } from '../../../shared/input-components';
import { Job } from '../../services';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export enum Sort {
    RELEVANCE_DESC,
    DATE_ASC,
    DATE_DESC
}

export enum ContractType {
    ALL,
    TEMPORARY,
    PERMANENT,
}

export interface JobSearchState {
    jobListScrollY: number;
    loading: boolean;
    searchError: boolean;
    searchQuery: JobSearchQuery;
    searchFilter: JobSearchFilter;
    jobList: Array<Job>;
    totalJobCount: number;
    initialState: boolean;
    page: number;
}

export interface JobSearchQuery {
    baseQuery: Array<TypeaheadMultiselectModel>;
    localityQuery: Array<TypeaheadMultiselectModel>;
}

export interface JobSearchFilter {
    sort: Sort;
    contractType: ContractType;
    workingTime: [number, number];
    companyName?: string;
}

export const initialState: JobSearchState = {
    jobListScrollY: 0,
    loading: false,
    searchError: false,
    searchQuery: {
        baseQuery: [],
        localityQuery: []
    },
    searchFilter: {
        contractType: ContractType.ALL,
        workingTime: [0, 100],
        sort: Sort.RELEVANCE_DESC
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
export const getJobListScrollY = createSelector(getJobSearchState, (state: JobSearchState) => state.jobListScrollY);
export const getInitialState = createSelector(getJobSearchState, (state: JobSearchState) => state.initialState);
