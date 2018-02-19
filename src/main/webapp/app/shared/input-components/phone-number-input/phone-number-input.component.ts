import {
    Component,
    ElementRef,
    forwardRef,
    Input,
    OnInit,
    ViewChild
} from '@angular/core';
import {
    AbstractControl,
    ControlValueAccessor,
    NG_VALIDATORS,
    NG_VALUE_ACCESSOR,
    ValidationErrors,
    Validator
} from '@angular/forms';
import { AsYouType, CountryCode, format, isValidNumber, parse } from 'libphonenumber-js';

@Component({
    selector: 'jr2-phone-number-input',
    template: `<input [id]="id" #input [disabled]="disabled" (input)="onInput($event)"
                      class="form-control" (blur)="onBlur($event)"
                      [placeholder]="placeholder">`,
    styles: [],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PhoneNumberInputComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => PhoneNumberInputComponent),
            multi: true
        }
    ]
})
export class PhoneNumberInputComponent implements OnInit, ControlValueAccessor, Validator {
    @ViewChild('input') inputViewChild: ElementRef;
    @Input() defaultCountry: CountryCode = 'CH';
    @Input() id: string;
    @Input() placeholder = '';

    disabled: boolean;
    country: CountryCode;

    ngOnInit() {
        this.country = this.defaultCountry;
    }

    writeValue(obj: any): void {
        if (obj) {
            const formatter = new AsYouType(this.defaultCountry);

            const value = formatter.input(obj);
            this.country = formatter.country;

            this.inputViewChild.nativeElement.value = value;
        }
    }

    registerOnChange(fn: any): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this._onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    validate(c: AbstractControl): ValidationErrors | any {
        const { value } = c;
        if (!!value) {
            if (!isValidNumber(value, this.country)) {
                return {
                    'phoneValidator': {
                        value,
                        country: this.country
                    }
                };
            }
        }

        return null;
    }

    registerOnValidatorChange(fn: () => void): void {
        this._validatorChange = fn;
    }

    onInput(event: any) {
        const eventValue = event.target.value;

        this.writeValue(eventValue);

        if (isValidNumber(eventValue, this.country)) {
            const parsedNumber = parse(eventValue, this.country);
            const e164Value = format(parsedNumber, 'International');
            this._onChange(e164Value);
        } else {
            this._onChange(eventValue);
        }

        this._onTouched();
    }

    onBlur(event: any) {
        const eventValue = event.target.value;
        if (isValidNumber(eventValue, this.country)) {
            const parsedNumber = parse(eventValue, this.country);
            this.inputViewChild.nativeElement.value = format(parsedNumber, 'International');
        }
        this._onTouched();
    }

    private _onChange = (_: any) => {
    };

    private _onTouched = () => {
    };

    private _validatorChange = () => {
    };
}
