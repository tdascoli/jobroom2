import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
    Locality,
    LocalityService,
    OccupationService,
    TypeaheadMultiselectModel
} from '../../shared/job-search';
import { Store } from '@ngrx/store';
import { ExecuteSearchAction, JobSearchState } from '../state-management';
import { LocalityInputType } from '../../shared/job-search/service/locality';

@Component({
    selector: 'jr2-job-search-toolbar',
    templateUrl: './job-search-toolbar.component.html',
    styleUrls: ['./job-search-toolbar.component.scss']
})
export class JobSearchToolbarComponent {
    @Input() total: number;
    @Input() baseQueryModel: Array<TypeaheadMultiselectModel>;
    @Input() localityQueryModel: Array<TypeaheadMultiselectModel>;

    constructor(private occupationService: OccupationService,
                private localityService: LocalityService,
                private store: Store<JobSearchState>) {
    }

    search() {
        this.store.dispatch(new ExecuteSearchAction(this.baseQueryModel, this.localityQueryModel));
    }

    handleLocalitySelect(locality: Locality) {
        // Todo: Research if this fits into the ngrx concept and find a better solution.
        const currentLocality = new TypeaheadMultiselectModel(LocalityInputType.LOCALITY, locality.city, locality.city, 1);
        const exists = !!this.localityQueryModel.find((i: TypeaheadMultiselectModel) =>
            currentLocality.equals(i));

        if (!exists) {
            this.localityQueryModel = [...this.localityQueryModel, currentLocality];
        }
    }

    fetchOccupationSuggestions = (query: string): Observable<TypeaheadMultiselectModel[]> => this.occupationService.fetchSuggestions(query);

    fetchLocalitySuggestions = (query: string): Observable<TypeaheadMultiselectModel[]> => this.localityService.fetchSuggestions(query);
}
