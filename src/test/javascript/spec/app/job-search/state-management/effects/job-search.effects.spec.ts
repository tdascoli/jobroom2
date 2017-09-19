import {
    JobSearchEffects,
    jobSearchReducer,
    JobSearchState
} from '../../../../../../../main/webapp/app/job-search/state-management';
import { TestBed } from '@angular/core/testing';
import { MockRouter } from '../../../../helpers/mock-route.service';
import { Router } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { cold, getTestScheduler, hot } from 'jasmine-marbles';
import * as actions from '../../../../../../../main/webapp/app/job-search/state-management/actions/job-search.actions';
import { provideMockActions } from '@ngrx/effects/testing';
import { ResponseWrapper } from '../../../../../../../main/webapp/app/shared/model/response-wrapper.model';
import { Headers } from '@angular/http';
import {
    JOB_SEARCH_DEBOUNCE,
    JOB_SEARCH_SCHEDULER
} from '../../../../../../../main/webapp/app/job-search/state-management/effects/job-search.effects';
import { JobService } from '../../../../../../../main/webapp/app/job-search/services';

describe('JobSearchEffects', () => {
    let effects: JobSearchEffects;
    let actions$: Observable<any>;
    let store: Store<JobSearchState>;

    const mockJobService = jasmine.createSpyObj('mockJobService', ['search']);
    const mockRouter = new MockRouter();

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot({ jobSearch: jobSearchReducer })
            ],
            providers: [
                JobSearchEffects,
                provideMockActions(() => actions$),
                { provide: JobService, useValue: mockJobService },
                { provide: Router, useValue: mockRouter },
                { provide: JOB_SEARCH_SCHEDULER, useFactory: getTestScheduler },
                { provide: JOB_SEARCH_DEBOUNCE, useValue: 30 }
            ],
        });

        effects = TestBed.get(JobSearchEffects);
        store = TestBed.get(Store);
    });

    describe('routerNavigation$', () => {
        const action = {
            type: ROUTER_NAVIGATION,
            payload: {
                event: {
                    url: '/job-search'
                }
            }
        };

        it('should return new JobListLoadedAction if store is in initial state', () => {
            const jobList = [
                {
                    id: '0',
                    externalId: 'extId0',
                    title: 'title-0',
                    publicationEndDate: new Date()
                }
            ];
            const responseWrapper = new ResponseWrapper(new Headers({ 'X-Total-Count': '100' }), jobList, 200);

            actions$ = hot('-a', { a: action });
            const response = cold('-a|', { a: responseWrapper });
            mockJobService.search.and.returnValue(response);

            const jobListLoadedAction = new actions.JobListLoadedAction({
                jobList,
                totalCount: 100,
                page: 0
            });
            const expected = cold('--b', { b: jobListLoadedAction });

            expect(effects.routerNavigation$).toBeObservable(expected);
        });

        it('should not return anything if store is not in initial state', () => {
            const loadJobListAction = new actions.JobListLoadedAction({
                jobList: [
                    {
                        id: '0',
                        externalId: 'extId0',
                        title: 'title-0',
                        publicationEndDate: new Date()
                    }
                ],
                totalCount: 100,
                page: 1
            });
            store.dispatch(loadJobListAction);

            actions$ = hot('-a', { a: action });

            const expected = cold('-');

            expect(effects.routerNavigation$).toBeObservable(expected);
        });

        it('should not do anything on a not job-search page', () => {
            const navigationAction = Object.assign(action, {
                payload: {
                    event: {
                        url: '/not-job-search'
                    }
                }
            });

            actions$ = hot('-a', { a: navigationAction });
            const expected = cold('------');
            expect(effects.routerNavigation$).toBeObservable(expected);
        });
    });

    describe('loadJobList$', () => {
        it('should return a new JobListLoadedAction with the loaded jobs on success', () => {
            const action = new actions.ToolbarChangedAction({
                baseQuery: [],
                localityQuery: []
            });
            const jobList = [
                {
                    id: '0',
                    externalId: 'extId0',
                    title: 'title-0',
                    publicationEndDate: new Date()
                },
                {
                    id: '1',
                    externalId: 'extId1',
                    title: 'title-1',
                    publicationEndDate: new Date()
                },
                {
                    id: '2',
                    externalId: 'extId2',
                    title: 'title-2',
                    publicationEndDate: new Date()
                }
            ];
            const responseWrapper = new ResponseWrapper(new Headers({ 'X-Total-Count': '100' }), jobList, 200);

            actions$ = hot('-a---', { a: action });
            const response = cold('-a|', { a: responseWrapper });
            mockJobService.search.and.returnValue(response);

            const jobListLoadedAction = new actions.JobListLoadedAction({
                jobList,
                totalCount: 100,
                page: 0
            });
            const expected = cold('-----b', { b: jobListLoadedAction });

            expect(effects.loadJobList$).toBeObservable(expected);
        });

        it('should return a new ShowJobListErrorAction on error', () => {
            const action = new actions.ToolbarChangedAction({
                baseQuery: [],
                localityQuery: []
            });

            actions$ = hot('-a---', { a: action });
            const response = cold('-#|', {}, 'error');
            mockJobService.search.and.returnValue(response);

            const showJobListErrorAction = new actions.ShowJobListErrorAction('error');
            const expected = cold('-----b', { b: showJobListErrorAction });

            expect(effects.loadJobList$).toBeObservable(expected);
        });
    });

    describe('loadNextPage$', () => {
        it('should return a new NextPageLoadedAction with the loaded jobs on success', () => {
            const jobList = [
                {
                    id: '0',
                    externalId: 'extId0',
                    title: 'title-0',
                    publicationEndDate: new Date()
                },
                {
                    id: '1',
                    externalId: 'extId1',
                    title: 'title-1',
                    publicationEndDate: new Date()
                },
                {
                    id: '2',
                    externalId: 'extId2',
                    title: 'title-2',
                    publicationEndDate: new Date()
                }
            ];
            const responseWrapper = new ResponseWrapper(new Headers({ 'X-Total-Count': '100' }), jobList, 200);
            const action = new actions.LoadNextPageAction();

            actions$ = hot('-a', { a: action });
            const response = cold('-a|', { a: responseWrapper });
            mockJobService.search.and.returnValue(response);

            const nextPageLoadedAction = new actions.NextPageLoadedAction(jobList);
            const expected = cold('--b', { b: nextPageLoadedAction });

            expect(effects.loadNextPage$).toBeObservable(expected);
        });

        it('should return a new ShowJobListErrorAction on error', () => {
            const action = new actions.LoadNextPageAction();

            actions$ = hot('-a', { a: action });
            const response = cold('-#', {}, 'error');
            mockJobService.search.and.returnValue(response);

            const showJobListErrorAction = new actions.ShowJobListErrorAction('error');
            const expected = cold('--b', { b: showJobListErrorAction });

            expect(effects.loadNextPage$).toBeObservable(expected);
        });
    });
});
