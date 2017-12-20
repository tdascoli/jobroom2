import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot, Resolve, Router,
    RouterStateSnapshot
} from '@angular/router';
import { JobPublication } from '../../shared/job-publication/job-publication.model';
import { Observable } from 'rxjs/Observable';
import { JobPublicationService } from '../../shared/job-publication/job-publication.service';

@Injectable()
export class JobPublicationDetailResolver implements Resolve<JobPublication> {

    constructor(private jobPublicationService: JobPublicationService,
                private router: Router) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<JobPublication> {
        return this.jobPublicationService.findByIdAndAccessToken(route.params['id'], route.queryParams['accessToken'])
            .catch((_) => {
                this.router.navigate(['/error']);
                return Observable.of(null);
            });
    }

}
