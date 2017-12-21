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
import { JobPublicationDetailGuard } from './job-publication-detail/job-publication-detail.guard';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JobPublicationCancelDialogComponent } from './dialogs/job-publication-cancel-dialog.component';
import { JobPublicationCancelDialogService } from './dialogs/job-publication-cancel-dialog.service';
import { JobPublicationDetailEffects } from './state-management/effects/job-publication-detail.effects';
import { jobPublicationDetailReducer } from './state-management/reducers/job-publication-detail.reducers';

@NgModule({
    imports: [
        StoreModule.forFeature('dashboard', dashboardReducer),
        StoreModule.forFeature('jobPublicationDetail', jobPublicationDetailReducer),
        EffectsModule.forFeature([DashboardEffects, JobPublicationDetailEffects]),
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
        NgbActiveModal,
        JobPublicationCancelDialogService
    ],
    entryComponents: [
        JobPublicationCancelDialogComponent
    ]
})
export class DashboardModule {
}
