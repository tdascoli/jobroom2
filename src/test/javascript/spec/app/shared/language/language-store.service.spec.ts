import { LanguageStoreService } from '../../../../../../main/webapp/app/shared/language/language-store.service';
import { JhiConfigService } from 'ng-jhipster/src/config.service';
import { EventEmitter } from '@angular/core';
import { LangChangeEvent } from '@ngx-translate/core';

describe('LanguageStoreService', () => {
    let mockCookieService,
        mockJhiLanguageService,
        mockJhiConfigService,
        mockTranslateService;

    beforeEach(() => {
        mockCookieService = jasmine.createSpyObj('mockCookieService', ['get', 'put']);
        mockJhiLanguageService = jasmine.createSpyObj('mockJhiLanguageService', ['changeLanguage']);
        mockJhiConfigService = new JhiConfigService({ defaultI18nLang: 'de' });
        mockTranslateService = jasmine.createSpyObj('mockTranslateService', ['getBrowserLang']);
        mockTranslateService.onLangChange = new EventEmitter<LangChangeEvent>();
    });

    describe('initDefaultLanguage', () => {
        it('should use valid browser language', () => {
            // GIVEN
            const sut = new LanguageStoreService(mockCookieService, mockJhiLanguageService, mockJhiConfigService, mockTranslateService);
            mockTranslateService.getBrowserLang.and.returnValue('it');

            // WHEN
            sut.initDefaultLanguage();

            // THEN
            expect(mockJhiLanguageService.changeLanguage).toHaveBeenCalledWith('it');
        });

        it('should not use invalid browser language', () => {
            // GIVEN
            const sut = new LanguageStoreService(mockCookieService, mockJhiLanguageService, mockJhiConfigService, mockTranslateService);
            mockTranslateService.getBrowserLang.and.returnValue('hu');

            // WHEN
            sut.initDefaultLanguage();

            // THEN
            expect(mockJhiLanguageService.changeLanguage).toHaveBeenCalledTimes(0);
        });

        it('should use stored language if present', () => {
            // GIVEN
            const sut = new LanguageStoreService(mockCookieService, mockJhiLanguageService, mockJhiConfigService, mockTranslateService);
            mockTranslateService.getBrowserLang.and.returnValue('en');
            mockCookieService['get'].and.callFake((key: string) => key === 'NG_TRANSLATE_LANG_KEY' ? 'it' : '');

            // WHEN
            sut.initDefaultLanguage();

            // THEN
            expect(mockJhiLanguageService.changeLanguage).toHaveBeenCalledWith('it');
        });
    });
});
