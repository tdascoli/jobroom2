import { JobSearchToolState } from './job-search-tool.state';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CandidateSearchToolState } from './candidate-search-tool.state';
import { HomeLayoutState } from './layout.state';

export interface HomeState {
    layoutState: HomeLayoutState
    jobSearchTool: JobSearchToolState
    candidateSearchTool: CandidateSearchToolState
}

export const getHomeState = createFeatureSelector<HomeState>('home');
export const getJobSearchToolState = createSelector(getHomeState, (state: HomeState) => state.jobSearchTool);
export const getCandidateSearchToolState = createSelector(getHomeState, (state: HomeState) => state.candidateSearchTool);
export const getLayoutState = createSelector(getHomeState, (state: HomeState) => state.layoutState);
export const getActiveToolbarItem = createSelector(getLayoutState, (state: HomeLayoutState) => state.activeToolbarItem);
export const getActiveCompanyTabId = createSelector(getLayoutState, (state: HomeLayoutState) => state.activeCompanyTabId);
export const getActiveAgencyTabId = createSelector(getLayoutState, (state: HomeLayoutState) => state.activeAgencyTabId);
