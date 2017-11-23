import { Injectable } from '@angular/core';
import { BaseRequestOptions, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils } from 'ng-jhipster';
import { ResponseWrapper } from '../../shared';
import { TranslateService } from '@ngx-translate/core';
import { Job } from './job';
import { JobSearchRequest } from './job-search-request';
import { createPageableURLSearchParams } from '../../shared/model/request-util';

@Injectable()
export class JobService {

    private resourceUrl = 'jobservice/api/jobs';
    private searchUrl = 'jobservice/api/_search/jobs';
    private countUrl = 'jobservice/api/_count/jobs';

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
        const options = new BaseRequestOptions();
        options.params = createPageableURLSearchParams(req);
        options.params.set('language', this.translateService.currentLang);

        return this.http.post(this.searchUrl, req, options)
            .map((res: Response) => this.convertResponse(res));
    }

    count(req: JobSearchRequest): Observable<number> {
        return this.http.post(this.countUrl, req)
            .map((res: Response) => this.convertResponse(res))
            .map((wrapper: ResponseWrapper) => {
                return Number.parseInt(wrapper.json.totalCount)
            });
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
