import {
    ChangeDetectionStrategy, Component, Input,
    OnInit
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

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
export class ZipCodeComponent implements OnInit {
    private readonly SWITZ_KEY = 'CH';

    @Input()
    formGroup: FormGroup;
    @Input()
    controlName: string;
    @Input()
    countryControl: FormControl;
    @Input()
    translations: Translations = {
        zipCode: 'home.tools.job-publication.locality.zipcode',
        zip: 'home.tools.job-publication.locality.zip',
        city: 'home.tools.job-publication.locality.city'
    };
    @Input()
    optional: boolean;

    switzSelected$: Observable<boolean>;

    constructor(private fb: FormBuilder) {
    }

    ngOnInit() {
        const validators = this.optional ? [] : [Validators.required];
        this.formGroup.addControl(this.controlName, this.fb.group({
            zip: ['', [...validators, Validators.pattern(/^\d*$/)]],
            city: ['', validators]
        }));

        this.switzSelected$ = Observable.merge(
            Observable.of(this.countryControl.value),
            this.countryControl.valueChanges)
            .map((selectedCountry) => selectedCountry === this.SWITZ_KEY);
    }
}
