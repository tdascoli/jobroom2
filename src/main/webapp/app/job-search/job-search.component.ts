import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { TypeaheadMultiselectModel } from '../shared/input-components';
import {
    getBaseQuery,
    getJobList,
    getTotalJobCount,
    JobSearchState
} from './state-management';
import {
    getInitialState,
    getLoading,
    getLocalityQuery,
    getSearchQuery,
    JobSearchQuery
} from './state-management/state/job-search.state';
import { Job } from './services';
import { InitJobSearchAction } from './state-management/actions/job-search.actions';
import { getLanguage } from '../shared/state-management/state/core.state';

@Component({
    selector: 'jr2-job-search',
    templateUrl: './job-search.component.html',
    styleUrls: ['./job-search.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobSearchComponent {
    jobList$: Observable<Array<Job>>;
    searchQuery$: Observable<JobSearchQuery>;
    baseQueryString$: Observable<string>;
    localityQueryString$: Observable<string>;
    totalCount$: Observable<number>;
    loading$: Observable<boolean>;
    initialized$: Observable<boolean>;
    reset$: Observable<number>;

    constructor(private store: Store<JobSearchState>) {
        this.store.dispatch(new InitJobSearchAction());

        this.jobList$ = store.select(getJobList);
        this.searchQuery$ = store.select(getSearchQuery);
        this.baseQueryString$ = store.select(getBaseQuery).map(queryModelToTextMapper);
        this.localityQueryString$ = store.select(getLocalityQuery).map(queryModelToTextMapper);
        this.totalCount$ = store.select(getTotalJobCount);
        this.loading$ = store.select(getLoading);
        this.initialized$ = store.select(getInitialState).map((initialState: boolean) => !initialState);
        this.reset$ = store.select(getLanguage).scan((acc: number) => acc + 1, 0);
    }
}

function queryModelToTextMapper(query: Array<TypeaheadMultiselectModel>): string {
    return query.map((item: TypeaheadMultiselectModel) => item.label).join(', ');
}
