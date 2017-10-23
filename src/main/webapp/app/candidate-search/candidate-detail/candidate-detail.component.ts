import {
    Component,
    OnInit
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Candidate, CandidateProfile, JobExperience } from '../services/candidate';
import { Observable } from 'rxjs/Observable';
import {
    JobCenter,
    ReferenceService
} from '../../shared/reference-service/reference.service';
import { CandidateService } from '../services/candidate.service';
import { OccupationService } from '../../shared/index';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import {
    CandidateSearchState,
    getCandidateProfileList,
    getTotalCandidateCount
} from '../state-management/state/candidate-search.state';
import { Occupation } from '../../shared/reference-service/occupation.service';

interface EnrichedJobExperience extends JobExperience {
    occupationLabels: {}
}

@Component({
    selector: 'jr2-candidate-detail',
    templateUrl: './candidate-detail.component.html',
    styleUrls: ['./candidate-detail.component.scss']
})
export class CandidateDetailComponent implements OnInit {
    candidateProfile$: Observable<CandidateProfile>;
    jobExperiences$: Observable<Array<EnrichedJobExperience>>;
    jobCenter$: Observable<JobCenter>;
    candidateProtectedData$: Observable<Candidate>;
    candidateProfiles$: Observable<Array<CandidateProfile>>;
    candidateProfileListTotalSize$: Observable<number>;
    candidateUrl: string;
    isCopied: boolean;

    constructor(private route: ActivatedRoute,
                private referenceService: ReferenceService,
                private candidateService: CandidateService,
                private occupationService: OccupationService,
                private translateService: TranslateService,
                private store: Store<CandidateSearchState>) {
    }

    ngOnInit() {
        this.candidateProfile$ = this.route.data
            .map((data) => data['candidateProfile']);

        this.jobCenter$ = this.candidateProfile$
            .map((candidateProfile) => candidateProfile.jobCenterCode)
            .flatMap((jobCenterCode) => jobCenterCode
                ? this.referenceService.resolveJobCenter(jobCenterCode)
                : Observable.empty());

        this.candidateProtectedData$ = this.candidateProfile$
            .map((candidateProfile) => candidateProfile.id)
            .flatMap((id) => this.candidateService.findCandidate(id));

        this.candidateUrl = window.location.href;

        this.candidateProfiles$ = this.store.select(getCandidateProfileList);
        this.candidateProfileListTotalSize$ = this.store.select(getTotalCandidateCount);

        const currentLanguage$ = Observable.merge(
            Observable.of(this.translateService.currentLang),
            this.translateService.onLangChange
                .map((langChange) => langChange.lang));

        this.jobExperiences$ = this.candidateProfile$
            .map((profile: CandidateProfile) => profile.jobExperiences)
            .flatMap((experiences) => Observable.combineLatest(experiences.map(this.enrichWithLabels.bind(this))))
            .combineLatest(currentLanguage$)
            .map(([experiences, lang]) => experiences.map(this.enrichWithCurrentLabel(lang)));
    }

    private enrichWithLabels(jobExperience: JobExperience): Observable<EnrichedJobExperience> {
        return this.occupationService.findOccupationByCode(jobExperience.occupationCode)
            .map((occupation: Occupation) => Object.assign({}, jobExperience,
                { occupationLabels: occupation.labels }));
    }

    private enrichWithCurrentLabel(lang: string): (jobExperience: EnrichedJobExperience) => EnrichedJobExperience {
        return (jobExperience: EnrichedJobExperience) => {
            return Object.assign({}, jobExperience, {
                occupation: jobExperience.occupationLabels[lang]
                    ? jobExperience.occupationLabels[lang]
                    : jobExperience.occupationCode
            });
        }
    }

    printCandidateDetails(): void {
        window.print();
    }
}
