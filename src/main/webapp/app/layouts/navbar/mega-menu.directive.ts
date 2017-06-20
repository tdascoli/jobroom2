import {AfterViewInit, Directive, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[jhiMegaMenu]'
})
export class MegaMenuDirective implements AfterViewInit {
    el: HTMLElement;

    constructor(private viewContainer: ViewContainerRef) {
        this.el = this.viewContainer.element.nativeElement;
    }

    ngAfterViewInit() {
        // This part is marked in the style guide for refactoring.
        // see ~@alv-ch/alv-styleguide/src/assets/styleguide/scripts/alv-ch.js
        const positionLeft = this.el.offsetLeft;
        const marginMegamenu = (document.body.clientWidth - 1540) / 2;
        const diff = -(positionLeft - marginMegamenu);
        const menu = <HTMLDivElement>this.el.querySelector('.dropdown-menu');
        Object.assign(menu.style, {left: diff + 'px'});
    }
}
