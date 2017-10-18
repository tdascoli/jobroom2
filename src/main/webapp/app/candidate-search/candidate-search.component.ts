import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
    CandidateSearchFilter,
    CandidateSearchState,
    getCandidateProfileList,
    getLoading,
    getSearchError,
    getSearchFilter,
    getTotalCandidateCount,
} from './state-management/state/candidate-search.state';
import { Store } from '@ngrx/store';
import {
    InitCandidateSearchAction,
    SearchCandidatesAction
} from './state-management/actions/candidate-search.actions';
import { CandidateProfile } from './services/candidate';

@Component({
    selector: 'jr2-candidate-search',
    templateUrl: './candidate-search.component.html',
    styles: []
})
export class CandidateSearchComponent {
    searchFilter$: Observable<CandidateSearchFilter>;
    totalCount$: Observable<number>;
    loading$: Observable<boolean>;
    showError$: Observable<boolean>;
    candidateProfileList$: Observable<Array<CandidateProfile>>;
    occupationName$: Observable<string>;

    constructor(private store: Store<CandidateSearchState>) {
        this.store.dispatch(new InitCandidateSearchAction());

        this.searchFilter$ = store.select(getSearchFilter);
        this.loading$ = store.select(getLoading);
        this.showError$ = store.select(getSearchError);
        this.totalCount$ = store.select(getTotalCandidateCount);
        this.candidateProfileList$ = store.select(getCandidateProfileList);
        this.occupationName$ = this.searchFilter$.map((filter: CandidateSearchFilter) =>
            filter.occupation ? filter.occupation.name : '')
    }

    searchCandidates(filter: CandidateSearchFilter): void {
        this.store.dispatch(new SearchCandidatesAction(filter));
    }
}
