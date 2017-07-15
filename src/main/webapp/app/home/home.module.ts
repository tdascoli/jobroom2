import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JobroomSharedModule, JobSearchSharedModule } from '../shared';
import { HOME_ROUTE, HomeComponent } from './';
import { JobSearchToolComponent } from './tools/job-search-tool.component';

@NgModule({
    imports: [
        JobroomSharedModule,
        JobSearchSharedModule,
        RouterModule.forRoot([HOME_ROUTE], { useHash: true })
    ],
    declarations: [
        HomeComponent,
        JobSearchToolComponent
    ],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JobroomHomeModule {
}
