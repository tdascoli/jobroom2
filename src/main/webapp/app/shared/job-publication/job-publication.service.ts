import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BaseRequestOptions, Http, Response } from '@angular/http';
import { Headers } from '@angular/http';
import { CEFR_Level, DrivingLicenceCategory, Experience, ResponseWrapper } from '../';
import { JobPublicationSearchRequest } from './job-publication-search-request';
import { EducationLevel, JobPublication, Status } from './job-publication.model';
import { createPageableURLSearchParams } from '../model/request-util';

@Injectable()
export class JobPublicationService {

    private readonly resourceUrl = 'jobpublicationservice/api/jobPublications';
    private readonly searchUrl = 'jobpublicationservice/api/_search/jobPublications';

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

    findById(id: string): Observable<JobPublication> {
        return this.http.get(`${this.resourceUrl}/${id}`)
            .map((resp) => resp.json());
    }

}
