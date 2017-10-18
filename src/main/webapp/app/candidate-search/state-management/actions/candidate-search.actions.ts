import { Action } from '@ngrx/store';
import { CandidateSearchFilter } from '../state/candidate-search.state';
import { CandidateProfile } from '../../services/candidate';

export const INIT_CANDIDATE_SEARCH = 'CANDIDATES:INIT_CANDIDATE_SEARCH';
export const SEARCH_CANDIDATES = 'CANDIDATES:SEARCH_CANDIDATES';
export const LOAD_NEXT_PAGE = 'CANDIDATES:LOAD_NEXT_PAGE';
export const NEXT_PAGE_LOADED = 'CANDIDATES:NEXT_PAGE_LOADED';
export const CANDIDATE_LIST_LOADED = 'CANDIDATES:CANDIDATE_LIST_LOADED';
export const SHOW_CANDIDATE_LIST_ERROR = 'CANDIDATES:SHOW_CANDIDATE_LIST_ERROR';
export const HIDE_CANDIDATE_LIST_ERROR = 'CANDIDATES:HIDE_CANDIDATE_LIST_ERROR';

export class InitCandidateSearchAction implements Action {
    readonly type = INIT_CANDIDATE_SEARCH;

    constructor() {
    }
}

export class SearchCandidatesAction implements Action {
    readonly type = SEARCH_CANDIDATES;

    constructor(public payload: CandidateSearchFilter) {
    }
}

export class CandidateProfileListLoadedAction implements Action {
    readonly type = CANDIDATE_LIST_LOADED;

    constructor(public payload: { candidateProfileList: Array<CandidateProfile>, totalCandidateCount: number, page: number }) {
    }
}

export class LoadNextPageAction implements Action {
    readonly type = LOAD_NEXT_PAGE;

    constructor() {
    }
}

export class NextPageLoadedAction implements Action {
    readonly type = NEXT_PAGE_LOADED;

    // todo: Check if we need to add the total count
    constructor(public payload: Array<CandidateProfile>) {
    }
}

export class ShowCandidateListErrorAction implements Action {
    readonly type = SHOW_CANDIDATE_LIST_ERROR;

    constructor(public error: any) {
    }
}

export class HideCandidateListErrorAction implements Action {
    readonly type = HIDE_CANDIDATE_LIST_ERROR;

    constructor() {
    }
}

export type Actions =
    | InitCandidateSearchAction
    | SearchCandidatesAction
    | LoadNextPageAction
    | NextPageLoadedAction
    | CandidateProfileListLoadedAction
    | ShowCandidateListErrorAction
    | HideCandidateListErrorAction
    ;
