import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { DATE_FORMAT } from '../../app.constants';

export class NgbDateMomentParserFormatter extends NgbDateParserFormatter {

    parse(value: string): NgbDateStruct {
        if (!value) {
            return null;
        }
        const date = moment(value, DATE_FORMAT);
        return date.isValid() ? {
            year: date.year(),
            month: date.month() + 1,
            day: date.date()
        } : null;
    }

    format(dateStruct: NgbDateStruct): string {
        if (!dateStruct) {
            return '';
        }
        const date = moment({
            year: dateStruct.year,
            month: dateStruct.month - 1,
            date: dateStruct.day
        });
        return date.isValid() ? date.format(DATE_FORMAT) : '';
    }

}
