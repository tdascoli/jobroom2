import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AbstractControl, FormBuilder, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { OccupationSuggestion } from '../../../shared/reference-service/occupation-autocomplete';
import { Subject } from 'rxjs/Subject';
import {
    DrivingLicenceCategory,
    Experience,
    ISCED_1997
} from '../../../shared/model/shared-types';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { LanguageSkillService } from '../../../candidate-search/services/language-skill.service';
import {
    FormatterFn,
    OccupationPresentationService,
    SuggestionLoaderFn
} from '../../../shared/reference-service/occupation-presentation.service';
import { Translations } from './zip-code/zip-code.component';
import { EMAIL_REGEX, URL_REGEX } from '../../../shared/validation/regex-patterns';

@Component({
    selector: 'jr2-job-publication-tool',
    templateUrl: './job-publication-tool.component.html',
    styleUrls: ['./job-publication-tool.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobPublicationToolComponent implements OnInit, OnDestroy {
    private readonly SWITZ_KEY = 'CH';

    educationLevels = ISCED_1997;
    experiences = Experience;
    drivingLicenceCategories = DrivingLicenceCategory;
    countries = [
        { key: this.SWITZ_KEY, value: 'Schweiz' },
        { key: 'DE', value: 'DE' },
        { key: 'FR', value: 'FR' },
        { key: 'IT', value: 'IT' },
        { key: 'UK', value: 'UK' },
        { key: 'A', value: 'A' }
    ];
    languageSkills$: Observable<Array<string>>;

    jobPublicationForm: FormGroup;
    publicationStartDateByArrangement = true;
    publicationEndDateIsPermanent = true;
    publicationStartDateMin = JobPublicationToolComponent.mapDateToNgbDateStruct();
    publicationEndDateMin = JobPublicationToolComponent.mapDateToNgbDateStruct();

    fetchOccupationSuggestions: SuggestionLoaderFn<Array<OccupationSuggestion>>;
    occupationFormatter: FormatterFn<OccupationSuggestion>;

    unsubscribe$ = new Subject<void>();

    private static mapDateToNgbDateStruct(source?: Date): NgbDateStruct {
        const date = source ? source : new Date();
        return {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate()
        };
    }

    private static mapNgbDateStructToDate(dateStruct: NgbDateStruct): Date {
        return new Date(dateStruct.year, dateStruct.month - 1, dateStruct.day);
    }

    constructor(private occupationPresentationService: OccupationPresentationService,
                private fb: FormBuilder,
                private languageSkillService: LanguageSkillService) {
        this.fetchOccupationSuggestions = this.occupationPresentationService.fetchOccupationSuggestions;
        this.occupationFormatter = this.occupationPresentationService.occupationFormatter;
        this.languageSkills$ = languageSkillService.getLanguages();

        this.jobPublicationForm = fb.group({
            job: fb.group({
                title: ['', Validators.required],
                occupation: fb.group({
                    occupationSuggestion: ['', Validators.required],
                    educationLevel: [],
                    experience: []
                }),
                description: ['', [Validators.required, Validators.maxLength(9000)]],
                workload: [[0, 100], Validators.required],
                publicationStartDate: fb.group({
                    immediate: 'true',
                    date: [{
                        value: null,
                        disabled: true
                    }, Validators.required]
                }),
                publicationEndDate: fb.group({
                    permanent: 'true',
                    date: [{
                        value: null,
                        disabled: true
                    }, Validators.required]
                }),
                startsImmediately: [],
                permanent: [],
                drivingLicenseLevel: [],
                location: fb.group({
                    countryCode: [this.countries[0].key, Validators.required],
                    text: []
                })
            }),
            company: fb.group({
                name: ['', Validators.required],
                street: ['', Validators.required],
                postboxNumber: [],
                countryCode: [this.countries[0].key, Validators.required]
            }),
            contact: fb.group({
                salutation: ['', Validators.required],
                firstName: ['', Validators.required],
                lastName: ['', Validators.required],
                phoneNumber: ['', Validators.required],
                email: ['', [Validators.required, Validators.pattern(EMAIL_REGEX)]],
            }),
            application: fb.group({
                written: [],
                electronic: [],
                phoneEnabled: [],
                email: [{
                    value: '',
                    disabled: true
                }, []],
                url: [{ value: '', disabled: true }, []],
                phoneNumber: [{ value: '', disabled: true }, [Validators.required]],
                additionalInfo: ['', [Validators.required, Validators.maxLength(240)]],
            }),
            publication: fb.group({
                jobroom: [],
                eures: [],
            })
        });

        this.validateCheckboxRelatedField('application.electronic',
            ['application.email', 'application.url']);
        this.validateCheckboxRelatedField('application.phoneEnabled', ['application.phoneNumber']);
        this.validateElectronicApplicationFields('application.email',
            'application.url', Validators.pattern(URL_REGEX));
        this.validateElectronicApplicationFields('application.url',
            'application.email', Validators.pattern(EMAIL_REGEX));

        this.configureDateInput('job.publicationStartDate.date', 'job.publicationStartDate.immediate',
            (disabled) => this.publicationStartDateByArrangement = disabled);
        this.configureDateInput('job.publicationEndDate.date', 'job.publicationEndDate.permanent',
            (disabled) => this.publicationEndDateIsPermanent = disabled);
        this.updatePublicationStartDateRelatedField();
    }

    getSwitzSelected(countryControl: AbstractControl): Observable<boolean> {
        return Observable.merge(
            Observable.of(countryControl.value),
            countryControl.valueChanges)
            .map((selectedCountry) => selectedCountry === this.SWITZ_KEY);
    }

    get job(): FormGroup {
        return this.jobPublicationForm.get('job') as FormGroup;
    }

    private validateCheckboxRelatedField(checkboxPath: string, relatedFieldPath: string[]) {
        this.jobPublicationForm.get(checkboxPath).valueChanges
            .takeUntil(this.unsubscribe$)
            .subscribe((enabled: boolean) => {
                relatedFieldPath.forEach((path) => {
                    const relatedControl = this.jobPublicationForm.get(path);
                    if (enabled) {
                        relatedControl.enable();
                    } else {
                        relatedControl.disable();
                        relatedControl.setValue('');
                    }
                    relatedControl.updateValueAndValidity();
                });
            });
    }

    private validateElectronicApplicationFields(source: string, target: string, validator: ValidatorFn) {
        this.jobPublicationForm.get(source).valueChanges
            .takeUntil(this.unsubscribe$)
            .distinctUntilChanged((a, b) => !a.length === !b.length)
            .subscribe((value) => {
                const validators = value ? [validator] : [Validators.required, validator];
                const applicationUrlControl = this.jobPublicationForm.get(target);
                applicationUrlControl.setValidators(validators);
                applicationUrlControl.updateValueAndValidity();
            });
    }

    private configureDateInput(dateInputPath: string, radioButtonsPath: string, onChange: (disabled: boolean) => void) {
        const date = this.jobPublicationForm.get(dateInputPath);
        this.jobPublicationForm.get(radioButtonsPath).valueChanges
            .takeUntil(this.unsubscribe$)
            .subscribe((value) => {
                if (value === 'false') {
                    date.enable();
                    onChange(false);
                } else {
                    date.disable();
                    onChange(true);
                }
            });
    }

    private updatePublicationStartDateRelatedField() {
        this.jobPublicationForm.get('job.publicationStartDate.date').valueChanges
            .takeUntil(this.unsubscribe$)
            .subscribe((value) => {
                if (value) {
                    const publicationEndDateControl = this.jobPublicationForm.get('job.publicationEndDate.date');
                    const publicationStartDate = JobPublicationToolComponent.mapNgbDateStructToDate(value);
                    const publicationEndDate = JobPublicationToolComponent
                        .mapNgbDateStructToDate(publicationEndDateControl.value ? publicationEndDateControl.value : this.publicationEndDateMin);

                    if (publicationStartDate > publicationEndDate) {
                        publicationEndDateControl.setValue(null);
                    }
                    this.publicationEndDateMin = JobPublicationToolComponent.mapDateToNgbDateStruct(publicationStartDate);
                }
            });
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    max(...values: number[]): number {
        return Math.max(...values);
    }

    blockExtraCharacters(event: any, maxLength: number): void {
        if (event.target.value.length >= maxLength) {
            event.preventDefault();
        }
    }

    getPoBoxZipCodeTranslations(): Translations {
        return {
            zipCode: 'home.tools.job-publication.company.postbox-zipcode',
            zip: 'home.tools.job-publication.company.postbox-zip',
            city: 'home.tools.job-publication.company.postbox-city'
        };
    }

    onSubmit(): void {
        const jobPublication: any = Object.assign({}, this.jobPublicationForm.value);
        if (this.jobPublicationForm.contains('job.occupation.occupationSuggestion')) {
            jobPublication.job.occupation.code = this.jobPublicationForm.get('job.occupation.occupationSuggestion').value.code;
        }

        jobPublication.job.workingTimePercentageFrom = jobPublication.job.workload[0];
        jobPublication.job.workingTimePercentageTo = jobPublication.job.workload[1];

        console.log(jobPublication);
    }
}
