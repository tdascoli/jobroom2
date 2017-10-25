import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

const languages = [
    'sq',
    'ar',
    'bs',
    'de-ch',
    'zh',
    'de',
    'da',
    'en',
    'fi',
    'fr',
    'gr',
    'hr',
    'ne',
    'it',
    'jp',
    'km',
    'hr',
    'ku',
    'lt',
    'no',
    'po',
    'pt',
    'ro',
    'ru',
    'sv',
    'sr',
    'sk',
    'sl',
    'es',
    'ta',
    'th',
    'cs',
    'tr',
    'hu',
    'vi',
];

@Injectable()
export class LanguageSkillService {
    getLanguages(): Observable<Array<string>> {
        return Observable.of(languages);
    }
}
