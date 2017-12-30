import { AfterViewInit, Component, ElementRef, OnInit, Renderer } from '@angular/core';

import { PasswordResetInitService } from './password-reset-init.service';
import { USERNAME_NOT_FOUND_TYPE } from '../../../shared';

@Component({
    selector: 'jhi-password-reset-init',
    templateUrl: './password-reset-init.component.html'
})
export class PasswordResetInitComponent implements OnInit, AfterViewInit {
    error: string;
    errorUsernameNotExists: string;
    resetAccount: any;
    success: string;

    constructor(
        private passwordResetInitService: PasswordResetInitService,
        private elementRef: ElementRef,
        private renderer: Renderer
    ) {
    }

    ngOnInit() {
        this.resetAccount = {};
    }

    ngAfterViewInit() {
        this.renderer.invokeElementMethod(this.elementRef.nativeElement.querySelector('#username'), 'focus', []);
    }

    requestReset() {
        this.error = null;
        this.errorUsernameNotExists = null;

        this.passwordResetInitService.save(this.resetAccount.username).subscribe(() => {
            this.success = 'OK';
        }, (response) => {
            this.success = null;
            if (response.status === 400 && response.json().type === USERNAME_NOT_FOUND_TYPE) {
                this.errorUsernameNotExists = 'ERROR';
            } else {
                this.error = 'ERROR';
            }
        });
    }
}
