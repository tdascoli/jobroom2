import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { CandidateSearchToolState } from '../../state-management/state/candidate-search-tool.state';
import {
    CandidateSearchToolCountAction,
    CandidateSearchToolSubmittedAction,
    ResetCandidateSearchToolCountAction
} from '../../state-management/actions/candidate-search-tool.actions';
import { IMultiSelectOption, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import { CantonService } from '../../../candidate-search/services/canton.service';
import { Subscription } from 'rxjs/Subscription';
import { Graduation } from '../../../shared/model/shared-types';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import {
    FormatterFn,
    OccupationOption,
    OccupationPresentationService,
    SuggestionLoaderFn
} from '../../../shared/reference-service/occupation-presentation.service';

@Component({
    selector: 'jr2-candidate-search-tool',
    templateUrl: './candidate-search-tool.component.html',
    styleUrls: ['./candidate-search-tool.component.scss']
})
export class CandidateSearchToolComponent implements OnInit, OnDestroy {

    @Input() candidateSearchToolModel: CandidateSearchToolState;
    @ViewChild(NgbTypeahead) ngbTypeaheadDirective;

    private subscription: Subscription;

    candidateSearchForm: FormGroup;
    graduations = Graduation;
    cantonOptions$: Observable<IMultiSelectOption[]>;
    multiSelectSettings: IMultiSelectSettings = {
        buttonClasses: 'form-control custom-select',
        containerClasses: '',
        checkedStyle: 'fontawesome',
        isLazyLoad: true,
        dynamicTitleMaxItems: 1
    };

    fetchOccupationSuggestions: SuggestionLoaderFn<Array<OccupationOption>>;
    occupationFormatter: FormatterFn<OccupationOption>;

    constructor(private occupationPresentationService: OccupationPresentationService,
                private store: Store<CandidateSearchToolState>,
                private cantonService: CantonService,
                private fb: FormBuilder) {
        this.fetchOccupationSuggestions = this.occupationPresentationService.fetchOccupationSuggestions;
        this.occupationFormatter = this.occupationPresentationService.occupationFormatter;
    }

    ngOnInit(): void {
        this.candidateSearchForm = this.fb.group({
            occupation: [this.candidateSearchToolModel.occupation],
            residence: [this.candidateSearchToolModel.residence],
            graduation: [this.candidateSearchToolModel.graduation]
        });
        this.cantonOptions$ = this.cantonService.getCantonOptions();

        this.subscription = this.candidateSearchForm.valueChanges
            .distinctUntilChanged()
            .filter((formValue: any) => !formValue.occupation || formValue.occupation.code)
            .subscribe((formValue: any) => this.filterChanged(formValue));
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    clearInvalidValue(event: any) {
        const occupationControl = this.candidateSearchForm.get('occupation');
        const value = occupationControl.value;
        if (value && value.code === undefined) {
            occupationControl.setValue(undefined, {
                emitEvent: true,
            });

            // This hack removes the invalid value from the input field.
            // The idea is from this PR: https://github.com/ng-bootstrap/ng-bootstrap/pull/1468
            //
            // todo: This is duplicated in the CandidateSearchToolbarComponent, we should eventual remove it.
            // todo: We have to review this after updating to the next ng-bootstrap versions.
            this.ngbTypeaheadDirective._userInput = '';
        }
    }

    search(formValue: any) {
        this.store.dispatch(new CandidateSearchToolSubmittedAction(formValue));
    }

    getBadgeKey() {
        const totalCount = this.candidateSearchToolModel.totalCount;

        let key = 'home.tools.candidate-search.search-badge';
        if (totalCount === 0) {
            key += '.none';
        } else if (totalCount === 1) {
            key += '.one';
        } else {
            key += '.many';
        }

        return key;
    }

    private filterChanged(formValue: any) {
        const { occupation, residence, graduation } = formValue;
        const isFilterSelected = (occupation && occupation.code)
            || (residence && residence.length > 0)
            || (graduation != null && graduation >= 0);

        if (isFilterSelected) {
            this.store.dispatch(new CandidateSearchToolCountAction(formValue));
        } else {
            this.store.dispatch(new ResetCandidateSearchToolCountAction());
        }
    }
}
