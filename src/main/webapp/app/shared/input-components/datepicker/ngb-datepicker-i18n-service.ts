import { NgbDatepickerI18nDefault } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker-i18n';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';

const I18N_VALUES = {
    months: {
        'de': ['Jän', 'Feb', 'März', 'Apr', 'Mai', 'Juni', 'Juli', 'Aug', 'Sept', 'Okt', 'Nov', 'Dez'],
        'fr': ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aou', 'Sep', 'Oct', 'Nov', 'Déc'],
        'it': ['Genn', 'Febbr', 'Mar', 'Apr', 'Magg', 'Giugno', 'Luglio', 'Ag', 'Sett', 'Ott', 'Nov', 'Dic'],
        'en': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    weekdays: {
        'de': ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
        'fr': ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'],
        'it': ['Lu', 'Ma', 'Me', 'Gi', 'Ve', 'Sa', 'Do'],
        'en': ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
    }
};

@Injectable()
export class NgbDatepickerI18nService extends NgbDatepickerI18nDefault {

    constructor(private translateService: TranslateService) {
        super();
    }

    getMonthShortName(month: number): string {
        return I18N_VALUES.months[this.translateService.currentLang][month - 1];
    }

    getWeekdayShortName(weekday: number): string {
        return I18N_VALUES.weekdays[this.translateService.currentLang][weekday - 1];
    }
}

export function datepickerI18nService() {
    return {
        provide: NgbDatepickerI18n,
        useClass: NgbDatepickerI18nService
    }
}
