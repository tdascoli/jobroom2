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
import { cold, getTestScheduler, hot } from 'jasmine-marbles';
import * as actions from '../../../../../../../main/webapp/app/job-search/state-management/actions/job-search.actions';
import { InitJobSearchAction } from '../../../../../../../main/webapp/app/job-search/state-management/actions/job-search.actions';
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

    describe('initJobSearch', () => {
        const action = new InitJobSearchAction();

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

            expect(effects.initJobSearch$).toBeObservable(expected);
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

            expect(effects.initJobSearch$).toBeObservable(expected);
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

    describe('loadNextJob$', () => {
        const job1 = {
            id: '0',
            externalId: 'extId0',
            title: 'title-0',
            publicationEndDate: new Date()
        };
        const job2 = {
            id: '1',
            externalId: 'extId1',
            title: 'title-1',
            publicationEndDate: new Date()
        };

        it('should return NextJobLoadedAction on success', () => {
            const loadJobListAction = new actions.JobListLoadedAction({
                jobList: [job1, job2],
                totalCount: 100,
                page: 0
            });
            store.dispatch(loadJobListAction);
            store.dispatch(new actions.SelectJobAction({ job: job1, index: 0 }));

            const action = new actions.LoadNextJobAction();
            actions$ = hot('-a', { a: action });

            const nextJobLoadedAction = new actions.NextJobLoadedAction({
                job: job2,
                index: 1
            });
            const expected = cold('-b', { b: nextJobLoadedAction});

            expect(effects.loadNextJob$).toBeObservable(expected);
        });

        it('should return NextJobLoadedAction with previous job on success', () => {
            const loadJobListAction = new actions.JobListLoadedAction({
                jobList: [job1, job2],
                totalCount: 100,
                page: 0
            });
            store.dispatch(loadJobListAction);
            store.dispatch(new actions.SelectJobAction({ job: job2, index: 1 }));

            const action = new actions.LoadPreviousJobAction();
            actions$ = hot('-a', { a: action });

            const nextJobLoadedAction = new actions.NextJobLoadedAction({
                job: job1,
                index: 0
            });
            const expected = cold('-b', { b: nextJobLoadedAction});

            expect(effects.loadNextJob$).toBeObservable(expected);
        });

        it('should return NextJobLoadedAction from the next page on success', () => {
            const loadJobListAction = new actions.JobListLoadedAction({
                jobList: [job1],
                totalCount: 100,
                page: 0
            });
            store.dispatch(loadJobListAction);
            store.dispatch(new actions.SelectJobAction({ job: job1, index: 0 }));

            const nextPage = [job2];
            const loadNextJobAction = new actions.LoadNextJobAction();
            const nextPageLoadedAction = new actions.NextPageLoadedAction(nextPage);
            actions$ = hot('-a-c', { a: loadNextJobAction, c: nextPageLoadedAction });

            const nextJobLoadedAction = new actions.NextJobLoadedAction({
                job: job2,
                index: 1
            });
            const expected = cold('---b', { b: nextJobLoadedAction});

            expect(effects.loadNextJob$).toBeObservable(expected);
        });

        it('should return NextJobErrorAction on error', () => {
            const loadJobListAction = new actions.JobListLoadedAction({
                jobList: [job1],
                totalCount: 100,
                page: 0
            });
            store.dispatch(loadJobListAction);
            store.dispatch(new actions.SelectJobAction({ job: job2, index: 1 }));

            const loadNextJobAction = new actions.LoadNextJobAction();
            const nextPageLoadedAction = new actions.NextPageLoadedAction([]);
            actions$ = hot('-a-c', { a: loadNextJobAction, c: nextPageLoadedAction });

            const error = new actions.NextJobErrorAction();
            const expected = cold('---b', { b: error});

            expect(effects.loadNextJob$).toBeObservable(expected);
        });

        it('should return NextJobErrorAction on search error', () => {
            const loadJobListAction = new actions.JobListLoadedAction({
                jobList: [job1],
                totalCount: 100,
                page: 0
            });
            store.dispatch(loadJobListAction);
            store.dispatch(new actions.SelectJobAction({ job: job2, index: 1 }));

            const loadNextJobAction = new actions.LoadNextJobAction();
            const showJobListErrorAction = new actions.ShowJobListErrorAction({});
            actions$ = hot('-a-c', { a: loadNextJobAction, c: showJobListErrorAction });

            const error = new actions.NextJobErrorAction();
            const expected = cold('---b', { b: error});

            expect(effects.loadNextJob$).toBeObservable(expected);
        });
    });
});
