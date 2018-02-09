import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CandidateSearchComponent } from './candidate-search.component';
import { CandidateDetailComponent } from './candidate-detail/candidate-detail.component';
import { CandidateDetailGuard } from './candidate-detail/candidate-detail.guard';

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
        path: 'candidate-detail/:id',
        component: CandidateDetailComponent,
        canActivate: [CandidateDetailGuard],
        data: {
            authorities: [],
            pageTitle: 'candidate-search.title'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [CandidateDetailGuard]
})
export class CandidateSearchRoutingModule {
}
