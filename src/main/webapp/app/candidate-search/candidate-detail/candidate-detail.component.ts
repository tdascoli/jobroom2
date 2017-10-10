import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Candidate, CandidateProfile } from '../services/candidate';
import { Observable } from 'rxjs/Observable';
import {
    JobCenter,
    ReferenceService
} from '../../shared/reference-service/reference.service';
import { CandidateService } from '../services/candidate.service';

@Component({
    selector: 'jr2-candidate-detail',
    templateUrl: './candidate-detail.component.html',
    styleUrls: ['./candidate-detail.component.scss']
})

export class CandidateDetailComponent implements OnInit {
    candidateProfile$: Observable<CandidateProfile>;
    jobCenter$: Observable<JobCenter>;
    candidateProtectedData$: Observable<Candidate>;

    constructor(private route: ActivatedRoute,
                private referenceService: ReferenceService,
                private candidateService: CandidateService) {
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
    }

    getOccupationLabel(code: string): string {
        return code;
    }

    printCandidateDetails(): void {
        window.print();
    }
}
