import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobSearchRoutingModule } from './job-search-routing.module';
import { JobroomSharedModule, JobSearchSharedModule } from '../shared';
import { JobSearchComponent } from './job-search.component';
import { JobSearchToolbarComponent } from './job-search-toolbar/job-search-toolbar.component';
import { JobSearchSidebarComponent } from './job-search-sidebar/job-search-sidebar.component';
import { JobSearchListItemComponent } from './job-search-list-item/job-search-list-item.component';
import { JhiLanguageService } from 'ng-jhipster';
import { customHttpProvider } from '../blocks/interceptor/http.provider';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { jobSearchReducer } from './state-management/reducers/job-search.reducers';
import { JobSearchEffects } from './state-management/effects/job-search.effects';
import { JobSearchListComponent } from './job-search-list/job-search-list.component';
import { JobDetailComponent } from './job-detail/job-detail.component';
import { ReactiveFormsModule } from '@angular/forms';
import { JobSearchFilterComponent } from './job-search-sidebar/job-search-filter/job-search-filter.component';
import { MarkdownModule } from 'angular2-markdown';
import { JobDetailResolver } from './job-detail/job-detail.resolver';
import { ClipboardModule } from 'ngx-clipboard';
import { WorkingTimeRangePipe } from './pipes/working-time-range.pipe';
import { JobService } from './services';
import { JobLocalityComponent } from './job-locality/job-locality.component';
import { DetailsPagePaginationEffects } from '../shared/components/details-page-pagination/state-management/effects/details-page-pagination.effects';
import { NouisliderModule } from 'ng2-nouislider';

@NgModule({
    imports: [
        StoreModule.forFeature('jobSearch', jobSearchReducer),
        EffectsModule.forFeature([JobSearchEffects, DetailsPagePaginationEffects]),
        StoreRouterConnectingModule,
        JobroomSharedModule,
        ReactiveFormsModule,
        CommonModule,
        JobSearchRoutingModule,
        JobSearchSharedModule,
        ClipboardModule,
        MarkdownModule.forRoot(),
        NouisliderModule
    ],
    declarations: [
        JobSearchComponent,
        JobSearchToolbarComponent,
        JobSearchSidebarComponent,
        JobSearchListItemComponent,
        JobSearchListComponent,
        JobDetailComponent,
        JobSearchFilterComponent,
        WorkingTimeRangePipe,
        JobLocalityComponent
    ],
    providers: [
        customHttpProvider(),
        JobDetailResolver,
        JobService
    ]
})
export class JobSearchModule {

    constructor(languageService: JhiLanguageService) {
        languageService.init();
    }
}
