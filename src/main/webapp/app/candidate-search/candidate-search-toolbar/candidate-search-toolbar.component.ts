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
import { CandidateSearchFilter, } from '../state-management/state/candidate-search.state';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import {
    FormatterFn,
    LocalityService,
    OccupationOption,
    OccupationPresentationService,
    SuggestionLoaderFn,
} from '../../shared/reference-service';
import { Subject } from 'rxjs/Subject';
import { customLocalityAutocompleteMapper } from '../candidate-search-filter/candidate-search-filter.component';

@Component({
    selector: 'jr2-candidate-search-toolbar',
    templateUrl: './candidate-search-toolbar.component.html',
    styleUrls: ['./candidate-search-toolbar.component.scss']
})

export class CandidateSearchToolbarComponent implements OnInit, OnDestroy, OnChanges {

    @Input() loading: boolean;
    @Input() searchFilter: CandidateSearchFilter;

    @Output() searchCandidates = new EventEmitter<CandidateSearchFilter>();

    @ViewChild(NgbTypeahead) ngbTypeaheadDirective;

    toolbarForm: FormGroup;

    fetchOccupationSuggestions: SuggestionLoaderFn<Array<OccupationOption>>;
    occupationFormatter: FormatterFn<OccupationOption>;

    private unsubscribe$ = new Subject<void>();

    constructor(private occupationPresentationService: OccupationPresentationService,
                private localityService: LocalityService,
                private fb: FormBuilder) {
        this.fetchOccupationSuggestions = this.occupationPresentationService.fetchCandidateSearchOccupationSuggestions;
        this.occupationFormatter = this.occupationPresentationService.occupationFormatter;
    }

    ngOnChanges(changes: SimpleChanges): void {
        const model = changes['searchFilter'];
        if (model && !model.isFirstChange()) {
            const { occupation } = model.currentValue;
            this.toolbarForm.get('occupation').patchValue(occupation, { emitEvent: false });
        }
    }

    ngOnInit() {
        this.toolbarForm = this.fb.group({
            occupation: [this.searchFilter.occupation],
            skills: [[...this.searchFilter.skills || []]],
            workplace: [this.searchFilter.workplace]
        });

        this.toolbarForm.valueChanges
            .takeUntil(this.unsubscribe$)
            .filter((formValue: any) => !formValue.occupation || formValue.occupation.key)
            .subscribe((formValue: any) =>
                this.search(formValue)
            );
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    fetchLocalitySuggestions = (prefix: string) =>
        this.localityService.fetchSuggestions(prefix, customLocalityAutocompleteMapper);

    clearInvalidValue(event: any) {
        const occupationControl = this.toolbarForm.get('occupation');
        const value = occupationControl.value;
        if (value && value.key === undefined) {
            occupationControl.setValue(undefined, {
                emitEvent: true,
            });

            // This hack removes the invalid value from the input field.
            // The idea is from this PR: https://github.com/ng-bootstrap/ng-bootstrap/pull/1468
            //
            // todo: This is duplicated in the CandidateSearchToolComponent, we should eventual remove it.
            // todo: We have to review this after updating to the next ng-bootstrap versions.
            this.ngbTypeaheadDirective._userInput = '';
        }
    }

    search(formValue: any): void {
        const searchFilter = Object.assign({}, this.searchFilter, formValue);
        this.searchCandidates.emit(searchFilter);
    }
}
