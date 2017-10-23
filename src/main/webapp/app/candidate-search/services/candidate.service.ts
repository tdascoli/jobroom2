import { Injectable } from '@angular/core';
import { Candidate, CandidateProfile } from './candidate';
import { Observable } from 'rxjs/Observable';
import { BaseRequestOptions, Http, Response } from '@angular/http';
import { CandidateSearchRequest } from './candidate-search-request';
import { ResponseWrapper } from '../../shared';
import { createPageableURLSearchParams } from '../../shared/model/request-util';

@Injectable()
export class CandidateService {

    private resourceUrl = 'candidateservice/api/candidates';
    private searchUrl = 'candidateservice/api/_search/candidates';
    private countUrl = 'candidateservice/api/_count/candidates';

    private static convertResponse(res: Response): ResponseWrapper {
        return new ResponseWrapper(res.headers, res.json(), res.status);
    }

    constructor(private http: Http) {
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
        const options = new BaseRequestOptions();
        options.params = createPageableURLSearchParams(req);

        return this.http.post(this.searchUrl, req, options)
            .map((res: Response) => CandidateService.convertResponse(res));
    }

    count(req: CandidateSearchRequest): Observable<number> {
        return this.http.post(this.countUrl, req)
            .map((res: Response) => CandidateService.convertResponse(res))
            .map((wrapper: ResponseWrapper) => {
                return Number.parseInt(wrapper.json.totalCount)
            });
    }
}
