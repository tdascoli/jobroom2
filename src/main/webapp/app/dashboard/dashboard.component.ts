import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
    PEADashboardState,
    getJobPublicationFilter,
    getJobPublications,
    getJobPublicationsPage,
    getJobPublicationsTotalCount,
    JobPublicationFilter
} from './state-management/state/pea-dashboard.state';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { JobPublication } from '../shared/job-publication/job-publication.model';
import {
    FilterJobPublicationsDashboardAction,
    LoadNextJobPublicationsDashboardPageAction
} from './state-management/actions/pea-dashboard.actions';

@Component({
    selector: 'jr2-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
    jobPublicationFilter$: Observable<JobPublicationFilter>;
    jobPublications$: Observable<JobPublication[]>;
    jobPublicationsTotalCount$: Observable<number>;
    jobPublicationsPage$: Observable<number>;

    constructor(private store: Store<PEADashboardState>) {
        this.jobPublicationFilter$ = store.select(getJobPublicationFilter);
        this.jobPublications$ = store.select(getJobPublications);
        this.jobPublicationsTotalCount$ = store.select(getJobPublicationsTotalCount);
        this.jobPublicationsPage$ = store.select(getJobPublicationsPage);
    }

    filterJobPublications(jobPublicationFilter: JobPublicationFilter): void {
        this.store.dispatch(new FilterJobPublicationsDashboardAction(jobPublicationFilter));
    }

    changeJobPublicationsPage(page): void {
        this.store.dispatch(new LoadNextJobPublicationsDashboardPageAction({ page: page - 1 }));
    }
}
