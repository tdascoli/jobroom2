import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { JobService } from '../../../entities/job/job.service';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import { ResponseWrapper } from '../../../shared/model/response-wrapper.model';
import { JobSearchRequest } from '../../../entities/job/job-search-request';
import { getJobSearchState, JobSearchState, LOAD_NEXT_PAGE } from '../index';
import {
    FILTER_CHANGED,
    FilterChangedAction,
    JobListLoadedAction,
    NextPageLoadedAction,
    ShowJobListErrorAction,
    TOOLBAR_CHANGED,
    ToolbarChangedAction
} from '../actions/job-search.actions';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { Scheduler } from 'rxjs/Scheduler';
import { async } from 'rxjs/scheduler/async';

export const JOB_SEARCH_DEBOUNCE = new InjectionToken<number>('JOB_SEARCH_DEBOUNCE');
export const JOB_SEARCH_SCHEDULER = new InjectionToken<Scheduler>('JOB_SEARCH_SCHEDULER');

type LoadJobTriggerAction = ToolbarChangedAction | FilterChangedAction;

@Injectable()
export class JobSearchEffects {

    @Effect()
    routerNavigation$: Observable<Action> = this.actions
        .ofType(ROUTER_NAVIGATION)
        .withLatestFrom(this.store.select(getJobSearchState))
        .switchMap(([action, state]) => {
            if (state.initialState) {
                return this.jobSearchService.search(toInitialSearchRequest(state))
                    .map(toJobListLoadedAction)
                    .catch((err: any) => Observable.of(new ShowJobListErrorAction(err)));
            } else {
                // Page is already loaded. Do not change the application state.
                return [];
            }
        });

    @Effect()
    loadJobList$: Observable<Action> = this.actions
        .ofType(TOOLBAR_CHANGED, FILTER_CHANGED)
        .debounceTime(this.debounce || 300, this.scheduler || async)
        .withLatestFrom(this.store.select(getJobSearchState))
        .switchMap(([action, state]) =>
            this.jobSearchService.search(toJobSearchRequest(action as LoadJobTriggerAction, state))
                .map(toJobListLoadedAction)
                .catch((err: any) => Observable.of(new ShowJobListErrorAction(err)))
        );

    @Effect()
    loadNextPage$: Observable<Action> = this.actions
        .ofType(LOAD_NEXT_PAGE)
        .withLatestFrom(this.store.select(getJobSearchState))
        .switchMap(([action, state]) =>
            this.jobSearchService.search(toNextPageRequest(state))
                .map((response: ResponseWrapper) => new NextPageLoadedAction(response.json))
                .catch((err: any) => Observable.of(new ShowJobListErrorAction(err)))
        );

    constructor(private actions: Actions,
                private jobSearchService: JobService,
                private store: Store<JobSearchState>,
                @Optional()
                @Inject(JOB_SEARCH_DEBOUNCE)
                private debounce,
                @Optional()
                @Inject(JOB_SEARCH_SCHEDULER)
                private scheduler: Scheduler) {
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
    return new JobSearchRequest(state.searchQuery, state.searchFilter, state.page);
}

function toNextPageRequest(state: JobSearchState): JobSearchRequest {
    return new JobSearchRequest(state.searchQuery, state.searchFilter, state.page);
}

function toJobSearchRequest(action: LoadJobTriggerAction, state: JobSearchState): JobSearchRequest {
    if (action.type === TOOLBAR_CHANGED) {
        return new JobSearchRequest(action.payload, state.searchFilter);
    } else {
        return new JobSearchRequest(state.searchQuery, action.payload);
    }
}
