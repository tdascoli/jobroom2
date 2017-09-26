import { Action } from '@ngrx/store';
import { OccupationSuggestion } from '../../../shared/job-search/service/occupation-autocomplete';

export const INIT_CANDIDATE_SEARCH = 'INIT_CANDIDATE_SEARCH';

// todo: move OccupationSuggestion to a reference-service module

export class InitCandidateSearchAction implements Action {
    readonly type = INIT_CANDIDATE_SEARCH;

    constructor(public payload?: {
        occupation?: OccupationSuggestion,
        residence?: number,
        graduation?: number,
    }) {
    }
}

export type Actions =
    | InitCandidateSearchAction
    ;
