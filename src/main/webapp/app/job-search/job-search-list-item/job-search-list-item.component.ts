import { Component, Input, OnInit } from '@angular/core';
import { Job } from '../../entities/job/job.model';

@Component({
    selector: 'jhi-job-search-list-item',
    templateUrl: './job-search-list-item.component.html',
    styles: []
})
export class JobSearchListItemComponent implements OnInit {
    @Input() job: Job;

    constructor() {
    }

    ngOnInit() {
    }

}
