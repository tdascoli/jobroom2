import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IMultiSelectOption } from 'angular-2-dropdown-multiselect';
import { Canton } from './candidate-search-request';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CantonService {

    constructor(private translateService: TranslateService) {
    }

    getCantonOptions(): Observable<IMultiSelectOption[]> {
        const mapToOption = (key: string) => Object.assign({}, {
            id: key,
            name: `global.reference.canton.${key}`
        });

        const translateOption = (option: IMultiSelectOption) => {
            return this.translateService.stream(option.name)
                .map((translation) => Object.assign({}, option, { name: translation }));
        };
        const translatedOptions = Object.keys(Canton)
            .filter((key) => !isNaN(Number(Canton[key])))
            .map(mapToOption)
            .map(translateOption);

        return Observable.combineLatest(translatedOptions);
    }
}
