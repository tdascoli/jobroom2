import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
    CandidateSearchFilter,
    CandidateSearchState,
} from '../state-management/state/candidate-search.state';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import {
    LocalityService,
    OccupationPresentationService,
} from '../../shared/reference-service';
import { Subject } from 'rxjs/Subject';
import { customLocalityAutocompleteMapper } from '../candidate-search-filter/candidate-search-filter.component';
import { Store } from '@ngrx/store';
import { ResetFilterAction } from '../state-management/actions/candidate-search.actions';
import { Observable } from 'rxjs/Observable';
import { TypeaheadMultiselectModel } from '../../shared/input-components/typeahead/typeahead-multiselect-model';

@Component({
    selector: 'jr2-candidate-search-toolbar',
    templateUrl: './candidate-search-toolbar.component.html',
    styleUrls: ['./candidate-search-toolbar.component.scss']
})

export class CandidateSearchToolbarComponent implements OnInit, OnDestroy, OnChanges {

    @Input() loading: boolean;
    @Input() searchFilter: CandidateSearchFilter;

    @Input()
    set reset(value: number) {
        if (value && this.toolbarForm) {
            this.toolbarForm.reset({
                occupations: [...this.searchFilter.occupations || []],
                skills: [...this.searchFilter.skills || []],
                workplace: this.searchFilter.workplace
            });
        }
    };

    @Output() searchCandidates = new EventEmitter<CandidateSearchFilter>();

    @ViewChild(NgbTypeahead) ngbTypeaheadDirective;

    private unsubscribe$ = new Subject<void>();

    toolbarForm: FormGroup;

    fetchOccupationSuggestions = (prefix: string): Observable<TypeaheadMultiselectModel[]> =>
        this.occupationPresentationService.fetchCandidateSearchOccupationSuggestions(prefix);

    fetchLocalitySuggestions = (prefix: string) =>
        this.localityService.fetchSuggestions(prefix, customLocalityAutocompleteMapper);

    constructor(private occupationPresentationService: OccupationPresentationService,
                private localityService: LocalityService,
                private fb: FormBuilder,
                private store: Store<CandidateSearchState>) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        const model = changes['searchFilter'];
        if (model && !model.isFirstChange()) {
            const { occupations } = model.currentValue;
            this.toolbarForm.get('occupations').patchValue(occupations, { emitEvent: false });
        }
    }

    ngOnInit() {
        this.toolbarForm = this.fb.group({
            occupations: [[...this.searchFilter.occupations || []]],
            skills: [[...this.searchFilter.skills || []]],
            workplace: [this.searchFilter.workplace]
        });

        this.toolbarForm.valueChanges
            .takeUntil(this.unsubscribe$)
            .subscribe((formValue: any) =>
                this.search(formValue)
            );
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    search(formValue: any): void {
        const searchFilter = Object.assign({}, this.searchFilter, formValue);
        this.searchCandidates.emit(searchFilter);
    }

    resetFilters(event: any): void {
        event.preventDefault();
        this.store.dispatch(new ResetFilterAction(new Date().getTime()))
    }
}
