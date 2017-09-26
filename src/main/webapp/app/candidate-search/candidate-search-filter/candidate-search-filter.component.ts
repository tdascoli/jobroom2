import { Component, Input, OnInit } from '@angular/core';
import {
    CandidateSearchFilter,
    CandidateSearchState
} from '../state-management/state/candidate-search.state';
import { FormBuilder, FormGroup } from '@angular/forms';
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
import { OccupationSuggestion } from '../../shared/job-search/service/occupation-autocomplete';
import { OccupationService } from '../../shared/job-search/service/occupation.service';

@Component({
    selector: 'jr2-candidate-search-filter',
    templateUrl: './candidate-search-filter.component.html',
    styles: []
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

    constructor(private occupationService: OccupationService,
                private store: Store<CandidateSearchState>,
                private fb: FormBuilder) {
    }

    ngOnInit(): void {
        this.filterForm = this.fb.group({
            occupation: [this.searchFilter.occupation],
            residence: [this.searchFilter.residence],
            skills: [[...this.searchFilter.skills]],
            experience: [this.searchFilter.experience],
            workplace: [this.searchFilter.workplace],
            availability: [this.searchFilter.availability],
            workload: [this.searchFilter.workload],
            workForm: [this.searchFilter.workForm],
            educationLevel: [this.searchFilter.educationLevel],
            graduation: [this.searchFilter.graduation],
            drivingLicenceCategory: [this.searchFilter.drivingLicenceCategory],
            languageSkills: [[...this.searchFilter.languageSkills]]
        });
    }

    fetchOccupationSuggestions = (prefix$: Observable<string>) => prefix$
        .filter((prefix: string) => prefix.length > 2)
        .switchMap((prefix: string) => this.occupationService.getOccupations(prefix));

    occupationFormatter = (occupation: OccupationSuggestion) => occupation.name;
}
