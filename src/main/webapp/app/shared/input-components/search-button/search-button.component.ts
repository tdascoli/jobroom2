import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'jr2-search-button',
    templateUrl: './search-button.component.html',
    styleUrls: ['./search-button.component.scss']
})

export class SearchButtonComponent {
    @Input()
    loading: boolean;
    @Output()
    search: EventEmitter<void> = new EventEmitter<void>();
}
