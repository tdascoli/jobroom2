import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { OccupationService } from '../../shared/reference-service/occupation.service';
import { CandidateSearchFilter } from '../state-management/state/candidate-search.state';
import { Graduation, GreaterRegion } from '../services/candidate-search-request';
import { MAX_CANDIDATE_LIST_SIZE } from '../../app.constants';
import { OccupationSuggestion } from '../../shared/reference-service/occupation-autocomplete';

@Component({
    selector: 'jr2-candidate-search-toolbar',
    templateUrl: './candidate-search-toolbar.component.html',
    styleUrls: ['./candidate-search-toolbar.component.scss']
})

export class CandidateSearchToolbarComponent implements OnInit, OnDestroy {

    @Input() totalCount: number;
    @Input() loading: boolean;
    @Input() searchFilter: CandidateSearchFilter;
    @Output() searchCandidates = new EventEmitter<CandidateSearchFilter>();

    maxCandidateListSize: number = MAX_CANDIDATE_LIST_SIZE;
    graduationOptions = Graduation;
    greaterRegions = GreaterRegion;

    toolbarForm: FormGroup;

    constructor(private occupationService: OccupationService,
                private fb: FormBuilder) {
    }

    ngOnInit() {
        this.toolbarForm = this.fb.group({
            occupation: [this.searchFilter.occupation],
            residence: [this.searchFilter.residence],
            graduation: [this.searchFilter.graduation]
        });
    }

    ngOnDestroy(): void {
    }

    fetchOccupationSuggestions = (prefix$: Observable<string>) => prefix$
        .filter((prefix: string) => prefix.length > 2)
        .switchMap((prefix: string) => this.occupationService.getOccupations(prefix));

    occupationFormatter = (occupation: OccupationSuggestion) => occupation.name;

    search(formValue: any): void {
        this.searchCandidates.emit(formValue);
    }
}
