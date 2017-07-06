import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobSearchComponent } from './job-search.component';

const routes: Routes = [
    {
        path: '',
        component: JobSearchComponent,
        data: {
            authorities: [],
            pageTitle: 'job-search.title'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class JobSearchRoutingModule {
}
