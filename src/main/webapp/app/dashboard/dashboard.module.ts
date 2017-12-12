import { NgModule } from '@angular/core';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { PeaDashboardComponent } from './pea-dashboard/pea-dashboard.component';
import { JobroomSharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { dashboardReducer } from './state-management/reducers/dashboard.reducers';
import { EffectsModule } from '@ngrx/effects';
import { DashboardEffects } from './state-management/effects/dashboard.effects';

@NgModule({
    imports: [
        StoreModule.forFeature('dashboard', dashboardReducer),
        EffectsModule.forFeature([DashboardEffects]),
        JobroomSharedModule,
        ReactiveFormsModule,
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
