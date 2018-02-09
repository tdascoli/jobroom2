import { Action } from '@ngrx/store';
import { CandidateSearchToolState } from '../state/candidate-search-tool.state';
import { OccupationOption } from '../../../shared/reference-service/occupation-presentation.service';

export const CANDIDATE_SEARCH_TOOL_SUBMITTED = 'CANDIDATE_SEARCH_TOOL_SUBMITTED';
export const CANDIDATE_SEARCH_TOOL_COUNT = 'CANDIDATE_SEARCH_TOOL_COUNT';
export const CANDIDATE_SEARCH_TOOL_COUNTED = 'CANDIDATE_SEARCH_TOOL_COUNTED';
export const UPDATE_OCCUPATION_TRANSLATION = 'UPDATE_OCCUPATION_TRANSLATION';
export const RESET_CANDIDATE_SEARCH_TOOL_COUNT = 'RESET_CANDIDATE_SEARCH_TOOL_COUNT';

export class UpdateOccupationTranslationAction implements Action {
    readonly type = UPDATE_OCCUPATION_TRANSLATION;

    constructor(public payload: OccupationOption) {
    }
}

export class CandidateSearchToolSubmittedAction implements Action {
    readonly type = CANDIDATE_SEARCH_TOOL_SUBMITTED;

    constructor(public payload: CandidateSearchToolState) {
    }
}

export class CandidateSearchToolCountAction implements Action {
    readonly type = CANDIDATE_SEARCH_TOOL_COUNT;

    constructor(public payload: CandidateSearchToolState) {
    }
}

export class CandidateSearchToolCountedAction implements Action {
    readonly type = CANDIDATE_SEARCH_TOOL_COUNTED;

    constructor(public payload: number) {
    }
}

export class ResetCandidateSearchToolCountAction implements Action {
    readonly type = RESET_CANDIDATE_SEARCH_TOOL_COUNT;

    constructor(public payload = {}) {
    }
}
