import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import {
    getSearchFilter,
    JobSearchFilter,
    JobSearchState
} from '../state-management';
import { Observable } from 'rxjs/Observable';
import { getResetTime } from '../state-management';

@Component({
    selector: 'jr2-job-search-sidebar',
    templateUrl: './job-search-sidebar.component.html',
    styleUrls: ['./job-search-sidebar.component.scss']
})
export class JobSearchSidebarComponent {
    searchFilter$: Observable<JobSearchFilter>;
    reset$: Observable<number>;

    constructor(private store: Store<JobSearchState>) {
        this.searchFilter$ = store.select(getSearchFilter);
        this.reset$ = store.select(getResetTime)
            .scan((acc: number) => acc + 1, 0);
    }
}
