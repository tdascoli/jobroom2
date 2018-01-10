import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { CandidateSearchToolState } from '../../state-management';
import {
    CandidateSearchToolCountAction,
    CandidateSearchToolSubmittedAction,
    ResetCandidateSearchToolCountAction
} from '../../state-management';
import { Subscription } from 'rxjs/Subscription';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import {
    FormatterFn, LocalityService,
    OccupationOption,
    OccupationPresentationService,
    SuggestionLoaderFn
} from '../../../shared/reference-service';
import { customLocalityAutocompleteMapper } from '../../../candidate-search/candidate-search-filter/candidate-search-filter.component';

@Component({
    selector: 'jr2-candidate-search-tool',
    templateUrl: './candidate-search-tool.component.html',
    styleUrls: ['./candidate-search-tool.component.scss']
})
export class CandidateSearchToolComponent implements OnInit, OnDestroy {

    @Input() candidateSearchToolModel: CandidateSearchToolState;

    @Input()
    set reset(value: number) {
        if (value && this.candidateSearchForm) {
            this.candidateSearchForm.reset({
                occupation: this.candidateSearchToolModel.occupation,
                workplace: this.candidateSearchToolModel.workplace,
                skills: [...this.candidateSearchToolModel.skills || []]
            });

        }
    };

    @ViewChild(NgbTypeahead) ngbTypeaheadDirective;

    private subscription: Subscription;

    candidateSearchForm: FormGroup;

    fetchOccupationSuggestions: SuggestionLoaderFn<Array<OccupationOption>>;
    occupationFormatter: FormatterFn<OccupationOption>;

    constructor(private occupationPresentationService: OccupationPresentationService,
                private store: Store<CandidateSearchToolState>,
                private fb: FormBuilder,
                private localityService: LocalityService) {
        this.fetchOccupationSuggestions = this.occupationPresentationService.fetchCandidateSearchOccupationSuggestions;
        this.occupationFormatter = this.occupationPresentationService.occupationFormatter;
    }

    ngOnInit(): void {
        this.candidateSearchForm = this.fb.group({
            occupation: [this.candidateSearchToolModel.occupation],
            workplace: [this.candidateSearchToolModel.workplace],
            skills: [[...this.candidateSearchToolModel.skills || []]]
        });

        this.subscription = this.candidateSearchForm.valueChanges
            .distinctUntilChanged()
            .filter((formValue: any) => !formValue.occupation || formValue.occupation.key)
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
        if (value && value.key === undefined) {
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

    fetchLocalitySuggestions = (prefix: string) =>
        this.localityService.fetchSuggestions(prefix, customLocalityAutocompleteMapper);

    private filterChanged(formValue: any) {
        const { occupation, workplace, skills } = formValue;
        const isFilterSelected = (occupation && occupation.key)
            || (workplace && workplace.model)
            || (skills && skills.length);

        if (isFilterSelected) {
            this.store.dispatch(new CandidateSearchToolCountAction(formValue));
        } else {
            this.store.dispatch(new ResetCandidateSearchToolCountAction());
        }
    }
}
