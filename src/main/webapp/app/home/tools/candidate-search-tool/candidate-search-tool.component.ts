import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { OccupationService } from '../../../shared/job-search/service/occupation.service';
import { LocalityService } from '../../../shared/job-search/service/locality.service';
import { TypeaheadMultiselectModel } from '../../../shared/job-search/typeahead-multiselect/typeahead-multiselect-model';
import {
    Availability, DrivingLicenceCategory, Experience, Graduation, GreaterRegion,
    ISCED_1997,
    WorkForm
} from '../../../candidate-search/services/candidate-search-request';

@Component({
    selector: 'jr2-candidate-search-tool',
    templateUrl: './candidate-search-tool.component.html'
})
export class CandidateSearchToolComponent implements OnInit {
    candidateSearchForm: FormGroup;

    greaterRegions = GreaterRegion;
    experiences = Experience;
    availabilities = Availability;
    educations = ISCED_1997;
    workForms = WorkForm;
    graduations = Graduation;
    drivingLicenceCategories = DrivingLicenceCategory;

    constructor(private occupationService: OccupationService,
                private localityService: LocalityService,
                private router: Router,
                private fb: FormBuilder) {
    }

    ngOnInit(): void {
        this.candidateSearchForm = this.fb.group({
            occupation: [],
            workLocation: []
        });
    }

    fetchOccupationSuggestions = (prefix: string): Observable<TypeaheadMultiselectModel[]> => this.occupationService.getOccupations(prefix);
    fetchLocalitySuggestions = (prefix: string): Observable<TypeaheadMultiselectModel[]> => this.localityService.fetchSuggestions(prefix);

    search() {
        this.router.navigate(['/candidate-search']);
    }
}
