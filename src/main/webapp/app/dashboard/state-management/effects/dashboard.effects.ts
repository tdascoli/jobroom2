import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import {
    FILTER_JOB_PUBLICATIONS_DASHBOARD, FilterJobPublicationsDashboardAction,
    JobPublicationsLoadedAction,
    JobPublicationsLoadErrorAction, LOAD_NEXT_JOB_PUBLICATIONS_DASHBOARD_PAGE,
    LoadNextJobPublicationsDashboardPageAction
} from '../actions/dashboard.actions';
import { ITEMS_PER_PAGE, Principal } from '../../../shared';
import { JobPublicationService } from '../../../shared/job-publication/job-publication.service';
import {
    DashboardState, getJobPublicationDashboardState, JobPublicationFilter,
    JobPublicationsDashboardState
} from '../state/dashboard.state';
import { JobPublicationSearchRequest } from '../../../shared/job-publication/job-publication-search-request';

@Injectable()
export class DashboardEffects {
    @Effect()
    loadNextJobPublicationsPage$: Observable<Action> = this.actions$
        .ofType(LOAD_NEXT_JOB_PUBLICATIONS_DASHBOARD_PAGE)
        .withLatestFrom(
            this.store.select(getJobPublicationDashboardState),
            this.principal.getAuthenticationState())
        .switchMap(([action, state, identity]: [LoadNextJobPublicationsDashboardPageAction, JobPublicationsDashboardState, any]) =>
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
        .switchMap(([action, state, identity]: [FilterJobPublicationsDashboardAction, JobPublicationsDashboardState, any]) =>
            this.jobPublicationService.search(
                    this.createSearchRequest(action.payload, state.page, identity))
                .map(this.toJobPublicationsLoadedActionAction)
                .catch(() => Observable.of(new JobPublicationsLoadErrorAction()))
        );

    constructor(private actions$: Actions,
                private store: Store<DashboardState>,
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
