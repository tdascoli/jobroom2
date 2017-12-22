import { Observable } from 'rxjs/Observable';
import { Store, StoreModule } from '@ngrx/store';
import { PEADashboardEffects } from '../../../../../../../main/webapp/app/dashboard/state-management/effects/pea-dashboard.effects';
import { DashboardState } from '../../../../../../../main/webapp/app/dashboard/state-management/state/dashboard.state';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { Headers } from '@angular/http';
import { Principal, ResponseWrapper } from '../../../../../../../main/webapp/app/shared';
import {
    FilterJobPublicationsDashboardAction,
    JobPublicationsLoadedAction,
    JobPublicationsLoadErrorAction,
    LoadNextJobPublicationsDashboardPageAction
} from '../../../../../../../main/webapp/app/dashboard/state-management/actions/pea-dashboard.actions';
import { JobPublicationService } from '../../../../../../../main/webapp/app/shared/job-publication/job-publication.service';
import { createJobPublication } from '../../../shared/job-publication/utils';
import { dashboardReducer } from '../../../../../../../main/webapp/app/dashboard/state-management/reducers/dahboard.reducers';

describe('PEADashboardEffects', () => {
    let effects: PEADashboardEffects;
    let actions$: Observable<any>;
    let store: Store<DashboardState>;

    const mockJobPublicationService = jasmine.createSpyObj('mockJobPublicationService', ['search']);
    const mockPrincipal = jasmine.createSpyObj('mockPrincipal', ['getAuthenticationState']);

    mockPrincipal.getAuthenticationState.and.returnValue(Observable.of({ email: 'email' }));

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot(dashboardReducer)
            ],
            providers: [
                PEADashboardEffects,
                provideMockActions(() => actions$),
                {
                    provide: JobPublicationService,
                    useValue: mockJobPublicationService
                },
                {
                    provide: Principal,
                    useValue: mockPrincipal
                }
            ],
        })
        ;

        effects = TestBed.get(PEADashboardEffects);
        store = TestBed.get(Store);
    });

    describe('loadNextJobPublicationsPage$', () => {
        const action = new LoadNextJobPublicationsDashboardPageAction({ page: 0 });

        it('should return JobPublicationsLoadedAction when load next page', () => {
            const jobPublications = [
                createJobPublication()
            ];
            const responseWrapper = new ResponseWrapper(new Headers({ 'X-Total-Count': '100' }), jobPublications, 200);

            actions$ = hot('-a', { a: action });
            const response = cold('-a|', { a: responseWrapper });
            mockJobPublicationService.search.and.returnValue(response);

            const jobPublicationsLoadedAction = new JobPublicationsLoadedAction({
                jobPublications,
                totalCount: 100,
                page: 0
            });
            const expected = cold('--b', { b: jobPublicationsLoadedAction });

            expect(effects.loadNextJobPublicationsPage$).toBeObservable(expected);
        });

        it('should return JobPublicationsLoadErrorAction on error', () => {
            actions$ = hot('-a', { a: action });
            const response = cold('-#');
            mockJobPublicationService.search.and.returnValue(response);

            const errorAction = new JobPublicationsLoadErrorAction();
            const expected = cold('--b', { b: errorAction });

            expect(effects.loadNextJobPublicationsPage$).toBeObservable(expected);
        });
    });

    describe('filterJobPublications$', () => {
        const action = new FilterJobPublicationsDashboardAction({
            jobTitle: 'name',
            onlineSinceDays: 3
        });

        it('should return JobPublicationsLoadedAction when filter', () => {
            const jobPublications = [
                createJobPublication()
            ];
            const responseWrapper = new ResponseWrapper(new Headers({ 'X-Total-Count': '100' }), jobPublications, 200);

            actions$ = hot('-a', { a: action });
            const response = cold('-a|', { a: responseWrapper });
            mockJobPublicationService.search.and.returnValue(response);

            const jobPublicationsLoadedAction = new JobPublicationsLoadedAction({
                jobPublications,
                totalCount: 100,
                page: 0
            });
            const expected = cold('--b', { b: jobPublicationsLoadedAction });

            expect(effects.filterJobPublications$).toBeObservable(expected);
        });

        it('should return JobPublicationsLoadErrorAction on error', () => {
            actions$ = hot('-a', { a: action });
            const response = cold('-#');
            mockJobPublicationService.search.and.returnValue(response);

            const errorAction = new JobPublicationsLoadErrorAction();
            const expected = cold('--b', { b: errorAction });

            expect(effects.filterJobPublications$).toBeObservable(expected);
        });
    });

});
