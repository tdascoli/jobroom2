import { Injectable } from '@angular/core';
import { BaseRequestOptions, Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils } from 'ng-jhipster';
import { ResponseWrapper } from '../../shared';
import { TranslateService } from '@ngx-translate/core';
import { Job } from './job';
import { JobSearchRequest } from './job-search-request';

@Injectable()
export class JobService {

    private resourceUrl = 'jobservice/api/jobs';
    private searchUrl = 'jobservice/api/_search/jobs';

    constructor(private http: Http,
                private dateUtils: JhiDateUtils,
                private translateService: TranslateService) {
    }

    find(id: string): Observable<Job> {
        return this.http.get(`${this.resourceUrl}/${id}`)
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    search(req: JobSearchRequest): Observable<ResponseWrapper> {
        const options: BaseRequestOptions = new BaseRequestOptions();
        options.params = this.toURLSearchParams(req);
        options.params.set('language', this.translateService.currentLang);

        return this.http.get(this.searchUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    private toURLSearchParams(req: JobSearchRequest): URLSearchParams {
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
