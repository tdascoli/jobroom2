import { Component, HostListener, Inject } from '@angular/core';
import { WINDOW } from '../../shared-libs.module';

@Component({
    selector: 'jr2-scroll-to-top',
    template: `
        <div class="scroll-top {{isHidden ? 'd-none' : ''}}"
             (click)="scrollToTop()">
            <i class="fa fa-chevron-up" aria-hidden="true"></i>
        </div>
    `
})
export class ScrollToTopComponent {
    isHidden = true;

    constructor(@Inject(WINDOW) private window: Window) {
    }

    @HostListener('window:scroll')
    onWindowScroll(): void {
        this.isHidden = this.window.scrollY < 200;
    }

    scrollToTop(): void {
        this.window.scrollTo(0, 0);
    }
}
