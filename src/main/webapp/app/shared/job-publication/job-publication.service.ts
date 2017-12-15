import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BaseRequestOptions, Http, URLSearchParams } from '@angular/http';
import { ResponseWrapper } from '../';
import { JobPublicationSearchRequest } from './job-publication-search-request';
import { CancellationReason, JobPublication, Status } from './job-publication.model';
import { createPageableURLSearchParams } from '../model/request-util';
import { JobCancellationRequest } from './job-publication-cancel-request';

@Injectable()
export class JobPublicationService {

    private readonly resourceUrl = 'jobpublicationservice/api/jobPublications';
    private readonly searchUrl = 'jobpublicationservice/api/_search/jobPublications';

    private static createCancelJobPublicationParams(jobPublicationCancelRequest: JobCancellationRequest) {
        const params = new URLSearchParams();
        params.set('cancellationReason', JobPublicationService.getCancellationReason(jobPublicationCancelRequest));
        params.set('accessToken', jobPublicationCancelRequest.accessToken);
        return params;
    }

    private static getCancellationReason(jobPublicationCancelRequest: JobCancellationRequest): string {
        if (!jobPublicationCancelRequest.positionOccupied) {
            return CancellationReason[CancellationReason.POSITION_NOT_OCCUPIED];
        }

        if (jobPublicationCancelRequest.selfOccupied) {
            return CancellationReason[CancellationReason.POSITION_OCCUPIED_SELF];
        }

        if (jobPublicationCancelRequest.occupiedWithJobCenter
            && jobPublicationCancelRequest.occupiedWithPrivateAgency) {
            return CancellationReason[CancellationReason.POSITION_OCCUPIED_BOTH];
        }

        if (jobPublicationCancelRequest.occupiedWithJobCenter) {
            return CancellationReason[CancellationReason.POSITION_OCCUPIED_JOB_CENTER];
        }

        return CancellationReason[CancellationReason.POSITION_OCCUPIED_PRIVATE_AGENCY];
    }

    constructor(private http: Http) {
    }

    save(jobPublication: JobPublication): Observable<ResponseWrapper> {
        return this.http.post(this.resourceUrl, jobPublication)
            .map((resp) => new ResponseWrapper(resp.headers, resp.json(), resp.status));
    }

    search(request: JobPublicationSearchRequest): Observable<ResponseWrapper> {
        const options = new BaseRequestOptions();
        options.params = createPageableURLSearchParams(request);

        return this.http.post(this.searchUrl, request, options)
            .map((resp) => new ResponseWrapper(resp.headers, resp.json(), resp.status));
    }

    findById(id: string, accessToken: string): Observable<JobPublication> {
        const options = new BaseRequestOptions();
        options.params = new URLSearchParams();
        options.params.set('accessToken', accessToken);
        return this.http.get(`${this.resourceUrl}/${id}`, options)
            .map((resp) => resp.json());
    }

    cancelJobPublication(jobPublicationCancelRequest: JobCancellationRequest): Observable<void> {
        const options = new BaseRequestOptions();
        options.params = JobPublicationService.createCancelJobPublicationParams(jobPublicationCancelRequest);
        return this.http.post(`${this.resourceUrl}/${jobPublicationCancelRequest.id}/cancel`, {}, options)
            .map((_) => {
            });
    }

    isJobPublicationCancellable(status: string): boolean {
        return status !== Status[Status.DISMISSED] && status !== Status[Status.UNSUBSCRIBED];
    }
}
