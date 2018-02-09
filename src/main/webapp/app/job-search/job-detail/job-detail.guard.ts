import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { JobSearchState } from '../state-management/state/job-search.state';
import { Store } from '@ngrx/store';
import { JobService } from '../services/job.service';
import { JobDetailLoadedAction } from '../state-management/actions/job-search.actions';
import { Injectable } from '@angular/core';

@Injectable()
export class JobDetailGuard implements CanActivate {

    constructor(private store: Store<JobSearchState>,
                private router: Router,
                private jobService: JobService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        const id = route.params['id'];

        return this.jobService.find(id)
            .catch((error) => {
                this.router.navigate(['/job-search']);
                return Observable.of(null);
            })
            .do((job) => this.store.dispatch(new JobDetailLoadedAction(job)))
            .map((job) => !!job)
    }
}
