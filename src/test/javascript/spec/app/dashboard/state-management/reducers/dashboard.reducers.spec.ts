import { dashboardReducer } from '../../../../../../../main/webapp/app/dashboard/state-management/reducers/dashboard.reducers';
import {
    DashboardState,
    initialState
} from '../../../../../../../main/webapp/app/dashboard/state-management/state/dashboard.state';
import {
    FilterJobPublicationsDashboardAction,
    JobPublicationsLoadedAction
} from '../../../../../../../main/webapp/app/dashboard/state-management/actions/dashboard.actions';

describe('dashboardReducer', () => {
    it('should update DashboardState for JOB_PUBLICATIONS_LOADED action', () => {
        // GIVEN
        const state = Object.assign({}, initialState);
        const jobPublications = [];
        const action = new JobPublicationsLoadedAction({
            jobPublications,
            totalCount: 3,
            page: 1
        });

        // WHEN
        const newState: DashboardState = dashboardReducer(state, action);

        // THEN
        expect(newState.jobPublicationsDashboardState.page).toEqual(1);
        expect(newState.jobPublicationsDashboardState.totalCount).toEqual(3);
        expect(newState.jobPublicationsDashboardState.jobPublications).toEqual(jobPublications);
        expect(newState.jobPublicationsDashboardState.jobPublicationFilter)
            .toEqual(initialState.jobPublicationsDashboardState.jobPublicationFilter);
    });

    it('should update DashboardState for FILTER_JOB_PUBLICATIONS_DASHBOARD action', () => {
        // GIVEN
        const state = Object.assign({}, initialState);
        const action = new FilterJobPublicationsDashboardAction({
            jobTitle: 'Se',
            onlineSinceDays: 2
        });

        // WHEN
        const newState: DashboardState = dashboardReducer(state, action);

        // THEN
        const jobPublicationsDashboardState = Object.assign({}, initialState.jobPublicationsDashboardState, {
            jobPublicationFilter: {
                jobTitle: 'Se',
                onlineSinceDays: 2
            },
            page: 0
        });
        const expectedState = Object.assign({}, initialState, {
            jobPublicationsDashboardState
        });
        expect(newState).toEqual(expectedState);
    });
});
