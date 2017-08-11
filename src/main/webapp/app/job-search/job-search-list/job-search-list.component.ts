import { Component, Input } from '@angular/core';
import { Job } from '../../entities/job/job.model';
import { Store } from '@ngrx/store';
import { JobSearchState, LoadNextPageAction } from '../state-management';
import { Observable } from 'rxjs/Observable';
import { getJobSearchError } from '../state-management/state/job-search.state';
import { HideJobListErrorAction } from '../state-management/actions/job-search.actions';

@Component({
    selector: 'jr2-job-search-list',
    templateUrl: './job-search-list.component.html',
    styles: []
})
export class JobSearchListComponent {
    @Input() jobList: Array<Job>;
    @Input() totalCount: number;
    @Input() baseQueryString: string;
    @Input() locationQueryString: string;

    displayError$: Observable<boolean>;

    constructor(private store: Store<JobSearchState>) {
        this.displayError$ = store.select(getJobSearchError);
    }

    closeAlert() {
        this.store.dispatch(new HideJobListErrorAction());
    }

    onScroll(event: any) {
        this.store.dispatch(new LoadNextPageAction());
    }

    getTitleKey() {
        let key = 'job-search.job-search-list.title';

        if (this.totalCount === 0) {
            key += '.none';
        } else if (this.totalCount === 1) {
            key += '.one';
        } else {
            key += '.other';
        }

        if (this.locationQueryString.length > 0) {
            key += '.with-locale';
        } else {
            key += '.without-locale';
        }

        return key;
    }
}
