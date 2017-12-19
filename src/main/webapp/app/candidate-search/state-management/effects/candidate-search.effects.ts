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
    CANDIDATE_LIST_LOADED,
    CANDIDATE_SEARCH_TOOL_CHANGED,
    CandidateProfileListLoadedAction,
    CandidateSearchToolChangedAction,
    INIT_CANDIDATE_SEARCH,
    LOAD_NEXT_PAGE,
    LoadNextPageAction,
    NEXT_PAGE_LOADED,
    NextPageLoadedAction,
    SEARCH_CANDIDATES,
    SearchCandidatesAction,
    SHOW_CANDIDATE_LIST_ERROR,
    ShowCandidateListErrorAction
} from '../actions/candidate-search.actions';
import { CandidateService } from '../../services/candidate.service';
import { CandidateSearchRequest } from '../../services/candidate-search-request';
import { ResponseWrapper } from '../../../shared/index';
import { createCandidateSearchRequestFromFilter } from '../util/search-request-mapper';
import { async } from 'rxjs/scheduler/async';
import {
    LOAD_NEXT_ITEMS_PAGE,
    LoadNextItemsPageAction,
    LoadNextItemsPageErrorAction,
    NEXT_ITEM_LOADED,
    NextItemLoadedAction,
    NextItemsPageLoadedAction
} from '../../../shared/components/details-page-pagination/state-management/actions/details-page-pagination.actions';
import { Router } from '@angular/router';
import { CandidateProfile } from '../../services/candidate';
import { WINDOW } from '../../../shared/shared-libs.module';

export const CANDIDATE_SEARCH_DEBOUNCE = new InjectionToken<number>('CANDIDATE_SEARCH_DEBOUNCE');
export const CANDIDATE_SEARCH_SCHEDULER = new InjectionToken<Scheduler>('CANDIDATE_SEARCH_SCHEDULER');
const CANDIDATE_DETAIL_FEATURE = 'candidate-detail';
import { CandidateLoggingService } from '../../services/candidate.logging.service';

@Injectable()
export class CandidateSearchEffects {
    @Effect()
    initCandidateSearch$: Observable<Action> = this.actions$
        .ofType(INIT_CANDIDATE_SEARCH)
        .withLatestFrom(this.store.select(getCandidateSearchState))
        .switchMap(([action, state]) => {
            if (state.initialState) {
                const searchRequest = toInitialSearchRequest(state);
                this.candidateLoggingService.logSearchEvent(searchRequest);
                return this.candidateService.search(searchRequest)
                    .map(toCandidateProfileListLoadedAction)
                    .catch((err: any) => Observable.of(new ShowCandidateListErrorAction(err)));
            } else {
                // Page is already loaded. Do not change the application state.
                return [];
            }
        });

    @Effect()
    loadCandidateList$: Observable<Action> = this.actions$
        .ofType(SEARCH_CANDIDATES, CANDIDATE_SEARCH_TOOL_CHANGED)
        .debounceTime(this.debounce || 300, this.scheduler || async)
        .do((action) => this.window.scroll(0, 0))
        .switchMap((action: SearchCandidatesAction | CandidateSearchToolChangedAction) => {
                const searchRequest = toSearchRequest(action);
                this.candidateLoggingService.logSearchEvent(searchRequest);
                return this.candidateService.search(searchRequest)
                        .map(toCandidateProfileListLoadedAction)
                        .catch((err: any) => Observable.of(new ShowCandidateListErrorAction(err)))
            }
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

    @Effect({ dispatch: false })
    logResultsPage$: Observable<void> = this.actions$
        .ofType(NEXT_PAGE_LOADED, CANDIDATE_LIST_LOADED)
        .withLatestFrom(this.store.select(getCandidateSearchState))
        .map(([action, searchState]) => {
            // TODO: It looks like the new results are already in the state here. Can we rely on that always being the case?
            this.candidateLoggingService.logResultsList(searchState);
            return null;
        });

    @Effect()
    nextItemsPageLoaded$: Observable<Action> = this.actions$
        .ofType(LOAD_NEXT_ITEMS_PAGE)
        .filter((action: NextItemLoadedAction) => action.payload.feature === CANDIDATE_DETAIL_FEATURE)
        .switchMap((loadNextItemsAction: LoadNextItemsPageAction) => {
            this.store.dispatch(new LoadNextPageAction());

            return Observable.merge(
                this.actions$
                    .ofType(NEXT_PAGE_LOADED)
                    .map((action: NextPageLoadedAction) => action.payload[0]),
                this.actions$
                    .ofType(SHOW_CANDIDATE_LIST_ERROR)
                    .map((action: ShowCandidateListErrorAction) => null))
                .take(1);
        })
        .map((candidateProfile: CandidateProfile) => candidateProfile
            ? new NextItemsPageLoadedAction({
                item: candidateProfile,
                feature: CANDIDATE_DETAIL_FEATURE
            })
            : new LoadNextItemsPageErrorAction({ feature: CANDIDATE_DETAIL_FEATURE }));

    @Effect({ dispatch: false })
    nextItemLoaded$: Observable<Action> = this.actions$
        .ofType(NEXT_ITEM_LOADED)
        .filter((action: NextItemLoadedAction) => action.payload.feature === CANDIDATE_DETAIL_FEATURE)
        .do((action: NextItemLoadedAction) => {
            this.router.navigate(['/candidate-detail', action.payload.item.id])
        });

    constructor(private actions$: Actions,
                private store: Store<CandidateSearchState>,
                private candidateService: CandidateService,
                private candidateLoggingService: CandidateLoggingService,
                @Optional()
                @Inject(CANDIDATE_SEARCH_DEBOUNCE)
                private debounce,
                @Optional()
                @Inject(CANDIDATE_SEARCH_SCHEDULER)
                private scheduler: Scheduler,
                @Inject(WINDOW)
                private window: Window,
                private router: Router) {
    }
}

function toInitialSearchRequest(state: CandidateSearchState): CandidateSearchRequest {
    return createCandidateSearchRequestFromFilter(state.searchFilter, 0);
}

function toSearchRequest(action: SearchCandidatesAction | CandidateSearchToolChangedAction): CandidateSearchRequest {
    return createCandidateSearchRequestFromFilter(action.payload, 0);
}

function toNextPageRequest(state: CandidateSearchState): CandidateSearchRequest {
    return createCandidateSearchRequestFromFilter(state.searchFilter, state.page + 1);
}

function toCandidateProfileListLoadedAction(response: ResponseWrapper): CandidateProfileListLoadedAction {
    return new CandidateProfileListLoadedAction({
        candidateProfileList: response.json,
        totalCandidateCount: +response.headers.get('X-Total-Count'),
        page: 0
    });
}
