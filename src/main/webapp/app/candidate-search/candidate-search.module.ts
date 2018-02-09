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
import { LanguageSkillService } from './services/language-skill.service';
import { CandidateSearchToolbarComponent } from './candidate-search-toolbar/candidate-search-toolbar.component';
import { JobSearchSharedModule } from '../shared/job-search/job-search-shared.module';
import { CandidateDetailComponent } from './candidate-detail/candidate-detail.component';
import { CandidateService } from './services/candidate.service';
import { DetailsPagePaginationEffects } from '../shared/components/details-page-pagination/state-management/effects/details-page-pagination.effects';
import { ClipboardModule } from 'ngx-clipboard';
import { CandidateSearchListComponent } from './candidate-search-list/candidate-search-list.component';
import { CandidateSearchListItemComponent } from './candidate-search-list-item/candidate-search-list-item.component';
import { CandidateSearchEffects } from './state-management/effects/candidate-search.effects';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { CantonService } from './services/canton.service';
import { RouterEffects } from './state-management/effects/router.effects';

@NgModule({
    imports: [
        StoreModule.forFeature('candidateSearch', candidateSearchReducer),
        EffectsModule.forFeature([
            CandidateSearchEffects,
            DetailsPagePaginationEffects,
            RouterEffects]),
        JobroomSharedModule,
        CommonModule,
        ReactiveFormsModule,
        CandidateSearchRoutingModule,
        JobSearchSharedModule,
        ClipboardModule,
        MultiselectDropdownModule
    ],
    declarations: [
        CandidateSearchListComponent,
        CandidateSearchListItemComponent,
        CandidateSearchComponent,
        CandidateSearchFilterComponent,
        CandidateSearchToolbarComponent,
        CandidateDetailComponent
    ],
    providers: [
        LanguageSkillService,
        CandidateService,
        CantonService
    ]
})
export class CandidateSearchModule {
}
