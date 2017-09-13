import { Action } from '@ngrx/store';
import { JobSearchFilter, JobSearchQuery } from '../state/job-search.state';
import { Job } from '../../services';

export const LOAD_NEXT_PAGE = 'LOAD_NEXT_PAGE';
export const JOB_LIST_LOADED = 'JOB_LIST_LOADED';
export const NEXT_PAGE_LOADED = 'NEXT_PAGE_LOADED';
export const SHOW_JOB_LIST_ERROR = 'SHOW_JOB_LIST_ERROR';
export const HIDE_JOB_LIST_ERROR = 'HIDE_JOB_LIST_ERROR';
export const FILTER_CHANGED = 'FILTER_CHANGED';
export const TOOLBAR_CHANGED = 'TOOLBAR_CHANGED';
export const SAVE_SCROLL_Y = 'SAVE_SCROLL_Y';

export class ToolbarChangedAction implements Action {
    readonly type = TOOLBAR_CHANGED;

    constructor(public payload: JobSearchQuery) {
    }
}

export class FilterChangedAction implements Action {
    readonly type = FILTER_CHANGED;

    constructor(public payload: JobSearchFilter) {
    }
}

export class LoadNextPageAction implements Action {
    readonly type = LOAD_NEXT_PAGE;

    constructor() {
    }
}

export class JobListLoadedAction implements Action {
    readonly type = JOB_LIST_LOADED;

    constructor(public payload: { jobList: Array<Job>, totalCount: number, page: number }) {
    }
}

export class NextPageLoadedAction implements Action {
    readonly type = NEXT_PAGE_LOADED;

    constructor(public payload: Array<Job>) {
    }
}

export class ShowJobListErrorAction implements Action {
    readonly type = SHOW_JOB_LIST_ERROR;

    constructor(public error: any) {
    }
}

export class HideJobListErrorAction implements Action {
    readonly type = HIDE_JOB_LIST_ERROR;

    constructor() {
    }
}

export class SaveScrollYAction implements Action {
    readonly type = SAVE_SCROLL_Y;

    constructor(public payload: number) {
    }
}

export type Actions =
    | ToolbarChangedAction
    | FilterChangedAction
    | LoadNextPageAction
    | JobListLoadedAction
    | NextPageLoadedAction
    | ShowJobListErrorAction
    | HideJobListErrorAction
    | SaveScrollYAction
    ;
