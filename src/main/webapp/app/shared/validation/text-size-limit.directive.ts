import { Directive, ElementRef, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subject } from 'rxjs/Subject';

@Directive({
    selector: '[jr2TextSizeLimit]'
})
export class TextSizeLimitDirective implements OnInit, OnDestroy {
    @Input()
    jr2TextSizeLimit = 0;

    private unsubscribe$ = new Subject<void>();

    constructor(private el: ElementRef,
                private control: NgControl) {
    }

    ngOnInit(): void {
        this.validateTextField(this.control);
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    @HostListener('keypress', ['$event'])
    blockExtraCharacters(event) {
        if (event.target.value.length >= this.jr2TextSizeLimit) {
            event.preventDefault();
        }
    }

    private validateTextField(textFieldControl: NgControl) {
        textFieldControl.valueChanges
            .takeUntil(this.unsubscribe$)
            .map((value) => value ? value : '')
            .filter((value) => value.length > this.jr2TextSizeLimit)
            .subscribe((value) =>
                textFieldControl.valueAccessor.writeValue(value.substr(0, this.jr2TextSizeLimit)));
    }
}
