import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class LanguageFilterService {

    private readonly MOST_USED_LANGUAGE_CODES = ['de', 'fr', 'it', 'de-ch'];

    constructor(private translateService: TranslateService) {
    }

    getSorterLanguageTranslations(languageOptions?: string[]): Observable<Array<{ key: string, value: string }>> {
        return this.translateService.getTranslation(this.translateService.currentLang)
            .concat(this.translateService.onLangChange.map((langChange) => langChange.translations))
            .map((translations) => {
                const unsortedLanguages = this.getUnsortedLanguages(translations, languageOptions);
                const sortedMostUsedLanguages = this.getSortedMostUsedLanguages(unsortedLanguages);
                const sortedLessUsedLanguages = this.getSortedLessUsedLanguages(unsortedLanguages);
                return sortedMostUsedLanguages.concat(sortedLessUsedLanguages)
            });
    }

    private getUnsortedLanguages(translations: any, languageOptions?: string[]) {
        return Object.keys(translations.global.reference.language)
            .filter((key) => languageOptions ? languageOptions.indexOf(key) >= 0 : true)
            .map((key) => ({
                key,
                value: translations.global.reference.language[key]
            }))
    }

    private getSortedMostUsedLanguages(translations: Array<{ key: string, value: string }>) {
        return translations
            .filter((translation) => this.isMostUsedLanguage(translation))
            .sort((a, b) => this.MOST_USED_LANGUAGE_CODES.indexOf(a.key) - this.MOST_USED_LANGUAGE_CODES.indexOf(b.key));
    }

    private getSortedLessUsedLanguages(translations: Array<{ key: string, value: string }>) {
        return translations
            .filter((translation) => !this.isMostUsedLanguage(translation))
            .sort((a, b) => a.value.localeCompare(b.value));
    }

    private isMostUsedLanguage(translation: { key: string, value: string }) {
        return this.MOST_USED_LANGUAGE_CODES.indexOf(translation.key) >= 0;
    }
}
