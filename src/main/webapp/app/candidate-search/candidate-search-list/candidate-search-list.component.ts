import { Component, Input } from '@angular/core';
import { CandidateProfile } from '../services/candidate';
import { MAX_CANDIDATE_LIST_SIZE } from '../../app.constants';
import { Store } from '@ngrx/store';
import { CandidateSearchState } from '../state-management/state/candidate-search.state';
import { HideCandidateListErrorAction } from '../state-management/actions/candidate-search.actions';

@Component({
    selector: 'jr2-candidate-search-list',
    templateUrl: './candidate-search-list.component.html',
    styles: []
})
export class CandidateSearchListComponent {
    @Input() profileList: Array<CandidateProfile>;
    @Input() totalCount: number;
    @Input() showError: boolean;
    @Input() occupationName: string;

    constructor(private store: Store<CandidateSearchState>) {
    }

    closeAlert() {
        this.store.dispatch(new HideCandidateListErrorAction());
    }

    getTitleKey() {
        let key = 'candidate-search.candidate-search-list.title';

        if (this.totalCount === 0) {
            key += '.none';
        } else if (this.totalCount === 1) {
            key += '.one';
        } else if (this.totalCount > MAX_CANDIDATE_LIST_SIZE) {
            key += '.many';
        } else {
            key += '.other';
        }

        // fixme: What should we have to use workplace or residence for the title?
        key += '.without-locality';

        return key;
    }

    getMaxCount() {
        return Math.min(this.totalCount, MAX_CANDIDATE_LIST_SIZE);
    }

    onScroll(event: any) {
        // todo: Implement infinite scrolling (https://alv-ch.atlassian.net/browse/JR2-319)
    }
}
