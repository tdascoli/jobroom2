import { Action } from '@ngrx/store';
import { CandidateSearchToolState } from '../state/candidate-search-tool.state';

export const CANDIDATE_SEARCH_TOOL_SUBMITTED = 'CANDIDATE_SEARCH_TOOL_SUBMITTED';

export class CandidateSearchToolSubmittedAction implements Action {
    readonly type = CANDIDATE_SEARCH_TOOL_SUBMITTED;

    constructor(public payload: CandidateSearchToolState) {
    }
}
