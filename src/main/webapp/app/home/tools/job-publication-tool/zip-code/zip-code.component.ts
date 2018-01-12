import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ValidationErrors,
    Validators
} from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { LocalityAutocomplete } from '../../../../shared/reference-service';
import { LocalityService } from '../../../../shared/index';
import { AbstractControl } from '@angular/forms/src/model';

export interface Translations {
    zipCode: string;
    zip: string;
    city: string;
}

@Component({
    selector: 'jr2-zip-code',
    templateUrl: './zip-code.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZipCodeComponent implements OnInit, OnChanges {
    @Input()
    group: FormGroup;
    @Input()
    controlName: string;
    @Input()
    switzSelected: boolean;
    @Input()
    translations: Translations = {
        zipCode: 'home.tools.job-publication.locality.zipcode',
        zip: 'home.tools.job-publication.locality.zip',
        city: 'home.tools.job-publication.locality.city'
    };
    @Input()
    optional: boolean;

    zipAutocompleter: FormControl;
    zipGroup: FormGroup;

    static localityResultMapper(localityAutocomplete: LocalityAutocomplete): any {
        return localityAutocomplete.localities
            .map((locality) => ({
                zip: locality.zipCode,
                city: locality.city,
                communalCode: locality.communalCode
            }));
    }

    private static zipAutocompleterRequiredValidator(control: AbstractControl): ValidationErrors | null {
        return control.value && control.value.zip && control.value.city
            ? null
            : { 'required': { value: control.value } };
    }

    private static zipAutocompleterOptionalValidator(control: AbstractControl): ValidationErrors | null {
        if (!control.value) {
            return control.untouched ? null : { 'invalidZip': 'invalid' };
        }

        const touched: boolean = control.value.zip || control.value.city;
        const validZip: boolean = control.value.zip && control.value.city;
        return !touched || validZip ? null : { 'invalidZip': { value: control.value } };
    }

    private static zipGroupValidator(control: AbstractControl): ValidationErrors | null {
        if (!control.value) {
            return null;
        }

        const touched: boolean = control.value.zip || control.value.city;
        const validZip: boolean = control.value.zip && control.value.city;
        const isValid: boolean = !touched || validZip;

        if (!isValid) {
            const emptyControlName = !control.value.zip ? 'zip' : 'city';
            control.get(emptyControlName).setErrors({ 'empty': emptyControlName });
        } else {
            control.get('zip').setErrors(null);
            control.get('city').setErrors(null);
        }

        return isValid ? null : { 'invalidZip': { value: control.value } };
    }

    constructor(private fb: FormBuilder,
                private localityService: LocalityService) {
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['switzSelected']) {
            let zipControlValue = {
                zip: '',
                city: ''
            };

            if (changes['switzSelected'].firstChange) {
                const zipAutocompleterValidators = this.optional
                    ? [ZipCodeComponent.zipAutocompleterOptionalValidator]
                    : [ZipCodeComponent.zipAutocompleterRequiredValidator];
                this.zipAutocompleter = this.fb.control('', zipAutocompleterValidators);

                const zipGroupInputValidators = this.optional
                    ? []
                    : [Validators.required];

                const zipGroupValidator = this.optional
                    ? ZipCodeComponent.zipGroupValidator
                    : null;

                this.zipGroup = this.fb.group({
                    zip: ['', [...zipGroupInputValidators, Validators.pattern(/^\d*$/)]],
                    city: ['', zipGroupInputValidators]
                }, {
                    validator: zipGroupValidator
                });

                if (this.group.get(this.controlName)) {
                    zipControlValue = this.group.get(this.controlName).value;
                }
            }

            this.group.removeControl(this.controlName);
            if (changes['switzSelected'].currentValue) {
                this.zipAutocompleter.setValue(zipControlValue);
                this.group.addControl(this.controlName, this.zipAutocompleter);
            } else {
                this.zipGroup.setValue(zipControlValue);
                this.group.addControl(this.controlName, this.zipGroup);
            }
        }
    }

    get zipControlGroup(): FormGroup {
        return this.group.get(this.controlName) as FormGroup;
    }

    search = (text$: Observable<string>) =>
        text$
            .debounceTime(200)
            .distinctUntilChanged()
            .flatMap((term) => term.length < 2 ? Observable.of([])
                : this.localityService.fetchSuggestions(term, ZipCodeComponent.localityResultMapper, false));

    formatter = (result: any) => {
        return (result.zip || '') + (result.city ? ' ' : '') + (result.city || '');
    };

    zipChange(): void {
        if (this.zipControlGroup.invalid) {
            this.zipControlGroup.reset();
        }
    }
}
