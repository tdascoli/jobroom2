import { Component, Input } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations'

@Component({
    selector: 'jr2-fading-message',
    animations: [
        trigger('visibilityChanged', [
            state('true', style({ opacity: 1, zIndex: 400 })),
            state('false', style({ opacity: 0 })),
            transition('0 => 1', animate('200ms')),
            transition('1 => 0', animate('200ms'))])
    ],
    templateUrl: './fading-message.component.html',
    styleUrls: ['./fading-message.component.scss']
})
export class FadingMessageComponent {
    @Input()
    visible: boolean
}
