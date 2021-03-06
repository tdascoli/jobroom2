import {
    AfterViewInit,
    Component,
    HostListener,
    Inject,
    Input,
    OnDestroy
} from '@angular/core';
import { CandidateProfile } from '../services/candidate';
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
    @Input() occupationCodes: Array<string>;
    @Input() occupationNames: Array<string>;
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
        this.subscription = this.store
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
        } else {
            key += '.many';
        }

        const occupationName = this.occupationNames.join(', ');
        if (occupationName && occupationName.length > 0) {
            key += '.with-query';
        }

        if (this.residenceFilterString && this.residenceFilterString.length > 0) {
            key += '.with-locality';
        }

        return key;
    }

    getMaxCount() {
        return this.totalCount;
    }

    onScroll(event: any) {
        this.store.dispatch(new LoadNextPageAction());
    }
}
