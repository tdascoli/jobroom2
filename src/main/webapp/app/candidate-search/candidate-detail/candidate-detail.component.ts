import { Component, OnInit, DoCheck, OnDestroy, HostListener } from '@angular/core';
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
export class CandidateDetailComponent implements OnInit, DoCheck, OnDestroy {
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
    lastElementToAppear: string;
    candidateContactShown: boolean;

    constructor(private route: ActivatedRoute,
                private referenceService: ReferenceService,
                private candidateService: CandidateService,
                private occupationPresentationService: OccupationPresentationService,
                private translateService: TranslateService,
                private store: Store<CandidateSearchState>,
                private location: Location,
                private candidateLoggingService: CandidateLoggingService) {
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
                if (event.type === 'popstate') {
                    this.profileLeft();
                    if (event.url.indexOf('candidate-detail') >= 0) {
                        const url = event.url;
                        const nextId = url.substring(url.lastIndexOf('/') + 1, url.length);
                        this.candidateLoggingService.logCandidateEvent({ event: 'browsernav', id: nextId });
                    }
                }
            }
        );

        this.RAVContactVisible = false;
        this.candidateContactVisible = false;
        this.candidateContactShown = false;
        this.lastElementToAppear = 'none';
    }

    ngDoCheck() {
        if (this.candidateUrl !== window.location.href) {
            this.candidateUrl = window.location.href;
            this.isCopied = false;
            this.RAVContactVisible = false;
            this.candidateContactVisible = false;
            this.candidateContactShown = false;

            const that = this;
            window.setTimeout(() => that.lastElementToAppear = 'none', 250);
        }
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

    isDisplayGraduation(graduation: string) {
        return graduation && graduation !== Graduation[Graduation.NONE];
    }

    isDisplayDegree(degree: string) {
        return degree && Degree[degree] >= Degree.SEKUNDARSCHULE_OBERSTUFE
            && Degree[degree] <= Degree.DOKTORAT;
    }

    public printCandidateDetails(): void {
        this.logCandidateEvent({ event: 'print' });
        window.print();
    }

    public sendAsMail(): void {
        this.logCandidateEvent({ event: 'sendlink' });
    }

    public copyLink(): void {
        this.logCandidateEvent({ event: 'copylink' });
    }

    public  backToResults(): void {
        this.profileLeft();
    }

    public  logCandidateEvent(event: Object): void {
        this.candidateProfile$.first().subscribe((profile) => {
                event['id'] = profile.id;
                this.candidateLoggingService.logCandidateEvent(event);
            });
    }

    @HostListener('window:unload')
    windowClosed(): void {
        this.profileLeft();
    }

    public profileLeft(): void {
        this.logCandidateEvent({ event: 'profileleft', lowestVisible: this.lastElementToAppear })
    }

    public showDetails(candidate): void {
        if (candidate) {
            this.candidateContactVisible = true;
            window.setTimeout( () => window.scrollTo(0, document.body.scrollHeight), 50);
            if (!this.candidateContactShown) {
                this.candidateContactShown = true;
                this.logCandidateEvent({ event: 'showcand' });
            }
        } else {
            this.RAVContactVisible = true;
            this.logCandidateEvent({ event: 'showrav' });
        }
    }

    public hideDetails(candidate): void {
        if (candidate) {
            this.candidateContactVisible = false;
        }
    }

    public phoneClicked(candidate): void {
        this.logCandidateEvent({ event: candidate ? 'phonecand' : 'phonerav' });
    }

    public mailClicked(candidate): void {
        this.logCandidateEvent({ event: candidate ? 'mailcand' : 'mailrav' });
    }

    public addToFavorites(): void {
        this.logCandidateEvent({ event: 'addtofavs' })
    }

    public onAppear(element): void {
        this.lastElementToAppear = element;
    }
}
