import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CandidateSearchRoutingModule } from './candidate-search-routing.module';
import { CandidateSearchComponent } from './candidate-search.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { candidateSearchReducer } from './state-management/reducers/candidate-search.reducers';

@NgModule({
    imports: [
        StoreModule.forFeature('candidateSearch', candidateSearchReducer),
        EffectsModule.forFeature([]),
        CommonModule,
        CandidateSearchRoutingModule
    ],
    declarations: [CandidateSearchComponent]
})
export class CandidateSearchModule {
}
