import { Component, OnInit } from '@angular/core';
import { ToolsTab } from './tools-content/tools-content.component';

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

    constructor() {
        this.toolbarTab = ToolbarTab.JobSeekers;
    }

    select(toolbarTab: ToolbarTab): void {
        this.toolbarTab = toolbarTab;
    }
}
