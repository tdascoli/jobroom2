import {
    ActivatedRouteSnapshot,
    Resolve,
    Router,
    RouterStateSnapshot
} from '@angular/router';
import { Job } from '../../entities/job/job.model';
import { Observable } from 'rxjs/Observable';
import { JobService } from '../../entities/job/job.service';
import { Injectable } from '@angular/core';

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
