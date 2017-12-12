import { Observable } from 'rxjs/Observable';
import { Store, StoreModule } from '@ngrx/store';
import { DashboardEffects } from '../../../../../../../main/webapp/app/dashboard/state-management/effects/dashboard.effects';
import { DashboardState } from '../../../../../../../main/webapp/app/dashboard/state-management/state/dashboard.state';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { dashboardReducer } from '../../../../../../../main/webapp/app/dashboard/state-management/reducers/dashboard.reducers';
import { cold, hot } from 'jasmine-marbles';
import { Headers } from '@angular/http';
import { ResponseWrapper } from '../../../../../../../main/webapp/app/shared';
import {
    FilterJobPublicationsDashboardAction,
    JobPublicationsLoadedAction, JobPublicationsLoadErrorAction, LoadNextJobPublicationsDashboardPageAction
} from '../../../../../../../main/webapp/app/dashboard/state-management/actions/dashboard.actions';
import { JobPublicationService } from '../../../../../../../main/webapp/app/shared/job-publication/job-publication.service';
import { Principal } from '../../../../../../../main/webapp/app/shared';
import { createJobPublication } from '../../utils';

describe('DashboardEffects', () => {
    let effects: DashboardEffects;
    let actions$: Observable<any>;
    let store: Store<DashboardState>;

    const mockJobPublicationService = jasmine.createSpyObj('mockJobPublicationService', ['search']);
    const mockPrincipal = jasmine.createSpyObj('mockPrincipal', ['identity']);

    // It's a life hack: we return Observable instead of Promise because of the issue
    // https://github.com/ReactiveX/rxjs/issues/2633
    mockPrincipal.identity.and.returnValue(Observable.of({ email: 'email' }));

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot({ dashboard: dashboardReducer })
            ],
            providers: [
                DashboardEffects,
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
        });

        effects = TestBed.get(DashboardEffects);
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
