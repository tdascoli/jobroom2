import { Component, OnInit } from '@angular/core';
import { ResponseWrapper } from '../shared/model/response-wrapper.model';
import { Job } from '../entities/job/job.model';
import { JobService } from '../entities/job/job.service';
import { ActivatedRoute, convertToParamMap, ParamMap, Params } from '@angular/router';
import { JobSearchRequest } from './job-search-request';

@Component({
    selector: 'jhi-job-search',
    templateUrl: './job-search.component.html',
    styles: []
})
export class JobSearchComponent implements OnInit {
    jobList: Array<Job>;
    terms = '';
    totalCount: number;

    constructor(private route: ActivatedRoute, private jobSearchService: JobService) {
    }

    ngOnInit() {
        this.route.queryParams
            .map((params: Params) => convertToParamMap(params))
            .map((paramMap: ParamMap) => {
                const classifications: Array<string> = paramMap.getAll('classification');
                const occupations: Array<string> = paramMap.getAll('occupation');
                const terms: Array<string> = paramMap.getAll('query');

                return [...classifications, ...occupations, ...terms];
            })
            .do((terms: Array<string>) => this.terms = terms.join(','))
            .map((terms: Array<string>) => new JobSearchRequest(terms))
            .flatMap((req: JobSearchRequest) => this.jobSearchService.search(req))
            .subscribe((response: ResponseWrapper) => {
                    this.jobList = response.json;
                    this.totalCount = this.jobList.length;
                }
            )
        ;
    }

}
