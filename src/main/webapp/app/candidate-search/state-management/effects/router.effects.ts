import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { CandidateService } from '../../services/candidate.service';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import {
    ROUTER_NAVIGATION,
    RouterNavigationAction,
    RouterNavigationPayload
} from '@ngrx/router-store';
import { RouterStateUrl } from '../../../shared/custom-router-state-serializer/custom-router-state-serializer';
import { SearchCandidatesAction } from '../actions/candidate-search.actions';
import { Router } from '@angular/router';

@Injectable()
export class RouterEffects {
    @Effect()
    routerNavigation$: Observable<Action> = this.actions$
        .ofType(ROUTER_NAVIGATION)
        .map((action: RouterNavigationAction<RouterStateUrl>) => action.payload)
        .filter(actionsWithFilter)
        .do(() => this.router.navigate(['/candidate-search']))
        .map(toSearchCandidatesAction.bind(this));

    constructor(private actions$: Actions,
                private router: Router,
                private candidateService: CandidateService) {
    }
}

function toSearchCandidatesAction(payload: RouterNavigationPayload<RouterStateUrl>): SearchCandidatesAction {
    const filterString = payload.routerState.queryParams.searchFilter;
    const filter = this.candidateService.decodeURISearchFilter(filterString);

    return new SearchCandidatesAction(filter);
}

function actionsWithFilter(payload: RouterNavigationPayload<RouterStateUrl>): boolean {
    const { url, queryParams } = payload.routerState;

    return url.startsWith('/candidate-search')
        && queryParams
        && typeof queryParams['searchFilter'] === 'string';
}
