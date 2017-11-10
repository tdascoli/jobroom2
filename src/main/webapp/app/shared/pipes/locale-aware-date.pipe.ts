import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { mapLangToLocale } from './pipes-util';

@Pipe({
    name: 'jr2Date'
})
export class LocaleAwareDatePipe implements PipeTransform {

    constructor(private translateService: TranslateService) {
    }

    public transform(value: any, pattern = 'mediumDate'): any {
        const wrapped = new DatePipe(mapLangToLocale(this.translateService.currentLang));
        return wrapped.transform(value, pattern);
    }
}
