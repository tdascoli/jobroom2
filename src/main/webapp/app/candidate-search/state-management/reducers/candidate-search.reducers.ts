import { CandidateSearchState, initialState } from '../state/candidate-search.state';
import { Actions, INIT_CANDIDATE_SEARCH } from '../actions/candidate-search.actions';

export function candidateSearchReducer(state = initialState, action: Actions): CandidateSearchState {
    let newState;
    switch (action.type) {
        case INIT_CANDIDATE_SEARCH:
            const searchFilter = Object.assign({}, state.searchFilter, action.payload);
            newState = Object.assign({}, state, { searchFilter });
            break;

        default:
            newState = state;
    }

    return newState;
}
