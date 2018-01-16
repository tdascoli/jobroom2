import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
    Candidate, CandidateProfile, Degree,
    JobExperience
} from '../services/candidate';
import { Observable } from 'rxjs/Observable';
import {
    GenderAwareOccupationLabel, JobCenter, OccupationPresentationService,
    ReferenceService
} from '../../shared/reference-service';
import { CandidateService } from '../services/candidate.service';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import {
    CandidateSearchFilter, CandidateSearchState, getCandidateProfileList,
    getSearchFilter, getTotalCandidateCount
} from '../state-management/state/candidate-search.state';
import { Contact, Gender, Graduation } from '../../shared';
import { Principal } from '../../shared/auth/principal.service';

interface EnrichedJobExperience extends JobExperience {
    occupationLabels: {
        male: String,
        female: String
    }
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
    relevantJobExperience$: Observable<JobExperience>;
    candidateUrl: string;
    preferredWorkRegions$: Observable<Array<string>>;
    preferredWorkCantons$: Observable<Array<string>>;
    contact: Contact;

    constructor(private route: ActivatedRoute,
                private referenceService: ReferenceService,
                private candidateService: CandidateService,
                private occupationPresentationService: OccupationPresentationService,
                private translateService: TranslateService,
                private principal: Principal,
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
            .flatMap((candidateProfile) => this.candidateService.findCandidate(candidateProfile));

        this.candidateUrl = window.location.href;

        this.candidateProfiles$ = this.store.select(getCandidateProfileList);
        this.candidateProfileListTotalSize$ = this.store.select(getTotalCandidateCount);

        const currentLanguage$ = Observable.merge(
            Observable.of(this.translateService.currentLang),
            this.translateService.onLangChange
                .map((langChange) => langChange.lang));

        this.jobExperiences$ = Observable.combineLatest(this.candidateProfile$, currentLanguage$)
            .flatMap(([profile]) => {
                const wantedJobExperiences = profile.jobExperiences
                    .filter((experience) => experience.wanted);
                return Observable.combineLatest(wantedJobExperiences.map(this.enrichWithLabels.bind(this)))
                    .map((jobExperiences) => jobExperiences.map(this.formatOccupationLabel(profile.gender)))
            })
            .map((experiences) => experiences.sort((a, b) => +b.lastJob - +a.lastJob))
            .shareReplay();

        const occupationCode$ = this.store.select(getSearchFilter)
            .map((searchFilter: CandidateSearchFilter) => searchFilter.occupation ? searchFilter.occupation.key : null);

        this.relevantJobExperience$ = this.jobExperiences$
            .combineLatest(occupationCode$, this.jobExperiences$)
            .map(([jobExperiences, occupationCode]) =>
                this.candidateService.getRelevantJobExperience(occupationCode, jobExperiences));
        this.populatePreferredWorkLocations();

        Observable.combineLatest(this.candidateProfile$, this.jobCenter$)
            .subscribe(([candidateProfile, jobCenter]) => {
                if (jobCenter && (jobCenter.code.startsWith('BEA') || jobCenter.code.startsWith('BSA'))) {
                    this.contact =  { phone: jobCenter.phone, email: jobCenter.email };
                } else {
                    this.contact = candidateProfile.jobAdvisor;
                }
            });
    }

    private enrichWithLabels(jobExperience: JobExperience): Observable<EnrichedJobExperience> {
        return this.occupationPresentationService.findOccupationLabelsByAvamCode(jobExperience.occupationCode)
            .map((occupationLabels: GenderAwareOccupationLabel) =>
                Object.assign({}, jobExperience, { occupationLabels }));
    }

    private formatOccupationLabel(gender: Gender): (jobExperience: EnrichedJobExperience) => EnrichedJobExperience {
        return (jobExperience: EnrichedJobExperience) => {
            const { male, female } = jobExperience.occupationLabels;
            const occupation = (gender === Gender.FEMALE && female) ? female : male;
            return Object.assign({}, jobExperience, { occupation });
        }
    }

    private populatePreferredWorkLocations(): void {
        this.preferredWorkRegions$ = this.candidateProfile$
            .flatMap((candidateProfile) => this.translateValues(candidateProfile.preferredWorkRegions,
                'global.reference.region.'));
        this.preferredWorkCantons$ = this.candidateProfile$
            .flatMap((candidateProfile) => this.translateValues(candidateProfile.preferredWorkCantons,
                'global.reference.canton.'));
    }

    private translateValues(values: Array<string>, keyPrefix: string): Observable<Array<string>> {
        // TODO: implement translation pipe
        if (values && values.length) {
            const keys = values.map((value) => keyPrefix.concat(value));
            return this.translateService.stream(keys)
                .map((translations) => keys.map((key) => translations[key]));
        }
        return Observable.of([]);
    }

    printCandidateDetails(): void {
        window.print();
    }

    isDisplayGraduation(graduation: string): boolean {
        return graduation && graduation !== Graduation[Graduation.NONE];
    }

    isDisplayDegree(degree: string): boolean {
        return degree && Degree[degree] >= Degree.SEK_II_WEITERFUEHRENDE_SCHULE
            && Degree[degree] <= Degree.TER_DOKTORAT_UNIVERSITAET;
    }

    isAuthenticated(): boolean {
        return this.principal.isAuthenticated();
    }
}
