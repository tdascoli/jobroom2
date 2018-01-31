import { ChangeDetectionStrategy, Component, } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
    CandidateSearchFilter,
    CandidateSearchState,
    getCandidateProfileList,
    getLoading,
    getSearchError,
    getSearchFilter,
    getTotalCandidateCount
} from './state-management/state/candidate-search.state';
import { Store } from '@ngrx/store';
import {
    InitCandidateSearchAction,
    SearchCandidatesAction
} from './state-management/actions/candidate-search.actions';
import { CandidateProfile } from './services/candidate';
import { OccupationOption } from '../shared/reference-service';
import { CantonService } from './services/canton.service';
import { IMultiSelectOption } from 'angular-2-dropdown-multiselect';

@Component({
    selector: 'jr2-candidate-search',
    templateUrl: './candidate-search.component.html',
    styleUrls: ['./candidate-search.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidateSearchComponent {
    searchFilter$: Observable<CandidateSearchFilter>;
    totalCount$: Observable<number>;
    loading$: Observable<boolean>;
    showError$: Observable<boolean>;
    candidateProfileList$: Observable<Array<CandidateProfile>>;
    occupationCode$: Observable<string>;
    occupationName$: Observable<string>;
    residenceFilterString$: Observable<string>;

    constructor(private store: Store<CandidateSearchState>,
                private cantonService: CantonService) {

        this.store.dispatch(new InitCandidateSearchAction());

        this.searchFilter$ = store.select(getSearchFilter);
        this.loading$ = store.select(getLoading);
        this.showError$ = store.select(getSearchError);
        this.totalCount$ = store.select(getTotalCandidateCount);
        this.candidateProfileList$ = store.select(getCandidateProfileList);
        this.occupationCode$ = store.select(getSearchFilter)
            .map(occupationMapper)
            .map((occupation) => occupation.key);
        this.occupationName$ = store.select(getSearchFilter)
            .map(occupationMapper)
            .map((occupation) => occupation.label ? occupation.label : '');
        this.residenceFilterString$ = this.store.select(getSearchFilter)
            .combineLatest(this.cantonService.getCantonOptions())
            .map(([filter, options]) => residenceMapper(filter, options));
    }

    searchCandidates(filter: CandidateSearchFilter): void {
        this.store.dispatch(new SearchCandidatesAction(filter));
    }
}

function occupationMapper(searchFilter: CandidateSearchFilter): OccupationOption {
    return searchFilter.occupation || { key: '', label: '' };
}

function residenceMapper(searchFilter: CandidateSearchFilter, cantonOptions: IMultiSelectOption[]): string {
    const residences = searchFilter.residence;
    if (residences && residences.length > 0) {
        return residences
            .map((residence) => cantonOptions.find((opt) => opt.id === residence).name)
            .join(', ')
    } else {
        return '';
    }
}
