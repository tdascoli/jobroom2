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
import { ActivatedRoute, Router } from '@angular/router';
import { JobPublication } from '../shared/job-publication/job-publication.model';
import { UserData } from './tools/job-publication-tool/service/user-data-resolver.service';

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
    jobPublication$: Observable<JobPublication>;
    userData$: Observable<UserData>;

    constructor(private store: Store<HomeState>,
                private route: ActivatedRoute,
                private router: Router) {
        this.jobSearchToolModel$ = store.select(getJobSearchToolState);
        this.candidateSearchToolModel$ = store.select(getCandidateSearchToolState);
        this.activeToolbarItem$ = store.select(getActiveToolbarItem);
        this.activeCompanyTabId$ = store.select(getActiveCompanyTabId);
        this.activeAgencyTabId$ = store.select(getActiveAgencyTabId);

        this.jobPublication$ = this.route.data
            .map((data) => data['jobPublication']);

        this.userData$ = this.route.data
            .map((data) => data['userData']);
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
