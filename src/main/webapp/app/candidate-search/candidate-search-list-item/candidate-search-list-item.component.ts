import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { CandidateProfile, JobExperience } from '../services/candidate';
import { Observable } from 'rxjs/Observable';
import {
    GenderAwareOccupationLabel,
    OccupationPresentationService
} from '../../shared/reference-service';
import { CandidateService } from '../services/candidate.service';
import { CandidateLoggingService } from '../services/candidate.logging.service';

@Component({
    selector: 'jr2-candidate-search-list-item',
    templateUrl: './candidate-search-list-item.component.html',
    styles: []
})
export class CandidateSearchListItemComponent implements OnInit {
    @Input() profile: CandidateProfile;
    @Input() occupationCode: string;
    @Input() index: number;

    jobExperience$: Observable<JobExperience>;
    validExperienceData = true;

    constructor(private occupationPresentationService: OccupationPresentationService,
                private candidateService: CandidateService,
                private candidateLoggingService: CandidateLoggingService,
                private http: Http) {
    }

    ngOnInit(): void {
        const relevantJobExperience = this.candidateService.getRelevantJobExperience(
            this.occupationCode, this.profile.jobExperiences);

        if (relevantJobExperience) {
            this.jobExperience$ = this.occupationPresentationService.findOccupationLabelsByAvamCode(relevantJobExperience.occupationCode)
                .map((occupationLabels: GenderAwareOccupationLabel) => Object.assign({}, relevantJobExperience,
                    {
                        occupation: occupationLabels.male +
                        ((occupationLabels.female && occupationLabels.male !== occupationLabels.female )
                            ? ' / ' + occupationLabels.female : '')
                    }));
        } else {
            this.validExperienceData = false;
        }
    }

    logHit(): void {
        this.candidateLoggingService.logCandidateEvent({ event: 'hit', id: this.profile.id, rank: this.index });
    }
}
