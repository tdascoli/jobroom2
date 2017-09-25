import { Action } from '@ngrx/store';

export const INIT_CANDIDATE_SEARCH = 'INIT_CANDIDATE_SEARCH';

export class InitCandidateSearchAction implements Action {
    readonly type = INIT_CANDIDATE_SEARCH;

    constructor(public payload?: {
        occupation?: string,
        residence?: number,
        graduation?: number,
    }) {
    }
}

export type Actions =
    | InitCandidateSearchAction
    ;
