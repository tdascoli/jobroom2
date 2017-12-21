import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { JobPublicationDetailComponent } from './job-publication-detail/job-publication-detail.component';
import { JobPublicationDetailGuard } from './job-publication-detail/job-publication-detail.guard';
import { PeaDashboardGuard } from './pea-dashboard/pea-dashboard.guard';

const routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [PeaDashboardGuard],
        data: { pageTitle: 'dashboard.title' }
    },
    {
        path: 'job-publication-detail/:id',
        component: JobPublicationDetailComponent,
        canActivate: [JobPublicationDetailGuard],
        data: { pageTitle: 'job-publication-details.title' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [
        JobPublicationDetailGuard,
        PeaDashboardGuard
    ]
})
export class DashboardRoutingModule {

}
