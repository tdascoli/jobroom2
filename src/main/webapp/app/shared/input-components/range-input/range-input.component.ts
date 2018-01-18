import { ChangeDetectorRef, Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'jr2-range-input',
    templateUrl: './range-input.component.html',
    styleUrls: ['./range-input.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => RangeInputComponent),
        multi: true
    }]
})
export class RangeInputComponent implements OnInit, ControlValueAccessor {
    @Input() min: number;
    @Input() max: number;
    @Input() step: number;
    @Input() inputSize: 'sm' | 'lg' | null;

    range: Array<number>;
    options: Array<number>;

    constructor(private changeDetectorRef: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.range = [this.min, this.max];
        this.options = [];
        for (let i = this.min; i <= this.max; i += this.step) {
            this.options.push(i);
        }
    }

    writeValue(obj: any): void {
        if (obj) {
            this.range = obj;
            this.changeDetectorRef.markForCheck();
        }
    }

    registerOnChange(fn: any): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this._onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
    }

    onChangeMin(newValue) {
        const newRange = [newValue, this.range[1]];
        this.writeValue(newRange);
        this._onChange(newRange);
    }

    onChangeMax(newValue) {
        const newRange = [this.range[0], newValue];
        this.writeValue(newRange);
        this._onChange(newRange);
    }

    private _onChange = (_: any) => {
    };
    private _onTouched = () => {
    }
}
