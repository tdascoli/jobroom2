import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';

// todo: Find a better solution instead of this hack!

/**
 * @whatItDoes Places the HTML element into the sticky toolbar.
 *
 * @howToUse
 * ```
 *     <some-element jhiStickyToolbarItem></some-element>
 *
 * ```
 */
@Directive({
    selector: '[jhiStickyToolbarItem]'
})
export class StickyToolbarItemDirective implements OnInit, OnDestroy {
    el: HTMLElement;

    constructor(el: ElementRef) {
        this.el = el.nativeElement;
    }

    ngOnInit() {
        const headerEl = <HTMLDivElement>document.querySelector('.header');
        if (headerEl) {
            headerEl.classList.add('has-toolbar');
        }
    }

    ngOnDestroy(): void {
        const headerEl = <HTMLDivElement>document.querySelector('.header');
        if (headerEl) {
            headerEl.classList.remove('has-toolbar');
        }
    }
}
