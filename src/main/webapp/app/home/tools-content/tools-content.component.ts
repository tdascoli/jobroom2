import { Component, Input, OnInit } from '@angular/core';

export enum ToolsTab {
    CandidateSearch,
    JobPublication
}

@Component({
    selector: 'jr2-home-services',
    templateUrl: './tools-content.component.html',
    styles: []
})
export class ToolsContentComponent implements OnInit {
    ToolsTab: typeof ToolsTab = ToolsTab;

    @Input() activeTab: ToolsTab = ToolsTab.JobPublication;

    tabs: Array<any> = [{
        'type' : ToolsTab.CandidateSearch,
        'textKey' : 'home.homeServices.candidateSearchTab'
    }, {
        'type' : ToolsTab.JobPublication,
        'textKey' : 'home.homeServices.jobPublicationTab'
    }];

    constructor() {
    }

    ngOnInit() {
        this.reorganizeTabs();
    }

    selectTab(tab: ToolsTab): void {
        this.activeTab = tab;
    }

    /**
     * Reorganize tabs array, in order to have activeTab (@Input) in the first place
     */
    reorganizeTabs() {
        let i;
        for (i = 0; i < this.tabs.length; i ++) {
            if (this.tabs[i].type === this.activeTab) { break; }
        }
        const defaultTabArray: Array<any> = this.tabs.splice(i, 1);
        this.tabs.splice(0, 0, defaultTabArray[0]);
    }
}
