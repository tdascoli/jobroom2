import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
    CandidateSearchFilter,
    CandidateSearchState, getLoading,
    getSearchFilter, getTotalCandidatesCount
} from './state-management/state/candidate-search.state';
import { Store } from '@ngrx/store';
import { SearchCandidatesAction } from './state-management/actions/candidate-search.actions';

@Component({
    selector: 'jr2-candidate-search',
    templateUrl: './candidate-search.component.html',
    styles: []
})
export class CandidateSearchComponent {
    searchFilter$: Observable<CandidateSearchFilter>;
    totalCount$: Observable<number>;
    loading$: Observable<boolean>;

    constructor(private store: Store<CandidateSearchState>) {
        this.searchFilter$ = store.select(getSearchFilter);
        this.loading$ = store.select(getLoading);
        this.totalCount$ = store.select(getTotalCandidatesCount);
    }

    searchCandidates(searchQuery: CandidateSearchFilter): void {
        this.store.dispatch(new SearchCandidatesAction(searchQuery));
    }
}
