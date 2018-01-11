import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
    ContractType,
    JobSearchState,
    Sort
} from '../../state-management/state/job-search.state';
import { FilterChangedAction } from '../../state-management/actions/job-search.actions';
import { JobSearchFilter } from '../../state-management/index';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

export const MIN_COMPANY_LENGTH = 2;
export const COMPANY_DEBOUNCE_TIME = 500;

@Component({
    selector: 'jr2-job-search-filter',
    templateUrl: './job-search-filter.component.html',
    styleUrls: ['./job-search-filter.component.scss']
})
export class JobSearchFilterComponent implements OnInit, OnDestroy {
    isFilterCollapsed: boolean;
    @Input() searchFilter: JobSearchFilter;

    @Input()
    set reset(value: number) {
        if (value && this.filterForm && this.companyName) {
            this.filterForm.reset({
                contractType: this.searchFilter.contractType,
                workingTime: this.searchFilter.workingTime,
                onlineSince: this.searchFilter.onlineSince,
                sort: this.searchFilter.sort
            });
            this.companyName.reset(this.searchFilter.companyName, { emitEvent: false });
        }
    };

    filterForm: FormGroup;
    companyName: FormControl;
    contractTypes = ContractType;
    sortOptions = Sort;

    private subscription: Subscription;

    constructor(private store: Store<JobSearchState>,
                private fb: FormBuilder) {
        // todo review if the isFilterCollapsed should be part of the CandidateSearchState or not
        this.isFilterCollapsed = true;
    }

    ngOnInit(): void {
        this.filterForm = this.fb.group({
            contractType: [this.searchFilter.contractType],
            workingTime: [this.searchFilter.workingTime],
            onlineSince: [this.searchFilter.onlineSince],
            sort: [this.searchFilter.sort]
        });

        this.companyName = this.fb.control(this.searchFilter.companyName);

        const filterForm$ = this.filterForm.valueChanges
            .map((formValue: any) => Object.assign(formValue, { companyName: this.companyName.value }));

        const companyName$ = this.companyName.valueChanges
            .filter((value: string) => value.length >= MIN_COMPANY_LENGTH || value.length === 0)
            .debounceTime(COMPANY_DEBOUNCE_TIME)
            .distinctUntilChanged()
            .map((companyName: string) => Object.assign(this.filterForm.value, { companyName }));

        this.subscription = Observable.merge(filterForm$, companyName$)
            .subscribe((filterValue: JobSearchFilter) =>
                this.store.dispatch(new FilterChangedAction(filterValue)));
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    toggleFilter() {
        this.isFilterCollapsed = !this.isFilterCollapsed;
    }
}
