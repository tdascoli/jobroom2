import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {
    CandidateSearchFilter,
    CandidateSearchState,
    getSearchFilter
} from '../state-management/state/candidate-search.state';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import {
    CantonSuggestion,
    LocalityAutocomplete,
    LocalityInputType,
    LocalityService,
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

@Component({
    selector: 'jr2-candidate-search-filter',
    templateUrl: './candidate-search-filter.component.html',
    styleUrls: ['./candidate-search-filter.component.scss']
})
export class CandidateSearchFilterComponent implements OnInit, OnDestroy {
    @Input() searchFilter: CandidateSearchFilter;

    @Input()
    set reset(value: number) {
        if (value && this.filterForm) {
            this.filterForm.reset({
                graduation: this.searchFilter.graduation,
                experience: this.searchFilter.experience,
                workplace: this.searchFilter.workplace,
                availability: this.searchFilter.availability,
                workload: this.searchFilter.workload,
                workForm: this.searchFilter.workForm,
                educationLevel: this.searchFilter.educationLevel,
                drivingLicenceCategory: this.searchFilter.drivingLicenceCategory,
                languageSkills: [...this.searchFilter.languageSkills || []]
            });

        }
    };

    @Output() searchCandidates = new EventEmitter<CandidateSearchFilter>();

    graduations = Graduation;
    experiences = Experience;
    availabilities = Availability;
    educationLevels = ISCED_1997;
    workForms = WorkForm;
    drivingLicenceCategories = DrivingLicenceCategory;
    filterForm: FormGroup;
    candidateSearchUrl$: Observable<string>;

    private formChangesSubscription: Subscription;

    constructor(private languageSkillService: LanguageSkillService,
                private localityService: LocalityService,
                private fb: FormBuilder,
                private store: Store<CandidateSearchState>,
                private candidateService: CandidateService) {
    }

    ngOnInit(): void {
        this.filterForm = this.fb.group({
            graduation: [this.searchFilter.graduation],
            experience: [this.searchFilter.experience],
            workplace: [this.searchFilter.workplace],
            availability: [this.searchFilter.availability],
            workload: [this.searchFilter.workload],
            workForm: [this.searchFilter.workForm],
            educationLevel: [this.searchFilter.educationLevel],
            drivingLicenceCategory: [this.searchFilter.drivingLicenceCategory],
            languageSkills: [[...this.searchFilter.languageSkills || []]]
        });

        this.formChangesSubscription = this.filterForm.valueChanges.subscribe((formValue: any) => {
                const searchFilter = Object.assign({}, this.searchFilter, formValue);
                this.searchCandidates.emit(searchFilter)
            }
        );

        this.candidateSearchUrl$ = this.store.select(getSearchFilter)
            .map((filter: CandidateSearchFilter) =>
                `${window.location.href}/?searchFilter=${this.candidateService.encodeURISearchFilter(filter)}`);
    }

    ngOnDestroy(): void {
        this.formChangesSubscription.unsubscribe();
    }

    getLanguageOptions(): Observable<Array<string>> {
        return this.languageSkillService.getLanguages();
    }

    fetchLocalitySuggestions = (prefix: string) =>
        this.localityService.fetchSuggestions(prefix, customLocalityAutocompleteMapper);
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
