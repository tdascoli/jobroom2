import {
    CandidateSearchToolState,
    initialState
} from '../state/candidate-search-tool.state';
import { Actions } from '../index';
import { CANDIDATE_SEARCH_TOOL_SUBMITTED } from '../actions/candidate-search-tool.actions';

export function candidateSearchToolReducer(state = initialState, action: Actions): CandidateSearchToolState {
    let newState;
    switch (action.type) {
        case CANDIDATE_SEARCH_TOOL_SUBMITTED:
            newState = Object.assign({}, action.payload);
            break;

        default:
            newState = state;
    }
    return newState;
}
