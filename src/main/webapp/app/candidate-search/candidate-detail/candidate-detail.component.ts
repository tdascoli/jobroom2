import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
    Candidate,
    CandidateProfile,
    Degree,
    JobExperience
} from '../services/candidate';
import { Observable } from 'rxjs/Observable';
import {
    JobCenter,
    ReferenceService
} from '../../shared/reference-service/reference.service';
import { CandidateService } from '../services/candidate.service';
import {
    GenderAwareOccupationLabel,
    OccupationPresentationService
} from '../../shared/reference-service';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import {
    CandidateSearchFilter,
    CandidateSearchState,
    getCandidateProfileList,
    getSearchFilter,
    getTotalCandidateCount
} from '../state-management/state/candidate-search.state';
import { Gender, Graduation } from '../../shared/model/shared-types';
import { Http } from '@angular/http';
import { Location } from '@angular/common';
import { CandidateLoggingService } from '../services/candidate.logging.service';

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
export class CandidateDetailComponent implements OnInit, OnDestroy {
    candidateProfile$: Observable<CandidateProfile>;
    jobExperiences$: Observable<Array<EnrichedJobExperience>>;
    jobCenter$: Observable<JobCenter>;
    candidateProtectedData$: Observable<Candidate>;
    candidateProfiles$: Observable<Array<CandidateProfile>>;
    candidateProfileListTotalSize$: Observable<number>;
    relevantJobExperience$: Observable<JobExperience>;
    candidateUrl: string;
    isCopied: boolean;
    preferredWorkRegions$: Observable<Array<string>>;
    preferredWorkCantons$: Observable<Array<string>>;
    locationSubscription: any;
    RAVContactVisible: boolean;
    candidateContactVisible: boolean;

    constructor(private route: ActivatedRoute,
                private referenceService: ReferenceService,
                private candidateService: CandidateService,
                private occupationPresentationService: OccupationPresentationService,
                private translateService: TranslateService,
                private store: Store<CandidateSearchState>,
                private http: Http,
                private location: Location,
                private loggingService: CandidateLoggingService) {
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

        this.jobExperiences$ = this.candidateProfile$
            .map((profile: CandidateProfile) => profile.jobExperiences)
            .flatMap((experiences) => Observable.combineLatest(experiences.map(this.enrichWithLabels.bind(this))))
            .combineLatest(this.candidateProfile$, currentLanguage$)
            .map(([experiences, profile, lang]) => experiences.map(this.formatOccupationLabel(profile.gender)))
            .map((experiences) => experiences
                .filter((experience) => experience.wanted)
                .sort((a, b) => +b.lastJob - +a.lastJob));

        const occupationCode$ = this.store.select(getSearchFilter)
            .map((searchFilter: CandidateSearchFilter) => searchFilter.occupation ? searchFilter.occupation.key : null);

        this.relevantJobExperience$ = this.jobExperiences$
            .combineLatest(occupationCode$)
            .map(([jobExperiences, occupationCode]) =>
                this.candidateService.getRelevantJobExperience(occupationCode, jobExperiences));
        this.populatePreferredWorkLocations();

        this.locationSubscription = this.location.subscribe((event) => {
                if (event.type === 'popstate' && event.url.indexOf('candidate-detail') < 0) {
                    // Technically, this could just be done in ngOnDestroy directly
                    this.profileMetrics('prflft');
                } else {
                    // Log a nav?
                }
            }
        );

        this.RAVContactVisible = false;
        this.candidateContactVisible = false;
    }

    ngOnDestroy() {
        this.locationSubscription.unsubscribe();
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
        this.profileMetrics({ event: 'prnt' });
        window.print();
    }

    isDisplayGraduation(graduation: string) {
        return graduation && graduation !== Graduation[Graduation.NONE];
    }

    isDisplayDegree(degree: string) {
        return degree && Degree[degree] >= Degree.SEKUNDARSCHULE_OBERSTUFE
            && Degree[degree] <= Degree.DOKTORAT;
    }

    sendAsMail(): void {
        this.profileMetrics({ event: 'sndlnk' });
    }

    copyLink(): void {
        this.profileMetrics({ event: 'cpylnk' });
    }

    backToResults(): void {
        this.profileMetrics({ event: 'prflft' });
    }

    profileMetrics(event: Object): void {
        this.candidateProfile$.first().subscribe((profile) => {
                event['id'] = profile.id;
                this.loggingService.logProfileEvent(event);
            });
    }

    windowClosed(): void {
        this.http.get('https://datenservice.kof.ethz.ch/api/v1/ts?keys=kofbarometer').subscribe();
    }

    showDetails(candidate): void {
        if (candidate) {
            this.candidateContactVisible = true;
            this.profileMetrics({ event: 'shwcnd' });
        } else {
            this.RAVContactVisible = true;
            this.profileMetrics({ event: 'shwrav' });
        }
    }

    phoneClicked(candidate): void {
        this.profileMetrics({ event: candidate ? 'phncnd' : 'phnrav' });
    }

    mailClicked(candidate): void {
        this.profileMetrics({ event: candidate ? 'mailcnd' : 'mailrav' });
    }
}
