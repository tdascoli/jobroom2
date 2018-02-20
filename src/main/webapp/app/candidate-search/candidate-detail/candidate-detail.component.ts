import { Component, OnInit } from '@angular/core';
import {
    Candidate,
    CandidateProfile,
    Degree,
    JobExperience
} from '../services/candidate';
import { Observable } from 'rxjs/Observable';
import {
    GenderAwareOccupationLabel,
    JobCenter,
    OccupationPresentationService,
    ReferenceService
} from '../../shared/reference-service';
import { CandidateService } from '../services/candidate.service';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import {
    CandidateSearchFilter,
    CandidateSearchState,
    getCandidateProfileList,
    getSearchFilter,
    getSelectedCandidateProfile,
    getTotalCandidateCount
} from '../state-management/state/candidate-search.state';
import { Contact, Gender, Graduation } from '../../shared';
import { Principal } from '../../shared/auth/principal.service';
import {
    MailToOpenedAction,
    PhoneToOpenedAction,
    PrintCandidateAction
} from '../state-management/actions/candidate-search.actions';

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
    preferredWorkRegions$: Observable<Array<string>>;
    preferredWorkCantons$: Observable<Array<string>>;
    contact$: Observable<Contact>;

    constructor(private referenceService: ReferenceService,
                private candidateService: CandidateService,
                private occupationPresentationService: OccupationPresentationService,
                private translateService: TranslateService,
                private principal: Principal,
                private store: Store<CandidateSearchState>) {
    }

    ngOnInit() {
        this.candidateProfile$ = this.store.select(getSelectedCandidateProfile)
            .filter((candidateProfile) => !!candidateProfile);

        this.jobCenter$ = this.candidateProfile$
            .map((candidateProfile) => candidateProfile.jobCenterCode)
            .flatMap((jobCenterCode) => jobCenterCode
                ? this.referenceService.resolveJobCenter(jobCenterCode)
                : Observable.empty());

        this.candidateProtectedData$ = this.candidateProfile$
            .flatMap((candidateProfile) => this.candidateService.findCandidate(candidateProfile));

        this.candidateProfiles$ = this.store.select(getCandidateProfileList);
        this.candidateProfileListTotalSize$ = this.store.select(getTotalCandidateCount);

        this.jobExperiences$ = this.candidateProfile$
            .flatMap((profile) => {
                const wantedJobExperiences = profile.jobExperiences
                    .filter((experience) => experience.wanted);
                return Observable.combineLatest(wantedJobExperiences.map(this.enrichWithLabels.bind(this)))
                    .map((jobExperiences) => jobExperiences.map(this.formatOccupationLabel(profile.gender)))
            })
            .map((experiences) => experiences.sort((a, b) => +b.lastJob - +a.lastJob))
            .shareReplay();

        const occupationCodes$ = this.store.select(getSearchFilter)
            .map((searchFilter: CandidateSearchFilter) =>
                searchFilter.occupations
                    ? searchFilter.occupations.map((typeaheadMultiselectModel) => typeaheadMultiselectModel.code)
                    : []
            );

        this.relevantJobExperience$ = this.jobExperiences$
            .combineLatest(occupationCodes$, this.jobExperiences$)
            .map(([jobExperiences, occupationCodes]) =>
                this.candidateService.getRelevantJobExperience(occupationCodes, jobExperiences));
        this.populatePreferredWorkLocations();

        this.contact$ = Observable.combineLatest(this.candidateProfile$, this.jobCenter$)
            .map(([candidateProfile, jobCenter]) => {
                if (jobCenter && (jobCenter.code.startsWith('BEA') || jobCenter.code.startsWith('BSA'))) {
                    return { phone: jobCenter.phone, email: jobCenter.email };
                } else {
                    return candidateProfile.jobAdvisor;
                }
            })
    }

    private enrichWithLabels(jobExperience: JobExperience): Observable<EnrichedJobExperience> {
        const currentLanguage$ = this.translateService.onLangChange
            .map((langChange) => langChange.lang)
            .startWith(this.translateService.currentLang);

        return currentLanguage$
            .switchMap((language) =>
                this.occupationPresentationService.findOccupationLabelsByAvamCode(jobExperience.occupation.avamCode, language)
                    .map((occupationLabels: GenderAwareOccupationLabel) =>
                        Object.assign({}, jobExperience, { occupationLabels }))
            );
    }

    private formatOccupationLabel(gender: Gender): (jobExperience: EnrichedJobExperience) => EnrichedJobExperience {
        return (jobExperience: EnrichedJobExperience) => {
            const { male, female } = jobExperience.occupationLabels;
            const occupationLabel = (gender === Gender.FEMALE && female) ? female : male;
            return Object.assign({}, jobExperience, { occupationLabel });
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
        this.store.dispatch(new PrintCandidateAction());
    }

    onSendLink(): void {
        this.store.dispatch(new MailToOpenedAction('sendLink'));
    }

    onMailToJobCenter(): void {
        this.store.dispatch(new MailToOpenedAction('jobCenter'));
    }

    onPhoneToJobCenter(): void {
        this.store.dispatch(new PhoneToOpenedAction('jobCenter'));
    }

    onMailToCandidate(): void {
        this.store.dispatch(new MailToOpenedAction('candidate'));
    }

    onPhoneToCandidate(): void {
        this.store.dispatch(new PhoneToOpenedAction('candidate'));
    }

    getCandidateUrl() {
        return window.location.href;
    }

    getEncodedCandidateUrl() {
        // todo: Review if we need a pipe for this.
        return encodeURIComponent(this.getCandidateUrl());
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
