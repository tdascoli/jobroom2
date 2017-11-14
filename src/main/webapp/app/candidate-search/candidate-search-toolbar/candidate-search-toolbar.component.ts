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
import { CandidateSearchFilter } from '../state-management/state/candidate-search.state';
import { IMultiSelectOption, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import { CantonService } from '../services/canton.service';
import { Subscription } from 'rxjs/Subscription';
import { Graduation } from '../../shared/model/shared-types';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import {
    FormatterFn,
    OccupationPresentationService,
    SuggestionLoaderFn,
} from '../../shared/reference-service/occupation-presentation.service';
import { OccupationSuggestion } from '../../shared/reference-service/occupation-autocomplete';

@Component({
    selector: 'jr2-candidate-search-toolbar',
    templateUrl: './candidate-search-toolbar.component.html',
    styleUrls: ['./candidate-search-toolbar.component.scss']
})

export class CandidateSearchToolbarComponent implements OnInit, OnDestroy {

    @Input() loading: boolean;
    @Input() searchFilter: CandidateSearchFilter;
    @Output() searchCandidates = new EventEmitter<CandidateSearchFilter>();

    @ViewChild(NgbTypeahead) ngbTypeaheadDirective;

    graduations = Graduation;

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

    fetchOccupationSuggestions: SuggestionLoaderFn<Array<OccupationSuggestion>>;
    occupationFormatter: FormatterFn<OccupationSuggestion>;

    private subscription: Subscription;

    constructor(private occupationPresentationService: OccupationPresentationService,
                private cantonService: CantonService,
                private fb: FormBuilder) {
        this.fetchOccupationSuggestions = this.occupationPresentationService.fetchOccupationSuggestions;
        this.occupationFormatter = this.occupationPresentationService.occupationFormatter;
    }

    ngOnInit() {
        this.residence = this.fb.control(this.searchFilter.residence);
        this.toolbarForm = this.fb.group({
            occupation: [this.searchFilter.occupation],
            graduation: [this.searchFilter.graduation]
        });

        this.cantonOptions$ = this.cantonService.getCantonOptions();

        // todo: Review this:
        // Residence input triggers a value change event on language change,
        // that's why distinctUntilChanged is used.
        const residence$ = this.residence.valueChanges
            .distinctUntilChanged()
            .map((residence: string) => Object.assign(this.toolbarForm.value, { residence }));

        this.subscription = Observable.merge(this.toolbarForm.valueChanges, residence$)
            .filter((formValue: any) => !formValue.occupation || formValue.occupation.code)
            .subscribe((formValue: any) =>
                this.search(formValue)
            );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    clearInvalidValue(event: any) {
        const occupationControl = this.toolbarForm.get('occupation');
        const value = occupationControl.value;
        if (value && value.code === undefined) {
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
