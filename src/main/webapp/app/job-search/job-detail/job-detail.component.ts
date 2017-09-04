import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { JobService } from '../../entities/job/job.service';
import { Job } from '../../entities/job/job.model';
import 'rxjs/add/operator/switchMap';

@Component({
    selector: 'jr2-job-detail',
    templateUrl: './job-detail.component.html',
    styleUrls: [
        './job-detail.scss'
    ]
})
export class JobDetailComponent implements OnInit {

    job: Job;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private jobService: JobService) {
    }

    ngOnInit() {

        this.route.paramMap
            .switchMap((params: ParamMap) =>
                this.jobService.find(params.get('id')))
            .subscribe(
                (job: Job) => this.job = job,
                (err) => this.goBackToList()
            );
    }

    goBackToList() {
        this.router.navigate(['/job-search']);
    }

}
