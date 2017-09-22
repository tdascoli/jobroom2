import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateSearchComponent } from './candidate-search.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { candidateSearchReducer } from './state-management/reducers/candidate-search.reducers';
import { CandidateSearchFilterComponent } from './candidate-search-filter/candidate-search-filter.component';
import { JobroomSharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { JhiLanguageService } from 'ng-jhipster';
import { RouterModule } from '@angular/router';
import { CANDIDATE_SEARCH_ROUTES } from './candidate-search.routes';

@NgModule({
    imports: [
        RouterModule.forChild(CANDIDATE_SEARCH_ROUTES),
        StoreModule.forFeature('candidateSearch', candidateSearchReducer),
        EffectsModule.forFeature([]),
        JobroomSharedModule,
        CommonModule,
        ReactiveFormsModule
    ],
    declarations: [
        CandidateSearchComponent,
        CandidateSearchFilterComponent
    ]
})
export class CandidateSearchModule {
    constructor(languageService: JhiLanguageService) {
        languageService.init();
    }
}
