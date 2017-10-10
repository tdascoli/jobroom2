import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {
    JobCenter,
    ReferenceService
} from '../../shared/reference-service/reference.service';
import { Job } from '../services';
import {
    getJobNavigationEnabled,
    getSelectedJobIndex, getTotalJobCount,
    JobSearchState
} from '../state-management/state/job-search.state';
import { Store } from '@ngrx/store';
import {
    LoadNextJobAction, LoadPreviousJobAction
} from '../state-management/actions/job-search.actions';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'jr2-job-detail',
    templateUrl: './job-detail.component.html',
    styleUrls: [
        './job-detail.scss'
    ]
})
export class JobDetailComponent implements OnInit, OnDestroy, AfterViewInit {
    job: Job;
    jobCenter$: Observable<JobCenter>;
    jobUrl: String;
    isCopied: boolean;
    showExternalJobDisclaimer: boolean;
    jobNavigationEnabled$: Observable<boolean>;
    firstJob: boolean;
    lastJob: boolean;

    private unsubscribe$: Subject<void> = new Subject<void>();

    constructor(private route: ActivatedRoute,
                private referenceService: ReferenceService,
                private store: Store<JobSearchState>) {
        this.jobNavigationEnabled$ = this.store.select(getJobNavigationEnabled);
        this.store.select(getSelectedJobIndex)
            .takeUntil(this.unsubscribe$)
            .withLatestFrom(this.store.select(getTotalJobCount))
            .subscribe(([jobIndex, totalJobCount]) => {
                this.firstJob = jobIndex === 0;
                this.lastJob = jobIndex === totalJobCount - 1;
            });
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
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    printJob() {
        window.print();
    }

    previousJob(): void {
        this.store.dispatch(new LoadPreviousJobAction());
    }

    nextJob(): void {
        this.store.dispatch(new LoadNextJobAction());
    }

}
