import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import {
    BaseQueryUpdatedAction,
    EXECUTE_SEARCH,
    ExecuteSearchAction,
    getJobSearchState,
    getSearchQuery,
    JobListLoadedAction,
    JobSearchState,
    LOAD_JOB_LIST,
    LOAD_NEXT_PAGE,
    LoadJobListAction,
    NavigationFinishedAction,
    NextPageLoadedAction
} from '../index';
import { JobService } from '../../../entities/job/job.service';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import { ResponseWrapper } from '../../../shared/model/response-wrapper.model';
import { TypeaheadMultiselectModel } from '../../../shared/job-search/typeahead-multiselect/typeahead-multiselect-model';
import { OccupationInputType } from '../../../shared/job-search/service/occupation-autocomplete';
import { Router } from '@angular/router';
import { ROUTER_NAVIGATION, RouterNavigationPayload } from '@ngrx/router-store';
import { JobSearchRequest } from '../../../entities/job/job-search-request';
import {
    LocalityQueryUpdatedAction,
    ShowJobListErrorAction
} from '../actions/job-search.actions';

@Injectable()
export class JobSearchEffects {
    @Effect()
    routerNavigation$: Observable<Action> = this.actions
        .ofType(ROUTER_NAVIGATION)
        .map(toPayload)
        .withLatestFrom(this.store.select(getJobSearchState))
        .flatMap(([payload, state]) => {
            if (!state.initialState) {
                // Page is already loaded. Do not change the application state.
                return [new NavigationFinishedAction()];
            } else {
                return toQueryModel(payload)
                    .flatMap((baseQueryModel: Array<TypeaheadMultiselectModel>) => [
                        new NavigationFinishedAction(),
                        new BaseQueryUpdatedAction(baseQueryModel),
                        new LoadJobListAction(baseQueryModel, [])
                    ]);
            }
        });

    @Effect()
    loadJobList$: Observable<Action> = this.actions
        .ofType(LOAD_JOB_LIST)
        .switchMap((action: LoadJobListAction) =>
            this.jobSearchService.search(new JobSearchRequest(action.baseQuery, action.localityQuery))
                .map((response: ResponseWrapper) => new JobListLoadedAction(response.json, +response.headers.get('X-Total-Count')))
                .catch((err: any) => Observable.of(new ShowJobListErrorAction(err)))
        );

    @Effect()
    loadNextPage$: Observable<Action> = this.actions
        .ofType(LOAD_NEXT_PAGE)
        .withLatestFrom(this.store.select(getSearchQuery))
        .switchMap(([action, query]) =>
            this.jobSearchService.search(new JobSearchRequest(query.baseQuery, query.localityQuery, query.page + 1))
                .map((response: ResponseWrapper) => new NextPageLoadedAction(response.json))
                .catch((err: any) => Observable.of(new ShowJobListErrorAction(err)))
        );

    @Effect()
    executeSearch$: Observable<Action> = this.actions
        .ofType(EXECUTE_SEARCH)
        .do((action: ExecuteSearchAction) => this.router.navigate(['job-search'], { queryParams: toQueryParams(action.baseQuery) }))
        .flatMap((action: ExecuteSearchAction) => [
                new BaseQueryUpdatedAction(action.baseQuery),
                new LocalityQueryUpdatedAction(action.localityQuery),
                new LoadJobListAction(action.baseQuery, action.localityQuery)
            ]
        );

    constructor(private actions: Actions,
                private jobSearchService: JobService,
                private router: Router,
                private store: Store<JobSearchState>) {
    }
}

function toQueryModel(payload: RouterNavigationPayload): Observable<Array<TypeaheadMultiselectModel>> {
    const paramMap = payload.routerState.root.queryParamMap;

    // todo: Resolve classification and occupation ids
    const classifications: Array<string> = paramMap.getAll('classification');
    const occupations: Array<string> = paramMap.getAll('occupation');
    const queries: Array<string> = paramMap.getAll('query');

    return Observable.of([...queries.map((q: string) => new TypeaheadMultiselectModel('free-text', q, q))]);
}

function toQueryParams(queryModel: Array<TypeaheadMultiselectModel>) {
    const query = queryModel
        .filter((value: TypeaheadMultiselectModel) => value.type === OccupationInputType.FREE_TEXT)
        .map((value: TypeaheadMultiselectModel) => value.label);
    const occupation = queryModel
        .filter((value: TypeaheadMultiselectModel) => value.type === OccupationInputType.OCCUPATION)
        .map((value: TypeaheadMultiselectModel) => value.code);
    const classification = queryModel
        .filter((value: TypeaheadMultiselectModel) => value.type === OccupationInputType.CLASSIFICATION)
        .map((value: TypeaheadMultiselectModel) => value.code);

    let ret = {};
    if (query.length > 0) {
        ret = Object.assign(ret, { query });
    }
    if (occupation.length > 0) {
        ret = Object.assign(ret, { occupation });
    }
    if (classification.length > 0) {
        ret = Object.assign(ret, { classification });
    }

    return ret;
}
