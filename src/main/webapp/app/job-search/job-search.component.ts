import { Component, OnInit } from '@angular/core';
import { ResponseWrapper } from '../shared/model/response-wrapper.model';
import { Job } from '../entities/job/job.model';
import { JobService } from '../entities/job/job.service';
import { ActivatedRoute } from '@angular/router';
import { JobSearchRequest } from './job-search-request';

@Component({
    selector: 'jhi-job-search',
    templateUrl: './job-search.component.html',
    styles: []
})
export class JobSearchComponent implements OnInit {
    jobList: Array<Job>;
    term = '';
    totalCount: number;

    constructor(private route: ActivatedRoute, private jobSearchService: JobService) {
    }

    ngOnInit() {
        this.route.queryParams
            .map((params) => params['term'])
            .do((term: string) => this.term = term || '')
            .map((term: string) => new JobSearchRequest(term))
            .flatMap((term: JobSearchRequest) => this.jobSearchService.search(term))
            .subscribe((response: ResponseWrapper) => {
                    this.jobList = response.json;
                    this.totalCount = this.jobList.length;
                }
            )
        ;
    }

}
