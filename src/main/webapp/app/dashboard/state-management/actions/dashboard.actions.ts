import { Action } from '@ngrx/store';
import { JobPublication } from '../../../shared/job-publication/job-publication.model';
import { JobPublicationFilter } from '../state/dashboard.state';

export const FILTER_JOB_PUBLICATIONS_DASHBOARD = 'DASHBOARD:FILTER_JOB_PUBLICATIONS_DASHBOARD';
export const LOAD_NEXT_JOB_PUBLICATIONS_DASHBOARD_PAGE = 'DASHBOARD:LOAD_NEXT_JOB_PUBLICATIONS_DASHBOARD_PAGE';
export const JOB_PUBLICATIONS_LOADED = 'DASHBOARD:JOB_PUBLICATIONS_LOADED';
export const JOB_PUBLICATIONS_LOAD_ERROR = 'DASHBOARD:JOB_PUBLICATIONS_LOAD_ERROR';

export class FilterJobPublicationsDashboardAction implements Action {
    readonly type = FILTER_JOB_PUBLICATIONS_DASHBOARD;

    constructor(public payload: JobPublicationFilter) {
    }
}

export class LoadNextJobPublicationsDashboardPageAction implements Action {
    readonly type = LOAD_NEXT_JOB_PUBLICATIONS_DASHBOARD_PAGE;

    constructor(public payload: { page: number }) {
    }
}

export class JobPublicationsLoadedAction implements Action {
    readonly type = JOB_PUBLICATIONS_LOADED;

    constructor(public payload: { jobPublications: JobPublication[], totalCount: number, page: number }) {
    }
}

export class JobPublicationsLoadErrorAction implements Action {
    readonly type = JOB_PUBLICATIONS_LOAD_ERROR;

    constructor() {
    }
}

export type Actions =
    | FilterJobPublicationsDashboardAction
    | JobPublicationsLoadErrorAction
    | LoadNextJobPublicationsDashboardPageAction
    | JobPublicationsLoadedAction;
