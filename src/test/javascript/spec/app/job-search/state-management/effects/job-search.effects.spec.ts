import {
    JobSearchEffects,
    jobSearchReducer,
    JobSearchState,
    NavigationFinishedAction
} from '../../../../../../../main/webapp/app/job-search/state-management';
import { TestBed } from '@angular/core/testing';
import { JobService } from '../../../../../../../main/webapp/app/entities/job/job.service';
import { MockRouter } from '../../../../helpers/mock-route.service';
import { convertToParamMap, Router } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { cold, hot } from 'jasmine-marbles';
import {
    BaseQueryUpdatedAction,
    ExecuteSearchAction,
    JobListLoadedAction,
    LoadJobListAction,
    LoadNextPageAction,
    NextPageLoadedAction,
    ShowJobListErrorAction
} from '../../../../../../../main/webapp/app/job-search/state-management/actions/job-search.actions';
import { TypeaheadMultiselectModel } from '../../../../../../../main/webapp/app/shared/job-search/typeahead-multiselect/typeahead-multiselect-model';
import { Headers } from '@angular/http';
import { ResponseWrapper } from '../../../../../../../main/webapp/app/shared/index';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { provideMockActions } from '@ngrx/effects/testing';

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
            ],
        });

        effects = TestBed.get(JobSearchEffects);
        store = TestBed.get(Store);
    });

    describe('routerNavigation$', () => {
        const action = {
            type: ROUTER_NAVIGATION,
            payload: { routerState: { root: { queryParamMap: convertToParamMap({ query: 'java' }) } } }
        };

        it('should return new NavigationFinishedAction, BaseQueryUpdatedAction and a LoadJobListAction if store is in initial state', () => {
            actions$ = hot('-a', { a: action });

            const baseQueryModel = [new TypeaheadMultiselectModel('free-text', 'java', 'java')];
            const navigationFinishedAction = new NavigationFinishedAction();
            const queryModelUpdatedAction = new BaseQueryUpdatedAction(baseQueryModel);
            const loadJobListAction = new LoadJobListAction(baseQueryModel, []);

            const expected = cold('-(abc)', {
                a: navigationFinishedAction,
                b: queryModelUpdatedAction,
                c: loadJobListAction
            });

            expect(effects.routerNavigation$).toBeObservable(expected);
        });

        it('should return new NavigationFinishedAction if store is not in initial state', () => {
            store.dispatch(new NavigationFinishedAction());

            actions$ = hot('-a', { a: action });

            const navigationFinishedAction = new NavigationFinishedAction();
            const expected = cold('-(a)', {
                a: navigationFinishedAction,
            });

            expect(effects.routerNavigation$).toBeObservable(expected);
        });
    });

    describe('loadJobList$', () => {
        it('should return a new JobListLoadedAction with the loaded jobs on success', () => {
            const baseQueryModel = [new TypeaheadMultiselectModel('free-text', 'java', 'java')];
            const jobList = [
                { id: 0, title: 'title-0' },
                { id: 1, title: 'title-1' },
                { id: 2, title: 'title-2' }
            ];
            const responseWrapper = new ResponseWrapper(new Headers({ 'X-Total-Count': '100' }), jobList, 200);
            const action = new LoadJobListAction(baseQueryModel, []);

            actions$ = hot('-a', { a: action });
            const response = cold('-a|', { a: responseWrapper });
            mockJobService.search.and.returnValue(response);

            const jobListLoadedAction = new JobListLoadedAction(jobList, 100);
            const expected = cold('--b', { b: jobListLoadedAction });

            expect(effects.loadJobList$).toBeObservable(expected);
        });

        it('should return a new ShowJobListErrorAction on error', () => {
            const action = new LoadJobListAction([], []);

            actions$ = hot('-a', { a: action });
            const response = cold('-#', {}, 'error');
            mockJobService.search.and.returnValue(response);

            const showJobListErrorAction = new ShowJobListErrorAction('error');
            const expected = cold('--b', { b: showJobListErrorAction });

            expect(effects.loadJobList$).toBeObservable(expected);
        });
    });

    describe('loadNextPage$', () => {
        it('should return a new NextPageLoadedAction with the loaded jobs on success', () => {
            const jobList = [
                { id: 0, title: 'title-0' },
                { id: 1, title: 'title-1' },
                { id: 2, title: 'title-2' }
            ];
            const responseWrapper = new ResponseWrapper(new Headers({ 'X-Total-Count': '100' }), jobList, 200);
            const action = new LoadNextPageAction();

            actions$ = hot('-a', { a: action });
            const response = cold('-a|', { a: responseWrapper });
            mockJobService.search.and.returnValue(response);

            const nextPageLoadedAction = new NextPageLoadedAction(jobList);
            const expected = cold('--b', { b: nextPageLoadedAction });

            expect(effects.loadNextPage$).toBeObservable(expected);
        });

        it('should return a new ShowJobListErrorAction on error', () => {
            const action = new LoadNextPageAction();

            actions$ = hot('-a', { a: action });
            const response = cold('-#', {}, 'error');
            mockJobService.search.and.returnValue(response);

            const showJobListErrorAction = new ShowJobListErrorAction('error');
            const expected = cold('--b', { b: showJobListErrorAction });

            expect(effects.loadNextPage$).toBeObservable(expected);
        });

    });

    describe('executeSearch$', () => {
        it('should return new LoadJobListAction and BaseQueryUpdatedAction', () => {
            const baseQueryModel = [new TypeaheadMultiselectModel('free-text', 'java', 'java')];
            const action = new ExecuteSearchAction(baseQueryModel, []);

            actions$ = hot('-a', { a: action });

            const queryModelUpdatedAction = new BaseQueryUpdatedAction(baseQueryModel);
            const loadJobListAction = new LoadJobListAction(baseQueryModel, []);

            const expected = cold('-(ab)', {
                a: queryModelUpdatedAction,
                b: loadJobListAction,
            });

            expect(effects.executeSearch$).toBeObservable(expected);
        });

        it('should call router.navigate with query params', () => {
            // GIVEN
            const action = new ExecuteSearchAction([new TypeaheadMultiselectModel('free-text', 'java', 'java')], []);
            actions$ = new ReplaySubject(1);

            // WHEN
            (actions$ as ReplaySubject<any>).next(action);
            effects.executeSearch$.subscribe();

            // THEN
            expect(mockRouter.navigate).toHaveBeenCalledWith(['job-search'], { queryParams: { query: ['java'] } });
        });
    });
});
