import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CandidateSearchComponent } from './candidate-search.component';
import { CandidateDetailComponent } from './candidate-detail/candidate-detail.component';
import { CandidateDetailResolver } from './candidate-detail/candidate-detail.resolver';

const routes: Routes = [
    {
        path: 'candidate-search',
        component: CandidateSearchComponent,
        data: {
            authorities: [],
            pageTitle: 'candidate-search.title'
        }
    },
    {
        path: 'candidate-search/:id',
        component: CandidateDetailComponent,
        resolve: {
            candidateProfile: CandidateDetailResolver
        },
        data: {
            authorities: [],
            pageTitle: 'candidate-search.title'
        }
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidateSearchRoutingModule {
}
