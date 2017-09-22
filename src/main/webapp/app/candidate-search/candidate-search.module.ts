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

@NgModule({
    imports: [
        StoreModule.forFeature('candidateSearch', candidateSearchReducer),
        EffectsModule.forFeature([]),
        JobroomSharedModule,
        CommonModule,
        ReactiveFormsModule,
        CandidateSearchRoutingModule
    ],
    declarations: [
        CandidateSearchComponent,
        CandidateSearchFilterComponent
    ]
})
export class CandidateSearchModule {
}
