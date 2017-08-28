import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
    ContractType,
    JobSearchState
} from '../../state-management/state/job-search.state';
import { FilterChangedAction } from '../../state-management/actions/job-search.actions';
import { JobSearchFilter } from '../../state-management/index';
import { Subscription } from 'rxjs/Subscription';

export class SelectItem {
    constructor(public value: any, public name: string) {
    }
}

@Component({
    selector: 'jr2-job-search-filter',
    templateUrl: './job-search-filter.component.html',
    styles: []
})
export class JobSearchFilterComponent implements OnInit, OnDestroy {
    @Input() searchFilter: JobSearchFilter;

    filterForm: FormGroup;
    contractTypeOptions: Array<SelectItem>;

    private subscription: Subscription;

    constructor(private store: Store<JobSearchState>,
                private fb: FormBuilder) {

        this.contractTypeOptions = Object.keys(ContractType)
            .filter((key: any) => typeof ContractType[key] === 'number')
            .map((key: any) => new SelectItem(ContractType[key], key));
    }

    ngOnInit(): void {
        this.filterForm = this.fb.group({
            contractType: [this.searchFilter.contractType],
            workingTime: [this.searchFilter.workingTime],
            sort: [this.searchFilter.sort]
        });

        this.subscription = this.filterForm.valueChanges.subscribe((formValue: any) =>
            this.store.dispatch(new FilterChangedAction(formValue))
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    uncapFirst(value: string): string {
        return value.charAt(0).toLowerCase() + value.slice(1);
    }
}
