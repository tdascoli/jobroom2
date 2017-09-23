import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { JhiLanguageService, NgJhipsterModule } from 'ng-jhipster';
import { CookieModule } from 'ngx-cookie';
import { Jobroom2LanguageService } from './language/jobroom2-language.service';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap/timepicker/timepicker.module';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap/modal/modal.module';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap/tabset/tabset.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap/tooltip/tooltip.module';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap/typeahead/typeahead.module';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap/alert/alert.module';
import { NgbDatepickerModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        NgbTimepickerModule.forRoot(),
        NgbModalModule.forRoot(),
        NgbTabsetModule.forRoot(),
        NgbTypeaheadModule.forRoot(),
        NgbAlertModule.forRoot(),
        NgbTooltipModule.forRoot(),
        NgbPaginationModule.forRoot(),
        NgbDatepickerModule.forRoot(),
        NgJhipsterModule.forRoot({
            // set below to true to make alerts look like toast
            alertAsToast: false,
            i18nEnabled: true,
            defaultI18nLang: 'de'
        }),
        CookieModule.forRoot()
    ],
    exports: [
        FormsModule,
        HttpModule,
        CommonModule,
        NgbTimepickerModule,
        NgbModalModule,
        NgbTabsetModule,
        NgbTypeaheadModule,
        NgbAlertModule,
        NgbTooltipModule,
        NgJhipsterModule,
        NgbPaginationModule,
        NgbDatepickerModule
    ],
    providers: [
        { provide: JhiLanguageService, useClass: Jobroom2LanguageService },
    ]
})
export class JobroomSharedLibsModule {
}
