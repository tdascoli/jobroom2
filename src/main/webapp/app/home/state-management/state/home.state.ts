import { JobSearchToolState } from './job-search-tool.state';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface HomeState {
    jobSearchTool: JobSearchToolState
}

export const getHomeState = createFeatureSelector<HomeState>('home');
export const getJobSearchToolState = createSelector(getHomeState, (state: HomeState) => state.jobSearchTool);
