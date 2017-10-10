import { Component, Input, OnInit } from '@angular/core';
import { JobExperience } from '../services/candidate';

@Component({
    selector: 'jr2-work-period',
    template: `
        <span class="badge badge-green">{{firstJob}}-{{lastJob}}</span>
    `
})

export class WorkPeriodComponent implements OnInit {
    @Input() jobExperiences: JobExperience[];

    constructor() {

    }

    ngOnInit() {
    }
}
