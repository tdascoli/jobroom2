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
                    ar: 'Arab',
                    'de-ch': 'Swiss German',
                    en: 'English',
                    de: 'German',
                    it: 'Italian',
                    fr: 'French',
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
                { key: 'de', value: 'German' },
                { key: 'fr', value: 'French' },
                { key: 'it', value: 'Italian' },
                { key: 'en', value: 'English' },
                { key: 'de-ch', value: 'Swiss German' },
                { key: 'ar', value: 'Arab' },
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
                { key: 'de', value: 'German' },
                { key: 'en', value: 'English' }
            ];
            const expectedObservable = cold('-a', { a: expected });
            expect(result).toBeObservable(expectedObservable);
        });
    });
});
