import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import {
    getSearchFilter,
    JobSearchFilter,
    JobSearchState
} from '../state-management/state/job-search.state';
import { Observable } from 'rxjs/Observable';
import { getLanguage } from '../../shared/state-management/state/core.state';

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
        this.reset$ = store.select(getLanguage)
            .scan((acc: number) => acc + 1, 0);
    }
}
