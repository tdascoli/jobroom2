import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import {
    getActiveAgencyTabId,
    getActiveCompanyTabId,
    getActiveToolbarItem,
    getJobSearchToolState,
    HomeState,
    JobSearchToolState
} from './state-management';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap/tabset/tabset.module';
import {
    SelectAgencyTabAction,
    SelectCompanyTabAction,
    SelectToolbarItemAction
} from './state-management/actions/layout.actions';
import { ToolbarItem } from './state-management/state/layout.state';

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: [
        'home.scss'
    ]
})
export class HomeComponent {
    ToolbarItem: typeof ToolbarItem = ToolbarItem;

    activeToolbarItem$: Observable<ToolbarItem>;
    jobSearchToolModel$: Observable<JobSearchToolState>;
    activeCompanyTabId$: Observable<string>;
    activeAgencyTabId$: Observable<string>;

    constructor(private store: Store<HomeState>) {
        this.jobSearchToolModel$ = store.select(getJobSearchToolState);
        this.activeToolbarItem$ = store.select(getActiveToolbarItem);
        this.activeCompanyTabId$ = store.select(getActiveCompanyTabId);
        this.activeAgencyTabId$ = store.select(getActiveAgencyTabId);
    }

    selectToolbarItem(toolbarItem: ToolbarItem): void {
        this.store.dispatch(new SelectToolbarItemAction(toolbarItem));
    }

    selectCompaniesTab(event: NgbTabChangeEvent): void {
        this.store.dispatch(new SelectCompanyTabAction(event.nextId));
    }

    selectRecruitmentAgenciesTab(event: NgbTabChangeEvent): void {
        this.store.dispatch(new SelectAgencyTabAction(event.nextId));
    }
}
