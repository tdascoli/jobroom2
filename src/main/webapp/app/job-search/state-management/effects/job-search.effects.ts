import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Job, JobSearchRequest, JobService } from '../../services';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import { ResponseWrapper } from '../../../shared/model/response-wrapper.model';
import {
    getJobSearchState,
    JobSearchState,
    LOAD_NEXT_PAGE,
    SHOW_JOB_LIST_ERROR
} from '../index';
import {
    FILTER_CHANGED,
    FilterChangedAction,
    INIT_JOB_SEARCH,
    JOB_SEARCH_TOOL_CHANGED,
    JobListLoadedAction,
    JobSearchToolChangedAction,
    LoadNextPageAction,
    NEXT_PAGE_LOADED,
    NextPageLoadedAction,
    ShowJobListErrorAction,
    TOOLBAR_CHANGED,
    ToolbarChangedAction
} from '../actions/job-search.actions';
import { Scheduler } from 'rxjs/Scheduler';
import { async } from 'rxjs/scheduler/async';
import { createJobSearchRequest } from '../util/search-request-mapper';
import { Router } from '@angular/router';
import {
    LOAD_NEXT_ITEMS_PAGE,
    LoadNextItemsPageAction,
    LoadNextItemsPageErrorAction,
    NEXT_ITEM_LOADED,
    NextItemLoadedAction,
    NextItemsPageLoadedAction,
} from '../../../shared/components/details-page-pagination/state-management/actions/details-page-pagination.actions';

export const JOB_SEARCH_DEBOUNCE = new InjectionToken<number>('JOB_SEARCH_DEBOUNCE');
export const JOB_SEARCH_SCHEDULER = new InjectionToken<Scheduler>('JOB_SEARCH_SCHEDULER');

type LoadJobTriggerAction =
    ToolbarChangedAction
    | FilterChangedAction
    | JobSearchToolChangedAction;

const JOB_DETAIL_FEATURE = 'job-detail';

@Injectable()
export class JobSearchEffects {

    @Effect()
    initJobSearch$: Observable<Action> = this.actions$
        .ofType(INIT_JOB_SEARCH)
        .take(1)
        .withLatestFrom(this.hasPreviousSearchTrigger(), this.store.select(getJobSearchState))
        .filter(([action, hasPrevTrigger, state]) => !hasPrevTrigger)
        .switchMap(([action, hasPrevTrigger, state]) =>
            this.jobSearchService.search(toInitialSearchRequest(state))
                .map(toJobListLoadedAction)
                .catch((err: any) => Observable.of(new ShowJobListErrorAction(err)))
        );

    @Effect()
    loadJobList$: Observable<Action> = this.actions$
        .ofType(TOOLBAR_CHANGED, FILTER_CHANGED, JOB_SEARCH_TOOL_CHANGED)
        .debounceTime(this.debounce || 300, this.scheduler || async)
        .withLatestFrom(this.store.select(getJobSearchState))
        .switchMap(([action, state]) =>
            this.jobSearchService.search(toJobSearchRequest(action as LoadJobTriggerAction, state))
                .map(toJobListLoadedAction)
                .catch((err: any) => Observable.of(new ShowJobListErrorAction(err)))
        );

    @Effect()
    loadNextPage$: Observable<Action> = this.actions$
        .ofType(LOAD_NEXT_PAGE)
        .withLatestFrom(this.store.select(getJobSearchState))
        .switchMap(([action, state]) =>
            this.jobSearchService.search(toNextPageRequest(state))
                .map((response: ResponseWrapper) => new NextPageLoadedAction(response.json))
                .catch((err: any) => Observable.of(new ShowJobListErrorAction(err)))
        );

    @Effect()
    nextItemsPageLoaded$: Observable<Action> = this.actions$
        .ofType(LOAD_NEXT_ITEMS_PAGE)
        .filter((action: NextItemLoadedAction) => action.payload.feature === JOB_DETAIL_FEATURE)
        .switchMap((loadNextItemsAction: LoadNextItemsPageAction) => {
            this.store.dispatch(new LoadNextPageAction());

            return Observable.merge(
                this.actions$
                    .ofType(NEXT_PAGE_LOADED)
                    .map((action: NextPageLoadedAction) => action.payload[0]),
                this.actions$
                    .ofType(SHOW_JOB_LIST_ERROR)
                    .map((action: ShowJobListErrorAction) => null))
                .take(1);
        })
        .map((selectedJob: Job) => selectedJob
            ? new NextItemsPageLoadedAction({
                item: selectedJob,
                feature: JOB_DETAIL_FEATURE
            })
            : new LoadNextItemsPageErrorAction({ feature: JOB_DETAIL_FEATURE }));

    @Effect({ dispatch: false })
    nextJobLoaded$: Observable<Action> = this.actions$
        .ofType(NEXT_ITEM_LOADED)
        .filter((action: NextItemLoadedAction) => action.payload.feature === JOB_DETAIL_FEATURE)
        .do((action: NextItemLoadedAction) => {
            this.router.navigate(['/job-detail', action.payload.item.id])
        });

    constructor(private actions$: Actions,
                private jobSearchService: JobService,
                private store: Store<JobSearchState>,
                @Optional()
                @Inject(JOB_SEARCH_DEBOUNCE)
                private debounce,
                @Optional()
                @Inject(JOB_SEARCH_SCHEDULER)
                private scheduler: Scheduler,
                private router: Router) {
    }

    private hasPreviousSearchTrigger(): Observable<boolean> {
        return this.actions$
            .ofType(FILTER_CHANGED, JOB_SEARCH_TOOL_CHANGED)
            .take(1)
            .map((action) => true)
            .startWith(false);
    }
}

function toJobListLoadedAction(response: ResponseWrapper): JobListLoadedAction {
    return new JobListLoadedAction({
        jobList: response.json,
        totalCount: +response.headers.get('X-Total-Count'),
        page: 0
    });
}

function toInitialSearchRequest(state: JobSearchState): JobSearchRequest {
    return createJobSearchRequest(state.searchQuery, state.searchFilter, state.page);
}

function toNextPageRequest(state: JobSearchState): JobSearchRequest {
    return createJobSearchRequest(state.searchQuery, state.searchFilter, state.page);
}

function toJobSearchRequest(action: LoadJobTriggerAction, state: JobSearchState): JobSearchRequest {
    if (action.type === TOOLBAR_CHANGED || action.type === JOB_SEARCH_TOOL_CHANGED) {
        return createJobSearchRequest(action.payload, state.searchFilter);
    } else {
        return createJobSearchRequest(state.searchQuery, action.payload);
    }
}
