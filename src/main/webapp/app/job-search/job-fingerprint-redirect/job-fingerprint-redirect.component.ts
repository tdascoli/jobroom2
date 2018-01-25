import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

@Component({
    selector: 'jr2-job-fingerprint-redirect',
    templateUrl: './job-fingerprint-redirect.component.html'
})
export class JobFingerprintRedirectComponent implements AfterViewInit {

    constructor() {
    }

    ngAfterViewInit(): void {
        window.scroll(0, 0);
    }
}
