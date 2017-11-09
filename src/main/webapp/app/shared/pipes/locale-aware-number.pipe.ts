import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { mapLangToLocale } from './pipes-util';

@Pipe({
    name: 'jr2Number'
})
export class LocaleAwareDecimalPipe implements PipeTransform {

    constructor(private translateService: TranslateService) {
    }

    transform(value: any, digits?: string): string | null {
        const wrapped = new DecimalPipe(mapLangToLocale(this.translateService.currentLang));
        return wrapped.transform(value, digits);
    }
}
