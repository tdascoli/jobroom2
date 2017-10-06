import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'jr2-search-button',
    template: `
        <button type="submit" class="btn btn-primary btn-lg"
                [ngClass]="{'btn-await btn-await--inverse': loading}"
                (click)="search.emit()">
            <span [jhiTranslate]="getButtonValueKey()"
                  [translateValues]="{count: getMaxCount()}">
            </span>
        </button>
    `
})

export class SearchButtonComponent {
    @Input()
    loading: boolean;
    @Input()
    maxSearchSize: number;
    @Input()
    totalCount = 0;
    @Input()
    titleTranslation: string;
    @Output()
    search: EventEmitter<void> = new EventEmitter<void>();

    getButtonValueKey() {
        let key = this.titleTranslation;

        if (this.loading) {
            key += '.loading';
        } else if (this.totalCount === 0) {
            key += '.none';
        } else if (this.totalCount === 1) {
            key += '.one';
        } else if (this.totalCount > this.maxSearchSize) {
            key += '.many';
        } else {
            key += '.other';
        }

        return key;
    }

    getMaxCount() {
        return Math.min(this.totalCount, this.maxSearchSize);
    }
}
