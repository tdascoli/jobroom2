import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiConfigService } from 'ng-jhipster/src/config.service';
import { LANGUAGES } from './language.constants';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

const LANGUAGE_KEY = 'NG_TRANSLATE_LANG_KEY';

@Injectable()
export class LanguageStoreService {

    constructor(private cookieService: CookieService,
                private languageService: JhiLanguageService,
                private configService: JhiConfigService,
                private translateService: TranslateService) {
    }

    initDefaultLanguage() {
        const shouldChange = (language: string) =>
            LANGUAGES.indexOf(language) > -1
            && this.configService.CONFIG_OPTIONS.defaultI18nLang !== language;

        const persistedLanguage = this.cookieService.get(LANGUAGE_KEY);
        const browserLanguage = this.translateService.getBrowserLang();

        if (shouldChange(persistedLanguage)) {
            this.languageService.changeLanguage(persistedLanguage);
        } else if (shouldChange(browserLanguage)) {
            this.languageService.changeLanguage(browserLanguage);
        }

        this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
            this.cookieService.put(LANGUAGE_KEY, event.lang);
        });
    }
}
