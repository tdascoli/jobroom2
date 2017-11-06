import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { OccupationService } from '../../../shared/reference-service/occupation.service';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { OccupationSuggestion } from '../../../shared/reference-service/occupation-autocomplete';
import { Subject } from 'rxjs/Subject';
import {
    DrivingLicenceCategory,
    Experience,
    ISCED_1997
} from '../../../shared/model/shared-types';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { LanguageSkillService } from '../../../candidate-search/services/language-skill.service';

@Component({
    selector: 'jr2-job-publication-tool',
    templateUrl: './job-publication-tool.component.html',
    styleUrls: ['./job-publication-tool.component.scss']
})
export class JobPublicationToolComponent implements OnInit, OnDestroy {
    educationLevels = ISCED_1997;
    experiences = Experience;
    drivingLicenceCategories = DrivingLicenceCategory;
    countries = [
        { key: 'CH', value: 'Schweiz' },
        { key: 'DE', value: 'DE' },
        { key: 'FR', value: 'FR' },
        { key: 'IT', value: 'IT' },
        { key: 'UK', value: 'UK' },
        { key: 'A', value: 'A' }
    ];
    languageSkills$: Observable<Array<string>>;

    jobPublicationForm: FormGroup;
    publicationStartDateByArrangement = true;
    minDate = JobPublicationToolComponent.buildMinDate();

    unsubscribe$ = new Subject<void>();

    private static buildMinDate(): NgbDateStruct {
        const now = new Date();
        return {
            year: now.getFullYear(),
            month: now.getMonth() + 1,
            day: now.getDate()
        };
    }

    constructor(private occupationService: OccupationService,
                private fb: FormBuilder,
                private languageSkillService: LanguageSkillService) {
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
                    immediate: 'false',
                    date: [{
                        value: null,
                        disabled: true
                    }, Validators.required]
                }),
                publicationEndDate: [],
                startsImmediately: [],
                permanent: [],
                drivingLicenseLevel: [],
                location: fb.group({
                    countryCode: [this.countries[0].key, Validators.required],
                    zipCode: ['', Validators.required],
                    text: []
                })
            }),
            company: fb.group({
                name: ['', Validators.required],
                street: ['', Validators.required],
                zipCode: ['', Validators.required],
                postboxNumber: [],
                postboxZipCode: [],
                countryCode: [this.countries[0].key, Validators.required]
            }),
            contact: fb.group({
                salutation: ['', Validators.required],
                firstName: ['', Validators.required],
                lastName: ['', Validators.required],
                phoneNumber: ['', Validators.required],
                email: ['', Validators.email],
            }),
            application: fb.group({
                mailEnabled: [],
                emailEnabled: [],
                phoneEnabled: [],
                email: [{ value: '', disabled: true }],
                url: [{ value: '', disabled: true }],
                phoneNumber: [{ value: '', disabled: true }],
                additionalInfo: ['', [Validators.required, Validators.maxLength(240)]],
            }),
            publication: fb.group({
                jobroom: [],
                eures: [],
            })
        });

        this.validateCheckboxRelatedField('application.mailEnabled',
            'application.url');
        this.validateCheckboxRelatedField('application.emailEnabled',
            'application.email', [Validators.email]);
        this.validateCheckboxRelatedField('application.phoneEnabled',
            'application.phoneNumber');
        this.configurePublicationStartDateInputs();
    }

    get job(): FormGroup {
        return this.jobPublicationForm.get('job') as FormGroup;
    }

    private validateCheckboxRelatedField(checkboxPath: string, relatedFieldPath: string, additionalValidators: ValidatorFn[] = []) {
        this.jobPublicationForm.get(checkboxPath).valueChanges
            .takeUntil(this.unsubscribe$)
            .subscribe((enabled: boolean) => {
                const relatedControl = this.jobPublicationForm.get(relatedFieldPath);
                if (enabled) {
                    relatedControl.enable();
                    relatedControl.setValidators([Validators.required, ...additionalValidators]);
                } else {
                    relatedControl.disable();
                    relatedControl.setValue('');
                    relatedControl.clearValidators();
                }
                relatedControl.updateValueAndValidity();
            });
    }

    private configurePublicationStartDateInputs() {
        const date = this.jobPublicationForm.get('job.publicationStartDate.date');
        this.jobPublicationForm.get('job.publicationStartDate.immediate').valueChanges
            .takeUntil(this.unsubscribe$)
            .subscribe((value) => {
                if (value === 'true') {
                    date.enable();
                    this.publicationStartDateByArrangement = false;
                } else {
                    date.disable();
                    this.publicationStartDateByArrangement = true;
                }
            });
    }

    fetchOccupationSuggestions = (prefix$: Observable<string>) => prefix$
        .filter((prefix: string) => prefix.length > 2)
        .switchMap((prefix: string) => this.occupationService.getOccupations(prefix));

    occupationFormatter = (occupation: OccupationSuggestion) => occupation.name;

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
