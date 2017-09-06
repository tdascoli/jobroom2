import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
    ContractType,
    JobSearchState
} from '../../state-management/state/job-search.state';
import { FilterChangedAction } from '../../state-management/actions/job-search.actions';
import { JobSearchFilter } from '../../state-management/index';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

export class SelectItem {
    constructor(public value: any, public name: string) {
    }
}

export const SORT_DATE_ASC = 'registrationDate,asc';
export const SORT_DATE_DESC = 'registrationDate,desc';
export const MIN_COMPANY_LENGTH = 2;
export const COMPANY_DEBOUNCE_TIME = 500;

@Component({
    selector: 'jr2-job-search-filter',
    templateUrl: './job-search-filter.component.html',
    styles: []
})
export class JobSearchFilterComponent implements OnInit, OnDestroy {
    @Input() searchFilter: JobSearchFilter;

    filterForm: FormGroup;
    companyName: FormControl;
    contractTypeOptions: Array<SelectItem>;
    sortOptions: Array<SelectItem>;

    private subscription: Subscription;

    constructor(private store: Store<JobSearchState>,
                private fb: FormBuilder) {

        this.contractTypeOptions = Object.keys(ContractType)
            .filter((key: any) => typeof ContractType[key] === 'number')
            .map((key: any) => new SelectItem(ContractType[key], key));

        this.sortOptions = [
            new SelectItem(null, 'relevance'),
            new SelectItem(SORT_DATE_DESC, 'date-desc'),
            new SelectItem(SORT_DATE_ASC, 'date-asc')
        ];
    }

    ngOnInit(): void {
        this.filterForm = this.fb.group({
            contractType: [this.searchFilter.contractType],
            workingTime: [this.searchFilter.workingTime],
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

    uncapFirst(value: string): string {
        return value.charAt(0).toLowerCase() + value.slice(1);
    }
}
