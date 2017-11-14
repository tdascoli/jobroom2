import { AfterViewInit, Component, HostListener, Input, OnDestroy } from '@angular/core';
import { Job } from '../services';
import { Store } from '@ngrx/store';
import { JobSearchState, LoadNextPageAction } from '../state-management';
import { Observable } from 'rxjs/Observable';
import {
    getJobListScrollY,
    getSearchError
} from '../state-management/state/job-search.state';
import {
    HideJobListErrorAction,
    SaveScrollYAction
} from '../state-management/actions/job-search.actions';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'jr2-job-search-list',
    templateUrl: './job-search-list.component.html',
    styles: []
})
export class JobSearchListComponent implements OnDestroy, AfterViewInit {
    @Input() jobList: Array<Job>;
    @Input() totalCount: number;
    @Input() baseQueryString: string;
    @Input() localityQueryString: string;

    displayError$: Observable<boolean>;

    private subscription: Subscription;
    private scrollY = 0;

    @HostListener('window:scroll')
    private saveScrollY() {
        this.scrollY = window.scrollY;
    }

    constructor(private store: Store<JobSearchState>) {
        this.displayError$ = store.select(getSearchError);
        this.subscription = this.store
            .select(getJobListScrollY)
            .subscribe((scrollY: number) => {
                this.scrollY = scrollY;
            });
    }

    ngAfterViewInit(): void {
        window.scroll(0, this.scrollY);
    }

    ngOnDestroy(): void {
        this.store.dispatch(new SaveScrollYAction(this.scrollY));

        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    closeAlert() {
        this.store.dispatch(new HideJobListErrorAction());
    }

    onScroll(event: any) {
        this.store.dispatch(new LoadNextPageAction());
    }

    getTitleKey() {
        let key = 'job-search.job-search-list.title';

        if (this.totalCount === 0) {
            key += '.none';
        } else if (this.totalCount === 1) {
            key += '.one';
        } else {
            key += '.other';
        }

        if (this.localityQueryString.length > 0) {
            key += '.with-locality';
        } else {
            key += '.without-locality';
        }

        return key;
    }

    getMaxCount() {
        return this.totalCount;
    }
}
