import { initialState, JobSearchToolState } from '../state/job-search-tool.state';
import { Actions, JOB_SEARCH_TOOL_SUBMITTED } from '../index';
import {
    JOB_SEARCH_TOOL_COUNT,
    JOB_SEARCH_TOOL_COUNTED,
    RESET_JOB_SEARCH_TOOL_COUNT
} from '../actions/job-search-tool.actions';
import * as core from '../../../shared/state-management/actions/core.actions';

export function jobSearchToolReducer(state = initialState, action: Actions | core.ResetAction): JobSearchToolState {
    let newState;
    switch (action.type) {
        case JOB_SEARCH_TOOL_SUBMITTED:
            newState = Object.assign({}, initialState);
            break;
        case JOB_SEARCH_TOOL_COUNT:
            newState = Object.assign({}, action.payload);
            break;
        case JOB_SEARCH_TOOL_COUNTED:
            newState = Object.assign({}, state, { totalCount: action.payload });
            break;
        case RESET_JOB_SEARCH_TOOL_COUNT:
            newState = Object.assign({}, initialState);
            break;
        case core.RESET:
            newState = Object.assign({}, initialState);
            break;

        default:
            newState = state;
    }

    return newState;
}
