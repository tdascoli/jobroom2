import { DashboardState, initialState } from '../state/dashboard.state';
import { Actions, FILTER_JOB_PUBLICATIONS_DASHBOARD, JOB_PUBLICATIONS_LOADED } from '../actions/dashboard.actions';

export function dashboardReducer(state = initialState, action: Actions): DashboardState {
    let newState;
    let jobPublicationsDashboardState;
    switch (action.type) {
        case JOB_PUBLICATIONS_LOADED:
            jobPublicationsDashboardState = Object.assign({}, state.jobPublicationsDashboardState, {
                    totalCount: action.payload.totalCount,
                    page: action.payload.page,
                    jobPublications: action.payload.jobPublications
            });
            newState = Object.assign({}, state, {
                jobPublicationsDashboardState
            });
            break;
        case FILTER_JOB_PUBLICATIONS_DASHBOARD:
            jobPublicationsDashboardState = Object.assign({}, state.jobPublicationsDashboardState, {
                jobPublicationFilter: action.payload,
                page: 0
            });
            newState = Object.assign({}, state, {
                jobPublicationsDashboardState
            });
            break;
        default:
            newState = state;
    }

    return newState;
}
