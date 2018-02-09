import { AfterViewInit, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
    JobCenter,
    ReferenceService
} from '../../shared/reference-service/reference.service';
import { Job } from '../services';
import {
    getJobList,
    getSelectedJob,
    getTotalJobCount,
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
export class JobDetailComponent implements AfterViewInit {
    job$: Observable<Job>;
    jobList$: Observable<Job[]>;
    jobCenter$: Observable<JobCenter>;
    jobListTotalSize$: Observable<number>;
    externalJobDisclaimerClosed = false;

    constructor(private referenceService: ReferenceService,
                private store: Store<JobSearchState>) {
        this.job$ = this.store.select(getSelectedJob);
        this.jobList$ = this.store.select(getJobList);
        this.jobListTotalSize$ = this.store.select(getTotalJobCount);
        this.jobCenter$ = this.job$
            .filter((job) => !!job)
            .map((job) => job.jobCenterCode)
            .filter((jobCenterCode) => !!jobCenterCode)
            .switchMap((jobCenterCode) => this.referenceService.resolveJobCenter(jobCenterCode))
    }

    isExternalJobDisclaimerShown(job: Job) {
        return job.source === 'extern' && !this.externalJobDisclaimerClosed;
    }

    ngAfterViewInit(): void {
        window.scroll(0, 0);
    }

    printJob() {
        window.print();
    }

    getJobUrl() {
        return window.location.href;
    }
}
