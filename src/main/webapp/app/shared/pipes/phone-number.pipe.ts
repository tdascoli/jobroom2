import { Pipe, PipeTransform } from '@angular/core';
import { CountryCode, format, isValidNumber, parse, } from 'libphonenumber-js';

@Pipe({
    name: 'jr2PhoneNumber'
})
export class PhoneNumberPipe implements PipeTransform {

    transform(value: string, country: CountryCode = 'CH'): string {
        if (isValidNumber(value, country)) {
            const parsedNumber = parse(value, country);
            return format(parsedNumber, 'International');
        }
        return value;
    }
}
