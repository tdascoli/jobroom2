import {
    Actions,
    BASE_QUERY_UPDATED,
    HIDE_JOB_LIST_ERROR_ACTION,
    initialState,
    JOB_LIST_LOADED,
    JobSearchState,
    NAVIGATION_FINISHED,
    NEXT_PAGE_LOADED,
    SHOW_JOB_LIST_ERROR_ACTION
} from '../index';

export function jobSearchReducer(state = initialState, action: Actions): JobSearchState {
    let newState;
    switch (action.type) {
        case JOB_LIST_LOADED:
            newState = Object.assign({}, state, {
                jobList: [...action.jobList],
                totalJobCount: action.totalCount,
                jobSearchError: false,
            });
            break;

        case BASE_QUERY_UPDATED:
            const searchQuery = Object.assign({}, state.searchQuery, { baseQuery: action.baseQuery });
            newState = Object.assign({}, state, { searchQuery });
            break;

        case NEXT_PAGE_LOADED:
            const nextPageQuery = Object.assign({}, state.searchQuery, { page: state.searchQuery.page + 1 });

            newState = Object.assign({}, state, {
                jobList: [...state.jobList, ...action.jobList]
            }, { searchQuery: nextPageQuery });
            break;

        case NAVIGATION_FINISHED:
            newState = Object.assign({}, state, { initialState: false });
            break;

        case SHOW_JOB_LIST_ERROR_ACTION:
            newState = Object.assign({}, state, { jobSearchError: true });
            break;

        case HIDE_JOB_LIST_ERROR_ACTION:
            newState = Object.assign({}, state, { jobSearchError: false });
            break;

        default:
            newState = Object.assign({}, state);
    }

    return newState;
}
