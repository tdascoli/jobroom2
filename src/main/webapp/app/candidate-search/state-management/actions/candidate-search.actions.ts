import { Action } from '@ngrx/store';
import { OccupationSuggestion } from '../../../shared/reference-service/occupation-autocomplete';
import { CandidateSearchFilter } from '../state/candidate-search.state';

export const INIT_CANDIDATE_SEARCH = 'INIT_CANDIDATE_SEARCH';
export const SEARCH_CANDIDATES = 'SEARCH_CANDIDATES';

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

export class SearchCandidatesAction implements Action {
    readonly type = SEARCH_CANDIDATES;

    constructor(public payload: CandidateSearchFilter) {
    }
}

export type Actions =
    | InitCandidateSearchAction
    | SearchCandidatesAction
    ;
