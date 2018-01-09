import { LanguageFilterService } from '../../../../../../../main/webapp/app/shared/input-components/language-filter/language-filter.service';
import { cold } from 'jasmine-marbles';
import { Observable } from 'rxjs/Observable';

describe('LanguageFilterService', () => {

    const mockTranslateService = jasmine.createSpyObj('mockTranslateService', ['onLangChange', 'getTranslation']);
    const testedObject = new LanguageFilterService(mockTranslateService);

    const translations = {
        global: {
            reference: {
                language: {
                    en: 'English',
                    de: 'German',
                    it: 'Italian',
                    fr: 'French',
                    ua: 'Ukrainian'
                }
            }
        }
    };
    mockTranslateService.onLangChange = Observable.empty();

    describe('getSorterLanguageTranslations', () => {
        it('should return sorted language translations', () => {
            // GIVEN
            mockTranslateService.getTranslation.and.returnValue(cold('-a', { a: translations }));

            // WHEN
            const result = testedObject.getSorterLanguageTranslations();

            // THEN
            const expected = [
                { key: 'en', value: 'English' },
                { key: 'fr', value: 'French' },
                { key: 'de', value: 'German' },
                { key: 'it', value: 'Italian' },
                { key: 'ua', value: 'Ukrainian' },
            ];
            const expectedObservable = cold('-a', { a: expected });
            expect(result).toBeObservable(expectedObservable);
        });

        it('should return "en" and "de" language translations', () => {
            // GIVEN
            mockTranslateService.getTranslation.and.returnValue(cold('-a', { a: translations }));

            // WHEN
            const result = testedObject.getSorterLanguageTranslations(['en', 'de']);

            // THEN
            const expected = [
                { key: 'en', value: 'English' },
                { key: 'de', value: 'German' },
            ];
            const expectedObservable = cold('-a', { a: expected });
            expect(result).toBeObservable(expectedObservable);
        });
    });
});
