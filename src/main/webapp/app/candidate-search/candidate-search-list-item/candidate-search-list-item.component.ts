import { Component, Input, OnInit } from '@angular/core';
import { CandidateProfile, JobExperience } from '../services/candidate';
import { Observable } from 'rxjs/Observable';
import {
    GenderAwareOccupationLabel,
    OccupationPresentationService
} from '../../shared/reference-service';
import { CandidateService } from '../services/candidate.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'jr2-candidate-search-list-item',
    templateUrl: './candidate-search-list-item.component.html',
    styles: []
})
export class CandidateSearchListItemComponent implements OnInit {
    @Input() profile: CandidateProfile;
    @Input() occupationCodes: Array<string>;

    jobExperience$: Observable<JobExperience>;
    validExperienceData = true;
    isDisplayExperience = false;

    constructor(private occupationPresentationService: OccupationPresentationService,
                private candidateService: CandidateService,
                private translateService: TranslateService) {
    }

    ngOnInit(): void {
        const relevantJobExperience = this.candidateService.getRelevantJobExperience(
            this.occupationCodes, this.profile.jobExperiences);

        if (relevantJobExperience) {
            this.isDisplayExperience = !!relevantJobExperience.experience;

            const currentLanguage$ = this.translateService.onLangChange
                .map((langChange) => langChange.lang)
                .startWith(this.translateService.currentLang);

            this.jobExperience$ = currentLanguage$
                .switchMap((language) =>
                    this.occupationPresentationService.findOccupationLabelsByAvamCode(relevantJobExperience.occupation.avamCode, language))
                .map((occupationLabels: GenderAwareOccupationLabel) => Object.assign({}, relevantJobExperience,
                    {
                        occupationLabel: occupationLabels.default
                    }))
                .shareReplay();
        } else {
            this.validExperienceData = false;
        }
    }
}
