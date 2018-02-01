import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
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
import {
    AgenciesTab,
    CompaniesTab,
    ToolbarItem
} from './state-management/state/layout.state';
import { ActivatedRoute, Router } from '@angular/router';
import { JobPublication } from '../shared/job-publication/job-publication.model';
import { UserData } from './tools/job-publication-tool/service/user-data-resolver.service';
import { Subscription } from 'rxjs/Subscription';

const BACKGROUND_CLASS_NAME_ARRAY = [];
BACKGROUND_CLASS_NAME_ARRAY[ToolbarItem.JOB_SEEKERS] = 'background--jobseeker';
BACKGROUND_CLASS_NAME_ARRAY[ToolbarItem.COMPANIES] = 'background--companies';
BACKGROUND_CLASS_NAME_ARRAY[ToolbarItem.RECRUITMENT_AGENCIES] = 'background--pea';

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: [
        'home.scss'
    ]
})
export class HomeComponent implements OnInit, OnDestroy {
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
    isSubnavCollapsed: boolean;

    private subscription: Subscription;

    constructor(private store: Store<HomeState>,
                private route: ActivatedRoute,
                private router: Router,
                private renderer: Renderer2) {
        this.jobSearchToolModel$ = store.select(getJobSearchToolState);
        this.candidateSearchToolModel$ = store.select(getCandidateSearchToolState);
        this.activeToolbarItem$ = store.select(getActiveToolbarItem);
        this.activeCompanyTabId$ = store.select(getActiveCompanyTabId);
        this.activeAgencyTabId$ = store.select(getActiveAgencyTabId);

        this.isSubnavCollapsed = true;

        this.jobPublication$ = this.route.data
            .map((data) => data['jobPublication']);

        this.userData$ = this.route.data
            .map((data) => data['userData']);
    }

    ngOnInit(): void {
        this.subscription = this.activeToolbarItem$
            .subscribe((toolbarItem: ToolbarItem) =>
                this.addBackGroundClass(BACKGROUND_CLASS_NAME_ARRAY[toolbarItem]));
    }

    ngOnDestroy(): void {
        this.removeAllBackgroundClass();
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    selectCompaniesTab(event: NgbTabChangeEvent): void {
        const url = event.nextId === CompaniesTab.JOB_PUBLICATION ? '/companies/jobpublication' : '/companies/candidates';
        this.router.navigate([url]);
    }

    selectRecruitmentAgenciesTab(event: NgbTabChangeEvent): void {
        const url = event.nextId === AgenciesTab.CANDIDATE_SEARCH ? '/agents/candidates' : '/agents/jobpublication';
        this.router.navigate([url]);
    }

    toggleSubnavbar() {
        this.isSubnavCollapsed = !this.isSubnavCollapsed;
    }

    collapseSubnavbar() {
        this.isSubnavCollapsed = true;
    }

    private addBackGroundClass(className: string) {
        this.removeAllBackgroundClass();
        if (className) {
            this.renderer.addClass(document.body, className);
        }
    }

    private removeAllBackgroundClass(exclude = null) {
        BACKGROUND_CLASS_NAME_ARRAY
            .forEach((className) => this.renderer.removeClass(document.body, className));
    }
}
