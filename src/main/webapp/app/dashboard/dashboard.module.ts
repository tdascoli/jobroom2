import { NgModule } from '@angular/core';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { PeaDashboardComponent } from './pea-dashboard/pea-dashboard.component';
import { JobroomSharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { JobPublicationDetailComponent } from './job-publication-detail/job-publication-detail.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JobPublicationCancelDialogComponent } from './dialogs/job-publication-cancel-dialog.component';
import { JobPublicationCancelDialogService } from './dialogs/job-publication-cancel-dialog.service';
import { JobPublicationDetailEffects } from './state-management/effects/job-publication-detail.effects';
import { jobPublicationDetailReducer } from './state-management/reducers/job-publication-detail.reducers';
import { PEADashboardEffects } from './state-management/effects/pea-dashboard.effects';
import { peaDashboardReducer } from './state-management/reducers/pea-dashboard.reducers';

@NgModule({
    imports: [
        StoreModule.forFeature('peaDashboard', peaDashboardReducer),
        StoreModule.forFeature('jobPublicationDetail', jobPublicationDetailReducer),
        EffectsModule.forFeature([PEADashboardEffects, JobPublicationDetailEffects]),
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
