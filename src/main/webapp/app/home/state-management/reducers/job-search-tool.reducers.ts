import { initialState, JobSearchToolState } from '../state/job-search-tool.state';
import { Actions, JOB_SEARCH_TOOL_SUBMITTED } from '../actions/job-search-tool.actions';

export function jobSearchToolReducer(state = initialState, action: Actions): JobSearchToolState {
    let newState;
    switch (action.type) {
        case JOB_SEARCH_TOOL_SUBMITTED:
            const { localityQuery, baseQuery } = action.payload;
            newState = Object.assign({}, state, {
                localityQuery: [...localityQuery],
                baseQuery: [...baseQuery]
            });
            break;

        default:
            newState = state;
    }

    return newState;
}
