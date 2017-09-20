import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as home from '../../../home/state-management'
import { ToolbarChangedAction } from '../actions/job-search.actions';

@Injectable()
export class HomeEffects {

    @Effect()
    jobSearchToolSubmitted$: Observable<Action> = this.actions$
        .ofType(home.JOB_SEARCH_TOOL_SUBMITTED)
        .do((action: home.JobSearchToolSubmittedAction) => this.router.navigate(['/job-search']))
        .map((action: home.JobSearchToolSubmittedAction) => new ToolbarChangedAction(action.payload));

    constructor(private actions$: Actions, private router: Router) {
    }
}
