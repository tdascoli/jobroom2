import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
    LocalityService,
    LocalitySuggestion,
    OccupationPresentationService
} from '../../shared/reference-service';
import { Store } from '@ngrx/store';
import { JobSearchState, ToolbarChangedAction } from '../state-management';
import { FormBuilder, FormGroup } from '@angular/forms';
import { JobSearchQuery } from '../state-management/state/job-search.state';
import { Subscription } from 'rxjs/Subscription';
import { LocalityInputType } from '../../shared/reference-service/locality-autocomplete';
import { TypeaheadMultiselectModel } from '../../shared/input-components';

@Component({
    selector: 'jr2-job-search-toolbar',
    templateUrl: './job-search-toolbar.component.html',
    styleUrls: ['./job-search-toolbar.component.scss']
})
export class JobSearchToolbarComponent implements OnInit, OnDestroy {
    @Input() loading: boolean;
    @Input() searchQuery: JobSearchQuery;

    toolbarForm: FormGroup;

    private subscription: Subscription;

    constructor(private occupationPresentationService: OccupationPresentationService,
                private localityService: LocalityService,
                private store: Store<JobSearchState>,
                private fb: FormBuilder) {
    }

    ngOnInit(): void {
        this.toolbarForm = this.fb.group({
            baseQuery: [[...this.searchQuery.baseQuery]],
            localityQuery: [[...this.searchQuery.localityQuery]]
        });

        this.subscription = this.toolbarForm.valueChanges.subscribe((formValue: any) =>
            this.search(formValue)
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    search(formValue: any) {
        this.store.dispatch(new ToolbarChangedAction(formValue));
    }

    handleLocalitySelect(locality: LocalitySuggestion) {
        const currentLocality = new TypeaheadMultiselectModel(LocalityInputType.LOCALITY, String(locality.communalCode), locality.city, 0);
        const ctrl = this.toolbarForm.get('localityQuery');
        const exists = !!ctrl.value.find((i: TypeaheadMultiselectModel) => currentLocality.equals(i));

        if (!exists) {
            ctrl.setValue([...ctrl.value, currentLocality]);
        }
    }

    fetchOccupationSuggestions = (query: string): Observable<TypeaheadMultiselectModel[]> =>
        this.occupationPresentationService.fetchJobSearchOccupationSuggestions(query);

    fetchLocalitySuggestions = (query: string): Observable<TypeaheadMultiselectModel[]> =>
        this.localityService.fetchSuggestions(query);
}
