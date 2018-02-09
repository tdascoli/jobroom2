import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { CandidateSearchState } from '../state-management/state/candidate-search.state';
import { CandidateProfileDetailLoadedAction } from '../state-management/actions/candidate-search.actions';
import { CandidateService } from '../services/candidate.service';

@Injectable()
export class CandidateDetailGuard implements CanActivate {

    constructor(private store: Store<CandidateSearchState>,
                private router: Router,
                private candidateService: CandidateService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        const id = route.params['id'];

        return this.candidateService.findCandidateProfile(id)
            .catch((error) => {
                this.router.navigate(['/candidate-search']);
                return Observable.of(null);
            })
            .do((candidateProfile) => this.store.dispatch(new CandidateProfileDetailLoadedAction(candidateProfile)))
            .map((candidateProfile) => !!candidateProfile)
    }
}
