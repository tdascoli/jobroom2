import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy,
    OnInit
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    ValidatorFn,
    Validators
} from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import {
    DrivingLicenceCategory, ResponseWrapper,
} from '../../../shared';
import { LanguageSkillService } from '../../../candidate-search/services/language-skill.service';
import {
    FormatterFn,
    OccupationOption,
    OccupationPresentationService,
    SuggestionLoaderFn
} from '../../../shared/reference-service';
import { Translations } from './zip-code/zip-code.component';
import { EMAIL_REGEX, URL_REGEX } from '../../../shared';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import * as countries from 'i18n-iso-countries';
import { PHONE_NUMBER_REGEX, POSTBOX_NUMBEB_REGEX } from '../../../shared';
import { EducationLevel, Experience, JobPublication } from '../../../shared/job-publication/job-publication.model';
import { JobPublicationService } from '../../../shared/job-publication/job-publication.service';
import { Subscriber } from 'rxjs/Subscriber';
import { DateUtils } from '../../../shared';
import { JobPublicationMapper } from './job-publication-mapper';

@Component({
    selector: 'jr2-job-publication-tool',
    templateUrl: './job-publication-tool.component.html',
    styleUrls: ['./job-publication-tool.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobPublicationToolComponent implements OnInit, OnDestroy {
    private readonly SWITZ_KEY = 'CH';
    readonly JOB_DESCRIPTION_MAX_LENGTH = 9000;
    readonly APPLICATION_ADDITIONAL_INFO_MAX_LENGTH = 240;

    @Input()
    jobPublication: JobPublication;

    educationLevels = EducationLevel;
    experiences = Experience;
    drivingLicenceCategories = DrivingLicenceCategory;
    languageSkills$: Observable<Array<string>>;

    jobPublicationForm: FormGroup;
    publicationStartDateByArrangement = true;
    publicationEndDateIsPermanent = true;
    publicationStartDateMin = DateUtils.mapDateToNgbDateStruct();
    publicationEndDateMin = DateUtils.mapDateToNgbDateStruct();

    fetchOccupationSuggestions: SuggestionLoaderFn<Array<OccupationOption>>;
    occupationFormatter: FormatterFn<OccupationOption>;

    countries$: Observable<{ key: string, value: string }[]>;

    showSuccessSaveMessage: boolean;
    showErrorSaveMessage: boolean;

    private unsubscribe$ = new Subject<void>();

    constructor(private occupationPresentationService: OccupationPresentationService,
                private fb: FormBuilder,
                private languageSkillService: LanguageSkillService,
                private translateService: TranslateService,
                private jobPublicationService: JobPublicationService,
                private cd: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.fetchOccupationSuggestions = this.occupationPresentationService.fetchJobPublicationOccupationSuggestions;
        this.occupationFormatter = this.occupationPresentationService.occupationFormatter;
        this.languageSkills$ = this.languageSkillService.getLanguages();
        this.setupCountries();

        const formModel = this.jobPublication
            ? JobPublicationMapper.mapJobPublicationToFormModel(this.jobPublication)
            : this.createDefaultFormModel();

        this.jobPublicationForm = this.createJobPublicationForm(formModel);

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

    private createJobPublicationForm(formModel: any): FormGroup {
        return this.fb.group({
            job: this.fb.group({
                title: [formModel.job.title, Validators.required],
                occupation: this.fb.group({
                    occupationSuggestion: [formModel.job.occupation.occupationSuggestion, Validators.required],
                    educationLevel: [formModel.job.occupation.educationLevel],
                    experience: [formModel.job.occupation.experience]
                }),
                description: [formModel.job.description,
                    [Validators.required, Validators.maxLength(this.JOB_DESCRIPTION_MAX_LENGTH)]],
                workload: [formModel.job.workload, Validators.required],
                publicationStartDate: this.fb.group({
                    immediate: formModel.job.publicationStartDate.immediate,
                    date: [{
                        value: formModel.job.publicationStartDate.date,
                        disabled: !formModel.job.publicationStartDate.date
                    }, Validators.required]
                }),
                publicationEndDate: this.fb.group({
                    permanent: formModel.job.publicationEndDate.permanent,
                    date: [{
                        value: formModel.job.publicationEndDate.date,
                        disabled: !formModel.job.publicationEndDate.date
                    }, Validators.required]
                }),
                drivingLicenseLevel: [formModel.job.drivingLicenseLevel],
                location: this.fb.group({
                    zipCode: [formModel.job.location.zipCode],
                    countryCode: [formModel.job.location.countryCode, Validators.required],
                    additionalDetails: [formModel.job.location.additionalDetails]
                }),
                languageSkills: [formModel.job.languageSkills]
            }),
            company: this.fb.group({
                name: [formModel.company.name, Validators.required],
                street: [formModel.company.street, Validators.required],
                houseNumber: [formModel.company.houseNumber, Validators.required],
                zipCode: [formModel.company.zipCode],
                postboxNumber: [formModel.company.postboxNumber, Validators.pattern(POSTBOX_NUMBEB_REGEX)],
                postboxZipCode: [formModel.company.postboxZipCode],
                countryCode: [formModel.company.countryCode, Validators.required]
            }),
            contact: this.fb.group({
                salutation: [formModel.contact.salutation, Validators.required],
                firstName: [formModel.contact.firstName, Validators.required],
                lastName: [formModel.contact.lastName, Validators.required],
                phoneNumber: [formModel.contact.phoneNumber,
                    [Validators.required, Validators.pattern(PHONE_NUMBER_REGEX)]],
                email: [formModel.contact.email, [Validators.required, Validators.pattern(EMAIL_REGEX)]],
            }),
            application: this.fb.group({
                written: [formModel.application.written],
                electronic: [formModel.application.electronic],
                phoneEnabled: [formModel.application.phoneEnabled],
                email: [{
                    value: formModel.application.email,
                    disabled: true
                }, []],
                url: [{ value: formModel.application.url, disabled: true }, []],
                phoneNumber: [{
                    value: formModel.application.phoneNumber,
                    disabled: true
                }, [Validators.required, Validators.pattern(PHONE_NUMBER_REGEX)]],
                additionalInfo: [formModel.application.additionalInfo,
                    [Validators.required, Validators.maxLength(this.APPLICATION_ADDITIONAL_INFO_MAX_LENGTH)]],
            }),
            publication: this.fb.group({
                jobroom: [formModel.publication.jobroom],
                eures: [formModel.publication.eures],
            })
        });
    }

    private createDefaultFormModel(): any {
        return {
            job: {
                title: '',
                occupation: {
                    occupationSuggestion: null,
                    educationLevel: null,
                    experience: null
                },
                description: '',
                workload: [0, 100],
                publicationStartDate: {
                    immediate: true,
                    date: null
                },
                publicationEndDate: {
                    permanent: true,
                    value: null
                },
                drivingLicenseLevel: null,
                location: {
                    countryCode: this.SWITZ_KEY,
                    additionalDetails: '',
                    zipCode: ''
                },
                languageSkills: []
            },
            company: {
                name: '',
                street: '',
                houseNumber: '',
                postboxNumber: '',
                countryCode: this.SWITZ_KEY
            },
            contact: {
                salutation: null,
                firstName: '',
                lastName: '',
                phoneNumber: '',
                email: ''
            },
            application: {
                written: false,
                electronic: false,
                phoneEnabled: false,
                email: '',
                url: '',
                phoneNumber: '',
                additionalInfo: ''
            },
            publication: {
                jobroom: false,
                eures: false
            }
        };
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
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
        const checkbox = this.jobPublicationForm.get(checkboxPath);
        checkbox.valueChanges
            .takeUntil(this.unsubscribe$)
            .startWith(checkbox.value)
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
        const field = this.jobPublicationForm.get(source);
        field.valueChanges
            .takeUntil(this.unsubscribe$)
            .startWith(field.value)
            .map((value) => value ? value : '')
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
        const radioButton = this.jobPublicationForm.get(radioButtonsPath);
        radioButton.valueChanges
            .takeUntil(this.unsubscribe$)
            .startWith(radioButton.value)
            .subscribe((value) => {
                if (!value) {
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
                    const publicationStartDate = DateUtils.mapNgbDateStructToDate(value);
                    const publicationEndDate = DateUtils.mapNgbDateStructToDate(
                        publicationEndDateControl.value ? publicationEndDateControl.value : this.publicationEndDateMin);

                    if (publicationStartDate > publicationEndDate) {
                        publicationEndDateControl.setValue(null);
                    }
                    this.publicationEndDateMin = DateUtils.mapDateToNgbDateStruct(publicationStartDate);
                }
            });
    }

    max(...values: number[]): number {
        return Math.max(...values);
    }

    getPoBoxZipCodeTranslations(): Translations {
        return {
            zipCode: 'home.tools.job-publication.company.postbox-zipcode',
            zip: 'home.tools.job-publication.company.postbox-zip',
            city: 'home.tools.job-publication.company.postbox-city'
        };
    }

    onSubmit(): void {
        const jobPublication = JobPublicationMapper.mapJobPublicationFormToJobPublication(
            this.jobPublicationForm.value);

        this.jobPublicationService.save(jobPublication)
            .subscribe(this.createSaveSubscriber());
    }

    private createSaveSubscriber() {
        return Subscriber.create(
            (resp: ResponseWrapper) => {
                const changeStatusCb = resp.status === 201
                    ? (show) => this.showSuccessSaveMessage = show
                    : (show) => this.showErrorSaveMessage = show;
                this.showAlert(changeStatusCb);
            },
            (_) => this.showAlert((show) => this.showErrorSaveMessage = show)
        );
    }

    private showAlert(changeAlertStatus: (show: boolean) => void): void {
        changeAlertStatus(true);
        this.cd.markForCheck();
        window.scroll(0, 0);
        setTimeout(() => {
            changeAlertStatus(false);
            this.cd.markForCheck();
        }, 5000);
    }

    private setupCountries(): void {
        countries.registerLocale(require('i18n-iso-countries/langs/en.json'));
        countries.registerLocale(require('i18n-iso-countries/langs/fr.json'));
        countries.registerLocale(require('i18n-iso-countries/langs/de.json'));
        countries.registerLocale(require('i18n-iso-countries/langs/it.json'));

        this.countries$ = Observable.merge(
            Observable.of(this.translateService.currentLang),
            this.translateService.onLangChange.map((e: LangChangeEvent) => e.lang))
            .map((lang: string) => {
                const countryNames = countries.getNames(lang);
                return Object.keys(countryNames)
                    .map((key) => ({ key, value: countryNames[key] }));
            });
    }

    resetForm(): void {
        this.jobPublicationForm.reset(this.createDefaultFormModel());
    }
}
