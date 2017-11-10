import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JobroomSharedModule } from '../../shared';
import {
    OrganizationComponent,
    OrganizationDeleteDialogComponent,
    OrganizationDeletePopupComponent,
    OrganizationDetailComponent,
    OrganizationDialogComponent,
    OrganizationPopupComponent,
    organizationPopupRoute,
    OrganizationPopupService,
    OrganizationResolvePagingParams,
    organizationRoute,
    OrganizationService,
} from './';

const ENTITY_STATES = [
    ...organizationRoute,
    ...organizationPopupRoute,
];

@NgModule({
    imports: [
        JobroomSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        OrganizationComponent,
        OrganizationDetailComponent,
        OrganizationDialogComponent,
        OrganizationDeleteDialogComponent,
        OrganizationPopupComponent,
        OrganizationDeletePopupComponent,
    ],
    entryComponents: [
        OrganizationComponent,
        OrganizationDialogComponent,
        OrganizationPopupComponent,
        OrganizationDeleteDialogComponent,
        OrganizationDeletePopupComponent,
    ],
    providers: [
        OrganizationService,
        OrganizationPopupService,
        OrganizationResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JobroomOrganizationModule {
}
