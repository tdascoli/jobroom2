import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

const languages = [
    'de',
    'fr',
    'it',
    'rm',
    'en',
    'es',
    'pt',
    'tr',
    'el',
    'hu',
    'pl',
    'cs',
    'sr',
    'nl',
    'ar',
    'he',
    'ru',
    'sv',
    'ja',
    'zh',
    'sl',
    'hr',
    'da',
    'ta',
    'sq',
    'ku',
    'de-ch',
    'mk',
    'bs',
    'bg',
    'no',
    'sk',
    'lt',
    'th',
    'fi',
    'km',
    'vi',
    'ro'
];

@Injectable()
export class LanguageSkillService {
    getLanguages(): Observable<Array<string>> {
        return Observable.of(languages);
    }
}
