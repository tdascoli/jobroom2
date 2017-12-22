import {
    initialState,
    JobPublicationDetailState,
    LoadingStatus
} from '../../../../../../../main/webapp/app/dashboard/state-management/state/job-publication-detail.state';
import { jobPublicationDetailReducer } from '../../../../../../../main/webapp/app/dashboard/state-management/reducers/job-publication-detail.reducers';
import {
    CancellationFailedAction,
    CancellationSucceededAction,
    HideErrorMessageAction,
    HideSuccessMessageAction,
    JobPublicationLoadedAction,
    LoadJobPublicationAction,
    LoadJobPublicationFailedAction
} from '../../../../../../../main/webapp/app/dashboard/state-management/actions/job-publication-detail.actions';
import {
    Locale,
    Status
} from '../../../../../../../main/webapp/app/shared/job-publication/job-publication.model';

describe('jobPublicationDetailReducer', () => {

    it('should update JobPublicationDetailState for CANCELLATION_SUCCEEDED action', () => {
        // GIVEN
        const jobPublication = {
            id: 'id',
            idAvam: 'id-avam',
            accessToken: 'access-token',
            job: null,
            company: null,
            contact: null,
            application: null,
            publication: null,
            creationDate: 'aa',
            locale: Locale.DE,
            status: Status.INITIAL
        };
        const state = Object.assign({}, initialState, { jobPublication });
        const changedJobPublication = Object.assign({}, jobPublication, { status: Status.DISMISSED });
        const action = new CancellationSucceededAction(changedJobPublication);

        // WHEN
        const newState: JobPublicationDetailState = jobPublicationDetailReducer(state, action);

        // THEN
        expect(newState.showCancellationSuccess).toBeTruthy();
        expect(newState.showCancellationError).toBeFalsy();
        expect(newState.jobPublication.status).toEqual(Status.DISMISSED);
    });

    it('should update JobPublicationDetailState for HIDE_SUCCESS_MESSAGE action', () => {
        // GIVEN
        const state = Object.assign({}, initialState, { showCancellationSuccess: true });
        const action = new HideSuccessMessageAction();

        // WHEN

        const newState: JobPublicationDetailState = jobPublicationDetailReducer(state, action);

        // THEN
        expect(newState.showCancellationSuccess).toBeFalsy();
    });

    it('should update JobPublicationDetailState for CANCELLATION_FAILED action', () => {
        // GIVEN
        const state = Object.assign({}, initialState, { showCancellationSuccess: true });
        const action = new CancellationFailedAction();

        // WHEN
        const newState: JobPublicationDetailState = jobPublicationDetailReducer(state, action);

        // THEN
        expect(newState.showCancellationError).toBeTruthy();
        expect(newState.showCancellationSuccess).toBeFalsy();
    });

    it('should update JobPublicationDetailState for HIDE_ERROR_MESSAGE action', () => {
        // GIVEN
        const state = Object.assign({}, initialState, { showCancellationError: true });
        const action = new HideErrorMessageAction();

        // WHEN
        const newState: JobPublicationDetailState = jobPublicationDetailReducer(state, action);

        // THEN
        expect(newState.showCancellationError).toBeFalsy();
    });

    it('should update JobPublicationDetailState for LOAD_JOB_PUBLICATION action', () => {
        // GIVEN
        const jobPublication = {
            id: 'id',
            idAvam: 'id-avam',
            accessToken: 'access-token',
            job: null,
            company: null,
            contact: null,
            application: null,
            publication: null,
            creationDate: 'aa',
            locale: Locale.DE,
            status: Status.INITIAL
        };
        const state = Object.assign({}, initialState, { jobPublication });
        const action = new LoadJobPublicationAction({
            id: 'id',
            accessToken: 'access-token'
        });

        // WHEN
        const newState: JobPublicationDetailState = jobPublicationDetailReducer(state, action);

        // THEN
        expect(newState.jobPublication).toBeNull();
        expect(newState.loadingStatus).toEqual(LoadingStatus.INITIAL);
    });

    it('should update JobPublicationDetailState for JOB_PUBLICATION_LOADED action', () => {
        // GIVEN
        const jobPublication = {
            id: 'id',
            idAvam: 'id-avam',
            accessToken: 'access-token',
            job: null,
            company: null,
            contact: null,
            application: null,
            publication: null,
            creationDate: 'aa',
            locale: Locale.DE,
            status: Status.INITIAL
        };
        const state = Object.assign({}, initialState);
        const action = new JobPublicationLoadedAction(jobPublication);

        // WHEN
        const newState: JobPublicationDetailState = jobPublicationDetailReducer(state, action);

        // THEN
        expect(newState.jobPublication).toEqual(jobPublication);
        expect(newState.loadingStatus).toEqual(LoadingStatus.OK);
    });

    it('should update JobPublicationDetailState for LOAD_JOB_PUBLICATION_FAILED action', () => {
        // GIVEN
        const action = new LoadJobPublicationFailedAction();
        const state = Object.assign({}, initialState);

        // WHEN
        const newState: JobPublicationDetailState = jobPublicationDetailReducer(state, action);

        // THEN
        expect(newState.loadingStatus).toEqual(LoadingStatus.FAILED);
    });
});
