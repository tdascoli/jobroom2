import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as jobSearch from '../../../job-search/state-management/actions/job-search.actions';
import * as candidateSearch from '../../../candidate-search/state-management/actions/candidate-search.actions';
import {
    JOB_SEARCH_TOOL_SUBMITTED,
    JobSearchToolSubmittedAction
} from '../actions/job-search-tool.actions';
import {
    CANDIDATE_SEARCH_TOOL_SUBMITTED,
    CandidateSearchToolSubmittedAction
} from '../actions/candidate-search-tool.actions';

@Injectable()
export class HomeEffects {

    @Effect()
    jobSearchToolSubmitted$: Observable<Action> = this.actions$
        .ofType(JOB_SEARCH_TOOL_SUBMITTED)
        .switchMap((action: JobSearchToolSubmittedAction) =>
            Observable.fromPromise(this.router.navigate(['/job-search']))
                .map((p) => new jobSearch.ToolbarChangedAction(action.payload))
        );

    @Effect()
    candidateSearchToolSubmitted$: Observable<Action> = this.actions$
        .ofType(CANDIDATE_SEARCH_TOOL_SUBMITTED)
        .switchMap((action: CandidateSearchToolSubmittedAction) =>
            Observable.fromPromise(this.router.navigate(['/candidate-search']))
                .map((p) => new candidateSearch.InitCandidateSearchAction(action.payload))
        );

    constructor(private actions$: Actions, private router: Router) {
    }
}
