import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'jr2-search-button',
    template: `
        <button type="submit" class="btn btn-primary btn-lg search-button"
                [ngClass]="{'btn-await btn-await--inverse': loading}"
                (click)="search.emit()">
            <span [hidden]="loading">
                <i class="fa fa-search" aria-hidden="true"></i>
            </span>
        </button>
    `,
    styles: [`
        .search-button {
            width: 4rem;
            height: 3rem;
        }
    `]
})

export class SearchButtonComponent {
    @Input()
    loading: boolean;
    @Output()
    search: EventEmitter<void> = new EventEmitter<void>();
}
