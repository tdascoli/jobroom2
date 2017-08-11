import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Job } from '../entities/job/job.model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { TypeaheadMultiselectModel } from '../shared/job-search/typeahead-multiselect/typeahead-multiselect-model';
import {
    getBaseQuery,
    getJobList,
    getTotalJobCount,
    JobSearchState
} from './state-management';
import { getLocationQuery } from './state-management/state/job-search.state';

@Component({
    selector: 'jr2-job-search',
    templateUrl: './job-search.component.html',
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobSearchComponent {
    jobList$: Observable<Array<Job>>;
    baseQueryModel$: Observable<Array<TypeaheadMultiselectModel>>;
    locationQueryModel$: Observable<Array<TypeaheadMultiselectModel>>;
    baseQueryString$: Observable<string>;
    locationQueryString$: Observable<string>;
    totalCount$: Observable<number>;

    constructor(private store: Store<JobSearchState>) {
        this.jobList$ = store.select(getJobList);
        this.baseQueryModel$ = store.select(getBaseQuery);
        this.locationQueryModel$ = store.select(getLocationQuery);
        this.baseQueryString$ = store.select(getBaseQuery).map(queryModelToTextMapper);
        this.locationQueryString$ = store.select(getLocationQuery).map(queryModelToTextMapper);
        this.totalCount$ = store.select(getTotalJobCount);
    }
}

function queryModelToTextMapper(query: Array<TypeaheadMultiselectModel>): string {
    return query.map((item: TypeaheadMultiselectModel) => item.label).join(', ');
}
