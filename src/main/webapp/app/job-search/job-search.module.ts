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
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { jobSearchReducer } from './state-management/reducers/job-search.reducers';
import { JobSearchEffects } from './state-management/effects/job-search.effects';
import { JobSearchListComponent } from './job-search-list/job-search-list.component';

@NgModule({
    imports: [
        StoreModule.forFeature('jobSearch', jobSearchReducer),
        EffectsModule.forFeature([JobSearchEffects]),
        StoreRouterConnectingModule,
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
        JobSearchListComponent,
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
