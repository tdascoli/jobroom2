import { ActionReducerMap } from '@ngrx/store';
import { HomeState } from '../state/home.state';
import { jobSearchToolReducer } from './job-search-tool.reducers';

export const homeReducers: ActionReducerMap<HomeState> = {
    jobSearchTool: jobSearchToolReducer
};
