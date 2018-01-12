import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

const SELECTOR = 'select.ng-invalid, textarea.ng-invalid, input.ng-invalid, jr2-phone-number-input.ng-invalid';

interface Controls {
    [key: string]: AbstractControl;
}

@Directive({ selector: '[jr2ScrollToFirstInvalid]' })
export class ScrollToFirstInvalidDirective {
    @Input() formGroup: FormGroup;

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

            // todo: Fix this for the zip-code component
            const control = this.findInvalidControl(this.formGroup.controls);
            if (control) {
                // Mark the control as touched in order to display the error message
                control.markAsTouched();
            }
        }
    }

    private scrollIntoView(element: Element) {
        const elementRect = element.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        const middle = absoluteElementTop - (window.innerHeight / 2);
        window.scrollTo(0, middle);
    }

    private findInvalidControl(controls: Controls): AbstractControl {
        const controlNames = Object.keys(controls);
        for (const controlName of controlNames) {
            const control = controls[controlName];
            const children = (control as any).controls || {};
            const invalidChild = this.findInvalidControl(children);

            if (invalidChild) {
                return invalidChild;
            } else if (control.invalid) {
                return control;
            }
        }

        return null;
    }
}
