import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {
    CandidateSearchFilter,
    CandidateSearchState,
    getSearchFilter
} from '../state-management/state/candidate-search.state';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import {
    CantonSuggestion,
    LocalityAutocomplete,
    LocalityInputType,
    LocalitySuggestion
} from '../../shared/reference-service';
import { LanguageSkillService } from '../services/language-skill.service';
import { Subscription } from 'rxjs/Subscription';
import { TypeaheadMultiselectModel } from '../../shared/input-components';
import { CandidateService } from '../services/candidate.service';
import { Store } from '@ngrx/store';
import {
    Availability,
    DrivingLicenceCategory,
    Experience, Graduation,
    ISCED_1997,
    WorkForm
} from '../../shared';
import { IMultiSelectOption, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import { CantonService } from '../services/canton.service';

@Component({
    selector: 'jr2-candidate-search-filter',
    templateUrl: './candidate-search-filter.component.html',
    styleUrls: ['./candidate-search-filter.component.scss']
})
export class CandidateSearchFilterComponent implements OnInit, OnDestroy {
    isFilterCollapsed: boolean;
    @Input() searchFilter: CandidateSearchFilter;

    @Output() searchCandidates = new EventEmitter<CandidateSearchFilter>();

    graduations = Graduation;
    experiences = Experience;
    availabilities = Availability;
    educationLevels = ISCED_1997;
    workForms = WorkForm;
    drivingLicenceCategories = DrivingLicenceCategory;
    filterForm: FormGroup;
    candidateSearchUrl$: Observable<string>;
    cantonOptions$: Observable<IMultiSelectOption[]>;

    residence: FormControl;

    multiSelectSettings: IMultiSelectSettings = {
        buttonClasses: 'form-control form-control-sm custom-select',
        containerClasses: '',
        checkedStyle: 'fontawesome',
        isLazyLoad: true,
        dynamicTitleMaxItems: 1
    };

    private formChangesSubscription: Subscription;

    constructor(private languageSkillService: LanguageSkillService,
                private fb: FormBuilder,
                private store: Store<CandidateSearchState>,
                private cantonService: CantonService,
                private candidateService: CandidateService) {
        // todo review if the isFilterCollapsed should be part of the CandidateSearchState or not
        this.isFilterCollapsed = true;
    }

    ngOnInit(): void {
        this.residence = this.fb.control(this.searchFilter.residence);
        this.filterForm = this.fb.group({
            graduation: [this.searchFilter.graduation],
            experience: [this.searchFilter.experience],
            availability: [this.searchFilter.availability],
            workload: [this.searchFilter.workload],
            workForm: [this.searchFilter.workForm],
            educationLevel: [this.searchFilter.educationLevel],
            drivingLicenceCategory: [this.searchFilter.drivingLicenceCategory],
            languageSkills: [[...this.searchFilter.languageSkills || []]]
        });

        this.cantonOptions$ = this.cantonService.getCantonOptions();

        // todo: Review this:
        // Residence input triggers a value change event on language change,
        // that's why distinctUntilChanged is used.
        const residence$ = this.residence.valueChanges
            .distinctUntilChanged()
            .map((residence: string) => Object.assign(this.filterForm.value, { residence }));

        this.formChangesSubscription = Observable.merge(this.filterForm.valueChanges, residence$)
            .subscribe((formValue: any) => {
                const searchFilter = Object.assign({}, this.searchFilter, formValue);
                this.searchCandidates.emit(searchFilter)
            }
        );

        this.candidateSearchUrl$ = this.store.select(getSearchFilter)
            .map((filter: CandidateSearchFilter) =>
                `${window.location.href}/?searchFilter=${this.candidateService.encodeURISearchFilter(filter)}`)
            .map((url) => encodeURIComponent(url));
    }

    ngOnDestroy(): void {
        this.formChangesSubscription.unsubscribe();
    }

    getLanguageOptions(): Observable<Array<string>> {
        return this.languageSkillService.getLanguages();
    }

    toggleFilter() {
        this.isFilterCollapsed = !this.isFilterCollapsed;
    }
}

export function customLocalityAutocompleteMapper(localityAutocomplete: LocalityAutocomplete): TypeaheadMultiselectModel[] {
    const localities = localityAutocomplete.localities
        .map((o: LocalitySuggestion) =>
            new TypeaheadMultiselectModel(LocalityInputType.LOCALITY, `${o.cantonCode}:${o.regionCode}`, o.city, 0));

    const cantons = localityAutocomplete.cantons
        .map((o: CantonSuggestion) =>
            new TypeaheadMultiselectModel(LocalityInputType.CANTON, String(o.code), o.name + ' (' + o.code + ')', 1));

    return [...localities, ...cantons];
}
