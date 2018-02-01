import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { TypeaheadMultiselectModel } from '../../../shared/input-components';
import { OccupationPresentationService } from '../../../shared/reference-service';
import { LocalityService } from '../../../shared/reference-service/locality.service';
import {
    LocalityInputType,
    LocalitySuggestion
} from '../../../shared/reference-service/locality-autocomplete';
import { JobSearchToolSubmittedAction } from '../../state-management';
import { Store } from '@ngrx/store';
import { JobSearchToolState } from '../../state-management/state/job-search-tool.state';
import { Subscription } from 'rxjs/Subscription';
import {
    JobSearchToolCountAction,
    ResetJobSearchToolCountAction
} from '../../state-management/actions/job-search-tool.actions';

@Component({
    selector: 'jr2-job-search-tool',
    templateUrl: './job-search-tool.component.html',
    styleUrls: ['./job-search-tool.component.scss']
})
export class JobSearchToolComponent implements OnInit, OnDestroy {
    @Input() jobSearchToolModel: JobSearchToolState;

    jobSearchForm: FormGroup;
    private subscription: Subscription;

    fetchOccupationSuggestions = (prefix: string): Observable<TypeaheadMultiselectModel[]> =>
        this.occupationPresentationService.fetchJobSearchOccupationSuggestions(prefix);
    fetchLocalitySuggestions = (prefix: string): Observable<TypeaheadMultiselectModel[]> =>
        this.localityService.fetchSuggestions(prefix);

    constructor(private occupationPresentationService: OccupationPresentationService,
                private localityService: LocalityService,
                private store: Store<JobSearchToolState>,
                private fb: FormBuilder) {
    }

    ngOnInit(): void {
        this.jobSearchForm = this.fb.group({
            baseQuery: [[...this.jobSearchToolModel.baseQuery]],
            localityQuery: [[...this.jobSearchToolModel.localityQuery]]
        });

        this.subscription = this.jobSearchForm.valueChanges
            .distinctUntilChanged()
            .subscribe((formValue) => this.filterChanged(formValue));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
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

    getBadgeKey() {
        const totalCount = this.jobSearchToolModel.totalCount;

        let key = 'home.tools.job-search.search-badge';
        if (totalCount === 0) {
            key += '.none';
        } else if (totalCount === 1) {
            key += '.one';
        } else {
            key += '.many';
        }

        return key;
    }

    private filterChanged(formValue: any): void {
        const { baseQuery, localityQuery } = formValue;
        const onlineSince = this.jobSearchToolModel.onlineSince;
        const isFilterSelected = !!baseQuery.length || !!localityQuery.length;

        if (isFilterSelected) {
            const payload = Object.assign({}, formValue, { onlineSince });
            this.store.dispatch(new JobSearchToolCountAction(payload));
        } else {
            this.store.dispatch(new ResetJobSearchToolCountAction());
        }
    }
}
