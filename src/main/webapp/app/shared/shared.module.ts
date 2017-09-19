import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';

import {
    AccountService,
    AuthServerProvider,
    CSRFService,
    HasAnyAuthorityDirective,
    JhiLoginModalComponent,
    JobroomSharedCommonModule,
    JobroomSharedLibsModule,
    LoginModalService,
    LoginService,
    Principal,
    StateStorageService,
    StickyToolbarItemDirective,
    UserService
} from './';
import { LocaleAwareDatePipe } from './pipes/locale-aware-date.pipe';
import { LocaleAwareDecimalPipe } from './pipes/locale-aware-number.pipe';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { KeysPipe } from './pipes/enum-keys.pipe';

@NgModule({
    imports: [
        JobroomSharedLibsModule,
        JobroomSharedCommonModule
    ],
    declarations: [
        JhiLoginModalComponent,
        HasAnyAuthorityDirective,
        StickyToolbarItemDirective,
        LocaleAwareDatePipe,
        LocaleAwareDecimalPipe,
        SafeHtmlPipe,
        KeysPipe
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
        LocaleAwareDatePipe,
        LocaleAwareDecimalPipe,
        SafeHtmlPipe,
        KeysPipe
    ],
    entryComponents: [JhiLoginModalComponent],
    exports: [
        JobroomSharedCommonModule,
        JhiLoginModalComponent,
        HasAnyAuthorityDirective,
        DatePipe,
        LocaleAwareDatePipe,
        LocaleAwareDecimalPipe,
        SafeHtmlPipe,
        KeysPipe,
        StickyToolbarItemDirective
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class JobroomSharedModule {
}
