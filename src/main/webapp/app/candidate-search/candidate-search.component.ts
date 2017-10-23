import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Location } from '@angular/common';
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
import { OccupationSuggestion } from '../shared/reference-service/occupation-autocomplete';
import { CantonService } from './services/canton.service';
import { IMultiSelectOption } from 'angular-2-dropdown-multiselect';
import { getSearchByUrlParams } from './state-management/state/candidate-search.state';

@Component({
    selector: 'jr2-candidate-search',
    templateUrl: './candidate-search.component.html',
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidateSearchComponent implements OnInit, OnDestroy {
    searchFilter$: Observable<CandidateSearchFilter>;
    totalCount$: Observable<number>;
    loading$: Observable<boolean>;
    showError$: Observable<boolean>;
    candidateProfileList$: Observable<Array<CandidateProfile>>;
    occupationCode$: Observable<string>;
    occupationName$: Observable<string>;
    residenceFilterString$: Observable<string>;

    private subscription;

    constructor(private store: Store<CandidateSearchState>,
                private cantonService: CantonService,
                private location: Location) {

        this.store.dispatch(new InitCandidateSearchAction());

        this.searchFilter$ = store.select(getSearchFilter);
        this.loading$ = store.select(getLoading);
        this.showError$ = store.select(getSearchError);
        this.totalCount$ = store.select(getTotalCandidateCount);
        this.candidateProfileList$ = store.select(getCandidateProfileList);
        this.occupationCode$ = store.select(getSearchFilter)
            .map(occupationMapper)
            .map((occupation) => occupation.code);
        this.occupationName$ = store.select(getSearchFilter)
            .map(occupationMapper)
            .map((occupation) => occupation.name);
        this.residenceFilterString$ = this.store.select(getSearchFilter)
            .combineLatest(this.cantonService.getCantonOptions())
            .map(([filter, options]) => residenceMapper(filter, options));
    }

    ngOnInit(): void {
        this.subscription = this.store.select(getSearchByUrlParams).subscribe((searchByUrlParams: boolean) => {
                if (searchByUrlParams) {
                    this.location.replaceState('/candidate-search');
                }
            }
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    searchCandidates(filter: CandidateSearchFilter): void {
        this.store.dispatch(new SearchCandidatesAction(filter));
    }
}

function occupationMapper(searchFilter: CandidateSearchFilter): OccupationSuggestion {
    return searchFilter.occupation || { code: '', name: '' };
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
