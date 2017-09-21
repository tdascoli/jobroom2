import { JobSearchToolState } from './job-search-tool.state';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CandidateSearchToolState } from './candidate-search-tool.state';

export interface HomeState {
    jobSearchTool: JobSearchToolState
    candidateSearchTool: CandidateSearchToolState
}

export const getHomeState = createFeatureSelector<HomeState>('home');
export const getJobSearchToolState = createSelector(getHomeState, (state: HomeState) => state.jobSearchTool);
export const getCandidateSearchToolState = createSelector(getHomeState, (state: HomeState) => state.candidateSearchTool);
