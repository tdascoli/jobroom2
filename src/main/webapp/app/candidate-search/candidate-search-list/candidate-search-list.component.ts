import {
    AfterViewInit,
    Component,
    HostListener,
    Inject,
    Input,
    OnDestroy
} from '@angular/core';
import { CandidateProfile } from '../services/candidate';
import { MAX_CANDIDATE_LIST_SIZE } from '../../app.constants';
import { Store } from '@ngrx/store';
import {
    CandidateSearchState,
    getCandidateListScrollY
} from '../state-management/state/candidate-search.state';
import {
    HideCandidateListErrorAction,
    LoadNextPageAction,
    SaveScrollYAction
} from '../state-management/actions/candidate-search.actions';
import { Subscription } from 'rxjs/Subscription';
import { WINDOW } from '../../shared/shared-libs.module';

@Component({
    selector: 'jr2-candidate-search-list',
    templateUrl: './candidate-search-list.component.html',
    styles: []
})
export class CandidateSearchListComponent implements OnDestroy, AfterViewInit {
    @Input() profileList: Array<CandidateProfile>;
    @Input() totalCount: number;
    @Input() showError: boolean;
    @Input() occupationCode: string;
    @Input() occupationName: string;
    @Input() residenceFilterString: string;

    private subscription: Subscription;
    private scrollY: number;

    @HostListener('window:scroll')
    private saveScrollY() {
        this.scrollY = this.window.scrollY;
    }

    constructor(private store: Store<CandidateSearchState>,
                @Inject(WINDOW)
                private window: Window) {
        const subscription = this.store
            .select(getCandidateListScrollY)
            .subscribe((scrollY: number) => {
                this.scrollY = scrollY;
            });
    }

    ngOnDestroy(): void {
        this.store.dispatch(new SaveScrollYAction(this.scrollY));

        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    ngAfterViewInit(): void {
        this.window.scroll(0, this.scrollY);
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

        if (this.residenceFilterString.length > 0) {
            key += '.with-locality';
        } else {
            key += '.without-locality';
        }

        return key;
    }

    getMaxCount() {
        return Math.min(this.totalCount, MAX_CANDIDATE_LIST_SIZE);
    }

    onScroll(event: any) {
        this.store.dispatch(new LoadNextPageAction());
    }
}
