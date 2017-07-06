import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobSearchRoutingModule } from './job-search-routing.module';
import { JobroomSharedModule } from '../shared';
import { JobSearchComponent } from './job-search.component';
import { JobSearchToolbarComponent } from './job-search-toolbar/job-search-toolbar.component';
import { JobSearchFilterComponent } from './job-search-filter/job-search-filter.component';
import { JobSearchListItemComponent } from './job-search-list-item/job-search-list-item.component';

@NgModule({
    imports: [
        JobroomSharedModule,
        CommonModule,
        JobSearchRoutingModule
    ],
    declarations: [JobSearchComponent, JobSearchToolbarComponent, JobSearchFilterComponent, JobSearchListItemComponent],
})
export class JobSearchModule {
}
