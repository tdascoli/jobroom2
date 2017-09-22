import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
    CandidateSearchFilter,
    CandidateSearchState,
    getSearchFilter
} from './state-management/state/candidate-search.state';
import { Store } from '@ngrx/store';

@Component({
    selector: 'jr2-candidate-search',
    templateUrl: './candidate-search.component.html',
    styles: []
})
export class CandidateSearchComponent {
    searchFilter$: Observable<CandidateSearchFilter>;

    constructor(private store: Store<CandidateSearchState>) {
        this.searchFilter$ = store.select(getSearchFilter);
    }
}
