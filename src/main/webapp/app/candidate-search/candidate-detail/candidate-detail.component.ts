import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Candidate, CandidateProfile } from '../services/candidate';
import { Observable } from 'rxjs/Observable';
import {
    JobCenter,
    ReferenceService
} from '../../shared/reference-service/reference.service';
import { CandidateService } from '../services/candidate.service';
import { OccupationService } from '../../shared/index';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'jr2-candidate-detail',
    templateUrl: './candidate-detail.component.html',
    styleUrls: ['./candidate-detail.component.scss']
})
export class CandidateDetailComponent implements OnInit, OnDestroy, AfterViewInit {
    candidateProfile$: Observable<CandidateProfile>;
    jobCenter$: Observable<JobCenter>;
    candidateProtectedData$: Observable<Candidate>;
    candidateUrl: string;
    isCopied: boolean;

    private unsubscribe$ = new Subject<void>();

    constructor(private route: ActivatedRoute,
                private referenceService: ReferenceService,
                private candidateService: CandidateService,
                private occupationService: OccupationService,
                private translateService: TranslateService) {
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
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    ngAfterViewInit(): void {
        this.unsubscribe$.next();
        this.candidateProfile$
            .subscribe((candidateProfile) =>
                this.populateOccupationName(candidateProfile));

    }

    private populateOccupationName(candidateProfile: CandidateProfile): void {
        candidateProfile.jobExperiences
            .forEach((jobExperience) =>
                this.occupationService.findOccupationByCode(jobExperience.occupationCode)
                    .subscribe((occupation) => {
                        const setOccupation = (lang) => jobExperience.occupation = occupation.labels[lang];
                        setOccupation(this.translateService.currentLang);
                        this.translateService.onLangChange
                            .takeUntil(this.unsubscribe$)
                            .subscribe((langChange) => setOccupation(langChange.lang));
                    })
            );
    }

    printCandidateDetails(): void {
        window.print();
    }
}
