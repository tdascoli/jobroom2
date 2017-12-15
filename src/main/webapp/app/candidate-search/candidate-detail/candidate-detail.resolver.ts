import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot, Resolve, Router,
    RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CandidateProfile } from '../services/candidate';
import { CandidateService } from '../services/candidate.service';

@Injectable()
export class CandidateDetailResolver implements Resolve<CandidateProfile> {

    constructor(private router: Router,
                private candidateService: CandidateService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CandidateProfile> {
        return this.candidateService.findCandidateProfile(route.params['id'])
            .catch((error: any) => {
                this.router.navigate(['/candidate-search']);
                return Observable.of(null);
            });
    }
}
