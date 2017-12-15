import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { JobPublication } from '../../shared/job-publication/job-publication.model';
import { JobPublicationCancelDialogService } from '../dialogs/job-publication-cancel-dialog.service';
import { JobPublicationService } from '../../shared/job-publication/job-publication.service';

@Component({
    selector: 'jr2-job-publication-detail',
    templateUrl: './job-publication-detail.component.html',
    styleUrls: []
})
export class JobPublicationDetailComponent implements OnInit {

    jobPublication$: Observable<JobPublication>;

    constructor(private route: ActivatedRoute,
                private cancelDialogService: JobPublicationCancelDialogService,
                private jobPublicationService: JobPublicationService) {
    }

    ngOnInit() {
        this.jobPublication$ = this.route.data
            .map((data) => data['jobPublication']);
    }

    isJobPublicationCancellable(status: string) {
        return this.jobPublicationService.isJobPublicationCancellable(status);
    }

    showCancellationDialog(id: string, accessToken: string) {
        this.cancelDialogService.open(id, accessToken);
    }

    printJobPublication() {
        window.print();
    }
}
