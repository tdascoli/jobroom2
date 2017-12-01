import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as jobSearch from '../../../job-search/state-management/actions/job-search.actions';
import * as candidateSearch from '../../../candidate-search/state-management/actions/candidate-search.actions';
import {
    JOB_SEARCH_TOOL_COUNT,
    JOB_SEARCH_TOOL_SUBMITTED, JobSearchToolCountAction, JobSearchToolCountedAction,
    JobSearchToolSubmittedAction
} from '../actions/job-search-tool.actions';
import {
    CANDIDATE_SEARCH_TOOL_COUNT,
    CANDIDATE_SEARCH_TOOL_SUBMITTED,
    CandidateSearchToolCountAction,
    CandidateSearchToolCountedAction,
    CandidateSearchToolSubmittedAction
} from '../actions/candidate-search-tool.actions';
import { CandidateService } from '../../../candidate-search/services/candidate.service';
import { createCandidateSearchRequestFromToolState } from '../../../candidate-search/state-management/util/search-request-mapper';
import { JobService } from '../../../job-search/services/job.service';
import {
    createJobSearchRequestFromToolState
} from '../../../job-search/state-management/util/search-request-mapper';

@Injectable()
export class HomeEffects {

    @Effect()
    jobSearchToolSubmitted$: Observable<Action> = this.actions$
        .ofType(JOB_SEARCH_TOOL_SUBMITTED)
        .do((action: JobSearchToolSubmittedAction) => this.router.navigate(['/job-search']))
        .map((action: JobSearchToolSubmittedAction) => new jobSearch.ToolbarChangedAction(action.payload));

    @Effect()
    candidateSearchToolSubmitted$: Observable<Action> = this.actions$
        .ofType(CANDIDATE_SEARCH_TOOL_SUBMITTED)
        .do((action: CandidateSearchToolSubmittedAction) => this.router.navigate(['/candidate-search']))
        .map((action: CandidateSearchToolSubmittedAction) => new candidateSearch.SearchCandidatesAction(action.payload));

    @Effect()
    candidateSearchToolCount$: Observable<Action> = this.actions$
        .ofType(CANDIDATE_SEARCH_TOOL_COUNT)
        .switchMap((action: CandidateSearchToolCountAction) => {
            const req = createCandidateSearchRequestFromToolState(action.payload);
            return this.candidateService.count(req)
                    .map((totalCount: number) => new CandidateSearchToolCountedAction(totalCount))
                    .catch((err: any) => Observable.of(new CandidateSearchToolCountedAction(0)))
            }
        );

    @Effect()
    jobSearchToolCount$: Observable<Action> = this.actions$
        .ofType(JOB_SEARCH_TOOL_COUNT)
        .switchMap((action: JobSearchToolCountAction) => {
                const req = createJobSearchRequestFromToolState(action.payload);
                return this.jobService.count(req)
                    .map((totalCount: number) => new JobSearchToolCountedAction(totalCount))
                    .catch((err: any) => Observable.of(new JobSearchToolCountedAction(0)))
            }
        );

    constructor(private actions$: Actions,
                private router: Router,
                private candidateService: CandidateService,
                private jobService: JobService) {
    }
}
