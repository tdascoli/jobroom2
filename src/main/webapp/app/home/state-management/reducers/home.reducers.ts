import { ActionReducerMap } from '@ngrx/store';
import { HomeState } from '../state/home.state';
import { jobSearchToolReducer } from './job-search-tool.reducers';
import { candidateSearchToolReducer } from './candidate-search-tool.reducers';

export const homeReducers: ActionReducerMap<HomeState> = {
    jobSearchTool: jobSearchToolReducer,
    candidateSearchTool: candidateSearchToolReducer
};
