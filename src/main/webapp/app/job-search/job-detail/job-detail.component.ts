import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {
    JobCenter,
    ReferenceService
} from '../../shared/reference-service/reference.service';
import { Job } from '../services';

@Component({
    selector: 'jr2-job-detail',
    templateUrl: './job-detail.component.html',
    styleUrls: [
        './job-detail.scss'
    ]
})
export class JobDetailComponent implements OnInit, AfterViewInit {

    job: Job;
    jobCenter$: Observable<JobCenter>;
    jobUrl: String;
    isCopied: boolean;
    showExternalJobDisclaimer: boolean;

    // After upgrading the jhipster version tslint fails with the following message:
    // ERROR: /home/mabi/development/projects/seco/jobroom2/src/main/webapp/app/job-search/job-detail/job-detail.component.html[91, 32]:
    // The property "async" that you're trying to access does not exist in the class declaration.
    // This is a temporary workaround to solve the linting failure above.
    async: any;

    constructor(private route: ActivatedRoute, private referenceService: ReferenceService) {
    }

    ngAfterViewInit(): void {
        window.scroll(0, 0);
    }

    ngOnInit() {
        this.job = this.route.snapshot.data['job'];
        if (this.job.jobCenterCode) {
            this.jobCenter$ = this.referenceService.resolveJobCenter(this.job.jobCenterCode);
        }
        this.jobUrl = window.location.href;

        this.showExternalJobDisclaimer = !!this.job.externalUrl;
    }

    printJob() {
        window.print();
    }
}
