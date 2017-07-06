import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JobroomSharedModule } from '../shared';

import { HOME_ROUTE, HomeComponent } from './';
import { JobSearchComponent } from './tools/job-search.component';

@NgModule({
    imports: [
        JobroomSharedModule,
        RouterModule.forRoot([ HOME_ROUTE ], { useHash: true })
    ],
    declarations: [
        HomeComponent,
        JobSearchComponent
    ],
    entryComponents: [
    ],
    providers: [
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JobroomHomeModule {}
