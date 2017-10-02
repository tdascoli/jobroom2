import { Component, Input } from '@angular/core';
import { Job } from '../services';
import { Store } from '@ngrx/store';
import { JobSearchState } from '../state-management/state/job-search.state';
import { SelectJobAction } from '../state-management/actions/job-search.actions';
import { Router } from '@angular/router';

@Component({
    selector: 'jr2-job-search-list-item',
    templateUrl: './job-search-list-item.component.html',
    styleUrls: ['./job-search-list-item.scss']
})
export class JobSearchListItemComponent {
    @Input() job: Job;
    @Input() index: number;

    constructor(private store: Store<JobSearchState>,
                private router: Router) {
    }

    selectJob(): void {
        this.store.dispatch(new SelectJobAction({ job: this.job, index: this.index }));
        this.router.navigate(['/job-detail', this.job.id]);
    }
}
