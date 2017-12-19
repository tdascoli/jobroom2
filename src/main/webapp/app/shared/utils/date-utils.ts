import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

export class DateUtils {

    static mapDateToNgbDateStruct(source?: Date): NgbDateStruct {
        const date = source ? source : new Date();
        return {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate()
        };
    }

    static mapNgbDateStructToDate(dateStruct: NgbDateStruct): Date {
        return new Date(dateStruct.year, dateStruct.month - 1, dateStruct.day);
    }

    static dateStringToToNgbDateStruct(date: string): NgbDateStruct {
        if (!date) {
            return null;
        }

        const [year, month, day] = date.split('-');
        return {
            year: +year,
            month: +month,
            day: +day
        };
    }

    static convertNgbDateStructToString(date: NgbDateStruct): string {
        return date ? moment(DateUtils.mapNgbDateStructToDate(date)).format('YYYY-MM-DD') : null;
    }
}
