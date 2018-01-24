import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { JobPublication } from '../../shared/job-publication/job-publication.model';
import { JobPublicationService } from '../../shared/job-publication/job-publication.service';
import { Store } from '@ngrx/store';
import {
    getJobPublication,
    getShowCancellationError,
    getShowCancellationSuccess,
    JobPublicationDetailState
} from '../state-management/state/job-publication-detail.state';
import {
    HideErrorMessageAction,
    HideSuccessMessageAction,
    SubmitCancellationAction
} from '../state-management/actions/job-publication-detail.actions';
import { JobPublicationCancelDialogService } from '../dialogs/job-publication-cancel-dialog.service';

@Component({
    selector: 'jr2-job-publication-detail',
    templateUrl: './job-publication-detail.component.html',
    styleUrls: []
})
export class JobPublicationDetailComponent {

    jobPublication$: Observable<JobPublication>;
    showCancellationSuccess$: Observable<boolean>;
    showCancellationError$: Observable<boolean>;
    showCancellationLink$: Observable<boolean>;

    constructor(private jobPublicationService: JobPublicationService,
                private store: Store<JobPublicationDetailState>,
                private jobPublicationCancelDialogService: JobPublicationCancelDialogService) {
        this.showCancellationSuccess$ = store.select(getShowCancellationSuccess);
        this.showCancellationError$ = store.select(getShowCancellationError);
        this.jobPublication$ = store.select(getJobPublication)
            .map(this.fixApplicationUrl);
        this.showCancellationLink$ = store.select(getJobPublication)
            .filter((jobPublication: JobPublication) => !!jobPublication)
            .map((jobPublication: JobPublication) =>
                this.jobPublicationService.isJobPublicationCancellable(jobPublication.status))
    }

    private fixApplicationUrl(jobPublication: JobPublication) {
        if (jobPublication.application.url && !jobPublication.application.url.startsWith('http')) {
            jobPublication.application = Object.assign(jobPublication.application, {
                url: `http://${jobPublication.application.url}`
            });
        }
        return jobPublication;
    }

    showCancellationDialog(id: string, accessToken: string) {
        const onSubmit = (cancellationData) => this.store.dispatch(new SubmitCancellationAction(cancellationData));
        this.jobPublicationCancelDialogService.open(id, accessToken, onSubmit);
    }

    closeSuccessMessage() {
        this.store.dispatch(new HideSuccessMessageAction());
    }

    closeErrorMessage() {
        this.store.dispatch(new HideErrorMessageAction());
    }

    printJobPublication() {
        window.print();
    }
}
