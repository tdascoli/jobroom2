import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {
    JobCenter,
    ReferenceService
} from '../../shared/job-search/service/reference.service';
import { Job } from '../services';

@Component({
    selector: 'jr2-job-detail',
    templateUrl: './job-detail.component.html',
    styleUrls: [
        './job-detail.scss'
    ]
})
export class JobDetailComponent implements OnInit {

    job: Job;
    jobCenter$: Observable<JobCenter>;
    jobUrl: String;

    constructor(private route: ActivatedRoute, private referenceService: ReferenceService) {
    }

    ngOnInit() {
        this.job = this.route.snapshot.data['job'];
        if (this.job.jobCenterCode) {
            this.jobCenter$ = this.referenceService.resolveJobCenter(this.job.jobCenterCode);
        }
        this.jobUrl = window.location.href;
    }

    printJob() {
        window.print();
    }
}
