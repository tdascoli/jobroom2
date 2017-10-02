import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { TypeaheadMultiselectModel } from '../typeahead-multiselect-model';
import { TypeaheadItemDisplayModel } from '../typeahead-item-display-model';

@Component({
    selector: 'jr2-typeahead-singleselect',
    templateUrl: './typeahead-singleselect.component.html',
    styleUrls: ['./typeahead-singleselect.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => TypeaheadMultiselectModel),
        multi: false
    }]
})
export class TypeaheadSingleselectComponent {
    @Input() placeholder = '';
    @Input() itemLoader: (text: string) => Observable<TypeaheadMultiselectModel[]>;
    @Input() editable = true;

    wrappedItemLoader = (text$: Observable<string>): Observable<TypeaheadItemDisplayModel[]> => {

        const toDisplayModel = (m: TypeaheadMultiselectModel, idx: number, array: TypeaheadMultiselectModel[]) => {
            let fistInGroup = false;
            if (idx === 0 || m.type !== array[idx - 1].type) {
                fistInGroup = true;
            }
            return new TypeaheadItemDisplayModel(m, idx === 0, fistInGroup);
        };

        const toDisplayModelArray = (items: TypeaheadMultiselectModel[]) => items
            .sort((o1: TypeaheadMultiselectModel, o2: TypeaheadMultiselectModel) => o1.compare(o2))
            .map(toDisplayModel);

        return text$
            .filter((query: string) => query.length > 2)
            .switchMap((query: string) => this.itemLoader(query))
            .map(toDisplayModelArray);
    };

    formatResultItem(item: TypeaheadMultiselectModel) {
        return item.label;
    }

    formatInputValue(item: TypeaheadItemDisplayModel) {
        return item.model.label;
    }

    getTypeClass(item: TypeaheadMultiselectModel) {
        return `typeahead-singleselect__type-label--${item.type}`;
    }
}
