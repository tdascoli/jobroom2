import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import {
    CancellationSucceededAction,
    FILTER_JOB_PUBLICATIONS_DASHBOARD,
    FilterJobPublicationsDashboardAction,
    JobPublicationsLoadedAction,
    JobPublicationsLoadErrorAction,
    LOAD_NEXT_JOB_PUBLICATIONS_DASHBOARD_PAGE,
    LoadNextJobPublicationsDashboardPageAction,
    SUBMIT_CANCELLATION,
    SubmitCancellationAction
} from '../actions/pea-dashboard.actions';
import { ITEMS_PER_PAGE, Principal } from '../../../shared';
import { JobPublicationService } from '../../../shared/job-publication/job-publication.service';
import {
    getJobPublicationDashboardState, JobPublicationFilter,
    PEADashboardState
} from '../state/pea-dashboard.state';
import { JobPublicationSearchRequest } from '../../../shared/job-publication/job-publication-search-request';
import { createJobPublicationCancellationRequest } from '../util/cancellation-request.mapper';
import { JobCancelRequest } from '../../../shared/job-publication/job-publication-cancel-request';
import { JobPublication } from '../../../shared/job-publication/job-publication.model';

@Injectable()
export class PEADashboardEffects {
    @Effect()
    cancelJobPublication$: Observable<Action> = this.actions$
        .ofType(SUBMIT_CANCELLATION)
        .map((action: SubmitCancellationAction) => createJobPublicationCancellationRequest(action.payload))
        .switchMap((jobCancelRequest: JobCancelRequest) =>
            this.jobPublicationService.cancelJobPublication(jobCancelRequest)
                .flatMap((code) => this.jobPublicationService.findByIdAndAccessToken(jobCancelRequest.id, jobCancelRequest.accessToken))
                .map((jobPublication: JobPublication) => new CancellationSucceededAction(jobPublication))
                .catch(() => Observable.of(new JobPublicationsLoadErrorAction()))
        );

    @Effect()
    loadNextJobPublicationsPage$: Observable<Action> = this.actions$
        .ofType(LOAD_NEXT_JOB_PUBLICATIONS_DASHBOARD_PAGE)
        .withLatestFrom(
            this.store.select(getJobPublicationDashboardState),
            this.principal.getAuthenticationState())
        .switchMap(([action, state, identity]: [LoadNextJobPublicationsDashboardPageAction, PEADashboardState, any]) =>
            this.jobPublicationService.search(
                this.createSearchRequest(state.jobPublicationFilter, action.payload.page, identity))
                .map((resp) => this.toJobPublicationsLoadedActionAction(resp, action.payload.page))
                .catch(() => Observable.of(new JobPublicationsLoadErrorAction()))
        );

    @Effect()
    filterJobPublications$: Observable<Action> = this.actions$
        .ofType(FILTER_JOB_PUBLICATIONS_DASHBOARD)
        .withLatestFrom(
            this.store.select(getJobPublicationDashboardState),
            this.principal.getAuthenticationState())
        .switchMap(([action, state, identity]: [FilterJobPublicationsDashboardAction, PEADashboardState, any]) =>
            this.jobPublicationService.search(
                this.createSearchRequest(action.payload, state.page, identity))
                .map(this.toJobPublicationsLoadedActionAction)
                .catch(() => Observable.of(new JobPublicationsLoadErrorAction()))
        );

    constructor(private actions$: Actions,
                private store: Store<PEADashboardState>,
                private principal: Principal,
                private jobPublicationService: JobPublicationService) {
    }

    private createSearchRequest(filter: JobPublicationFilter, page: number, identity): JobPublicationSearchRequest {
        const { jobTitle, onlineSinceDays } = filter;
        return {
            email: identity.email,
            page,
            size: ITEMS_PER_PAGE,
            jobTitle,
            onlineSinceDays
        };
    }

    private toJobPublicationsLoadedActionAction(response, page = 0): JobPublicationsLoadedAction {
        return new JobPublicationsLoadedAction({
            jobPublications: response.json,
            totalCount: +response.headers.get('X-Total-Count'),
            page
        });
    }
}
