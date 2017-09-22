import { Component, Input, OnInit } from '@angular/core';
import {
    CandidateSearchFilter,
    CandidateSearchState
} from '../state-management/state/candidate-search.state';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Graduation, GreaterRegion } from '../services/candidate-search-request';

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
    filterForm: FormGroup;

    constructor(private store: Store<CandidateSearchState>,
                private fb: FormBuilder) {
    }

    ngOnInit(): void {
        this.filterForm = this.fb.group({
            occupation: [this.searchFilter.occupation],
            residence: [this.searchFilter.residence],
            graduation: [this.searchFilter.graduation]
        });
    }
}
