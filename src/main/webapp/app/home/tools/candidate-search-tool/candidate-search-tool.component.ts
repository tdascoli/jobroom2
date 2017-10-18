import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { OccupationService } from '../../../shared/reference-service/occupation.service';
import { Graduation } from '../../../candidate-search/services/candidate-search-request';
import { Store } from '@ngrx/store';
import { CandidateSearchToolState } from '../../state-management/state/candidate-search-tool.state';
import { CandidateSearchToolSubmittedAction } from '../../state-management/actions/candidate-search-tool.actions';
import { OccupationSuggestion } from '../../../shared/reference-service/occupation-autocomplete';
import { IMultiSelectOption, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import { CantonService } from '../../../candidate-search/services/canton.service';

@Component({
    selector: 'jr2-candidate-search-tool',
    templateUrl: './candidate-search-tool.component.html',
    styleUrls: ['./candidate-search-tool.component.scss']
})
export class CandidateSearchToolComponent implements OnInit {

    @Input() candidateSearchToolModel: CandidateSearchToolState;

    candidateSearchForm: FormGroup;
    graduations = Graduation;
    cantonOptions$: Observable<IMultiSelectOption[]>;
    multiSelectSettings: IMultiSelectSettings = {
        buttonClasses: 'form-control custom-select',
        containerClasses: '',
        checkedStyle: 'fontawesome',
        isLazyLoad: true,
        dynamicTitleMaxItems: 1
    };

    constructor(private occupationService: OccupationService,
                private store: Store<CandidateSearchToolState>,
                private cantonService: CantonService,
                private fb: FormBuilder) {
    }

    ngOnInit(): void {
        this.candidateSearchForm = this.fb.group({
            occupation: [this.candidateSearchToolModel.occupation],
            residence: [this.candidateSearchToolModel.residence],
            graduation: [this.candidateSearchToolModel.graduation]
        });
        this.cantonOptions$ = this.cantonService.getCantonOptions();
    }

    fetchOccupationSuggestions = (prefix$: Observable<string>) => prefix$
        .filter((prefix: string) => prefix.length > 2)
        .switchMap((prefix: string) => this.occupationService.getOccupations(prefix));

    occupationFormatter = (occupation: OccupationSuggestion) => occupation.name;

    search(formValue: any) {
        this.store.dispatch(new CandidateSearchToolSubmittedAction(formValue));
    }
}
