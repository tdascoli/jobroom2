import { Component, Input, OnInit } from '@angular/core';
import { CandidateProfile } from '../services/candidate';
import { MAX_CANDIDATE_LIST_SIZE } from '../../app.constants';
import { Store } from '@ngrx/store';
import {
    CandidateSearchFilter,
    CandidateSearchState
} from '../state-management/state/candidate-search.state';
import {
    HideCandidateListErrorAction,
    LoadNextPageAction
} from '../state-management/actions/candidate-search.actions';

@Component({
    selector: 'jr2-candidate-search-list',
    templateUrl: './candidate-search-list.component.html',
    styles: []
})
export class CandidateSearchListComponent implements OnInit {
    @Input() profileList: Array<CandidateProfile>;
    @Input() totalCount: number;
    @Input() showError: boolean;
    @Input() searchFilter: CandidateSearchFilter;
    occupationName: string;
    occupationCode: string;

    constructor(private store: Store<CandidateSearchState>) {
    }

    ngOnInit(): void {
        const occupation = this.searchFilter.occupation;
        if (occupation) {
            this.occupationCode = occupation.code;
            this.occupationName = occupation.name;
        } else {
            this.occupationName = '';
        }
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
        this.store.dispatch(new LoadNextPageAction());
    }
}
