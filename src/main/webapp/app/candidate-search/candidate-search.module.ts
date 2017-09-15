import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CandidateSearchRoutingModule } from './candidate-search-routing.module';
import { CandidateSearchComponent } from './candidate-search.component';

@NgModule({
  imports: [
    CommonModule,
    CandidateSearchRoutingModule
  ],
  declarations: [CandidateSearchComponent]
})
export class CandidateSearchModule { }
