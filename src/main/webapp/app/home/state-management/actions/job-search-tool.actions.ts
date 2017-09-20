import { Action } from '@ngrx/store';
import { JobSearchToolState } from '../state/job-search-tool.state';

export const JOB_SEARCH_TOOL_SUBMITTED = 'JOB_SEARCH_TOOL_SUBMITTED';

export class JobSearchToolSubmittedAction implements Action {
    readonly type = JOB_SEARCH_TOOL_SUBMITTED;

    constructor(public payload: JobSearchToolState) {
    }
}

export type Actions =
    | JobSearchToolSubmittedAction;
