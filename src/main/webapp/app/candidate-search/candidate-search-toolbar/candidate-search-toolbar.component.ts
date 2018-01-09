import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import {
    CandidateSearchFilter,
} from '../state-management/state/candidate-search.state';
import { IMultiSelectOption, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import { CantonService } from '../services/canton.service';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import {
    FormatterFn,
    OccupationOption,
    OccupationPresentationService,
    SuggestionLoaderFn,
} from '../../shared/reference-service';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'jr2-candidate-search-toolbar',
    templateUrl: './candidate-search-toolbar.component.html',
    styleUrls: ['./candidate-search-toolbar.component.scss']
})

export class CandidateSearchToolbarComponent implements OnInit, OnDestroy {

    @Input() loading: boolean;
    @Input() searchFilter: CandidateSearchFilter;

    @Input()
    set reset(value: number) {
        if (value && this.toolbarForm && this.residence) {
            this.toolbarForm.reset({
                occupation: this.searchFilter.occupation,
                skills: [...this.searchFilter.skills || []],
            });
            this.residence.reset(this.searchFilter.residence, { emitEvent: false });
        }
    };

    @Output() searchCandidates = new EventEmitter<CandidateSearchFilter>();

    @ViewChild(NgbTypeahead) ngbTypeaheadDirective;

    cantonOptions$: Observable<IMultiSelectOption[]>;
    multiSelectSettings: IMultiSelectSettings = {
        buttonClasses: 'form-control form-control-lg custom-select',
        containerClasses: '',
        checkedStyle: 'fontawesome',
        isLazyLoad: true,
        dynamicTitleMaxItems: 1
    };

    toolbarForm: FormGroup;
    residence: FormControl;

    fetchOccupationSuggestions: SuggestionLoaderFn<Array<OccupationOption>>;
    occupationFormatter: FormatterFn<OccupationOption>;

    private unsubscribe$ = new Subject<void>();

    constructor(private occupationPresentationService: OccupationPresentationService,
                private cantonService: CantonService,
                private fb: FormBuilder) {
        this.fetchOccupationSuggestions = this.occupationPresentationService.fetchCandidateSearchOccupationSuggestions;
        this.occupationFormatter = this.occupationPresentationService.occupationFormatter;
    }

    ngOnInit() {
        this.residence = this.fb.control(this.searchFilter.residence);
        this.toolbarForm = this.fb.group({
            occupation: [this.searchFilter.occupation],
            skills: [[...this.searchFilter.skills || []]],
        });

        this.cantonOptions$ = this.cantonService.getCantonOptions();

        // todo: Review this:
        // Residence input triggers a value change event on language change,
        // that's why distinctUntilChanged is used.
        const residence$ = this.residence.valueChanges
            .distinctUntilChanged()
            .map((residence: string) => Object.assign(this.toolbarForm.value, { residence }));

        Observable.merge(this.toolbarForm.valueChanges, residence$)
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
