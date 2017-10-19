import { Component, Input, OnInit } from '@angular/core';
import { CandidateProfile, JobExperience } from '../services/candidate';
import { Observable } from 'rxjs/Observable';
import {
    Occupation,
    OccupationService
} from '../../shared/reference-service/occupation.service';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

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

    private currentLanguage$: Observable<string>;

    constructor(private occupationService: OccupationService,
                private translateService: TranslateService) {

        this.currentLanguage$ = Observable.merge(
            new BehaviorSubject(translateService.currentLang),
            translateService.onLangChange.map((langChange) => langChange.lang)
        );
    }

    ngOnInit(): void {
        let relevantJobExperience;
        if (this.occupationCode) {
            const occupationCodeNum = Number.parseInt(this.occupationCode);
            relevantJobExperience = this.profile.jobExperiences
                .find((jobExperience) => jobExperience.occupationCode === occupationCodeNum);
        } else if (this.profile.jobExperiences.length > 0) {
            relevantJobExperience = this.profile.jobExperiences[0];
        }

        if (relevantJobExperience) {
            this.jobExperience$ = this.occupationService.findOccupationByCode(relevantJobExperience.occupationCode)
                .map((occupation: Occupation) => Object.assign({}, relevantJobExperience, { occupationLabels: occupation.labels }))
                .combineLatest(this.currentLanguage$)
                .map(([experience, lang]) => Object.assign({}, experience, { occupation: experience.occupationLabels[lang] }));
        } else {
            this.validExperienceData = false;
        }
    }
}
