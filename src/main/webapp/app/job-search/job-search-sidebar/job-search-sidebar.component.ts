import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import {
    getSearchFilter,
    JobSearchFilter,
    JobSearchState
} from '../state-management/state/job-search.state';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'jr2-job-search-sidebar',
    templateUrl: './job-search-sidebar.component.html',
    styleUrls: ['./job-search-sidebar.component.scss']
})
export class JobSearchSidebarComponent {
    searchFilter$: Observable<JobSearchFilter>;

    constructor(private store: Store<JobSearchState>) {
        this.searchFilter$ = store.select(getSearchFilter);
    }
}
