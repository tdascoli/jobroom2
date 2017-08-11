import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { OccupationService, TypeaheadMultiselectModel } from '../../shared/job-search';
import { Store } from '@ngrx/store';
import { ExecuteSearchAction, JobSearchState } from '../state-management';

@Component({
    selector: 'jr2-job-search-toolbar',
    templateUrl: './job-search-toolbar.component.html',
    styleUrls: ['./job-search-toolbar.component.scss']
})
export class JobSearchToolbarComponent {
    @Input() total: number;
    @Input() baseQueryModel: Array<TypeaheadMultiselectModel>;
    @Input() locationQueryModel: Array<TypeaheadMultiselectModel>;

    constructor(private service: OccupationService, private store: Store<JobSearchState>) {
    }

    search() {
        this.store.dispatch(new ExecuteSearchAction(this.baseQueryModel, this.locationQueryModel));
    }

    fetchSuggestions = (query: string): Observable<TypeaheadMultiselectModel[]> => this.service.fetchSuggestions(query);
}
