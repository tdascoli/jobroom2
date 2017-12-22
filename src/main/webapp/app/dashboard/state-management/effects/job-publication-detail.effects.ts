import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { JobPublicationService } from '../../../shared/job-publication/job-publication.service';
import { createJobPublicationCancellationRequest } from '../util/cancellation-request.mapper';
import {
    CancellationFailedAction,
    CancellationSucceededAction,
    JobPublicationLoadedAction,
    LOAD_JOB_PUBLICATION,
    LoadJobPublicationAction,
    LoadJobPublicationFailedAction,
    SUBMIT_CANCELLATION,
    SubmitCancellationAction
} from '../actions/job-publication-detail.actions';
import { JobCancelRequest } from '../../../shared/job-publication/job-publication-cancel-request';
import { JobPublication } from '../../../shared/job-publication/job-publication.model';

@Injectable()
export class JobPublicationDetailEffects {

    @Effect()
    loadJobPublication$: Observable<Action> = this.actions$
        .ofType(LOAD_JOB_PUBLICATION)
        .switchMap((action: LoadJobPublicationAction) =>
            this.jobPublicationService.findByIdAndAccessToken(action.payload.id, action.payload.accessToken)
                .map((jobPublication: JobPublication) => new JobPublicationLoadedAction(jobPublication))
                .catch((error) => Observable.of(new LoadJobPublicationFailedAction(error)))
        );

    @Effect()
    cancelJobPublication$: Observable<Action> = this.actions$
        .ofType(SUBMIT_CANCELLATION)
        .map((action: SubmitCancellationAction) => createJobPublicationCancellationRequest(action.payload))
        .switchMap((jobCancelRequest: JobCancelRequest) =>
            this.jobPublicationService.cancelJobPublication(jobCancelRequest)
                .flatMap((code) => this.jobPublicationService.findByIdAndAccessToken(jobCancelRequest.id, jobCancelRequest.accessToken))
                .map((jobPublication: JobPublication) => new CancellationSucceededAction(jobPublication))
                .catch((error) => Observable.of(new CancellationFailedAction(error)))
        );

    constructor(private actions$: Actions,
                private jobPublicationService: JobPublicationService) {
    }
}
