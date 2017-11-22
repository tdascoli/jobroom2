import { NgModule } from '@angular/core';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { PeaDashboardComponent } from './pea-dashboard/pea-dashboard.component';

@NgModule({
    imports: [
        DashboardRoutingModule
    ],
    declarations: [
        DashboardComponent,
        PeaDashboardComponent
    ],
    providers: []
})
export class DashboardModule {

}
