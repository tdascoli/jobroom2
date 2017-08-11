import { Injectable } from '@angular/core';
import { BaseRequestOptions, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils } from 'ng-jhipster';
import { Job } from './job.model';
import { createRequestOption, ResponseWrapper } from '../../shared';
import { TranslateService } from '@ngx-translate/core';
import { JobSearchRequest } from './job-search-request';

@Injectable()
export class JobService {

    private resourceUrl = 'jobservice/api/jobs';
    private searchUrl = 'jobservice/api/_search/jobs';

    constructor(private http: Http, private dateUtils: JhiDateUtils, private translateService: TranslateService) {
    }

    create(job: Job): Observable<Job> {
        const copy = this.convert(job);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    update(job: Job): Observable<Job> {
        const copy = this.convert(job);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    find(id: number): Observable<Job> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    search(req: JobSearchRequest): Observable<ResponseWrapper> {
        const options: BaseRequestOptions = new BaseRequestOptions();
        options.params = req.toURLSearchParams();
        options.params.set('language', this.translateService.currentLang);

        return this.http.get(this.searchUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
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

    private convert(job: Job): Job {
        const copy: Job = Object.assign({}, job);
        copy.publicationStartDate = this.dateUtils
            .convertLocalDateToServer(job.publicationStartDate);
        copy.publicationEndDate = this.dateUtils
            .convertLocalDateToServer(job.publicationEndDate);
        copy.registrationDate = this.dateUtils
            .convertLocalDateToServer(job.registrationDate);
        copy.cancellationDate = this.dateUtils
            .convertLocalDateToServer(job.cancellationDate);
        copy.startDate = this.dateUtils
            .convertLocalDateToServer(job.startDate);
        copy.endDate = this.dateUtils
            .convertLocalDateToServer(job.endDate);
        return copy;
    }
}
