import { Action } from '@ngrx/store';
import { CandidateSearchFilter } from '../state/candidate-search.state';
import { CandidateProfile } from '../../services/candidate';
import { OccupationOption } from '../../../shared/reference-service';
import { TypeaheadMultiselectModel } from '../../../shared/input-components/typeahead/typeahead-multiselect-model';

export const INIT_CANDIDATE_SEARCH = 'CANDIDATES:INIT_CANDIDATE_SEARCH';
export const CANDIDATE_PROFILE_DETAIL_LOADED = 'CANDIDATES:CANDIDATE_PROFILE_DETAIL_LOADED';
export const SEARCH_CANDIDATES = 'CANDIDATES:SEARCH_CANDIDATES';
export const CANDIDATE_SEARCH_TOOL_CHANGED = 'CANDIDATES:CANDIDATE_SEARCH_TOOL_CHANGED';
export const LOAD_NEXT_PAGE = 'CANDIDATES:LOAD_NEXT_PAGE';
export const NEXT_PAGE_LOADED = 'CANDIDATES:NEXT_PAGE_LOADED';
export const CANDIDATE_LIST_LOADED = 'CANDIDATES:CANDIDATE_LIST_LOADED';
export const SHOW_CANDIDATE_LIST_ERROR = 'CANDIDATES:SHOW_CANDIDATE_LIST_ERROR';
export const HIDE_CANDIDATE_LIST_ERROR = 'CANDIDATES:HIDE_CANDIDATE_LIST_ERROR';
export const COUNT_CANDIDATES = 'COUNT_CANDIDATES';
export const SAVE_SCROLL_Y = 'CANDIDATES:SAVE_SCROLL_Y';
export const UPDATE_OCCUPATION_TRANSLATION = 'CANDIDATES:UPDATE_OCCUPATION_TRANSLATION';
export const RESET_FILTER = 'CANDIDATES:RESET';
export const PRINT_CANDIDATE = 'CANDIDATES:PRINT_CANDIDATE';
export const MAIL_TO_OPENED = 'CANDIDATES:MAIL_TO_OPENED';
export const PHONE_TO_OPENED = 'CANDIDATES:PHONE_TO_OPENED';

export class CandidateProfileDetailLoadedAction implements Action {
    readonly type = CANDIDATE_PROFILE_DETAIL_LOADED;

    constructor(public payload: CandidateProfile) {
    }
}

export class InitCandidateSearchAction implements Action {
    readonly type = INIT_CANDIDATE_SEARCH;

    constructor(public payload = {}) {
    }
}

export class UpdateOccupationTranslationAction implements Action {
    readonly type = UPDATE_OCCUPATION_TRANSLATION;

    constructor(public payload: Array<TypeaheadMultiselectModel>) {
    }
}

export class SearchCandidatesAction implements Action {
    readonly type = SEARCH_CANDIDATES;

    constructor(public payload: CandidateSearchFilter) {
    }
}

export class CandidateSearchToolChangedAction implements Action {
    readonly type = CANDIDATE_SEARCH_TOOL_CHANGED;

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

    constructor(public payload = {}) {
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

    constructor(public payload: any) {
    }
}

export class HideCandidateListErrorAction implements Action {
    readonly type = HIDE_CANDIDATE_LIST_ERROR;

    constructor(public payload = {}) {
    }
}

export class CountCandidatesAction implements Action {
    readonly type = COUNT_CANDIDATES;

    constructor(public payload: CandidateSearchFilter) {
    }
}

export class SaveScrollYAction implements Action {
    readonly type = SAVE_SCROLL_Y;

    constructor(public payload: number) {
    }
}

export class ResetFilterAction implements Action {
    readonly type = RESET_FILTER;

    constructor(public payload: number) {
    }
}

export class PrintCandidateAction implements Action {
    readonly type = PRINT_CANDIDATE;

    constructor(public payload = {}) {

    }
}

export class MailToOpenedAction implements Action {
    readonly type = MAIL_TO_OPENED;

    constructor(public payload: string) {
    }
}

export class PhoneToOpenedAction implements Action {
    readonly type = PHONE_TO_OPENED;

    constructor(public payload: string) {
    }
}

export type Actions =
    | InitCandidateSearchAction
    | SearchCandidatesAction
    | CandidateSearchToolChangedAction
    | CandidateProfileDetailLoadedAction
    | LoadNextPageAction
    | NextPageLoadedAction
    | MailToOpenedAction
    | PrintCandidateAction
    | PhoneToOpenedAction
    | CandidateProfileListLoadedAction
    | UpdateOccupationTranslationAction
    | ShowCandidateListErrorAction
    | HideCandidateListErrorAction
    | CountCandidatesAction
    | SaveScrollYAction
    | ResetFilterAction
    ;
