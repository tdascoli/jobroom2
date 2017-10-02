import { Component, Input, OnInit } from '@angular/core';
import {
    CandidateSearchFilter,
    CandidateSearchState
} from '../state-management/state/candidate-search.state';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
    Availability,
    DrivingLicenceCategory,
    Experience,
    Graduation,
    GreaterRegion,
    ISCED_1997,
    WorkForm
} from '../services/candidate-search-request';
import { Observable } from 'rxjs/Observable';
import { OccupationSuggestion } from '../../shared/reference-service/occupation-autocomplete';
import { OccupationService } from '../../shared/reference-service/occupation.service';
import { LocalityService } from '../../shared/reference-service/locality.service';
import { LanguageSkillService } from '../services/language-skill.service';
import { isNullOrUndefined } from 'util';

@Component({
    selector: 'jr2-candidate-search-filter',
    templateUrl: './candidate-search-filter.component.html',
    styleUrls: ['./candidate-search-filter.component.scss']
})
export class CandidateSearchFilterComponent implements OnInit {
    @Input()
    searchFilter: CandidateSearchFilter;

    greaterRegions = GreaterRegion;
    graduations = Graduation;
    experiences = Experience;
    availabilities = Availability;
    educationLevels = ISCED_1997;
    workForms = WorkForm;
    drivingLicenceCategories = DrivingLicenceCategory;

    filterForm: FormGroup;
    occupationControl: FormControl;
    experienceControl: FormControl;
    graduationControl: FormControl;

    constructor(private languageSkillService: LanguageSkillService,
                private occupationService: OccupationService,
                private localityService: LocalityService,
                private store: Store<CandidateSearchState>,
                private fb: FormBuilder) {
    }

    ngOnInit(): void {
        this.occupationControl = new FormControl(this.searchFilter.occupation);
        this.experienceControl = new FormControl(this.searchFilter.experience);
        this.graduationControl = new FormControl(this.searchFilter.graduation);

        this.filterForm = this.fb.group({
            occupation: this.occupationControl,
            residence: [this.searchFilter.residence],
            skills: [[...this.searchFilter.skills]],
            experience: this.experienceControl,
            workplace: [this.searchFilter.workplace],
            availability: [this.searchFilter.availability],
            workload: [this.searchFilter.workload],
            workForm: [this.searchFilter.workForm],
            educationLevel: [this.searchFilter.educationLevel],
            graduation: this.graduationControl,
            drivingLicenceCategory: [this.searchFilter.drivingLicenceCategory],
            languageSkills: [[...this.searchFilter.languageSkills]]
        });
        this.disableDependedFields();
    }

    private disableDependedFields() {
        this.experienceControl.disable();
        this.graduationControl.disable();

        this.occupationControl.valueChanges.subscribe((value) => {
            if (isNullOrUndefined(value)) {
                this.experienceControl.disable();
                this.graduationControl.disable();
            } else {
                this.experienceControl.enable();
                this.graduationControl.enable();
            }
        })
    }

    getLanguageOptions(): Observable<Array<string>> {
        return this.languageSkillService.getLanguages();
    }

    fetchOccupationSuggestions = (prefix$: Observable<string>) => prefix$
        .filter((prefix: string) => prefix.length > 2)
        .switchMap((prefix: string) => this.occupationService.getOccupations(prefix));

    occupationFormatter = (occupation: OccupationSuggestion) => occupation.name;

    fetchLocalitySuggestions = (prefix: string) => this.localityService.fetchSuggestions(prefix)
}
