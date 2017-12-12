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
    UserService
} from './';
import { LocaleAwareDatePipe } from './pipes/locale-aware-date.pipe';
import { LocaleAwareDecimalPipe } from './pipes/locale-aware-number.pipe';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { LanguageComponent } from './components/language/language.component';
import { DetailsPagePaginationControlsComponent } from './components/details-page-pagination-controls/details-page-pagination-controls.component';
import { DetailsPagePaginationComponent } from './components/details-page-pagination/details-page-pagination.component';
import { dateParserFormatterProvider } from './input-components/datepicker/ngb-date-moment-parser-formatter';
import { datepickerI18nService } from './input-components/datepicker/ngb-datepicker-i18n-service';
import { OrganizationService } from './organization/organization.service';
import { JobPublicationService } from './job-publication/job-publication.service';

@NgModule({
    imports: [
        JobroomSharedLibsModule,
        JobroomSharedCommonModule
    ],
    declarations: [
        JhiLoginModalComponent,
        HasAnyAuthorityDirective,
        LocaleAwareDatePipe,
        LocaleAwareDecimalPipe,
        SafeHtmlPipe,
        LanguageComponent,
        DetailsPagePaginationControlsComponent,
        DetailsPagePaginationComponent
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
        dateParserFormatterProvider(),
        datepickerI18nService(),
        OrganizationService,
        JobPublicationService
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
        LanguageComponent,
        DetailsPagePaginationControlsComponent,
        DetailsPagePaginationComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class JobroomSharedModule {
}
