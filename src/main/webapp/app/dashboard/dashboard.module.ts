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
import { JobPublicationDetailComponent } from './job-publication-detail/job-publication-detail.component';
import { JobPublicationDetailResolver } from './job-publication-detail/job-publication-detail.resolver';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JobPublicationCancelDialogComponent } from './dialogs/job-publication-cancel-dialog.component';
import { JobPublicationCancelDialogService } from './dialogs/job-publication-cancel-dialog.service';

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
        PeaDashboardComponent,
        JobPublicationDetailComponent,
        JobPublicationCancelDialogComponent
    ],
    providers: [
        JobPublicationDetailResolver,
        NgbActiveModal,
        JobPublicationCancelDialogService
    ],
    entryComponents: [
        JobPublicationCancelDialogComponent
    ]
})
export class DashboardModule {
}
