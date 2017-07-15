import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobSearchRoutingModule } from './job-search-routing.module';
import { JobroomSharedModule, JobSearchSharedModule } from '../shared';
import { JobSearchComponent } from './job-search.component';
import { JobSearchToolbarComponent } from './job-search-toolbar/job-search-toolbar.component';
import { JobSearchFilterComponent } from './job-search-filter/job-search-filter.component';
import { JobSearchListItemComponent } from './job-search-list-item/job-search-list-item.component';
import { JhiLanguageService } from 'ng-jhipster';
import { customHttpProvider } from '../blocks/interceptor/http.provider';

@NgModule({
    imports: [
        JobroomSharedModule,
        CommonModule,
        JobSearchRoutingModule,
        JobSearchSharedModule
    ],
    declarations: [
        JobSearchComponent,
        JobSearchToolbarComponent,
        JobSearchFilterComponent,
        JobSearchListItemComponent,
    ],
    providers: [
        customHttpProvider(),
    ]
})
export class JobSearchModule {

    constructor(languageService: JhiLanguageService) {
        languageService.init();
    }
}
