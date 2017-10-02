import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { TypeaheadMultiselectModel } from '../../../shared/input-components';
import { OccupationService } from '../../../shared/reference-service/occupation.service';
import { LocalityService } from '../../../shared/reference-service/locality.service';
import {
    LocalityInputType,
    LocalitySuggestion
} from '../../../shared/reference-service/locality-autocomplete';
import { JobSearchToolSubmittedAction } from '../../state-management';
import { Store } from '@ngrx/store';
import { JobSearchToolState } from '../../state-management/state/job-search-tool.state';

@Component({
    selector: 'jr2-job-search-tool',
    templateUrl: './job-search-tool.component.html',
    styleUrls: ['./job-search-tool.component.scss']
})
export class JobSearchToolComponent implements OnInit {
    @Input() jobSearchToolModel;

    jobSearchForm: FormGroup;
    fetchOccupationSuggestions = (prefix: string): Observable<TypeaheadMultiselectModel[]> => this.occupationService.fetchSuggestions(prefix);
    fetchLocalitySuggestions = (prefix: string): Observable<TypeaheadMultiselectModel[]> => this.localityService.fetchSuggestions(prefix);

    constructor(private occupationService: OccupationService,
                private localityService: LocalityService,
                private store: Store<JobSearchToolState>,
                private fb: FormBuilder) {
    }

    ngOnInit(): void {
        this.jobSearchForm = this.fb.group({
            baseQuery: [[...this.jobSearchToolModel.baseQuery]],
            localityQuery: [[...this.jobSearchToolModel.localityQuery]]
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

    search(formValue: any) {
        this.store.dispatch(new JobSearchToolSubmittedAction(formValue));
    }
}
