import './vendor.ts';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Ng2Webstorage } from 'ng2-webstorage';

import { JobroomSharedModule, UserRouteAccessService } from './shared';
import { JobroomHomeModule } from './home/home.module';
import { JobroomAdminModule } from './admin/admin.module';
import { JobroomAccountModule } from './account/account.module';
import { JobroomEntityModule } from './entities/entity.module';

import { customHttpProvider } from './blocks/interceptor/http.provider';
import { PaginationConfig } from './blocks/config/uib-pagination.config';
import {
    ActiveMenuDirective,
    ErrorComponent,
    FooterComponent,
    JhiMainComponent,
    LayoutRoutingModule,
    MegaMenuDirective,
    NavbarComponent,
    PageRibbonComponent,
    ProfileService,
    VersionComponent,
    VersionService
} from './layouts';

import { AppRoutingModule } from './app.routing.module';
import { JobSearchModule } from './job-search/job-search.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { DEBUG_INFO_ENABLED } from './app.constants';
import { CandidateSearchModule } from './candidate-search/candidate-search.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CustomRouterStateSerializer, } from './shared/custom-router-state-serializer/custom-router-state-serializer';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { reducers } from './shared/state-management/reducers/core.reducers';

// jhipster-needle-angular-add-module-import JHipster will add new module here

@NgModule({
    imports: [
        BrowserModule,
        AppRoutingModule,
        LayoutRoutingModule,
        Ng2Webstorage.forRoot({ prefix: 'jhi', separator: '-' }),
        JobroomSharedModule,
        JobroomHomeModule,
        JobroomAdminModule,
        JobroomAccountModule,
        JobroomEntityModule,
        JobSearchModule,
        CandidateSearchModule,
        DashboardModule,
        StoreModule.forRoot(reducers),
        StoreRouterConnectingModule,
        DEBUG_INFO_ENABLED ? StoreDevtoolsModule.instrument({ maxAge: 25 }) : [],
        EffectsModule.forRoot([])
        // jhipster-needle-angular-add-module JHipster will add new module here
    ],
    declarations: [
        JhiMainComponent,
        NavbarComponent,
        ErrorComponent,
        PageRibbonComponent,
        VersionComponent,
        ActiveMenuDirective,
        FooterComponent,
        MegaMenuDirective
    ],
    providers: [
        ProfileService,
        VersionService,
        customHttpProvider(),
        PaginationConfig,
        UserRouteAccessService,
        { provide: RouterStateSerializer, useClass: CustomRouterStateSerializer }
    ],
    bootstrap: [JhiMainComponent]
})
export class JobroomAppModule {
}
