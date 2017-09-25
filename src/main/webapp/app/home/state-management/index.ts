import { JobSearchToolSubmittedAction } from './actions/job-search-tool.actions';
import { CandidateSearchToolSubmittedAction } from './actions/candidate-search-tool.actions';
import {
    SelectAgencyTabAction,
    SelectCompanyTabAction,
    SelectToolbarItemAction
} from './actions/layout.actions';

export * from './actions/job-search-tool.actions';
export * from './actions/candidate-search-tool.actions';
export * from './actions/layout.actions';
export * from './reducers/home.reducers';
export * from './reducers/job-search-tool.reducers';
export * from './reducers/layout.reducers';
export { JobSearchToolState } from './state/job-search-tool.state';
export * from './effects/home.effects';
export * from './state/home.state';
export { CandidateSearchToolState } from './state/candidate-search-tool.state';

export type Actions =
    | JobSearchToolSubmittedAction
    | CandidateSearchToolSubmittedAction
    | SelectToolbarItemAction
    | SelectCompanyTabAction
    | SelectAgencyTabAction
    ;
