import {
    ActivatedRouteSnapshot,
    Resolve,
    Router,
    RouterStateSnapshot
} from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Job, JobService } from '../services';

@Injectable()
export class JobDetailResolver implements Resolve<Job> {

    constructor(private jobService: JobService, private router: Router) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Job> {
        return this.jobService.find(route.params['id'])
            .catch((error: any) => {
                this.router.navigate(['/job-search']);
                return Observable.of(null);
            });
    }
}
