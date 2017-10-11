import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CandidateSearchRoutingModule } from './candidate-search-routing.module';
import { CandidateSearchComponent } from './candidate-search.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { candidateSearchReducer } from './state-management/reducers/candidate-search.reducers';
import { CandidateSearchFilterComponent } from './candidate-search-filter/candidate-search-filter.component';
import { JobroomSharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LanguageSelectorComponent } from './language-selector/language-selector.component';
import { LanguageSkillService } from './services/language-skill.service';
import { CandidateSearchToolbarComponent } from './candidate-search-toolbar/candidate-search-toolbar.component';
import { JobSearchSharedModule } from '../shared/job-search/job-search-shared.module';
import { CandidateDetailComponent } from './candidate-detail/candidate-detail.component';
import { CandidateDetailResolver } from './candidate-detail/candidate-detail.resolver';
import { CandidateService } from './services/candidate.service';
import { WorkPeriodComponent } from './work-period/work-period.component';

@NgModule({
    imports: [
        StoreModule.forFeature('candidateSearch', candidateSearchReducer),
        EffectsModule.forFeature([]),
        JobroomSharedModule,
        CommonModule,
        ReactiveFormsModule,
        CandidateSearchRoutingModule,
        JobSearchSharedModule
    ],
    declarations: [
        CandidateSearchComponent,
        CandidateSearchFilterComponent,
        LanguageSelectorComponent,
        CandidateSearchToolbarComponent,
        CandidateDetailComponent,
        WorkPeriodComponent
    ],
    providers: [
        LanguageSkillService,
        CandidateDetailResolver,
        CandidateService
    ]
})
export class CandidateSearchModule {
}
