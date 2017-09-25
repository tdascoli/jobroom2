import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
    LocalityService,
    LocalitySuggestion,
    OccupationService
} from '../../shared/job-search';
import { Store } from '@ngrx/store';
import { JobSearchState, ToolbarChangedAction } from '../state-management';
import { FormBuilder, FormGroup } from '@angular/forms';
import { JobSearchQuery } from '../state-management/state/job-search.state';
import { Subscription } from 'rxjs/Subscription';
import { LocalityInputType } from '../../shared/job-search/service/locality-autocomplete';
import { MAX_JOB_LIST_SIZE } from '../../app.constants';
import { TypeaheadMultiselectModel } from '../../shared/input-components';

@Component({
    selector: 'jr2-job-search-toolbar',
    templateUrl: './job-search-toolbar.component.html',
    styleUrls: ['./job-search-toolbar.component.scss']
})
export class JobSearchToolbarComponent implements OnInit, OnDestroy {
    @Input() totalCount: number;
    @Input() loading: boolean;
    @Input() searchQuery: JobSearchQuery;

    toolbarForm: FormGroup;

    private subscription: Subscription;

    constructor(private occupationService: OccupationService,
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

    fetchOccupationSuggestions = (query: string): Observable<TypeaheadMultiselectModel[]> => this.occupationService.fetchSuggestions(query);

    fetchLocalitySuggestions = (query: string): Observable<TypeaheadMultiselectModel[]> => this.localityService.fetchSuggestions(query);

    getButtonValueKey() {
        let key = 'job-search.toolbar.search-button.title';

        if (this.loading) {
            key += '.loading';
        } else if (this.totalCount === 0) {
            key += '.none';
        } else if (this.totalCount === 1) {
            key += '.one';
        } else if (this.totalCount > MAX_JOB_LIST_SIZE) {
            key += '.many';
        } else {
            key += '.other';
        }

        return key;
    }

    getMaxCount() {
        return Math.min(this.totalCount, MAX_JOB_LIST_SIZE);
    }
}
