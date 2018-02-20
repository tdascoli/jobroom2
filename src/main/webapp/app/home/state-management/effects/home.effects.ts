import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as jobSearch from '../../../job-search/state-management/actions/job-search.actions';
import * as candidateSearch from '../../../candidate-search/state-management/actions/candidate-search.actions';
import {
    JOB_SEARCH_TOOL_COUNT,
    JOB_SEARCH_TOOL_SUBMITTED,
    JobSearchToolCountAction,
    JobSearchToolCountedAction,
    JobSearchToolSubmittedAction
} from '../actions/job-search-tool.actions';
import {
    CANDIDATE_SEARCH_TOOL_COUNT,
    CANDIDATE_SEARCH_TOOL_SUBMITTED,
    CandidateSearchToolCountAction,
    CandidateSearchToolCountedAction,
    CandidateSearchToolSubmittedAction,
    UpdateOccupationTranslationAction
} from '../actions/candidate-search-tool.actions';
import { CandidateService } from '../../../candidate-search/services/candidate.service';
import { createCandidateSearchRequestFromToolState } from '../../../candidate-search/state-management/util/search-request-mapper';
import { JobService } from '../../../job-search/services/job.service';
import { createJobSearchRequestFromToolState } from '../../../job-search/state-management/util/search-request-mapper';
import {
    LANGUAGE_CHANGED,
    LanguageChangedAction
} from '../../../shared/state-management/actions/core.actions';
import { OccupationPresentationService } from '../../../shared/reference-service/occupation-presentation.service';
import { getCandidateSearchToolState, HomeState } from '../state/home.state';
import { TypeaheadMultiselectModel } from '../../../shared/input-components/typeahead/typeahead-multiselect-model';

@Injectable()
export class HomeEffects {

    @Effect()
    jobSearchToolSubmitted$: Observable<Action> = this.actions$
        .ofType(JOB_SEARCH_TOOL_SUBMITTED)
        .do((action: JobSearchToolSubmittedAction) => this.router.navigate(['/job-search']))
        .map((action: JobSearchToolSubmittedAction) => new jobSearch.JobSearchToolChangedAction(action.payload));

    @Effect()
    candidateSearchToolSubmitted$: Observable<Action> = this.actions$
        .ofType(CANDIDATE_SEARCH_TOOL_SUBMITTED)
        .do((action: CandidateSearchToolSubmittedAction) => this.router.navigate(['/candidate-search']))
        .map((action: CandidateSearchToolSubmittedAction) => new candidateSearch.CandidateSearchToolChangedAction(action.payload));

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

    @Effect()
    languageChange$: Observable<Action> = this.actions$
        .ofType(LANGUAGE_CHANGED)
        .withLatestFrom(this.store.select(getCandidateSearchToolState))
        .filter(([action, state]) => !!state.occupations)
        .switchMap(([action, state]) => {
            const { occupations } = state;
            const language = (action as LanguageChangedAction).payload;

            const translations$ = occupations.map((occupation: TypeaheadMultiselectModel) =>
                this.occupationPresentationService.findOccupationLabelsByCode(occupation.code, language)
                    .map((label) => new TypeaheadMultiselectModel(occupation.type, occupation.code, label.default)));

            return Observable.forkJoin(translations$)
                .map((translatedOccupations: Array<TypeaheadMultiselectModel>) =>
                    new UpdateOccupationTranslationAction(translatedOccupations));
        });

    constructor(private actions$: Actions,
                private router: Router,
                private store: Store<HomeState>,
                private occupationPresentationService: OccupationPresentationService,
                private candidateService: CandidateService,
                private jobService: JobService) {
    }
}
