import {
    Actions,
    CANCELLATION_SUCCEEDED,
    FILTER_JOB_PUBLICATIONS_DASHBOARD,
    JOB_PUBLICATIONS_LOADED
} from '../actions/pea-dashboard.actions';
import { initialState, PEADashboardState } from '../state/pea-dashboard.state';

export function peaDashboardReducer(state = initialState, action: Actions): PEADashboardState {
    let newState;
    switch (action.type) {
        case JOB_PUBLICATIONS_LOADED:
            const { totalCount, page, jobPublications } = action.payload;
            newState = Object.assign({}, state, {
                totalCount,
                page,
                jobPublications
            });
            break;

        case FILTER_JOB_PUBLICATIONS_DASHBOARD:
            newState = Object.assign({}, state, {
                jobPublicationFilter: action.payload,
                page: 0
            });
            break;

        case CANCELLATION_SUCCEEDED:
            const updatedJobPublication = action.payload;
            const patchedPublications = state.jobPublications
                .map((jobPublication) => jobPublication.id === updatedJobPublication.id
                    ? updatedJobPublication
                    : jobPublication);
            newState = Object.assign({}, state, {
                jobPublications: patchedPublications
            });

            break;

        default:
            newState = state;
    }

    return newState;
}
