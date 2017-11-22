import { Injectable, NgModule } from '@angular/core';
import { CanActivate, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { Principal } from '../shared/auth/principal.service';

@Injectable()
export class PEAGuard implements CanActivate {

    constructor(private principal: Principal) {
    }

    canActivate() {
        return this.principal.identity()
            .then((account) =>
                this.principal.hasAnyAuthority(['ROLE_PRIVATE_EMPLOYMENT_AGENT']));
    }
}

const routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [PEAGuard],
        data: { pageTitle: 'dashboard-title' }
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
