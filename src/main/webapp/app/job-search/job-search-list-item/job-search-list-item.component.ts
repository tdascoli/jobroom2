import { Component, Input } from '@angular/core';
import { Job } from '../../entities/job/job.model';
import { JOB_SEARCH_RESULT_TRUNCATE_DESCRIPTION } from '../../app.constants';

@Component({
    selector: 'jr2-job-search-list-item',
    templateUrl: './job-search-list-item.component.html',
    styles: []
})
export class JobSearchListItemComponent {
    @Input() job: Job;

    maxDescriptionLength =  JOB_SEARCH_RESULT_TRUNCATE_DESCRIPTION;
}
