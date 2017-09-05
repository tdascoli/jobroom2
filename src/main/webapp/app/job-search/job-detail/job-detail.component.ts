import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

    constructor(private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.job = this.route.snapshot.data['job'];
    }
}
