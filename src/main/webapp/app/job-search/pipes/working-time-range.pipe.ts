import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'workingTimeRange'
})
export class WorkingTimeRangePipe implements PipeTransform {

    transform(value: any, args?: any): any {
        if (Array.isArray(value)) {
            const min = value[0] || 0;
            const max = value[1] || 100;

            if (min === max) {
                return `${max}%`;
            } else {
                return `${min}% - ${max}%`;
            }
        }

        return null;
    }

}
