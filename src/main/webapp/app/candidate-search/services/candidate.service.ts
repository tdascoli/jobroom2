import { Injectable } from '@angular/core';
import { Candidate, CandidateProfile } from './candidate';
import { Observable } from 'rxjs/Observable';
import { BaseRequestOptions, Http, Response, URLSearchParams } from '@angular/http';
import {
    CandidateLanguageSkill,
    CandidateSearchRequest
} from './candidate-search-request';
import { ResponseWrapper } from '../../shared';

@Injectable()
export class CandidateService {

    private resourceUrl = 'candidateservice/api/candidates';
    private searchUrl = 'candidateservice/api/_search/candidates';
    private countUrl = 'candidateservice/api/_count/candidates';

    private static convertResponse(res: Response): ResponseWrapper {
        return new ResponseWrapper(res.headers, res.json(), res.status);
    }

    private static isLanguageSkill(arg: any): arg is CandidateLanguageSkill {
        return arg.code !== undefined;
    }

    private static convertArrayToParams(params: URLSearchParams, value: Array<any>, key: string): void {
        value.forEach((v: any, index: number) => {
            if (typeof v === 'object') {
                CandidateService.convertObjectToParams(params, v, key, index);
            } else {
                params.append(key, v);
            }
        });
    }

    private static convertObjectToParams(params: URLSearchParams, obj: any, key: string, index?: number): void {
        for (const property in obj) {
            if (obj.hasOwnProperty(property)) {
                let param: string;
                if (CandidateService.isLanguageSkill(obj)) {
                    param = key + '[' + index + '].' + property;
                } else {
                    param = key + '.' + property;
                }
                params.set(param, obj[property])
            }
        }
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
        options.params = this.toURLSearchParams(req);

        return this.http.get(this.searchUrl, options)
            .map((res: Response) => CandidateService.convertResponse(res));
    }

    count(req: any): Observable<number> {
        const options = new BaseRequestOptions();
        options.params = this.toURLSearchParams(req);

        return this.http.get(this.countUrl, options)
            .map((res: Response) => CandidateService.convertResponse(res))
            .map((wrapper: ResponseWrapper) => {
                return Number.parseInt(wrapper.json.totalCount)
            });
    }

    private toURLSearchParams(req: CandidateSearchRequest): URLSearchParams {
        const params: URLSearchParams = new URLSearchParams();

        Object.keys(req).forEach((key: string) => {
            const value = req[key];
            if (Array.isArray(value)) {
                CandidateService.convertArrayToParams(params, value, key);
            } else if (typeof value === 'object') {
                CandidateService.convertObjectToParams(params, value, key);
            } else {
                params.set(key, value);
            }
        });

        return params;
    }
}
