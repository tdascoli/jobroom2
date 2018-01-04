import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class LanguageFilterService {

    constructor(private translateService: TranslateService) {
    }

    getSorterLanguageTranslations(languageOptions?: string[]): Observable<Array<{ key: string, value: string }>> {
        return this.translateService.getTranslation(this.translateService.currentLang)
            .concat(this.translateService.onLangChange.map((langChange) => langChange.translations))
            .map((translations) => Object.keys(translations.global.reference.language)
                .filter((key) => languageOptions ? languageOptions.indexOf(key) >= 0 : true)
                .map((key) => ({ key, value: translations.global.reference.language[key] }))
                .sort((a, b) => a.value.localeCompare(b.value)));
    }
}
