import { Directive, ElementRef, HostListener } from '@angular/core';

const SELECTOR = 'select.ng-invalid, textarea.ng-invalid, input.ng-invalid, jr2-phone-number-input.ng-invalid';

@Directive({ selector: '[jr2ScrollToFirstInvalid]' })
export class ScrollToFirstInvalidDirective {

    constructor(private elementRef: ElementRef) {
    }

    @HostListener('submit', ['$event'])
    onSubmit(event) {
        const formElement = this.elementRef.nativeElement;
        const elementWithError = formElement.querySelector(SELECTOR);
        if (elementWithError) {
            this.scrollIntoView(elementWithError);

            // The phone number input has an input child element.
            const elementToFocus = elementWithError.querySelector('input') || elementWithError;
            if (elementToFocus.focus) {
                elementToFocus.focus();
            }
        }
    }

    private scrollIntoView(element: Element) {
        const elementRect = element.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        const middle = absoluteElementTop - (window.innerHeight / 2);
        window.scrollTo(0, middle);
    }
}
