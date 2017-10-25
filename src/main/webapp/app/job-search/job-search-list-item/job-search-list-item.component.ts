import { Component, Input } from '@angular/core';
import { Job } from '../services';

@Component({
    selector: 'jr2-job-search-list-item',
    templateUrl: './job-search-list-item.component.html'
})
export class JobSearchListItemComponent {
    @Input() job: Job;
}
