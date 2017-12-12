import { InjectionToken, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { JhiLanguageService, NgJhipsterModule } from 'ng-jhipster';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CookieModule } from 'ngx-cookie';
import { Jobroom2LanguageService } from './language/jobroom2-language.service';
import { HttpClientModule } from '@angular/common/http';

export const WINDOW = new InjectionToken<Window>('WindowToken');

export function _window(): Window {
    return window;
}

@NgModule({
    imports: [
        NgbModule.forRoot(),
        NgJhipsterModule.forRoot({
            // set below to true to make alerts look like toast
            alertAsToast: false,
            i18nEnabled: true,
            defaultI18nLang: 'de'
        }),
        InfiniteScrollModule,
        CookieModule.forRoot()
    ],
    exports: [
        FormsModule,
        HttpModule,
        CommonModule,
        NgbModule,
        NgJhipsterModule,
        InfiniteScrollModule
    ],
    providers: [
        { provide: JhiLanguageService, useClass: Jobroom2LanguageService },
        { provide: WINDOW, useFactory: _window }
    ]
})
export class JobroomSharedLibsModule {
}
