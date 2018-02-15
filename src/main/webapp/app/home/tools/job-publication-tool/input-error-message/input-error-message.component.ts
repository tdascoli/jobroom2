import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'jr2-input-error-message',
    templateUrl: './input-error-message.component.html',
    styleUrls: []
})
export class InputErrorMessageComponent implements OnInit {
    @Input() formGroup: FormGroup;
    @Input() path: string;
    @Input() errorCodes: Array<string>;
    @Input() keys: Array<string>;

    formControl: AbstractControl;

    ngOnInit(): void {
        this.formControl = this.formGroup.get(this.path);
    }

    isErrorShown(errorCode: string) {
        return this.formControl
            && this.hasError(errorCode)
            && this.formControl.touched;
    }

    private hasError(errorCode: string) {
        const errorCodePaths = errorCode.split('.');
        let error = this.formControl.getError(errorCodePaths[0]);

        for (let i = 1; i < errorCodePaths.length; i++) {
            if (!(error instanceof Object)) {
                break;
            }
            error = error[errorCodePaths[i]];
        }

        return error !== null && error !== undefined;
    }
}
