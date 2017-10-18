import { Component, Input } from '@angular/core';
import { CandidateProfile } from '../services/candidate';
import { Store } from '@ngrx/store';
import { CandidateSearchState } from '../state-management/state/candidate-search.state';
import { SelectCandidateProfileAction } from '../state-management/actions/candidate-search.actions';

@Component({
    selector: 'jr2-candidate-search-list-item',
    templateUrl: './candidate-search-list-item.component.html',
    styles: []
})
export class CandidateSearchListItemComponent {
    @Input() profile: CandidateProfile;
    // fixme: Implement candidate list item

    constructor(private store: Store<CandidateSearchState>) {
    }
}
