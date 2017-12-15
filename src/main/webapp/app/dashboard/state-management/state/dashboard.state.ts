import { createFeatureSelector, createSelector } from '@ngrx/store';
import { JobPublication } from '../../../shared/job-publication/job-publication.model';

export interface JobPublicationFilter {
    jobTitle: string;
    onlineSinceDays: number;
}

export interface JobPublicationsDashboardState {
    jobPublicationFilter: JobPublicationFilter;
    jobPublications: JobPublication[];
    totalCount: number;
    page: number;
}

export interface DashboardState {
    jobPublicationsDashboardState: JobPublicationsDashboardState
}

export const initialState: DashboardState = {
    jobPublicationsDashboardState: {
        jobPublicationFilter: {
            jobTitle: '',
            onlineSinceDays: 90
        },
        jobPublications: [],
        totalCount: 0,
        page: -1
    }
};

export const getDashboardState = createFeatureSelector<DashboardState>('dashboard');
export const getJobPublicationDashboardState = createSelector(getDashboardState, (state: DashboardState) => state.jobPublicationsDashboardState);
export const getJobPublicationFilter = createSelector(getJobPublicationDashboardState, (state: JobPublicationsDashboardState) => state.jobPublicationFilter);
export const getJobPublications = createSelector(getJobPublicationDashboardState, (state: JobPublicationsDashboardState) => state.jobPublications);
export const getJobPublicationsTotalCount = createSelector(getJobPublicationDashboardState, (state: JobPublicationsDashboardState) => state.totalCount);
export const getJobPublicationsPage = createSelector(getJobPublicationDashboardState, (state: JobPublicationsDashboardState) => state.page);
