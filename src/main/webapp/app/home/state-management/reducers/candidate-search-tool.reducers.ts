import {
    CandidateSearchToolState,
    initialState
} from '../state/candidate-search-tool.state';
import { Actions } from '../index';
import {
    CANDIDATE_SEARCH_TOOL_COUNT,
    CANDIDATE_SEARCH_TOOL_COUNTED,
    CANDIDATE_SEARCH_TOOL_SUBMITTED,
    RESET_CANDIDATE_SEARCH_TOOL_COUNT
} from '../actions/candidate-search-tool.actions';

export function candidateSearchToolReducer(state = initialState, action: Actions): CandidateSearchToolState {
    let newState;
    switch (action.type) {
        case CANDIDATE_SEARCH_TOOL_SUBMITTED:
            newState = Object.assign({}, state, action.payload);
            break;
        case CANDIDATE_SEARCH_TOOL_COUNT:
            newState = Object.assign({}, action.payload);
            break;
        case CANDIDATE_SEARCH_TOOL_COUNTED:
            newState = Object.assign({}, state, { totalCount: action.payload });
            break;
        case RESET_CANDIDATE_SEARCH_TOOL_COUNT:
            newState = Object.assign({}, initialState);
            break;
        default:
            newState = state;
    }
    return newState;
}
