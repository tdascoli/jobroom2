import { Component, Input } from '@angular/core';
import { Locality } from '../services/job';

@Component({
    selector: 'jr2-job-locality',
    template: `
        <span *ngIf="locality" class="badge badge-blue">
            {{ locality.zipCode }} {{ locality.text }}
            <ng-container *ngIf="locality.cantonCode || locality.countryCode">
                ({{ locality.cantonCode || locality.countryCode }})
            </ng-container>
        </span>
    `
})

export class JobLocalityComponent {
    @Input()
    locality: Locality;
}
