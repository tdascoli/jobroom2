import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import {
    CandidateSearchToolState,
    getActiveAgencyTabId,
    getActiveCompanyTabId,
    getActiveToolbarItem,
    getCandidateSearchToolState,
    getJobSearchToolState,
    HomeState,
    JobSearchToolState
} from './state-management';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ToolbarItem, CompaniesTab, AgenciesTab } from './state-management/state/layout.state';
import { Router } from '@angular/router';

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: [
        'home.scss'
    ]
})
export class HomeComponent {
    ToolbarItem: typeof ToolbarItem = ToolbarItem;
    CompaniesTab: typeof CompaniesTab = CompaniesTab;
    AgenciesTab: typeof AgenciesTab = AgenciesTab;

    activeToolbarItem$: Observable<ToolbarItem>;
    jobSearchToolModel$: Observable<JobSearchToolState>;
    candidateSearchToolModel$: Observable<CandidateSearchToolState>;
    activeCompanyTabId$: Observable<string>;
    activeAgencyTabId$: Observable<string>;

    constructor(private store: Store<HomeState>,
                private router: Router) {
        this.jobSearchToolModel$ = store.select(getJobSearchToolState);
        this.candidateSearchToolModel$ = store.select(getCandidateSearchToolState);
        this.activeToolbarItem$ = store.select(getActiveToolbarItem);
        this.activeCompanyTabId$ = store.select(getActiveCompanyTabId);
        this.activeAgencyTabId$ = store.select(getActiveAgencyTabId);
    }

    selectCompaniesTab(event: NgbTabChangeEvent): void {
        const url = event.nextId === CompaniesTab.JOB_PUBLICATION ? '/companies/jobpublication' : '/companies/candidates';
        this.router.navigate([url]);
    }

    selectRecruitmentAgenciesTab(event: NgbTabChangeEvent): void {
        const url = event.nextId === AgenciesTab.CANDIDATE_SEARCH ? '/agents/candidates' : '/agents/jobpublication';
        this.router.navigate([url]);
    }
}
