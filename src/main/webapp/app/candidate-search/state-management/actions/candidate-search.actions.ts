import { Action } from '@ngrx/store';
import { CandidateSearchFilter } from '../state/candidate-search.state';

export const INIT_CANDIDATE_SEARCH = 'INIT_CANDIDATE_SEARCH';

export class InitCandidateSearchAction implements Action {
    readonly type = INIT_CANDIDATE_SEARCH;

    constructor(public payload?: CandidateSearchFilter) {
    }
}

export type Actions =
    | InitCandidateSearchAction
    ;
