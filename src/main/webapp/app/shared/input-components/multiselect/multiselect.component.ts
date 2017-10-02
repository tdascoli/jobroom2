import {
    ChangeDetectorRef,
    Component,
    forwardRef,
    Input,
    ViewChild
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms/src/forms';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

enum Key {
    Tab = 9,
    Enter = 13,
}

export const MAX_ITEM_NUM = 5;

@Component({
    selector: 'jr2-multiselect',
    templateUrl: './multiselect.component.html',
    styleUrls: ['./multiselect.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => MultiselectComponent),
        multi: true
    }]
})
export class MultiselectComponent implements ControlValueAccessor {
    @ViewChild('input') inputEl;

    @Input() id: string;
    @Input() placeholder: string;
    @Input() maxItemNum = MAX_ITEM_NUM;
    disabled = false;
    selectedItems: Array<string> = [];

    constructor(private changeDetectorRef: ChangeDetectorRef) {
    }

    writeValue(obj: any): void {
        if (Array.isArray(obj)) {
            this.selectedItems = [...obj];
            this.changeDetectorRef.markForCheck();
        }
    }

    registerOnChange(fn: (value: any) => any): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: () => any): void {
        this._onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    focusInput() {
        this.inputEl.nativeElement.focus();
    }

    getInputWidth() {
        const value = this.inputEl.nativeElement.value || '';
        if (this.selectedItems.length === this.maxItemNum || this.disabled) {
            return 0;
        } else if (value.length > 0) {
            return `${value.length}em`;
        } else if (this.selectedItems.length > 0) {
            return '0.5em';
        } else {
            return '100%';
        }
    }

    handleBlur(event: any) {
        if (!this.selectInputValue()) {
            this.inputEl.nativeElement.value = '';
        }
    }

    handleKeyDown(event: KeyboardEvent) {
        if ((event.which === Key.Enter || event.which === Key.Tab) && !this.disabled) {
            this.selectInputValue();

            event.preventDefault();
            event.stopPropagation();
        }
    }

    removeItem(item: string) {
        if (!this.disabled) {
            const filteredItems = this.selectedItems.filter((i: string) => item !== i);

            this._onChange(filteredItems);
            this.writeValue(filteredItems);

            this.focusInput();
        }
    }

    showPlaceholder(): boolean {
        return this.selectedItems.length === 0;
    }

    private selectInputValue(): string {
        const value = this.inputEl.nativeElement.value;
        if (value.length > 2
            && this.selectedItems.indexOf(value) < 0) {

            const newItems = [...this.selectedItems, value];

            this._onChange(newItems);
            this.writeValue(newItems);

            this.inputEl.nativeElement.value = '';

            return value;
        } else {
            return null;
        }
    }

    private _onChange = (_: any) => {
    }
    private _onTouched = () => {
    }
}
