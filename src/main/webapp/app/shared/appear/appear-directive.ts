import {
    ElementRef, Output, Directive, AfterViewInit, OnDestroy, EventEmitter, DoCheck
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/startWith';

@Directive({
    selector: '[jhiAppear]'
})
export class AppearDirective implements AfterViewInit, OnDestroy, DoCheck {
    @Output()
    jhiAppear: EventEmitter<void>;

    elementPos: number;
    elementHeight: number;

    scrollPos: number;
    windowHeight: number;

    subscriptionScroll: Subscription;
    subscriptionResize: Subscription;

    windowLocation: string;

    TIME_TO_ARM = 300;

    constructor(private element: ElementRef) {
        this.jhiAppear = new EventEmitter<void>();
        this.windowLocation = window.location.href;
    }

    private saveDimensions(): void {
        this.elementPos = this.getOffsetTop(this.element.nativeElement);
        this.elementHeight = this.element.nativeElement.offsetHeight;
        this.windowHeight = window.innerHeight;
    }

    private saveScrollPos(): void {
        this.scrollPos = window.scrollY;
    }

    private getOffsetTop(element: any): number {
        let offsetTop = element.offsetTop || 0;
        if (element.offsetParent) {
            offsetTop += this.getOffsetTop(element.offsetParent);
        }
        return offsetTop;
    }

    private checkVisibility(): void {
        if (this.isVisible()) {
            // double check dimensions (due to async loaded contents, e.g. images)
            this.saveDimensions();
            if (this.isVisible()) {
                this.unsubscribe();
                this.jhiAppear.emit();
            }
        }
    }

    private isVisible(): boolean {
        return this.scrollPos >= this.elementPos || (this.scrollPos + this.windowHeight) >= (this.elementPos + this.elementHeight);
    }

    public subscribe(): void {
        this.subscriptionScroll = Observable.fromEvent(window, 'scroll').startWith(null)
            .subscribe(() => {
                this.saveScrollPos();
                this.checkVisibility();
            });
        this.subscriptionResize = Observable.fromEvent(window, 'resize').startWith(null)
            .subscribe(() => {
                this.saveDimensions();
                this.checkVisibility();
            });
    }

    public unsubscribe(): void {
        if (this.subscriptionScroll) {
            this.subscriptionScroll.unsubscribe();
        }
        if (this.subscriptionResize) {
            this.subscriptionResize.unsubscribe();
        }
    }

    public ngAfterViewInit(): void {
        const theOtherOne = this;
        window.setTimeout(function(){
            theOtherOne.subscribe();
        }, this.TIME_TO_ARM);
    }

    public ngOnDestroy(): void {
        this.unsubscribe();
    }

    public ngDoCheck() {
        const currentLoc = window.location.href;
        if (currentLoc !== this.windowLocation) {
            this.windowLocation = currentLoc;
            window.setTimeout(this.reArm.bind(this), this.TIME_TO_ARM);
        }
    }

    private reArm(): void {
        this.unsubscribe();
        this.subscribe();
    }
}
