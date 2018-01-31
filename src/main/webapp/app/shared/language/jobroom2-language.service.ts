import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { JhiConfigService } from 'ng-jhipster/src/config.service';
import { CookieService } from 'ngx-cookie';
import { LANGUAGES } from './language.constants';
import { JhiLanguageService } from 'ng-jhipster';
import { CoreState } from '../state-management/state/core.state';
import { Store } from '@ngrx/store';
import {
    InitLanguageAction,
    LanguageChangedAction
} from '../state-management/actions/core.actions';

const LANGUAGE_KEY = 'NG_TRANSLATE_LANG_KEY';

@Injectable()
export class Jobroom2LanguageService {
    private jhiLanguageService: JhiLanguageService;

    constructor(private translateService: TranslateService,
                private configService: JhiConfigService,
                private cookieService: CookieService,
                private store: Store<CoreState>) {

        this.configService.getConfig().defaultI18nLang = this.defaultLanguage();
        this.jhiLanguageService = new JhiLanguageService(this.translateService, this.configService);
    }

    init() {
        this.jhiLanguageService.init();
        this.store.dispatch(new InitLanguageAction(this.currentLang));
    }

    set currentLang(langKey: string) {
        this.jhiLanguageService.currentLang = langKey;
    }

    get currentLang() {
        return this.jhiLanguageService.currentLang;
    }

    changeLanguage(languageKey: string) {
        this.cookieService.put(LANGUAGE_KEY, languageKey);
        this.jhiLanguageService.changeLanguage(languageKey);
        this.store.dispatch(new LanguageChangedAction(languageKey));
    }

    getCurrent(): Promise<string> {
        return this.jhiLanguageService.getCurrent();
    }

    private defaultLanguage() {
        const isValid = (language: string) => LANGUAGES.indexOf(language) > -1;

        const persistedLanguage = this.cookieService.get(LANGUAGE_KEY);
        if (isValid(persistedLanguage)) {
            return persistedLanguage;
        }
        const browserLanguage = this.translateService.getBrowserLang();
        if (isValid(browserLanguage)) {
            return browserLanguage;
        }

        return LANGUAGES[0];
    }
}
