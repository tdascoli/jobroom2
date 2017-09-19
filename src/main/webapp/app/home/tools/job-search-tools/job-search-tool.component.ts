import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { TypeaheadMultiselectModel } from '../../../shared/job-search/typeahead-multiselect/typeahead-multiselect-model';
import { OccupationService } from '../../../shared/job-search/service/occupation.service';
import { LocalityService } from '../../../shared/job-search/service/locality.service';
import {
    LocalityInputType,
    LocalitySuggestion
} from '../../../shared/job-search/service/locality-autocomplete';

@Component({
    selector: 'jr2-job-search-tool',
    templateUrl: './job-search-tool.component.html',
    styleUrls: ['./job-search-tool.component.scss']
})
export class JobSearchToolComponent implements OnInit {
    jobSearchForm: FormGroup;
    fetchOccupationSuggestions = (prefix: string): Observable<TypeaheadMultiselectModel[]> => this.occupationService.fetchSuggestions(prefix);
    fetchLocalitySuggestions = (prefix: string): Observable<TypeaheadMultiselectModel[]> => this.localityService.fetchSuggestions(prefix);

    constructor(private router: Router,
                private occupationService: OccupationService,
                private localityService: LocalityService,
                private fb: FormBuilder) {
    }

    ngOnInit(): void {
        this.jobSearchForm = this.fb.group({
            baseQuery: [[]],
            localityQuery: [[]]
        });
    }

    handleLocalitySelect(locality: LocalitySuggestion) {
        const currentLocality = new TypeaheadMultiselectModel(LocalityInputType.LOCALITY, String(locality.communalCode), locality.city, 0);
        const ctrl = this.jobSearchForm.get('localityQuery');
        const exists = !!ctrl.value.find((i: TypeaheadMultiselectModel) => currentLocality.equals(i));

        if (!exists) {
            ctrl.setValue([...ctrl.value, currentLocality]);
        }
    }

    search() {
        this.router.navigate(['/job-search']);
    }
}
