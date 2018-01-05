import { JobPublication } from '../../../shared/job-publication/job-publication.model';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface PEADashboardState {
    jobPublicationFilter: JobPublicationFilter;
    jobPublications: JobPublication[];
    totalCount: number;
    page: number;
}

export interface JobPublicationFilter {
    jobTitle: string;
    onlineSinceDays: number;
}

export const initialState: PEADashboardState = {
    jobPublicationFilter: {
        jobTitle: '',
        onlineSinceDays: 90
    },
    jobPublications: [],
    totalCount: 0,
    page: 0
};

export const getJobPublicationDashboardState = createFeatureSelector<PEADashboardState>('peaDashboard');
export const getJobPublicationFilter = createSelector(getJobPublicationDashboardState, (state: PEADashboardState) => state.jobPublicationFilter);
export const getJobPublications = createSelector(getJobPublicationDashboardState, (state: PEADashboardState) => state.jobPublications);
export const getJobPublicationsTotalCount = createSelector(getJobPublicationDashboardState, (state: PEADashboardState) => state.totalCount);
export const getJobPublicationsPage = createSelector(getJobPublicationDashboardState, (state: PEADashboardState) => state.page);
