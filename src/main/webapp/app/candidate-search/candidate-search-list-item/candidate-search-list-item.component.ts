import { Component, Input, OnInit } from '@angular/core';
import { CandidateProfile, JobExperience } from '../services/candidate';
import { Observable } from 'rxjs/Observable';
import {
    Occupation,
    OccupationService
} from '../../shared/reference-service/occupation.service';
import { CandidateService } from '../services/candidate.service';

@Component({
    selector: 'jr2-candidate-search-list-item',
    templateUrl: './candidate-search-list-item.component.html',
    styles: []
})
export class CandidateSearchListItemComponent implements OnInit {
    @Input() profile: CandidateProfile;
    @Input() occupationCode: string;

    jobExperience$: Observable<JobExperience>;
    validExperienceData = true;

    constructor(private occupationService: OccupationService,
                private candidateService: CandidateService) {
    }

    ngOnInit(): void {
        const relevantJobExperience = this.candidateService.getRelevantJobExperience(
            this.occupationCode, this.profile.jobExperiences);

        if (relevantJobExperience) {
            this.jobExperience$ = this.occupationService.findOccupationByCode(relevantJobExperience.occupationCode)
                .map((occupation: Occupation) => Object.assign({}, relevantJobExperience,
                    {
                        occupation: occupation.labels.male +
                        ((occupation.labels.female && occupation.labels.male !== occupation.labels.female )
                            ? ' / ' + occupation.labels.female : '')
                    }));
        } else {
            this.validExperienceData = false;
        }
    }
}
