import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { JobPublication } from '../../../../shared/job-publication/job-publication.model';
import { Observable } from 'rxjs/Observable';
import { JobPublicationService } from '../../../../shared/job-publication/job-publication.service';
import { LocalityService } from '../../../../shared/reference-service';
import { ZipCodeComponent } from '../zip-code/zip-code.component';

@Injectable()
export class JobPublicationResolverService implements Resolve<JobPublication> {
    constructor(private jobPublicationService: JobPublicationService,
                private localityService: LocalityService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<JobPublication> {
        const jobPublicationId = route.paramMap.get('jobPublicationId');
        const accessToken = route.paramMap.get('accessToken');

        if (jobPublicationId) {
            return this.jobPublicationService.findByIdAndAccessToken(jobPublicationId, accessToken)
                .flatMap(this.setJobLocation.bind(this));
        } else {
            return Observable.of(null);
        }
    }

    private setJobLocation(jobPublication: JobPublication): Observable<JobPublication> {
        return this.localityService.fetchSuggestions(
            jobPublication.job.location.zipCode,
            ZipCodeComponent.localityResultMapper)
            .map((locality) => {
                if (locality.length) {
                    jobPublication.job.location.communalCode = locality[0].communalCode;
                }
                return jobPublication;
            });
    }
}
