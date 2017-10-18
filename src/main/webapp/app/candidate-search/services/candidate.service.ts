import { Injectable } from '@angular/core';
import { Candidate, CandidateProfile } from './candidate';
import { Observable } from 'rxjs/Observable';
import { BaseRequestOptions, Http, Response, URLSearchParams } from '@angular/http';
import { CandidateSearchRequest } from './candidate-search-request';
import { ResponseWrapper } from '../../shared/model/response-wrapper.model';
import { JhiDateUtils } from 'ng-jhipster';

@Injectable()
export class CandidateService {

    private resourceUrl = 'candidateservice/api/candidates';
    private searchUrl = 'candidateservice/api/_search/candidates';

    constructor(private http: Http,
                private dateUtils: JhiDateUtils) {
    }

    findCandidate(id: string): Observable<Candidate> {
        return this.http.get(`${this.resourceUrl}/${id}`)
            .map((res: Response) => {
                const jsonResponse = res.json();
                return jsonResponse as Candidate;
            });
    }

    findCandidateProfile(id: string): Observable<CandidateProfile> {
        return this.http.get(`${this.resourceUrl}/profiles/${id}`)
            .map((res: Response) => {
                const jsonResponse = res.json();
                return jsonResponse as CandidateProfile;
            });
    }

    search(req: CandidateSearchRequest): Observable<ResponseWrapper> {
        const options: BaseRequestOptions = new BaseRequestOptions();
        options.params = this.toURLSearchParams(req);

        return this.http.get(this.searchUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    // todo: Remove duplicated code (see: job.service.ts)
    private toURLSearchParams(req: CandidateSearchRequest): URLSearchParams {
        const params: URLSearchParams = new URLSearchParams();

        Object.keys(req).forEach((key: string) => {
            const value = req[key];
            if (Array.isArray(value)) {
                value.forEach((v: any) => {
                    params.append(key, v);
                });
            } else {
                params.set(key, value);
            }
        });

        return params;
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        for (let i = 0; i < jsonResponse.length; i++) {
            this.convertItemFromServer(jsonResponse[i]);
        }
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convertItemFromServer(entity: any) {
        entity.publicationStartDate = this.dateUtils
            .convertLocalDateFromServer(entity.publicationStartDate);
        entity.publicationEndDate = this.dateUtils
            .convertLocalDateFromServer(entity.publicationEndDate);
        entity.registrationDate = this.dateUtils
            .convertLocalDateFromServer(entity.registrationDate);
        entity.cancellationDate = this.dateUtils
            .convertLocalDateFromServer(entity.cancellationDate);
        entity.startDate = this.dateUtils
            .convertLocalDateFromServer(entity.startDate);
        entity.endDate = this.dateUtils
            .convertLocalDateFromServer(entity.endDate);
    }
}
