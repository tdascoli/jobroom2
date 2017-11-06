import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'keys'
})
export class KeysPipe implements PipeTransform {
    transform(value, exclude: string[] = []): any {
        return Object.keys(value)
            .map((enumMember) => parseInt(enumMember, 10))
            .filter((key) => key >= 0)
            .map((key) => Object.assign({ key }, {
                value: value[key].replace(/^_/, '')
            }))
            .filter((item) => exclude.indexOf(item.value) < 0);
    }
}
