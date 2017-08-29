import {
    ChangeDetectorRef,
    Component,
    forwardRef,
    Input,
    ViewChild
} from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TypeaheadMultiselectModel } from './typeahead-multiselect-model';

const TYPEAHEAD_MULTISELECT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TypeaheadMultiselectComponent),
    multi: true
};

export class ItemDisplayModel {
    constructor(public model: TypeaheadMultiselectModel,
                public first = false,
                public firstInGroup = false) {
    }
}

@Component({
    selector: 'jr2-typeahead-multiselect',
    templateUrl: './typeahead-multiselect.component.html',
    styleUrls: ['./typeahead-multiselect.component.scss'],
    providers: [TYPEAHEAD_MULTISELECT_CONTROL_VALUE_ACCESSOR]
})
export class TypeaheadMultiselectComponent implements ControlValueAccessor {
    @Input() itemLoader: (text: string) => Observable<TypeaheadMultiselectModel[]>;
    @Input() placeHolder: string;
    @Input() editable = true;
    @Input() focusFirst = false;
    @ViewChild('input') inputEl;

    inputValue: string;
    selectedItems: Array<TypeaheadMultiselectModel> = [];

    constructor(private changeDetectorRef: ChangeDetectorRef) {
    }

    registerOnChange(fn: (value: any) => any): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: () => any): void {
        this._onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
    }

    writeValue(obj: any): void {
        if (obj) {
            this.selectedItems = [...obj];
            this.changeDetectorRef.markForCheck();
        }
    }

    formatResultItem(item: TypeaheadMultiselectModel) {
        return item.label;
    }

    getItemClass(item: TypeaheadMultiselectModel) {
        return `typeahead-multiselect__tag--${item.type}`;
    }

    getTypeClass(item: TypeaheadMultiselectModel) {
        return `typeahead-multiselect__type-label--${item.type}`;
    }

    removeItem(item: TypeaheadMultiselectModel) {
        const filteredItems = this.selectedItems.filter((i: TypeaheadMultiselectModel) => !item.equals(i));

        this._onChange(filteredItems);
        this.writeValue(filteredItems);

        this.inputEl.nativeElement.focus();
    }

    selectFreeText($e) {
        const freeText = new TypeaheadMultiselectModel('free-text', this.inputValue, this.inputValue);
        if (this.editable && !this.exists(freeText) && freeText.code.length > 2) {
            const newItems = [...this.selectedItems, freeText];

            this._onChange(newItems);
            this.writeValue(newItems);

            this.inputEl.nativeElement.value = '';
        }
    }

    selectItem($e) {
        const newItems = [...this.selectedItems, $e.item.model];

        this._onChange(newItems);
        this.writeValue(newItems);

        this.inputEl.nativeElement.value = '';
        $e.preventDefault();
    }

    showPlaceholder(): boolean {
        return this.selectedItems.length === 0;
    }

    wrappedItemLoader = (text$: Observable<string>): Observable<ItemDisplayModel[]> => {

        const toDisplayModel = (m: TypeaheadMultiselectModel, idx: number, array: TypeaheadMultiselectModel[]) => {
            let fistInGroup = false;
            if (idx === 0 || m.type !== array[idx - 1].type) {
                fistInGroup = true;
            }
            return new ItemDisplayModel(m, idx === 0, fistInGroup);
        };

        const toDisplayModelArray = (items: TypeaheadMultiselectModel[]) => items
            .filter((m: TypeaheadMultiselectModel) => !this.exists(m))
            .sort((o1: TypeaheadMultiselectModel, o2: TypeaheadMultiselectModel) => o1.compare(o2))
            .map(toDisplayModel);

        return text$
            .filter((query: string) => query.length > 2)
            .switchMap((query: string) => this.itemLoader(query))
            .map(toDisplayModelArray);
    }

    private exists(model: TypeaheadMultiselectModel) {
        return !!this.selectedItems.find((i: TypeaheadMultiselectModel) => model.equals(i));
    }

    private _onChange = (_: any) => {
    }
    private _onTouched = () => {
    }

}
