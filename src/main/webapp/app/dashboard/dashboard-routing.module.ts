import { Injectable, NgModule } from '@angular/core';
import { CanActivate, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { Principal } from '../shared/auth/principal.service';
import { JobPublicationDetailComponent } from './job-publication-detail/job-publication-detail.component';
import { JobPublicationDetailResolver } from './job-publication-detail/job-publication-detail.resolver';

@Injectable()
export class PEAGuard implements CanActivate {

    constructor(private principal: Principal) {
    }

    canActivate() {
        return this.principal.identity()
            .then((account) =>
                this.principal.hasAnyAuthority(['ROLE_PRIVATE_EMPLOYMENT_AGENT',
                    'ROLE_PUBLIC_EMPLOYMENT_SERVICE']));
    }
}

const routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [PEAGuard],
        data: { pageTitle: 'dashboard.title' }
    },
    {
        path: 'job-publication-detail/:id',
        component: JobPublicationDetailComponent,
        canActivate: [],
        resolve: {
            jobPublication: JobPublicationDetailResolver
        },
        data: { pageTitle: 'job-publication-details.title' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [
        PEAGuard
    ]
})
export class DashboardRoutingModule {

}
