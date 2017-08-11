import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DatePipe } from '@angular/common';

import {
    JobroomSharedLibsModule,
    JobroomSharedCommonModule,
    CSRFService,
    AuthServerProvider,
    AccountService,
    UserService,
    StateStorageService,
    LoginService,
    LoginModalService,
    Principal,
    HasAnyAuthorityDirective,
    JhiLoginModalComponent,
    StickyToolbarItemDirective
} from './';
import { LocaleAwareDatePipe } from './pipes/locale-aware-date.pipe';

@NgModule({
    imports: [
        JobroomSharedLibsModule,
        JobroomSharedCommonModule
    ],
    declarations: [
        JhiLoginModalComponent,
        HasAnyAuthorityDirective,
        StickyToolbarItemDirective,
        LocaleAwareDatePipe
    ],
    providers: [
        LoginService,
        LoginModalService,
        AccountService,
        StateStorageService,
        Principal,
        CSRFService,
        AuthServerProvider,
        UserService,
        DatePipe,
        LocaleAwareDatePipe
    ],
    entryComponents: [JhiLoginModalComponent],
    exports: [
        JobroomSharedCommonModule,
        JhiLoginModalComponent,
        HasAnyAuthorityDirective,
        DatePipe,
        LocaleAwareDatePipe,
        StickyToolbarItemDirective
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class JobroomSharedModule {}
