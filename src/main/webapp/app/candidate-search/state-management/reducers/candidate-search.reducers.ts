import { CandidateSearchState, initialState } from '../state/candidate-search.state';
import {
    Actions,
    CANDIDATE_LIST_LOADED,
    CANDIDATE_PROFILE_DETAIL_LOADED,
    CANDIDATE_PROFILE_DETAIL_URL_COPIED,
    CANDIDATE_SEARCH_TOOL_CHANGED,
    HIDE_CANDIDATE_LIST_ERROR,
    HIDE_URL_COPIED_MESSAGE,
    NEXT_PAGE_LOADED,
    RESET_FILTER,
    SAVE_SCROLL_Y,
    SEARCH_CANDIDATES,
    SHOW_CANDIDATE_LIST_ERROR,
    UPDATE_OCCUPATION_TRANSLATION
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
                loading: true
            });
            break;

        case CANDIDATE_SEARCH_TOOL_CHANGED:
            const searchFilter = Object.assign({}, initialState.searchFilter, action.payload);
            newState = Object.assign({}, initialState, {
                searchFilter,
                loading: true
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

        case UPDATE_OCCUPATION_TRANSLATION:
            newState = Object.assign({}, state, {
                searchFilter: Object.assign({}, state.searchFilter, { occupation: action.payload })
            });
            break;
        case RESET_FILTER:
            newState = Object.assign({}, initialState, { resetTime: action.payload });
            break;

        case CANDIDATE_PROFILE_DETAIL_LOADED:
            const selectedCandidateProfile = action.payload;
            newState = Object.assign({}, state, {
                selectedCandidateProfile,
                candidateProfileList: state.candidateProfileList.map((candidateProfile) =>
                    (selectedCandidateProfile && candidateProfile.id === selectedCandidateProfile.id)
                        ? Object.assign({}, candidateProfile, { visited: true })
                        : candidateProfile
                )
            });
            break;

        case CANDIDATE_PROFILE_DETAIL_URL_COPIED:
            newState = Object.assign({}, state, { displayUrlCopiedMessage: true });
            break;

        case HIDE_URL_COPIED_MESSAGE:
            newState = Object.assign({}, state, { displayUrlCopiedMessage: false });
            break;

        default:
            newState = state;
    }

    return newState;
}
