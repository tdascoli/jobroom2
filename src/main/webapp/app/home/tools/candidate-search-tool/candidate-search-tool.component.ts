import {
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
    CandidateSearchToolCountAction,
    CandidateSearchToolState,
    CandidateSearchToolSubmittedAction,
    ResetCandidateSearchToolCountAction
} from '../../state-management';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import {
    LocalityService,
    OccupationPresentationService
} from '../../../shared/reference-service';
import { customLocalityAutocompleteMapper } from '../../../candidate-search/candidate-search-filter/candidate-search-filter.component';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { TypeaheadMultiselectModel } from '../../../shared/input-components/typeahead/typeahead-multiselect-model';

@Component({
    selector: 'jr2-candidate-search-tool',
    templateUrl: './candidate-search-tool.component.html',
    styleUrls: ['./candidate-search-tool.component.scss']
})
export class CandidateSearchToolComponent implements OnInit, OnDestroy, OnChanges {

    @Input() candidateSearchToolModel: CandidateSearchToolState;
    @ViewChild(NgbTypeahead) ngbTypeaheadDirective;

    private unsubscribe$: Subject<void> = new Subject();

    candidateSearchForm: FormGroup;

    fetchOccupationSuggestions = (prefix: string): Observable<TypeaheadMultiselectModel[]> =>
        this.occupationPresentationService.fetchCandidateSearchOccupationSuggestions(prefix);

    constructor(private occupationPresentationService: OccupationPresentationService,
                private store: Store<CandidateSearchToolState>,
                private fb: FormBuilder,
                private localityService: LocalityService) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        const model = changes['candidateSearchToolModel'];
        if (model && !model.isFirstChange()) {
            const { occupations } = model.currentValue;
            this.candidateSearchForm.get('occupations').patchValue(occupations, { emitEvent: false });
        }
    }

    ngOnInit(): void {
        this.candidateSearchForm = this.fb.group({
            occupations: [[...this.candidateSearchToolModel.occupations || []]],
            workplace: [this.candidateSearchToolModel.workplace],
            skills: [[...this.candidateSearchToolModel.skills || []]]
        });

        this.candidateSearchForm.valueChanges
            .distinctUntilChanged()
            .takeUntil(this.unsubscribe$)
            .subscribe((formValue: any) => this.filterChanged(formValue));
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
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
        const { occupations, workplace, skills } = formValue;
        const isFilterSelected = (occupations && occupations.length > 0)
            || (workplace && workplace.model)
            || (skills && skills.length);

        if (isFilterSelected) {
            this.store.dispatch(new CandidateSearchToolCountAction(formValue));
        } else {
            this.store.dispatch(new ResetCandidateSearchToolCountAction());
        }
    }
}
