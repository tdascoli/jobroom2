import { Observable } from 'rxjs/Observable';
import { Store, StoreModule } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpModule } from '@angular/http';
import { JobPublicationDetailEffects } from '../../../../../../../main/webapp/app/dashboard/state-management/effects/job-publication-detail.effects';
import { JobPublicationDetailState } from '../../../../../../../main/webapp/app/dashboard/state-management/state/job-publication-detail.state';
import {
    CancellationFailedAction,
    CancellationSucceededAction,
    JobPublicationLoadedAction,
    LoadJobPublicationAction,
    LoadJobPublicationFailedAction,
    SubmitCancellationAction
} from '../../../../../../../main/webapp/app/dashboard/state-management/actions/job-publication-detail.actions';
import { cold, hot } from 'jasmine-marbles';
import {
    Locale,
    Status
} from '../../../../../../../main/webapp/app/shared/job-publication/job-publication.model';
import { JobPublicationService } from '../../../../../../../main/webapp/app/shared/job-publication/job-publication.service';
import { jobSearchReducer } from '../../../../../../../main/webapp/app/job-search/state-management/reducers/job-search.reducers';
import { CancellationData } from '../../../../../../../main/webapp/app/dashboard/dialogs/cancellation-data';

describe('JobPublicationCancelEffects', () => {
    let effects: JobPublicationDetailEffects;
    let actions$: Observable<any>;
    let store: Store<JobPublicationDetailState>;

    const mockJobPublicationService = jasmine.createSpyObj('mockJobPublicationService', ['findByIdAndAccessToken', 'cancelJobPublication']);

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpModule,
                StoreModule.forRoot({ jobSearch: jobSearchReducer })
            ],
            providers: [
                JobPublicationDetailEffects,
                provideMockActions(() => actions$),
                {
                    provide: JobPublicationService,
                    useValue: mockJobPublicationService
                }
            ]
        });

        effects = TestBed.get(JobPublicationDetailEffects);
        store = TestBed.get(Store);
    });

    describe('loadJobPublication$', () => {
        it('should return a new JobPublicationLoadedAction with the loaded job publication on success', () => {
            const id = 'id';
            const accessToken = 'access-token';
            const action = new LoadJobPublicationAction({ id, accessToken });

            actions$ = hot('-a', { a: action });

            const jobPublication = {
                id,
                idAvam: 'id-avam',
                accessToken,
                job: null,
                company: null,
                contact: null,
                application: null,
                publication: null,
                creationDate: 'aa',
                locale: Locale.DE,
                status: Status.INITIAL
            };
            const response = cold('-a|', { a: jobPublication });
            mockJobPublicationService.findByIdAndAccessToken.and.returnValue(response);

            const jobPublicationLoadedAction = new JobPublicationLoadedAction(jobPublication);
            const expected = cold('--b', { b: jobPublicationLoadedAction });

            expect(effects.loadJobPublication$).toBeObservable(expected);
        });

        it('should return a new LoadJobPublicationFailedAction on error', () => {
            const id = 'id';
            const accessToken = 'access-token';
            const action = new LoadJobPublicationAction({ id, accessToken });

            actions$ = hot('-a', { a: action });

            const response = cold('-#|', {}, 'error');
            mockJobPublicationService.findByIdAndAccessToken.and.returnValue(response);

            const loadJobPublicationFailedAction = new LoadJobPublicationFailedAction('error');
            const expected = cold('--b', { b: loadJobPublicationFailedAction });

            expect(effects.loadJobPublication$).toBeObservable(expected);
        });
    });

    describe('cancelJobPublication$', () => {
        it('should return a new CancellationSucceededAction with the updated job publication on success', () => {
            const cancellationData: CancellationData = {
                id: 'id',
                accessToken: 'token',
                cancellationReason: {
                    positionOccupied: true,
                    occupiedWith: {
                        jobCenter: true,
                        privateAgency: false,
                        self: false
                    }
                }
            };
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

            const action = new SubmitCancellationAction(cancellationData);
            actions$ = hot('-a', { a: action });

            const cancellationResponse = cold('-a|', { a: 200 });
            mockJobPublicationService.cancelJobPublication.and.returnValue(cancellationResponse);

            const findByIdAndTokenResponse = cold('-a|', { a: jobPublication });
            mockJobPublicationService.findByIdAndAccessToken.and.returnValue(findByIdAndTokenResponse);

            const cancellationSucceededAction = new CancellationSucceededAction(jobPublication);
            const expected = cold('---b', { b: cancellationSucceededAction });

            expect(effects.cancelJobPublication$).toBeObservable(expected);
        });

        it('should return a new CancellationFailedAction on error', () => {
            const cancellationData: CancellationData = {
                id: 'id',
                accessToken: 'token',
                cancellationReason: {
                    positionOccupied: true,
                    occupiedWith: {
                        jobCenter: true,
                        privateAgency: false,
                        self: false
                    }
                }
            };

            const action = new SubmitCancellationAction(cancellationData);
            actions$ = hot('-a', { a: action });

            const response = cold('-#|', {}, 'error');
            mockJobPublicationService.cancelJobPublication.and.returnValue(response);

            const cancellationFailedAction = new CancellationFailedAction('error');
            const expected = cold('--b', { b: cancellationFailedAction });

            expect(effects.cancelJobPublication$).toBeObservable(expected);
        });
    });
});
