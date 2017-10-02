import { initialState, JobSearchState } from '../state/job-search.state';
import {
    Actions,
    FILTER_CHANGED,
    HIDE_JOB_LIST_ERROR,
    JOB_LIST_LOADED,
    LOAD_NEXT_PAGE, NEXT_JOB_LOADED,
    NEXT_PAGE_LOADED,
    SAVE_SCROLL_Y, SELECT_JOB, SelectJobAction,
    SHOW_JOB_LIST_ERROR,
    TOOLBAR_CHANGED
} from '../actions/job-search.actions';

export function jobSearchReducer(state = initialState, action: Actions): JobSearchState {
    let newState;
    switch (action.type) {
        case TOOLBAR_CHANGED:
            const searchQuery = Object.assign({}, action.payload);
            newState = Object.assign({}, state, { searchQuery }, { loading: true });
            break;

        case FILTER_CHANGED:
            const searchFilter = Object.assign({}, action.payload);
            newState = Object.assign({}, state, { searchFilter }, { loading: true });
            break;

        case JOB_LIST_LOADED:
            newState = Object.assign({}, state, {
                jobList: [...action.payload.jobList],
                totalJobCount: action.payload.totalCount,
                searchError: false,
                page: action.payload.page,
                initialState: false,
                loading: false,
                jobNavigationEnabled: true
            });
            break;

        case NEXT_PAGE_LOADED:
            newState = Object.assign({}, state, {
                jobList: [...state.jobList, ...action.payload]
            });
            break;

        case SHOW_JOB_LIST_ERROR:
            newState = Object.assign({}, state, { searchError: true }, { loading: false });
            break;

        case HIDE_JOB_LIST_ERROR:
            newState = Object.assign({}, state, { searchError: false });
            break;

        case LOAD_NEXT_PAGE:
            newState = Object.assign({}, state, { page: state.page + 1 });
            break;

        case SAVE_SCROLL_Y:
            newState = Object.assign({}, state, { jobListScrollY: action.payload });
            break;

        case SELECT_JOB:
            newState = Object.assign({}, state, {
                selectedJobIndex: action.payload.index
            });
            break;

        case NEXT_JOB_LOADED:
            newState = Object.assign({}, state, {
                nextJob: action.payload.job,
                selectedJobIndex: action.payload.index
            });
            break;

        default:
            newState = state;
    }

    return newState;
}
