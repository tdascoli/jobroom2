import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { OccupationService } from '../../../shared/reference-service/occupation.service';
import { TypeaheadMultiselectModel } from '../../../shared/input-components';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'jr2-job-publication-tool',
    templateUrl: './job-publication-tool.component.html',
    styleUrls: ['./job-publication-tool.component.scss']
})
export class JobPublicationToolComponent implements OnInit {
    jobPublicationForm: FormGroup;

    constructor(private occupationService: OccupationService,
                private fb: FormBuilder) {
        this.jobPublicationForm = fb.group({
            title: [],
            occupation: fb.array([]),
            description: [],
            workload: fb.group({
                workingTimePercentageMin: [],
                workingTimePercentageMax: []
            }),
            publicationStartDate: [],
            publicationEndDate: [],
            drivingLicenseLevel: [],
            languages: fb.array([]),
            locality: fb.group({
                countryCode: [],
                zipCode: [],
                text: []
            }),
            company: fb.group({
                name: [],
                street: [],
                zipCode: [],
                postboxNumber: [],
                postboxZipCode: [],
                countryCode: []
            }),
            contact: fb.group({
                salutation: [],
                firstName: [],
                lastName: [],
                phone: [],
                email: [],
            }),
            application: fb.group({
                mailEnabled: [],
                emailEnabled: [],
                phoneEnabled: [],
                email: [],
                url: [],
                phone: [],
                additionalInfo: [],
            }),
            publication: fb.group({
                jobroom: [],
                eures: [],
            })
        });
    }

    fetchOccupationSuggestions = (query: string): Observable<TypeaheadMultiselectModel[]> => this.occupationService.fetchSuggestions(query);

    ngOnInit(): void {
    }

    onSubmit(): void {

    }
}
