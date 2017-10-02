import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { JobSearchRequest, JobService } from '../../services';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import { ResponseWrapper } from '../../../shared/model/response-wrapper.model';
import { getJobSearchState, JobSearchState, LOAD_NEXT_PAGE } from '../index';
import {
    FILTER_CHANGED,
    FilterChangedAction,
    INIT_JOB_SEARCH,
    JobListLoadedAction, LOAD_NEXT_JOB, LOAD_PREVIOUS_JOB, LoadNextJobAction,
    LoadNextPageAction, LoadPreviousJobAction, NEXT_JOB_LOADED,
    NEXT_PAGE_LOADED, NextJobErrorAction,
    NextJobLoadedAction,
    NextPageLoadedAction, SelectedJob,
    ShowJobListErrorAction,
    TOOLBAR_CHANGED,
    ToolbarChangedAction
} from '../actions/job-search.actions';
import { Scheduler } from 'rxjs/Scheduler';
import { async } from 'rxjs/scheduler/async';
import { createJobSearchRequest } from '../util/search-request-mapper';
import { Router } from '@angular/router';
import { Job } from '../../services/job';

export const JOB_SEARCH_DEBOUNCE = new InjectionToken<number>('JOB_SEARCH_DEBOUNCE');
export const JOB_SEARCH_SCHEDULER = new InjectionToken<Scheduler>('JOB_SEARCH_SCHEDULER');

type LoadJobTriggerAction = ToolbarChangedAction | FilterChangedAction;

@Injectable()
export class JobSearchEffects {

    @Effect()
    initJobSearch$: Observable<Action> = this.actions$
        .ofType(INIT_JOB_SEARCH)
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
    loadJobList$: Observable<Action> = this.actions$
        .ofType(TOOLBAR_CHANGED, FILTER_CHANGED)
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
    loadNextJob$: Observable<Action> = this.actions$
        .ofType(LOAD_NEXT_JOB, LOAD_PREVIOUS_JOB)
        .distinctUntilChanged()
        .withLatestFrom(this.store.select(getJobSearchState))
        .switchMap(([action, state]) =>
            this.getNextJob(state, action as LoadNextJobAction | LoadPreviousJobAction))
        .map((selectedJob: SelectedJob) => selectedJob
            ? new NextJobLoadedAction(selectedJob)
            : new NextJobErrorAction());

    @Effect({ dispatch: false })
    nextJobLoaded$: Observable<Action> = this.actions$
        .ofType(NEXT_JOB_LOADED)
        .do((action: NextJobLoadedAction) => {
            const job = action.payload.job;
            this.router.navigate(['/job-detail', job.id])
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

    private getNextJob(state: JobSearchState,
                       loadJobAction: LoadNextJobAction | LoadPreviousJobAction): Observable<SelectedJob> {
        const nextJobIndex = state.selectedJobIndex
            + (loadJobAction instanceof LoadPreviousJobAction ? -1 : 1);
        const nextJob = state.jobList[nextJobIndex];

        if (nextJob) {
            return Observable.of({ job: nextJob, index: nextJobIndex });
        } else {
            this.store.dispatch(new LoadNextPageAction());

            return this.actions$
                .ofType(NEXT_PAGE_LOADED)
                .take(1)
                .map((action: NextPageLoadedAction) =>
                    ({ job: action.payload[0], index: nextJobIndex }));
        }
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
    if (action.type === TOOLBAR_CHANGED) {
        return createJobSearchRequest(action.payload, state.searchFilter);
    } else {
        return createJobSearchRequest(state.searchQuery, action.payload);
    }
}
