import { Component } from '@angular/core';
import { ToolsTab } from './tools-content/tools-content.component';
import { Store } from '@ngrx/store';
import { getJobSearchToolState, JobSearchToolState } from './state-management';
import { Observable } from 'rxjs/Observable';

enum ToolbarTab {
    JobSeekers,
    Companies,
    RecruitmentAgencies
}

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: [
        'home.scss'
    ]
})
export class HomeComponent {
    ToolbarTab: typeof ToolbarTab = ToolbarTab;
    ToolsTab: typeof ToolsTab = ToolsTab;

    toolbarTab: ToolbarTab;

    jobSearchToolModel$: Observable<JobSearchToolState>;

    constructor(private store: Store<JobSearchToolState>) {
        this.toolbarTab = ToolbarTab.JobSeekers;
        this.jobSearchToolModel$ = store.select(getJobSearchToolState);
    }

    select(toolbarTab: ToolbarTab): void {
        this.toolbarTab = toolbarTab;
    }
}
