import { Action } from '@ngrx/store';
import { Job } from '../../../entities/job/job.model';
import { TypeaheadMultiselectModel } from '../../../shared/job-search/typeahead-multiselect/typeahead-multiselect-model';
import { RouterNavigationAction } from '@ngrx/router-store';
import { WorkingTime } from '../state/job-search.state';

export const EXECUTE_SEARCH = 'EXECUTE_JOB_SEARCH';
export const JOB_LIST_LOADED = 'JOB_LIST_LOADED';
export const LOAD_JOB_LIST = 'LOAD_JOB_LIST';
export const SHOW_JOB_LIST_ERROR_ACTION = 'SHOW_JOB_LIST_ERROR_ACTION';
export const HIDE_JOB_LIST_ERROR_ACTION = 'HIDE_JOB_LIST_ERROR_ACTION';
export const BASE_QUERY_UPDATED = 'BASE_QUERY_UPDATED';
export const LOCALITY_QUERY_UPDATED = 'LOCALITY_QUERY_UPDATED';
export const LOAD_NEXT_PAGE = 'LOAD_NEXT_PAGE';
export const NEXT_PAGE_LOADED = 'NEXT_PAGE_LOADED';
export const NAVIGATION_FINISHED = 'NAVIGATION_FINISHED';
export const FILTER_WORKINGTIME_CHANGED = 'FILTER_WORKINGTIME_CHANGED';

export class ExecuteSearchAction implements Action {
    readonly type = EXECUTE_SEARCH;

    constructor(public baseQuery: Array<TypeaheadMultiselectModel>, public localityQuery: Array<TypeaheadMultiselectModel>) {
    }
}

// Todo: Do we need two separate actions for the query update?
// Review this during https://alv-ch.atlassian.net/browse/JR2-38
export class BaseQueryUpdatedAction implements Action {
    readonly type = BASE_QUERY_UPDATED;

    constructor(public baseQuery: Array<TypeaheadMultiselectModel>) {
    }
}

export class LocalityQueryUpdatedAction implements Action {
    readonly type = LOCALITY_QUERY_UPDATED;

    constructor(public localityQuery: Array<TypeaheadMultiselectModel>) {
    }
}

export class LoadJobListAction implements Action {
    readonly type = LOAD_JOB_LIST;

    constructor(public baseQuery: Array<TypeaheadMultiselectModel>, public localityQuery: Array<TypeaheadMultiselectModel>) {
    }
}

export class JobListLoadedAction implements Action {
    readonly type = JOB_LIST_LOADED;

    constructor(public jobList: Array<Job>, public totalCount: number) {
    }
}

export class ShowJobListErrorAction implements Action {
    readonly type = SHOW_JOB_LIST_ERROR_ACTION;

    constructor(error: any) {
    }
}

export class HideJobListErrorAction implements Action {
    readonly type = HIDE_JOB_LIST_ERROR_ACTION;

    constructor() {
    }
}

export class LoadNextPageAction implements Action {
    readonly type = LOAD_NEXT_PAGE;

    constructor() {
    }
}

export class NextPageLoadedAction implements Action {
    readonly type = NEXT_PAGE_LOADED;

    constructor(public jobList: Array<Job>) {
    }
}

export class NavigationFinishedAction implements Action {
    readonly type = NAVIGATION_FINISHED;
}

export class WorkingTimeChangedAction implements Action {
    readonly type = FILTER_WORKINGTIME_CHANGED;

    constructor(public workingTime: WorkingTime) {
    }
}

export type Actions =
    | ExecuteSearchAction
    | LoadJobListAction
    | JobListLoadedAction
    | RouterNavigationAction
    | BaseQueryUpdatedAction
    | LocalityQueryUpdatedAction
    | LoadNextPageAction
    | NextPageLoadedAction
    | NavigationFinishedAction
    | ShowJobListErrorAction
    | HideJobListErrorAction
    | WorkingTimeChangedAction
    ;
