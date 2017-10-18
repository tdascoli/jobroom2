import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import {
    Item, LoadNextItemAction,
    LoadPreviousItemAction
} from './state-management/actions/details-page-pagination.actions';

@Component({
    selector: 'jr2-details-page-pagination',
    template: `
        <jr2-details-page-pagination-controls
            [navigationEnabled]="navigationEnabled"
            [first]="first"
            [last]="last"
            (nextItem)="next()"
            (previousItem)="previous()">
        </jr2-details-page-pagination-controls>
    `
})
export class DetailsPagePaginationComponent implements OnChanges {
    @Input() currentItem: Item;
    @Input() itemsList: Array<Item>;
    @Input() totalSize: number;
    @Input() feature: string;

    navigationEnabled: boolean;
    first: boolean;
    last: boolean;

    constructor(private store: Store<any>) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['currentItem']) {
            window.scroll(0, 0);
        }

        if (!this.itemsList) {
            return;
        }

        this.navigationEnabled = !!this.itemsList.length;
        if (this.navigationEnabled) {
            this.first = this.itemsList[0].id === this.currentItem.id;
            this.last = this.itemsList[this.itemsList.length - 1].id === this.currentItem.id
                && this.itemsList.length === this.totalSize;
        }
    }

    previous(): void {
        this.store.dispatch(new LoadPreviousItemAction(this.createPayload()));
    }

    next(): void {
        this.store.dispatch(new LoadNextItemAction(this.createPayload()));
    }

    private createPayload() {
        return {
            currentItem: this.currentItem,
            itemsList: this.itemsList,
            feature: this.feature
        };
    }
}
