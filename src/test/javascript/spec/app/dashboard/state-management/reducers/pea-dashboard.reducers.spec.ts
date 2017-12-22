import {
    CancellationSucceededAction,
    FilterJobPublicationsDashboardAction,
    JobPublicationsLoadedAction
} from '../../../../../../../main/webapp/app/dashboard/state-management/actions/pea-dashboard.actions';
import {
    initialState,
    PEADashboardState
} from '../../../../../../../main/webapp/app/dashboard/state-management/state/pea-dashboard.state';
import { peaDashboardReducer } from '../../../../../../../main/webapp/app/dashboard/state-management/reducers/pea-dashboard.reducers';
import {
    Locale,
    Status
} from '../../../../../../../main/webapp/app/shared/job-publication/job-publication.model';

describe('peaDashboardReducer', () => {
    it('should update PEADashboardState for JOB_PUBLICATIONS_LOADED action', () => {
        // GIVEN
        const state = Object.assign({}, initialState);
        const jobPublications = [];
        const action = new JobPublicationsLoadedAction({
            jobPublications,
            totalCount: 3,
            page: 1
        });

        // WHEN
        const newState: PEADashboardState = peaDashboardReducer(state, action);

        // THEN
        expect(newState.page).toEqual(1);
        expect(newState.totalCount).toEqual(3);
        expect(newState.jobPublications).toEqual(jobPublications);
        expect(newState.jobPublicationFilter).toEqual(initialState.jobPublicationFilter);
    });

    it('should update DashboardState for FILTER_JOB_PUBLICATIONS_DASHBOARD action', () => {
        // GIVEN
        const state = Object.assign({}, initialState);
        const action = new FilterJobPublicationsDashboardAction({
            jobTitle: 'Se',
            onlineSinceDays: 2
        });

        // WHEN
        const newState: PEADashboardState = peaDashboardReducer(state, action);

        // THEN
        const expectedState = Object.assign({}, initialState, {
            jobPublicationFilter: {
                jobTitle: 'Se',
                onlineSinceDays: 2
            },
            page: 0
        });
        expect(newState).toEqual(expectedState);
    });

    it('should update DashboardState for CANCELLATION_SUCCEEDED action', () => {
        // GIVEN
        const jobPublication1 = {
            id: 'id1',
            idAvam: 'id-avam',
            accessToken: 'access-token1',
            job: null,
            company: null,
            contact: null,
            application: null,
            publication: null,
            creationDate: 'aa',
            locale: Locale.DE,
            status: Status.INITIAL
        };

        const jobPublication2 = {
            id: 'id2',
            idAvam: 'id-avam',
            accessToken: 'access-token1',
            job: null,
            company: null,
            contact: null,
            application: null,
            publication: null,
            creationDate: 'aa',
            locale: Locale.DE,
            status: Status.INITIAL
        };

        const jobPublication3 = {
            id: 'id3',
            idAvam: 'id-avam',
            accessToken: 'access-token1',
            job: null,
            company: null,
            contact: null,
            application: null,
            publication: null,
            creationDate: 'aa',
            locale: Locale.DE,
            status: Status.INITIAL
        };

        const jobPublication4 = {
            id: 'id4',
            idAvam: 'id-avam',
            accessToken: 'access-token1',
            job: null,
            company: null,
            contact: null,
            application: null,
            publication: null,
            creationDate: 'aa',
            locale: Locale.DE,
            status: Status.INITIAL
        };
        const state = Object.assign({}, initialState, {
            jobPublications: [
                jobPublication1,
                jobPublication2,
                jobPublication3,
                jobPublication4
            ]
        });

        const updatedJobPublication = {
            id: 'id2',
            idAvam: 'id-avam',
            accessToken: 'access-token1',
            job: null,
            company: null,
            contact: null,
            application: null,
            publication: null,
            creationDate: 'aa',
            locale: Locale.DE,
            status: Status.INITIAL
        };

        const action = new CancellationSucceededAction(updatedJobPublication);

        // WHEN
        const newState: PEADashboardState = peaDashboardReducer(state, action);

        // THEN
        const expectedState = Object.assign({}, initialState, {
            jobPublications: [
                jobPublication1,
                updatedJobPublication,
                jobPublication3,
                jobPublication4
            ]
        });
        expect(newState).toEqual(expectedState);
    });
});
