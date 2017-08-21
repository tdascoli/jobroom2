import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobSearchComponent } from './job-search.component';
import { JobDetailComponent } from './job-detail/job-detail.component';

const routes: Routes = [
    {
        path: 'job-search',
        component: JobSearchComponent,
        data: {
            authorities: [],
            pageTitle: 'job-search.title'
        }
    },
    {
        path: 'job-detail/:id',
        component: JobDetailComponent,
        data: {
            authorities: [],
            pageTitle: 'job-detail.title'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class JobSearchRoutingModule {
}
