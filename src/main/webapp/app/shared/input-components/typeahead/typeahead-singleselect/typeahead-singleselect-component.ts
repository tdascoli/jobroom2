import { ChangeDetectorRef, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { TypeaheadMultiselectModel } from '../typeahead-multiselect-model';
import { TypeaheadItemDisplayModel } from '../typeahead-item-display-model';
import { TYPEAHEAD_QUERY_MIN_LENGTH } from '../../../../app.constants';

@Component({
    selector: 'jr2-typeahead-singleselect',
    templateUrl: './typeahead-singleselect.component.html',
    styleUrls: ['./typeahead-singleselect.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => TypeaheadSingleselectComponent),
        multi: true
    }]
})
export class TypeaheadSingleselectComponent implements ControlValueAccessor {
    @Input() placeholder = '';
    @Input() itemLoader: (text: string) => Observable<TypeaheadMultiselectModel[]>;
    @Input() editable = true;

    selectedItem: TypeaheadMultiselectModel;

    constructor(private changeDetectorRef: ChangeDetectorRef) {
    }

    writeValue(obj: any): void {
        this.selectedItem = obj;
        this.changeDetectorRef.markForCheck();
    }

    registerOnChange(fn: any): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this._onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
    }

    formatResultItem(item: TypeaheadMultiselectModel) {
        return item.label;
    }

    formatInputValue(item: TypeaheadItemDisplayModel) {
        if (item && item.model) {
            return item.model.label;
        } else {
            return ''
        }
    }

    getTypeClass(item: TypeaheadMultiselectModel) {
        return `typeahead-singleselect__type-label--${item.type}`;
    }

    inputChange(event: any) {
        if (event.srcElement.value === '' && this.selectedItem) {
            // handle deleting a current item
            this._onChange(null);
            this.writeValue(null);
        }
    }

    modelChange(event: TypeaheadItemDisplayModel) {
        if ((event && !event.model.equals(this.selectedItem))
            || (!event && this.selectedItem)) {
            this._onChange(event);
        }
        this.writeValue(event);
    }

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
            .filter((query: string) => query.length >= TYPEAHEAD_QUERY_MIN_LENGTH)
            .switchMap((query: string) => this.itemLoader(query))
            .map(toDisplayModelArray);
    };

    private _onChange = (_: any) => {
    };
    private _onTouched = () => {
    }
}
