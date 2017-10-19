import { Action } from '@ngrx/store';
import { CandidateSearchToolState } from '../state/candidate-search-tool.state';

export const CANDIDATE_SEARCH_TOOL_SUBMITTED = 'CANDIDATE_SEARCH_TOOL_SUBMITTED';
export const CANDIDATE_SEARCH_TOOL_COUNT = 'CANDIDATE_SEARCH_TOOL_COUNT';
export const CANDIDATE_SEARCH_TOOL_COUNTED = 'CANDIDATE_SEARCH_TOOL_COUNTED';

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
