import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import {
    CandidateSearchState,
    getCandidateSearchState
} from '../state/candidate-search.state';
import { Scheduler } from 'rxjs/Scheduler';
import { Observable } from 'rxjs/Observable';
import {
    CandidateProfileListLoadedAction,
    INIT_CANDIDATE_SEARCH,
    LOAD_NEXT_PAGE,
    NextPageLoadedAction,
    SEARCH_CANDIDATES,
    SearchCandidatesAction,
    ShowCandidateListErrorAction,
} from '../actions/candidate-search.actions';
import { CandidateService } from '../../services/candidate.service';
import { CandidateSearchRequest } from '../../services/candidate-search-request';
import { ResponseWrapper } from '../../../shared/index';
import { createCandidateSearchRequest } from '../util/search-request-mapper';
import { async } from 'rxjs/scheduler/async';

export const CANDIDATE_SEARCH_DEBOUNCE = new InjectionToken<number>('CANDIDATE_SEARCH_DEBOUNCE');
export const CANDIDATE_SEARCH_SCHEDULER = new InjectionToken<Scheduler>('CANDIDATE_SEARCH_SCHEDULER');

@Injectable()
export class CandidateSearchEffects {
    @Effect()
    initCandidateSearch$: Observable<Action> = this.actions$
        .ofType(INIT_CANDIDATE_SEARCH)
        .withLatestFrom(this.store.select(getCandidateSearchState))
        .switchMap(([action, state]) => {
            if (state.initialState) {
                return this.candidateService.search(toInitialSearchRequest(state))
                    .map(toCandidateProfileListLoadedAction)
                    .catch((err: any) => Observable.of(new ShowCandidateListErrorAction(err)));
            } else {
                // Page is already loaded. Do not change the application state.
                return [];
            }
        });

    @Effect()
    loadCandidateList$: Observable<Action> = this.actions$
        .ofType(SEARCH_CANDIDATES)
        .debounceTime(this.debounce || 300, this.scheduler || async)
        .withLatestFrom(this.store.select(getCandidateSearchState))
        .switchMap(([action, state]) =>
            this.candidateService.search(toSearchRequest(action as SearchCandidatesAction, state))
                .map(toCandidateProfileListLoadedAction)
                .catch((err: any) => Observable.of(new ShowCandidateListErrorAction(err)))
        );

    @Effect()
    loadNextPage$: Observable<Action> = this.actions$
        .ofType(LOAD_NEXT_PAGE)
        .withLatestFrom(this.store.select(getCandidateSearchState))
        .switchMap(([action, state]) =>
            this.candidateService.search(toNextPageRequest(state))
                .map((response: ResponseWrapper) => new NextPageLoadedAction(response.json))
                .catch((err: any) => Observable.of(new ShowCandidateListErrorAction(err)))
        );

    constructor(private actions$: Actions,
                private store: Store<CandidateSearchState>,
                private candidateService: CandidateService,
                @Optional()
                @Inject(CANDIDATE_SEARCH_DEBOUNCE)
                private debounce,
                @Optional()
                @Inject(CANDIDATE_SEARCH_SCHEDULER)
                private scheduler: Scheduler) {
    }
}

function toInitialSearchRequest(state: CandidateSearchState): CandidateSearchRequest {
    return createCandidateSearchRequest(state.searchFilter, state.page);
}

function toSearchRequest(action: SearchCandidatesAction, state: CandidateSearchState): CandidateSearchRequest {
    return createCandidateSearchRequest(action.payload, state.page);
}

function toNextPageRequest(state: CandidateSearchState): CandidateSearchRequest {
    return createCandidateSearchRequest(state.searchFilter, state.page + 1);
}

function toCandidateProfileListLoadedAction(response: ResponseWrapper): CandidateProfileListLoadedAction {
    return new CandidateProfileListLoadedAction({
        candidateProfileList: response.json,
        totalCandidateCount: +response.headers.get('X-Total-Count'),
        page: 0
    });
}
