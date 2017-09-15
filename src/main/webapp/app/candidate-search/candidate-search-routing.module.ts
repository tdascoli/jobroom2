import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CandidateSearchComponent } from './candidate-search.component';

const routes: Routes = [
    {
        path: 'candidate-search',
        component: CandidateSearchComponent,
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
