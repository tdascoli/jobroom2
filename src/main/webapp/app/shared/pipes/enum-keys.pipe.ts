import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'keys'
})
export class KeysPipe implements PipeTransform {
    transform(value, args: string[]): any {
        return Object.keys(value)
            .filter((enumMember) => parseInt(enumMember, 10) >= 0)
            .map((enumMember) => Object.assign({
                key: enumMember,
                value: value[enumMember].replace(/^_/, '')
            }));
    }
}
