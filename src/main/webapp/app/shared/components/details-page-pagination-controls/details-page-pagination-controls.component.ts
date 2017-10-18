import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'jr2-details-page-pagination-controls',
    template: `
        <ul *ngIf="navigationEnabled" class="pagination pagination--block pagination-alv">
            <li class="page-item" [ngClass]="{'disabled': first}">
                <a class="page-link" (click)="previousItem.emit()">
                    <i class="fa fa-chevron-left" aria-hidden="true"></i> {{ 'navigation.previous' | translate }}
                </a>
            </li>
            <li class="page-item" [ngClass]="{'disabled': last}">
                <a class="page-link" (click)="nextItem.emit()">
                    {{ 'navigation.next' | translate }} <i class="fa fa-chevron-right" aria-hidden="true"></i>
                </a>
            </li>
        </ul>
    `
})
export class DetailsPagePaginationControlsComponent {
    @Input() navigationEnabled: boolean;
    @Input() first: boolean;
    @Input() last: boolean;

    @Output() nextItem = new EventEmitter<void>();
    @Output() previousItem = new EventEmitter<void>();
}
