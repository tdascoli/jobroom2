import { EventEmitter } from '@angular/core';
import { LangChangeEvent } from '@ngx-translate/core';
import { Jobroom2LanguageService } from '../../../../../../main/webapp/app/shared/language/jobroom2-language.service';
import { JhiConfigService } from 'ng-jhipster/src/config.service';

describe('Jobroom2LanguageService', () => {
    let mockTranslateService,
        mockJhiConfigService,
        mockCookieService
    ;

    beforeEach(() => {
        mockCookieService = jasmine.createSpyObj('mockCookieService', ['get', 'put']);
        mockTranslateService = jasmine.createSpyObj('mockTranslateService', ['getBrowserLang', 'use', 'setDefaultLang']);
        mockTranslateService.onLangChange = new EventEmitter<LangChangeEvent>();
        mockJhiConfigService = new JhiConfigService({ defaultI18nLang: 'de' });
    });

    describe('defaultLanguage', () => {
        let sut;
        beforeEach(() => {
            sut = new Jobroom2LanguageService(mockTranslateService, mockJhiConfigService, mockCookieService);
        });

        it('should use valid browser language', () => {
            // GIVEN
            mockTranslateService.getBrowserLang.and.returnValue('it');

            // WHEN
            const defaultLanguage = sut.defaultLanguage();

            // THEN
            expect(defaultLanguage).toBe('it');
        });

        it('should not use invalid browser language', () => {
            // GIVEN
            mockTranslateService.getBrowserLang.and.returnValue('hu');

            // WHEN
            const defaultLanguage = sut.defaultLanguage();

            // THEN
            expect(defaultLanguage).toBe('de');
        });

        it('should use stored language if present', () => {
            // GIVEN
            mockTranslateService.getBrowserLang.and.returnValue('en');
            mockCookieService['get'].and.callFake((key: string) => key === 'NG_TRANSLATE_LANG_KEY' ? 'it' : '');

            // WHEN
            const defaultLanguage = sut.defaultLanguage();

            // THEN
            expect(defaultLanguage).toBe('it');
        });
    });
});
