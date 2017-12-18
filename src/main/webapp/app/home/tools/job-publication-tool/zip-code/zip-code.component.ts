import {
    ChangeDetectionStrategy,
    Component, Input, OnChanges,
    OnInit, SimpleChanges
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { LocalityAutocomplete } from '../../../../shared/reference-service/locality-autocomplete';
import { LocalityService } from '../../../../shared/index';

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
            .map((locality) => ({ zip: locality.zipCode, city: locality.city, communalCode: locality.communalCode }));
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
                const validators = this.optional ? [] : [Validators.required];
                this.zipAutocompleter = this.fb.control('', validators);
                this.zipGroup = this.fb.group({
                    zip: ['', [...validators, Validators.pattern(/^\d*$/)]],
                    city: ['', validators]
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
            .flatMap((term) => term.length < 2 ? Observable.empty()
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
