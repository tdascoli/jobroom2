import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    forwardRef,
    Inject,
    Input,
    ViewChild,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms/src/forms';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { WINDOW } from '../../shared-libs.module';

enum Key {
    Tab = 9,
    Enter = 13,
}

export const MAX_ITEM_NUM = 5;

// todo: Check if there is a better way to get the default font
const DEFAULT_FONT = '14px / 21px "Open Sans", "Helvetica Neue", Arial, sans-serif';

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
export class MultiselectComponent implements ControlValueAccessor, AfterViewInit {
    @ViewChild('input') inputEl;
    @ViewChild('canvas') canvasEl;

    @Input() id: string;
    @Input() placeholder = '';
    @Input() maxItemNum = MAX_ITEM_NUM;
    disabled = false;
    selectedItems: Array<string> = [];

    private canvasCtx;
    private lastKey = '';

    constructor(private changeDetectorRef: ChangeDetectorRef,
                @Inject(WINDOW)
                private window: Window) {
    }

    ngAfterViewInit() {
        const canvas = this.canvasEl.nativeElement;
        const font = this.window.getComputedStyle(this.inputEl.nativeElement).font || DEFAULT_FONT;
        this.canvasCtx = canvas.getContext('2d');
        this.canvasCtx.font = font;
    }

    writeValue(obj: any): void {
        const value = obj === null ? [] : obj;
        if (Array.isArray(value)) {
            this.selectedItems = [...value];
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
            const lastChar = this.lastKey.length === 1 ? this.lastKey : '';
            const width = this.canvasCtx.measureText(value + lastChar).width;
            return `${width}px`;
        } else if (this.selectedItems.length > 0) {
            return '0.5em';
        } else {
            return '100%';
        }
    }

    handleBlur(event: any) {
        this.inputEl.nativeElement.value = '';
    }

    handleKeyDown(event: KeyboardEvent) {
        if ((event.which === Key.Enter || event.which === Key.Tab) && !this.disabled) {
            this.selectInputValue();

            event.preventDefault();
            event.stopPropagation();
        }
        this.lastKey = event.key;
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
