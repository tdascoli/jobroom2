import { Component, Input } from '@angular/core';
import { Job } from '../../entities/job/job.model';

@Component({
    selector: 'jr2-job-search-list-item',
    templateUrl: './job-search-list-item.component.html',
    styleUrls: ['./job-search-list-item.scss']
})
export class JobSearchListItemComponent {
    @Input() job: Job;
}
