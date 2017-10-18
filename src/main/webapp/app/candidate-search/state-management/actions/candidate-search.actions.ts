import { Action } from '@ngrx/store';
import { CandidateSearchFilter } from '../state/candidate-search.state';
import { CandidateProfile } from '../../services/candidate';

export const INIT_CANDIDATE_SEARCH = 'INIT_CANDIDATE_SEARCH';
export const SEARCH_CANDIDATES = 'SEARCH_CANDIDATES';
export const SELECT_PROFILE_CANDIDATE = 'SELECT_PROFILE_CANDIDATE';
export const CANDIDATE_LIST_LOADED = 'CANDIDATE_LIST_LOADED';
export const SHOW_CANDIDATE_LIST_ERROR = 'SHOW_CANDIDATE_LIST_ERROR';
export const HIDE_CANDIDATE_LIST_ERROR = 'HIDE_CANDIDATE_LIST_ERROR';

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

export class SelectCandidateProfileAction implements Action {
    readonly type = SELECT_PROFILE_CANDIDATE;

    constructor(public payload: { profile: CandidateProfile, index: number }) {
    }
}

export class CandidateProfileListLoadedAction implements Action {
    readonly type = CANDIDATE_LIST_LOADED;

    constructor(public payload: { candidateProfileList: Array<CandidateProfile>, totalCandidateCount: number, page: number }) {
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
    | SelectCandidateProfileAction
    | CandidateProfileListLoadedAction
    | ShowCandidateListErrorAction
    | HideCandidateListErrorAction
    ;
