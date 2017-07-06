import { Component, OnInit } from '@angular/core';

enum Tab {
    Jobs,
    JobOffers,
    Candidates
}

enum CandidateTab {
    Search,
    JobPublication
}

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: [
        'home.scss'
    ]

})
export class HomeComponent {
    Tab: typeof Tab = Tab;
    tab: Tab;

    CandidateTab: typeof CandidateTab = CandidateTab;
    candidateTab: CandidateTab;

    constructor() {
        this.tab = Tab.Jobs;
        this.candidateTab = CandidateTab.Search;
    }

    select(tab: Tab): void {
        this.tab = tab;
    }

    selectCandidateTab(candidateTab: CandidateTab): void {
        this.candidateTab = candidateTab;
    }
}
