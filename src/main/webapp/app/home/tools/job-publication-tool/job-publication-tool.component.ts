import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { OccupationService } from '../../../shared/reference-service/occupation.service';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { OccupationSuggestion } from '../../../shared/reference-service/occupation-autocomplete';
import { Subject } from 'rxjs/Subject';
import { DrivingLicenceCategory, Experience, ISCED_1997 } from '../../../shared/model/shared-types';

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

    jobPublicationForm: FormGroup;

    unsubscribe$ = new Subject<void>();

    constructor(private occupationService: OccupationService,
                private fb: FormBuilder) {
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
                publicationStartDate: [],
                publicationEndDate: [],
                startsImmediately: [],
                permanent: [],
                drivingLicenseLevel: [],
                languageSkills: [],
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
