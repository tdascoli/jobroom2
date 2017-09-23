import './vendor.ts';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Ng2Webstorage } from 'ng2-webstorage';

import { JobroomSharedModule, UserRouteAccessService } from './shared';
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

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { DEBUG_INFO_ENABLED } from './app.constants';
import { RouterModule } from '@angular/router';
import { APP_ROUTES } from './app.routes';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/throw';

// jhipster-needle-angular-add-module-import JHipster will add new module here

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forRoot(APP_ROUTES, { useHash: true }),
        LayoutRoutingModule,
        Ng2Webstorage.forRoot({ prefix: 'jhi', separator: '-' }),
        JobroomSharedModule,
        JobroomAccountModule,
        JobroomEntityModule,
        StoreModule.forRoot({}),
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
        UserRouteAccessService
    ],
    bootstrap: [JhiMainComponent]
})
export class JobroomAppModule {
}
