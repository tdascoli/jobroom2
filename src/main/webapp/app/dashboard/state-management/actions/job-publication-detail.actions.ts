import { Action } from '@ngrx/store';
import { JobPublication, } from '../../../shared/job-publication/job-publication.model';
import { CancellationData } from '../../dialogs/cancellation-data';

export const SUBMIT_CANCELLATION = 'JOB_PUBLICATION_DETAIL:SUBMIT_CANCELLATION';
export const CANCELLATION_SUCCEEDED = 'JOB_PUBLICATION_DETAIL:CANCELLATION_SUCCEEDED';
export const CANCELLATION_FAILED = 'JOB_PUBLICATION_DETAIL:CANCELLATION_FAILED';
export const HIDE_SUCCESS_MESSAGE = 'JOB_PUBLICATION_DETAIL:HIDE_SUCCESS_MESSAGE';
export const HIDE_ERROR_MESSAGE = 'JOB_PUBLICATION_DETAIL:HIDE_ERROR_MESSAGE';
export const LOAD_JOB_PUBLICATION = 'JOB_PUBLICATION_DETAIL:LOAD_JOB_PUBLICATION';
export const LOAD_JOB_PUBLICATION_FAILED = 'JOB_PUBLICATION_DETAIL:LOAD_JOB_PUBLICATION_FAILED';
export const JOB_PUBLICATION_LOADED = 'JOB_PUBLICATION_DETAIL:JOB_PUBLICATION_LOADED';

export class LoadJobPublicationAction implements Action {
    readonly type = LOAD_JOB_PUBLICATION;

    constructor(public payload: { id: string, accessToken: string }) {
    }
}

export class JobPublicationLoadedAction implements Action {
    readonly type = JOB_PUBLICATION_LOADED;

    constructor(public payload: JobPublication) {
    }
}

export class LoadJobPublicationFailedAction implements Action {
    readonly type = LOAD_JOB_PUBLICATION_FAILED;

    constructor(public payload = {}) {
    }
}

export class SubmitCancellationAction implements Action {
    readonly type = SUBMIT_CANCELLATION;

    constructor(public payload: CancellationData) {
    }
}

export class CancellationSucceededAction implements Action {
    readonly type = CANCELLATION_SUCCEEDED;

    constructor(public payload: JobPublication) {
    }
}

export class CancellationFailedAction implements Action {
    readonly type = CANCELLATION_FAILED;

    constructor(public payload = {}) {
    }
}

export class HideSuccessMessageAction implements Action {
    readonly type = HIDE_SUCCESS_MESSAGE;

    constructor(public payload = {}) {
    }
}

export class HideErrorMessageAction implements Action {
    readonly type = HIDE_ERROR_MESSAGE;

    constructor(public payload = {}) {
    }
}

export type Actions = LoadJobPublicationAction
    | JobPublicationLoadedAction
    | LoadJobPublicationFailedAction
    | SubmitCancellationAction
    | CancellationSucceededAction
    | CancellationFailedAction
    | HideSuccessMessageAction
    | HideErrorMessageAction
    ;
