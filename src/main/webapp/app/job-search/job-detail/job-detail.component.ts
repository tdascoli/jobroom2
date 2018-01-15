import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {
    JobCenter,
    ReferenceService
} from '../../shared/reference-service/reference.service';
import { Job } from '../services';
import {
    getJobList, getTotalJobCount,
    JobSearchState
} from '../state-management/state/job-search.state';
import { Store } from '@ngrx/store';

@Component({
    selector: 'jr2-job-detail',
    templateUrl: './job-detail.component.html',
    styleUrls: [
        './job-detail.scss'
    ]
})
export class JobDetailComponent implements OnInit, OnDestroy, AfterViewInit {
    job: Job;
    jobList$: Observable<Job[]>;
    jobCenter$: Observable<JobCenter>;
    jobUrl: String;
    showExternalJobDisclaimer: boolean;
    jobListTotalSize$: Observable<number>;

    constructor(private route: ActivatedRoute,
                private referenceService: ReferenceService,
                private store: Store<JobSearchState>) {
        this.jobList$ = this.store.select(getJobList);
        this.jobListTotalSize$ = this.store.select(getTotalJobCount);
    }

    ngAfterViewInit(): void {
        window.scroll(0, 0);
    }

    ngOnInit() {
        this.route.data.subscribe((data) => {
            this.job = data['job'];
            this.jobCenter$ = this.job.jobCenterCode
                ? this.referenceService.resolveJobCenter(this.job.jobCenterCode)
                : Observable.empty();
            this.showExternalJobDisclaimer = !!this.job.externalUrl;
        });

        this.jobUrl = window.location.href;
    }

    ngOnDestroy(): void {
    }

    printJob() {
        window.print();
    }
}
