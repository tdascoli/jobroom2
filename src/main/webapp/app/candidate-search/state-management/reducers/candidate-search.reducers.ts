import {
    CandidateSearchFilter,
    CandidateSearchState,
    initialState
} from '../state/candidate-search.state';
import {
    Actions,
    CANDIDATE_LIST_LOADED,
    HIDE_CANDIDATE_LIST_ERROR,
    NEXT_PAGE_LOADED,
    SAVE_SCROLL_Y,
    SEARCH_CANDIDATES,
    SHOW_CANDIDATE_LIST_ERROR
} from '../actions/candidate-search.actions';

export function candidateSearchReducer(state = initialState, action: Actions): CandidateSearchState {
    let newState;
    switch (action.type) {
        case CANDIDATE_LIST_LOADED:
            const { candidateProfileList, totalCandidateCount, page } = action.payload;
            newState = Object.assign({}, state, {
                candidateProfileList: [...candidateProfileList],
                totalCandidateCount,
                page,
                loading: false,
                searchError: false,
                candidateListScrollY: 0
            });
            break;

        case SHOW_CANDIDATE_LIST_ERROR:
            newState = Object.assign({}, state, { searchError: true, loading: false });
            break;

        case HIDE_CANDIDATE_LIST_ERROR:
            newState = Object.assign({}, state, { searchError: false });
            break;

        case SEARCH_CANDIDATES:
            newState = Object.assign({}, state, {
                searchFilter: action.payload,
                loading: true,
                initialState: false
            });
            break;

        case NEXT_PAGE_LOADED:
            newState = Object.assign({}, state, {
                candidateProfileList: [...state.candidateProfileList, ...action.payload],
                page: state.page + 1,
                loading: false
            });
            break;
        case SAVE_SCROLL_Y:
            newState = Object.assign({}, state, { candidateListScrollY: action.payload });
            break;

        default:
            newState = state;
    }

    return newState;
}
